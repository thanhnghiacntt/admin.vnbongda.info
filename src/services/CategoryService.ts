import {ResourceService} from "./ResourceService";
import {Callback} from "../helpers/HttpClient";

export class CategoryService extends ResourceService{
  constructor() {
    super("category")
  }

  /**
   * Get all
   * @param {Callback} callback
   */
  getAll(callback: Callback){
    this.get("all", callback);
  }
}

