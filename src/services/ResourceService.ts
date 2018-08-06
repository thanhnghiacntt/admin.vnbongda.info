import {HttpClient} from "../common/network/HttpClient";
import {Query, PagingData} from "./Query";
import {Config} from "../settings/Config";



/**
 * the shared http client
 * @type {HttpClient}
 */
export var httpClient = new HttpClient(Config.apiEndpoint);


/**
 * The resource class for querying data
 * Update data & delete data
 */
export class ResourceService<T> {

  /**
   * the shared http client
   */
  protected client: HttpClient = httpClient;

  /**
   * initialize the resource with name
   */
  constructor(protected name: string) {
  }

  /**
   * create a query
   * example:
   *  buildingService.query().where("name").contains("data");
   *
   * @return {Query}
   */
  query(): Query<T> {
    return new Query<T>(this);
  }

  /**
   * Execute a query
   * @param query the data query
   */
  executeQuery(query: Query<T> = undefined) {

    let url = this.name + "?";

    if (query) {
      url += "query=" + encodeURIComponent(query.queryString);
    }

    return this.client.get(
      url + "&start=" + query.start + "&limit=" + query.limit
    );
  }

  /**
   * get item
   * @param id
   */
  get(id: string){
    return this.client.get(this.name + "/" + id)
  }

  /**
   * save an item
   * @param data the item to save
   */
  save(data: T) {
    return this.client.post(this.name, data);
  }

  /**
   * partial update
   *
   * @param data item to save
   */
  partialSave(data: T) {
    const url = this.name + "/" + data["id"];
    return this.client.post(url, data);
  }


  /**
   * delete an item
   * @param data item to delete
   */
  delete(data: T) {
    return this.client.delete(this.name + "/" + data["id"]);
  }

}