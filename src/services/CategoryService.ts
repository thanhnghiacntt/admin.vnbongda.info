import {ResourceService} from "./ResourceService";
import {Config} from "../settings/Config";
import {Category} from "../models/Category";
import {Helper} from "../utils/Helper";
import {Configuration} from "../settings/Configuration";


export class CategoryService extends ResourceService<Configuration> {

  endPoint: string;

  /**
   * create a map setting service
   */

  constructor() {
    super("/category");
    this.endPoint = Config.apiEndpoint;
  }

  /**
   * Get category by id
   * @param id
   */
  getCategoryById(id: string) {
    const url = this.name + "/" + id;
    var response = this.client.get(url);
    return response;
  }

  /**
   * Save category
   */
  saveCategory(category: Category) {
    var url = this.name + "/save";
    if (!Helper.isNullOrEmpty(category.id)) {
      url = this.name + "/update/" + category.id;
      var response = this.client.post(url, category);
      return response;
    } else {
      var response = this.client.post(url, category);
      return response;
    }
  }

  /**
   * Del category
   * @param id
   */
  delCategoryById(id: string) {
    const url = this.name + "/delete/" + id;
    var response = this.client.delete(url);
    return response;
  }

  /**
   * Del category
   * @param id
   */
  forceDelCategoryById(id: string) {
    const url = this.name + "/force-delete/" + id;
    let response = this.client.delete(url);
    return response;
  }

  /**
   * Get categories
   * @param id
   */
  getCategories() {
    const url = this.name + "/list";
    let response = this.client.get(url);
    return response;
  }

  getChildren(id?: string) {
    const url = this.name + "/children" + ((id || "").length > 0 ? "?id=" + id : "");
    let response = this.client.get(url);
    return response;
  }
}