import {Authentication} from "./Authentication";
import {Helper} from "./Helper";

export interface RequestHeaders {
  [key: string]: string
}


export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE"
}

export type Callback = (response: HttpResponse) => void

export interface HttpResponse {
  code?: string,
  message?: string,
  data?: any
}

export class HttpClient {

  /**
   * list of header to send with the request
   */
  headers: RequestHeaders = {};

  /**
   * create a http client with base url and access token
   */
  constructor() {
  }

  /**
   * set header field
   * @param name name of the header
   * @param value value of the header field
   */
  setHeader(name: string, value: string) {
    this.headers[name] = value;
  }

  /**
   * Method get
   * @param {string} full url
   * @param {Callback} callback
   * @param data at body
   * @returns {XMLHttpRequest}
   */
  get(url: string, data?: any, callback?: Callback) {
    return this.sendRequest(Method.GET, url, data, callback);
  }

  /**
   * Method post
   * @param {string} full url
   * @param {Callback} callback
   * @param data at body
   * @returns {XMLHttpRequest}
   */
  post(url: string, data?: any, callback?: Callback) {
    return this.sendRequest(Method.POST, url, data, callback);
  }

  /**
   * Method put
   * @param {string} full url
   * @param {Callback} callback
   * @param data at body
   * @returns {XMLHttpRequest}
   */
  put(url: string, data?: any, callback?: Callback){
    return this.sendRequest(Method.PUT, url, data, callback);
  }

  /**
   * Method patch
   * @param {string} full url
   * @param {Callback} callback
   * @param data at body
   * @returns {XMLHttpRequest}
   */
  patch(url: string, data?: any, callback?: Callback){
    return this.sendRequest(Method.PATCH, url, data, callback);
  }

  /**
   * Method delete
   * @param {string} full url
   * @param {Callback} callback
   * @param data at body
   * @returns {XMLHttpRequest}
   */
  delete(url: string, data?: any, callback?: Callback){
    return this.sendRequest(Method.DELETE, url, data, callback);
  }

  /**
   * Send request
   * @param {Method} method
   * @param {string} full url
   * @param data at body
   * @param {Callback} callback
   * @returns {XMLHttpRequest}
   */
  sendRequest(method: Method, url: string, data: any, callback: Callback){
    let request = new XMLHttpRequest();

    request.onload = (event) => {
      let req = event.target as XMLHttpRequest;
      let content: HttpResponse = {};
      let error = false;
      try {
        content = JSON.parse(req.responseText)
      }
      catch (err){
        content = {
          code: "exception",
          message: "Response is not valid json format",
          data: req.responseText
        }
      }
      callback(content)
    };

    request.ontimeout = (event) => {
      let req = event.target as XMLHttpRequest;
      let content: HttpResponse = {
        code: "exception",
        message: "Request timeout",
        data: req.responseText
      };
      callback(content)
    };

    request.onerror = (event) => {
      let req = event.target as XMLHttpRequest;
      let content = {
        code: "exception",
        message: "Request error",
        data: req.responseText
      };
      callback(content)
    };
    request.open(method, url, true);

    if (data != null){
      request.setRequestHeader("Content-Type", "application/json");
    }

    if (this.headers != null) {
      for (let key in this.headers){
        request.setRequestHeader(key, this.headers[key]);
      }
    }
    if(Authentication.isLogin()){
      request.setRequestHeader("Authorization", "Bearer" + Authentication.getToken());
    }
    request.setRequestHeader("lang", Authentication.getLanguage());

    request.setRequestHeader("Accept", "application/json");

    request.send(data != null ? JSON.stringify(data): null);

    return request
  }

  /**
   * build url request
   * @param {string} url
   * @param {Map} params
   * @returns {string}
   */
  private buildUrl(url: string, params: any){

    if (params == null){
      return url
    }
    let pairs = [];

    for (let key in params)
    {
      pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
    }

    if (url.indexOf("?") >= 0){
      return url + "&" + pairs.join("&");
    }

    return url + "?" + pairs.join("&");
  }

}