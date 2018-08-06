import * as React from "react";
import {Prototype} from "../../../models/Prototype";
import {TextureService} from "../../../services/TextureService";
import {ObjFileReader} from "../../utils/ObjFileReader";
import PrototypeDetailsPage from "../../../prototype/PrototypeDetailsPage";
import {Config} from "../../../settings/Config";
import {InformationDialog} from "../dialog/InformationDialog";
import {Spinner} from "../loader/Spinner";

/**
 * state for building importer
 */
interface UploadBuildingPrototypeState {
    prototype?: Prototype,
    materialLoaded?: boolean,
    modelLoaded?: boolean,
    isValid?: boolean,
    isLoading?: boolean,
    validateMessage?: string,
    thumbnailMessage?: string,
}

/**
 * state for building importer
 */
interface UploadBuildingPrototypeProps {
    prototypeDetail: PrototypeDetailsPage,
    doValidation?: boolean
}

/**
 * building importer
 */
export class UploadBuildingPrototype extends React.Component<UploadBuildingPrototypeProps, UploadBuildingPrototypeState> {

    /**
     * initial state
     * @type {{}}
     */
    state: UploadBuildingPrototypeState = {
        prototype: null,
        validateMessage: null,
        isLoading: false
    };

    /**
     *  Confirm dialog
     */
    private validateDialog: InformationDialog;

    private warningDialog: InformationDialog;

    /**
     * the file input element
     */
    filePicker: HTMLInputElement;

    /**
     * the file input element
     */

    thumbnailPicker: HTMLInputElement;

    /**
     * list of files
     * @type {Array}
     */
    files: File[] = [];

    /**
     * pending textures
     * @type {number}
     */
    pendingTextures: number = 0;

    /**
     * the texture service
     * @type {TextureService}
     */
    private textureService = new TextureService();

    /**
     * the object file reader
     * @type {ObjFileReader}
     */
    private fileReader = new ObjFileReader();

    private firstClick: boolean = true;

    /**
     * call when the component did mount
     */
    componentDidMount() {
        if (this.props.prototypeDetail != null) {
            this.setState({prototype: this.props.prototypeDetail.state.prototype});
        }
    }

    /**
     *
     * start picking file
     */
    async selectModelFiles() {
        if (this.firstClick && !this.props.prototypeDetail.state.isAddNew) {
            await this.warningDialog.show();
        }
        this.firstClick = false;

        this.setState({
            materialLoaded: false,
            modelLoaded: false,
            isValid: false,
            validateMessage: ""
        });
        this.files = [];
        this.filePicker.click()
    }

    /**
     * file has been picked
     */
    async filePicked() {
        let selectedFiles = this.filePicker.files;
        if (selectedFiles.length == 0) {
            return;
        }
        let building = this.props.prototypeDetail.state.prototype;
        let isValid = this.validateUploadPrototype(selectedFiles);
        this.props.prototypeDetail.setState({isModelValid: isValid});
        if (isValid) {
            for (var i = 0; i < selectedFiles.length; i++) {
                this.files.push(selectedFiles[i])
            }
            this.parseFiles(true);
        } else {
            this.setState({
                validateMessage: "Files are missing, please add full files (*.mtl, *.obj, image)."
            });
            building.materials = null;
            this.props.prototypeDetail.setState({prototype: building});
        }
    }

    /**
     * thumbnail picked
     */
    async thumbnailPicked() {
        /*Clear thumbnail*/
        let building = this.props.prototypeDetail.state.prototype;

        let valid = await this.validateThumbnail();
        if (valid) {
            this.setState({thumbnailMessage: ""});
            Spinner.show(true)
            let file = this.thumbnailPicker.files[0];
            if (this.state.prototype == null) {
                this.state.prototype = {};
            }
            if (file != undefined) {
                this.textureService.upload(file, (url) => {
                    let buildingPrototype = this.state.prototype;
                    buildingPrototype.thumbnail = url;
                    this.setState({prototype: buildingPrototype});
                    Spinner.show(false);
                    this.props.prototypeDetail.setState({isThumbnailValid: true});
                });
            } else {
                this.props.prototypeDetail.setState({isThumbnailValid: true});
                Spinner.show(false);
            }
        } else {
            building.thumbnail = null;
            this.props.prototypeDetail.setState({prototype: building, isThumbnailValid: false});
        }
    }

    /**
     * load material file
     */
    loadMaterialFile() {
        let materialFile =
            this.files.filter(file => file.name.toLowerCase().match(/\.mtl$/i) !== null)[0];
        if (materialFile === undefined) {
            this.setState({
                validateMessage: "Material File is required.",
                isLoading: false,
            });
            Spinner.show(false)
        } else {
            var reader = new FileReader();
            reader.onload = this.materialFileLoaded.bind(this);
            reader.readAsText(materialFile)
        }
    }

    /**
     * when the material files is loaded
     * @param event
     */
    materialFileLoaded(event: Event) {
        const source = event.target["result"];
        this.state.prototype.materials = this.fileReader.loadMaterials(source);
        this.setState({
            prototype: this.state.prototype,
            materialLoaded: true
        });
        this.parseFiles();
    }

    /**
     * load the model file
     */
    loadModelFile() {
        let modelFile =
            this.files.filter(file => file.name.toLowerCase().match(/\.obj$/) !== null)[0];

        if (modelFile === undefined) {
            Spinner.show(false)
        } else {
            var reader = new FileReader();
            reader.onload = this.modelFileLoaded.bind(this);
            reader.readAsText(modelFile);
        }
    }

    /**
     * callback when material file is loaded
     * @param event the input event
     */
    modelFileLoaded(event: Event) {
        this.state.prototype.objFile = event.target["result"];
        this.setState({
            prototype: this.state.prototype,
            modelLoaded: true
        });
        this.props.prototypeDetail.state.prototype = this.state.prototype;
    }

    /**
     * upload all textures to the cloud
     */
    uploadTextures() {
        let textures = this.files.filter(file => file.name.match(/(png|jpg)$/) !== null);
        this.pendingTextures = textures.length;
        Spinner.show(true);
        let count = 0;
        textures
            .forEach((file) => {
                this.textureService.upload(file, (url) => {
                    for (let material of this.state.prototype.materials) {
                        if (material.texture.toLowerCase() == file.name.toLowerCase()) {
                            material.texture = url;
                        }
                    }
                    count++;
                    if (textures.length == count) {
                        this.setState({prototype: this.state.prototype});
                        Spinner.show(false);
                    }
                });
            });
    }

    /**
     * this parse files
     */
    parseFiles(initialize = false) {

        if (initialize) {

            let building = this.state.prototype;
            if (building == undefined) {
                building = {};
            }
            this.setState({
                prototype: building,
                materialLoaded: false,
                modelLoaded: false,
                isValid: false
            });
        }

        if (!this.state.materialLoaded) {
            this.loadMaterialFile()
        } else {
            this.uploadTextures();
            this.loadModelFile()
        }
    }

    /**
     * check if it is validate
     */
    validate() {
        const isValid = this.state.modelLoaded &&
            this.state.prototype.name &&
            this.pendingTextures == 0;

        this.setState({
            isValid: isValid
        });
    }

    /**
     * render the importer
     */
    render() {
        return (
            <div className="ui two column grid upload-buildings">
                <InformationDialog icon="info icon"
                                   title="Information Message"
                                   message={this.state.validateMessage}
                                   ref={dialog => this.validateDialog = dialog}/>
                <InformationDialog icon="info icon"
                                   title="Warrning Message"
                                   message="When you change the prototype then objects that is using this prototype will auto change."
                                   ref={dialog => this.warningDialog = dialog}/>

                <div className="column">
                    <div className="ui small images">
                        {
                            this.state.prototype != null && this.state.prototype.materials != null ?
                                <img src={this.state.prototype.materials[0].texture}
                                     alt={this.state.prototype.materials[0].texture}
                                     className="ui image small thumbnail"/>
                                : <img src={Config.resourceServer + "/data/no-image.png"}
                                       className="ui image small thumbnail"/>
                        }
                    </div>
                    <div>
                        <label className="errorMessage">{this.state.validateMessage}</label>
                    </div>
                    <a className="ui mini icon button" onClick={() => this.selectModelFiles()}>
                        <i className="ui mini upload icon"/> Upload Prototype Building
                    </a>
                </div>
                <input type="file"
                       accept={".mtl,.obj,image/*"}
                       ref={item => this.filePicker = item}
                       onChange={() => this.filePicked()}
                       style={{display: "none"}}
                       multiple={true}/>
                <div className="column">
                    <div className="ui small images">
                        {
                            this.state.prototype != null && this.state.prototype.thumbnail != null ?
                                <img src={this.state.prototype.thumbnail}
                                     alt={this.state.prototype.thumbnail} className="ui image small thumbnail"/>
                                : <img src={Config.resourceServer + "/data/no-image.png"}
                                       className="ui image small thumbnail"/>
                        }
                    </div>
                    <div>
                        <label className="errorMessage">{this.state.thumbnailMessage}</label>
                    </div>
                    <a className="ui mini icon button" onClick={() => this.thumbnailPicker.click()}>
                        <i className="ui mini upload icon"/> Upload Thumbnail
                    </a>
                    <input type="file"
                           accept="image/*"
                           ref={item => this.thumbnailPicker = item}
                           onChange={() => this.thumbnailPicked()}
                           style={{display: "none"}}/>
                </div>
            </div>
        )
    }

    /**
     * ValidateFile
     * @param selectedFiles
     */
    validateUploadPrototype(selectedFiles) {
        if (selectedFiles.length == 0) {
            this.setState({validateMessage: "This is required field."});
            return false;
        }

        let texture = false;
        let model = false;
        let material = false;

        for (let file of selectedFiles) {
            var name = file.name;
            var extention = name.substr(-4).toLocaleLowerCase();
            switch (extention) {
                case ".jpg":
                case ".png":
                    texture = true;
                    break;
                case ".obj":
                    model = true;
                    break;
                case ".mtl":
                    material = true;
                    break;
            }
        }

        return texture && model && material;
    }

    /**
     * Validate thumbnail
     */
    private async validateThumbnail() {
        let file = this.thumbnailPicker.files[0];
        if (file != undefined) {
            let name = file.name != null ? file.name.toLocaleLowerCase() : "";
            if (name.lastIndexOf(".png") == -1 && name.lastIndexOf(".jpg") == -1) {
                try {
                    this.setState({
                        thumbnailMessage: "Please select image file (*.jpg, *.png)."
                    });
                } catch (error) {
                }
                return false;
            }
        }
        return true;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.doValidation) {
            if (this.state.prototype.materials == null || this.state.prototype.materials[0].texture == "") {
                this.validateUploadPrototype(this.filePicker.files);
            }
        }
    }
}