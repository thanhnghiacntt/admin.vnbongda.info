import {ResourceService} from "./ResourceService";
import {Callback} from "../helpers/HttpClient";
import CategoryEntity from "../models/CategoryEntity";

export class CategoryService extends ResourceService{
  constructor() {
    super("category")
  }

  /**
   * New category
   * @returns {CategoryEntity}
   */
  getNewCategoryEntity(): CategoryEntity{
    let category: CategoryEntity = {
      orderBy : 0,
      parentId: 0,
      id: 0,
      description: "",
      slug: "",
      name: ""
    };
    return category;
  }
  /**
   * Get all
   * @param {Callback} callback
   */
  getAll(callback: Callback){
    this.get("all", callback);
  }
}

