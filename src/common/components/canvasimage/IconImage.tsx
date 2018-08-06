import * as React from 'react';

interface IconImageState {
  errorMessage?: string;
  isLoadImage?: boolean;
}

interface IconImageProps {
  width?: number,
  height?: number,
  src?: string,
  onChange?: Function,
  readOnly?: boolean,
  isBase64?: boolean,
  /**
   * limit size of icon (kb)
   */
  limit?: number
}

export class IconImage extends React.Component<IconImageProps, IconImageState> {

  state: IconImageState = {
    errorMessage: '',
  };


  image: HTMLImageElement;
  fileInput: HTMLInputElement;

  setImageSrc(url, callback) {
    if (typeof (url) == 'string') {
      this.image.src = url;
    } else {
      let fr = new FileReader();
      fr.readAsDataURL(url);
      fr.onload = () => {
        this.image.src = fr.result;
        let base64 = '';
        if (fr.result) {
          base64 = fr.result.split(',')[1];
        }
        callback(base64);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.src) {
      let url = nextProps.src;
      if (!nextProps.src) {
        url = "/data/no-image.png"
      }
      else if (nextProps.isBase64)
        url = 'data:image/png;base64,' + nextProps.src;
      this.setImageSrc(url, (base64) => {
      });
    }
  }

  componentDidMount() {
    let url = '/data/no-image.png';
    if (this.props.src && this.props.isBase64) {
      url = 'data:image/png;base64,' + this.props.src;
    }
    this.setImageSrc(url, (base64) => {
    });
  }

  deleteImage() {
    this.props.onChange ? this.props.onChange("") : null;
    this.setImageSrc("/data/no-image.png", () => {
    });
  }

  render() {
    let canvasImageStyle = {
      display: 'inline-block'
    };
    return (<div className="ui form" style={canvasImageStyle}>
      <div className="field">
        <img width={this.props.width ? this.props.width : 100} height={this.props.width ? this.props.width : 100}
             ref={(image) => {
               this.image = image
             }}/>
        {!this.props.readOnly ? <a title={'Clear'} href="#" className="delete-button" onClick={() => this.deleteImage()}/> : null}
      </div>
      {
        this.props.readOnly ? null :
          <div className="field">
            <input
              ref={(fileInput) => {
                this.fileInput = fileInput;
              }} style={{display: 'none'}}
              type="file"
              accept="image/*"
              onChange={
                (e) => {
                  this.setState({errorMessage: ''});
                  if (this.props.limit && e.target.files[0].size / 1024 > this.props.limit) {
                    this.setState({errorMessage: "The selected file is exceeded the limit size, please select file less than " + this.props.limit + "kb."});
                    return;
                  }
                  let name = e.target.files[0].name;
                  name = name != null ? name.toLocaleLowerCase() : "";
                  if (name.lastIndexOf(".png") == -1 && name.lastIndexOf(".jpg") == -1) {
                    this.setState({errorMessage: "Please select image file (*.jpg, *.png)."});
                    return;
                  }
                  this.setImageSrc(e.target.files[0],
                    (base64) => {
                      this.props.onChange ? this.props.onChange(base64) : () => {
                      }
                    })
                }}/>
            <label className="errorMessage"> {this.state.errorMessage}  </label>
            <button onClick={() => this.fileInput.click()} className="ui button mini basic"><i
              className="ui icon upload"/>Upload
            </button>
          </div>
      }
    </div>)
  }

}