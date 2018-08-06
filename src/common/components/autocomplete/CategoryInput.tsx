import * as React from "react";
import {Category} from "../../../models/Category";
import {CategoryService} from "../../../services/CategoryService";
import {Loader} from "../loader/MiniLoader";

interface Props{
    changeCategories?: Function,
    selectedCategories?:Category[]
}

interface States {
    showDialog?: boolean,
    isLoading?: boolean,
    Categories?: Category[],
    selectedCategory?: Category[];
}

export class CategoryInput extends React.Component<Props, States> {

    state: States = {
        showDialog: false,
        isLoading: false,
        Categories: [],
        selectedCategory: this.props.selectedCategories || []
    };

    private categoryService:CategoryService = new CategoryService();

    componentWillMount(){
        this.loadChildren();
    }

    async loadChildren(category?: Category) {
        if (category) {
            category.isLoading = true;
        } else {
            this.setState({isLoading: true});
        }
        // let url = this.resourceServer + (category ? "?categoryId=" + category.id : "");
        let response = await this.categoryService.getChildren(category?category.id:"");
        let data = response.data || [];
        if (category){
            category.children = data;
            category.isLoading = false;
            this.setSelectedCategories(category.children);
        } else{
            this.state.Categories = data;
            this.setSelectedCategories(this.state.Categories);
        }
        this.setState({isLoading:false,Categories:this.state.Categories});
    }

    componentWillReceiveProps(nextProps){
        this.state.selectedCategory = nextProps.selectedCategories || [];
        this.setSelectedCategories(nextProps.selectedCategories || []);
        this.setState({});
    }

    getCategoryById(id:string, categories?:Category[]):Category{
        if (!categories){
            categories = this.state.Categories;
        }
        for (let i = 0 ; i<categories.length;i++ ){
            if (categories[i].id == id){
                return categories[i];
            }else if ((categories[i].children || []).length >0){
                let category = this.getCategoryById(id,categories[i].children);
                if (category)
                    return category;
            }
        }
      return null;
    }

    setSelectedCategories(categories?:Category[]){
        if ((categories||[]).length >0){
            categories.forEach(x => {
                x.isSelected = this.state.selectedCategory?this.state.selectedCategory.some(y => y.id == x.id):false;
                if ((x.children || []).length >0){
                    this.setSelectedCategories(x.children);
                }
            });
        }
    }

    isPermitedSelection(category:Category):boolean{
        if (category){
            let children = category.children || [];
            for (let i = 0 ;i< children.length;i++){
                if (children[i].isSelected || !this.isPermitedSelection(children[i])){
                    return false;
                }
            }
        }
        return true;
    }

    toggleExpand(category: Category) {
        if (category.hasChildren) {
            category.isExpand = !category.isExpand;
            if (category.isExpand && (category.children || []).length == 0) {
                this.loadChildren(category);
            }
            this.setState({});
        }
    }

    saveCategories(){
        //get categories is selected in dialog
        let categories = this.getSelectedCategories() || [];
        let selectedCategories = this.state.selectedCategory;
        selectedCategories.forEach(x=>{
            //get categories that is selected and unload in dialog
            if (!this.getCategoryById(x.id)){
                categories.push(x);
            }
        });
        selectedCategories = categories;
        if (this.props.changeCategories){
            // let ids = selectedCategories.map(x => x.id) || [];
            this.props.changeCategories(selectedCategories);
        }
        this.setState({showDialog: !this.state.showDialog, selectedCategory:selectedCategories});
    }

    toggleDialog(){
        if (!this.state.showDialog){
            this.setSelectedCategories(this.state.Categories);
        }
        this.setState({showDialog: !this.state.showDialog});
    }

    /**
     * get categories is selected in the category
     * @param category is root categories. if category = null then find all
     * @returns categories
     */
    getSelectedCategories(category?: Category): Category[] {
        let children = [];
        if (!category) {
            children = this.state.Categories || [];
        }else{
            children = category.children || [];
        }

        let selectedItems = [];
        for (let i = 0; i < children.length; i++) {
            if (children[i]) {
                let items = this.getSelectedCategories(children[i]) || [];
                if (items.length > 0) {
                    selectedItems = selectedItems.concat(items);
                }
            }
        }
        if (selectedItems.length == 0 && category && category.isSelected) {
            selectedItems.push(category);
        }
        return selectedItems;
    }

    render() {
        return (
            <div className="dkm-fields dkm-ad-category-input-box">
                <div className="dkm-show-selected-categories">
                    <label className="dkm-label">Categories</label>
                    <div className="dkm-category">
                        <div className="dkm-input">
                            {
                                this.state.selectedCategory.map(x=>this.renderSelectedCategory(x))
                            }
                        </div>
                        <a className="dkm-button" title="Add categories"
                                onClick={event => this.toggleDialog()}><i className="edit icon"/>
                        </a>
                    </div>
                </div>
                {this.renderDialog()}
            </div>
        )
    }

    unSelectCategory(category){
        let index = this.state.selectedCategory.indexOf(category);
        if (index >-1){
            this.state.selectedCategory.splice(index,1);
        }
        this.setState({selectedCategory: this.state.selectedCategory});
        if (this.props.changeCategories){
            this.props.changeCategories(this.state.selectedCategory);
        }
    }

    toggleCategory(category){
        if (!category.hasChildren) {
            category.isSelected = !category.isSelected;
            this.setState({});
        }else{
            this.toggleExpand(category);
        }
    }

    renderSelectedCategory(category:Category){
        return(
            <div className="dkm-selected-category" key={"category"+category.id} onClick={event => this.unSelectCategory(category)}>
                {category.name}
                <span>X</span>
            </div>
        )
    }

    renderDialog() {
        if (this.state.showDialog) {
            return (
                <div className="dkm-categories-modal">
                    <div className="dkm-categories-modal-background">
                        <div className="dkm-dialog-modal">
                            <div className="dkm-modal-content">
                                <div className="dkm-header">Categories</div>
                                <div className="dkm-body">
                                    {
                                        (this.state.isLoading) ?
                                            <Loader key="loader-root" showLoader={true}/> :
                                            ((this.state.Categories || []).length > 0) ?
                                                this.state.Categories.map(category => this.renderCategory(category)) :
                                                <label>Không có dữ liệu</label>
                                    }
                                </div>
                                <div className="dkm-footer">
                                    <button onClick={event => {this.saveCategories();}}>Save</button>
                                    <button onClick={event => {this.toggleDialog()}}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    renderCategory(category: Category) {
        let id = "category-" + category.id;
        let children = category.children || [];
        let enable = (children.length == 0) || this.isPermitedSelection(category);
        return (
            <div className="dkm-category-item" key={"categoryItem"+category.id}>
                {category.hasChildren ?
                    <div className="dkm-category-expand"
                         onClick={event => {this.toggleExpand(category)}}>{category.isExpand ? "-" : "+"}</div>:
                    null
                }
                {!category.hasChildren?
                        <div className={category.isSelected?"dkm-checkbox dkm-checked":"dkm-checkbox"} classID={id}
                             onClick={event => {category.isSelected = !category.isSelected; this.setState({});}}></div>:
                    null
                }
                <div className="dkm-category-name" htmlFor={id}
                     onClick={event => {this.toggleCategory(category)}}>{category.name}</div>

                {(category.hasChildren && category.isExpand) ?
                    (category.isLoading) ?
                        <Loader key={"loader"+category.id} showLoader={true}/> :
                        children.map(item =>
                            this.renderCategory(item)) :
                    null
                }
            </div>
        )
    }
}