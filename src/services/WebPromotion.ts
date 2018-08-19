import {Callback, HttpClient, Method, RequestHeaders} from "../helpers/HttpClient";
import {AppStore} from "../redux/AppStore";
import {Cookie} from "../helpers/Cookie";
import {CookieKey} from "../helpers/CookieKey";


export class WebPromotion {

  static endPoint = "http://vnbongda.info/api";

  static get(path: string, params: any, callback: Callback) {
    return WebPromotion.sendRequest(Method.GET, path, params, callback)
  }

  static post(path: string, params: any, callback: Callback) {
    return WebPromotion.sendRequest(Method.POST, path, params, callback)
  }

  public static sendRequest(method: Method, path: string, data: any, callback: Callback) {

    let client = new HttpClient();

    let url = this.endPoint + "/" + path;

    let headers: RequestHeaders = {
      lang: AppStore.getState().currentLanguage
    };

    let token = Cookie.get(CookieKey.token);
    if (token != null) {
      headers["token"] = token;
    }
    let lang = Cookie.get(CookieKey.language);
    if(lang != null){
      headers["lang"] = lang;
    }

    client.sendRequest(method, url, data, headers, (response) => {
      callback(response)
    })
  }

}