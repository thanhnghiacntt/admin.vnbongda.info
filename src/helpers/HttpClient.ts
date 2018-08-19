
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

export type Callback = (response: any) => void

export interface Response {
  success?: boolean,
  message?: string,
  data?: any
}

export class HttpClient {

  get(url: string, params: any, headers: RequestHeaders, callback: Callback){
    return this.sendRequest(Method.GET, url, params, headers, callback)
  }

  post(url: string, params: any, headers: RequestHeaders, callback: Callback){
    return this.sendRequest(Method.POST, url, params, headers, callback)
  }

  put(url: string, params: any, headers: RequestHeaders, callback: Callback){
    return this.sendRequest(Method.PUT, url, params, headers, callback)
  }

  patch(url: string, params: any, headers: RequestHeaders, callback: Callback){
    return this.sendRequest(Method.PATCH, url, params, headers, callback)
  }

  delete(url: string, params: any, headers: RequestHeaders, callback: Callback){
    return this.sendRequest(Method.DELETE, url, params, headers, callback)
  }

  sendRequest(method: Method, url: string, data: any, headers: RequestHeaders, callback: Callback){
    let request = new XMLHttpRequest();

    request.onload = (event) => {
      let req = event.target as XMLHttpRequest;
      let content = {};
      let error = false;
      try {
        content = JSON.parse(req.responseText)
      }
      catch (err){
        content = {
          success: false,
          message: "Response is not valid json format",
          data: req.responseText
        }
      }

      callback(content)
    };

    request.ontimeout = (event) => {
      let req = event.target as XMLHttpRequest;
      let content = {
        success: false,
        message: "Request timeout",
        data: req.responseText
      };
      callback(content)
    };

    request.onerror = (event) => {
      let req = event.target as XMLHttpRequest;
      let content = {
        success: false,
        message: "Request error",
        data: req.responseText
      };
      callback(content)
    };

    if (method == "GET"){
      request.open(method, this.buildUrl(url, data), true)
    }
    else
    {
      request.open(method, url, true);
    }

    if (data != null){
      request.setRequestHeader("Content-Type", "application/json");
    }

    if (headers != null) {
      for (let key in headers){
        request.setRequestHeader(key, headers[key])
      }
    }

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