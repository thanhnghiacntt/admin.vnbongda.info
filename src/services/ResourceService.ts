/**
 * Resource service
 */
import {Callback, HttpClient} from "../helpers/HttpClient";
import {Config} from "../settting/Config";
/**
 * the shared http client
 * @type {HttpClient}
 */
export var httpClient = new HttpClient();

export class ResourceService {
  /**
   * Path home url
   * @type {string}
   */
  protected pathHome: string = Config.apiEndpoint;
  /**
   * the shared http client
   */
  protected client: HttpClient = httpClient;

  /**
   * initialize the resource with name
   */
  constructor(protected name: string) {
    this.pathHome += "/" + name;
  }

  /**
   * get item
   * @param id
   */
  get(path: string, callback: Callback) {
    return this.client.get(this.pathHome + "/" + path, null, callback);
  }

  /**
   * save an item
   * @param data the item to save
   */
  post(path: string, data: any, callback: Callback) {
    return this.client.post(this.pathHome + "/" + path, data, callback);
  }

  /**
   * save an item
   * @param data the item to save
   */
  put(path:string, data: any, callback: Callback) {
    return this.client.put(this.pathHome + "/" + path, data, callback);
  }

  /**
   * save an item
   * @param data the item to save
   */
  patch(path:string, data: any, callback: Callback) {
    return this.client.patch(this.pathHome + "/" + path, data, callback);
  }

  /**
   * delete an item
   * @param data item to delete
   */
  delete(path:string, callback: Callback) {
    return this.client.delete(this.pathHome + "/" + path, null, callback);
  }

  /**
   * save an item
   * @param data the item to save
   */
  save(path:string, data: any, callback: Callback) {
    return this.client.post(this.pathHome + "/" + path, data, callback);
  }

  /**
   * partial update
   *
   * @param data item to save
   */
  update(path:string, data: any, callback: Callback) {
    return this.client.post(this.pathHome + "/" + path, data, callback);
  }
}

