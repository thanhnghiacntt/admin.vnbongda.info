import {Authentication} from "../../utils/Authentication";

/**
 *
 * The http client
 */
export class HttpClient {

  /**
   * list of header to send with the request
   */
  headers = {};

  /**
   * create a http client with base url and access token
   * @param baseUrl base url to the api
   * @param accessToken the access token for authentication
   */
  constructor(private baseUrl: string) {
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
   * call a get request
   *
   * @param url url to connect to
   */
  get(url: string, data?: any) {
    return this.sendRequest("GET", url, data);
  }

  /**
   * call a delete request
   *
   * @param url url to connect to
   */
  delete(url: string, data?: any) {
    return this.sendRequest("DELETE", url, data);
  }

  /**
   * send a post request with data
   *
   * @param url url to post
   * @param data the data
   * @param isJson if the body is json
   */
  post(url: string, data?: any) {
    return this.sendRequest("POST", url, data);
  }

  /**
   * send a patch request with data
   *
   * @param url url to patch
   * @param data the data
   * @param isJson if the body is json
   */
  patch(url: string, data?: any) {
    return this.sendRequest("PATCH", url, data);
  }

  /**
   * send a put request with data
   *
   * @param url url to put
   * @param data the data
   * @param isJson if the body is json
   */
  put(url: string, data?: any) {
    return this.sendRequest("PUT", url, data);
  }

  /**
   * execute a request
   * @param method
   * @param url
   * @param data
   * @param callback
   * @returns {Request}
   */
  sendRequest(method: string, url: string, data?: any) {
    const request: Request = new Request(
      method,
      this.baseUrl + url,
      data
    );
    request.headers = this.headers;
    if (Authentication.isAuthentication()) {
      request.headers["Authorization"] = "Bearer " + Authentication.getToken();
    }
    request.execute();
    return request.promise;
  }
}

export class Response {
  /**
   * Message response
   */
  message: string;

  /**
   * Code response
   */
  code: string;

  /**
   * reponse data
   */
  data: any;
}

/**
 * Status code
 */


/**
 * The network request
 */
export class Request {

  /**
   * number of referece
   */
  private refCount: number = 0;

  /**
   * the real http xml request
   */
  private request: XMLHttpRequest;

  /**
   * request headers
   * @type {{}}
   */
  public headers = {};


  /**
   * promise
   */
  private _promise: any;


  /**
   * constructor
   * @param order
   * @param type
   * @param location
   * @param method
   * @param url
   * @param data
   * @param callback
   */
  constructor(/**
               * method of the request
               */
              public method: string,
              /**
               * url to connect to
               */
              public url: string,
              /**
               * data to send to the request
               */
              public data?: any) {
    this.request = null;
  }

  get promise() {
    return this._promise;
  }

  /**
   * then like then of promise
   * @param callback
   * @returns {any|JQueryPromise<U>|PromiseLike<TResult>|JQueryPromise<R>|Promise<TResult>|JQueryPromise<void>}
   */
  then(callback: (Response) => void) {
    return this.promise.then(response => {
      callback(response);
    });
  }

  httpResponseError() {

  }

  /**
   * execute a request
   */
  execute() {
    this.request = new XMLHttpRequest();
    let _request = this.request;
    let _method = this.method;
    let _url = this.url;
    let _data = this.data;
    let _headers = this.headers;

    this._promise = new Promise(function (resolve, reject) {
      _request.onload = (event) => {
        let request = event.target as XMLHttpRequest;
        let response = new Response();
        try {
          response = JSON.parse(request.responseText);
        }
        catch (err) {
          response.code = "error";
          response.message = err;
        }
        let headers = request.getAllResponseHeaders();
        let headersArray = [];
        ( headers.split(/\n/g) || []).map(x => {
          let arr = x.split(':');
          headersArray[arr[0]] = arr.splice(1, arr.length - 1).join('');
        });
        resolve(response);
      };

      _request.ontimeout = (event) => {
        let request = event.target as XMLHttpRequest;
        let response = new Response();
        response.code = "timeout";
        response.message = "Request timeout.";
        reject(response);
      };

      _request.onerror = (event) => {
        let request = event.target as XMLHttpRequest;
        let response = new Response();
        response.code = "netword_error";
        response.message = "Network request failed.";
        reject(response);
      };

      _request.open(_method, _url, true);

      if (_data != null) {
        _request.setRequestHeader("Content-Type", "application/json");
      }

      for (let key in _headers) {
        _request.setRequestHeader(key, _headers[key]);
      }

      _request.setRequestHeader("Accept", "application/json");

      _request.send(_data != null ? JSON.stringify(_data) : null);
    });

    return this;
  }

  retain() {
    this.refCount++;
    return this;
  }

  /**
   * cancel the request
   */
  abort() {
    if (this.refCount > 0) {
      this.refCount--;
      return;
    }

    if (this.request != null) {
      this.request.abort();
    }
  }
}
