import {ResourceService} from "./ResourceService";
import {Config} from "../settings/Config";
import {Authentication} from "../utils/Authentication";
import {Configuration} from "../settings/Configuration";


/**
 *
 * The http client
 */
export class TextureService extends ResourceService<Configuration> {


  /**
   * create a building service
   */
  constructor() {
    super("/textures");
    this.endPoint = Config.apiEndpoint;
  }

  endPoint: string;
  /**
   * url to the service
   * @type {string}
   */

  /**
   * upload 1 file with callback
   * @param file
   * @param callback
   */
  upload(file: File, callback: (string) => void) {
    let request = new XMLHttpRequest();
    if (request.upload) {
      request.open("POST", this.endPoint + "/textures/" + file.name, true);
      request.setRequestHeader("ContentType", "");
      if (Authentication.isAuthentication()) {
        request.setRequestHeader("Authorization", "Bearer " + Authentication.getToken());
      }
      request.onreadystatechange = () => {
        if (request.readyState == XMLHttpRequest.DONE
          && request.status == 200) {
          let response = JSON.parse(request.responseText)
          callback(response.data)
        }
      };

      request.send(file);
    }
  }
}
