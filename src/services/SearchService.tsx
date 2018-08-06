import {Config} from "../settings/Config";
import {ResourceService} from "./ResourceService";
import {Request} from "../common/network/HttpClient"


export class SearchService extends ResourceService<{}> {

  endPoint: string;

  /**
   * create a map setting service
   */

  request: Request = null;

  constructor() {
    super("/search");
    this.endPoint = Config.apiEndpoint;
  }

  search(text: string, callback: (data)=>(void)) {
    let url = Config.apiEndpoint + "/search" + "?key=" + encodeURIComponent(text);

    if (this.request) {
      this.request.abort();
    }
    this.request = new Request("GET", url).execute();
    this.request.then((res) => {
      callback(res.data);
    })
  }

  cancelRequest() {

  }
}