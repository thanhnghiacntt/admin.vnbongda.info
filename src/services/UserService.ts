import {Cookie} from "../helpers/Cookie";
import {Callback, RequestHeaders, HttpClient} from '../helpers/HttpClient';
import {AppStore, AppEvent} from '../redux/AppStore';
import {CookieKey} from "../helpers/CookieKey";
import {WebPromotion} from "./WebPromotion";

/**
 * Created by kem on 8/27/17.
 */

export enum Role {
  Employer = 0,
  Manager = 1
}

export interface Customer {
  [key: string]: any

  customerId?: Number
  name: String
  email: String
  quantity: Number
  confirm: Number
}


export class UserService {

  static shared = new UserService();

  constructor() {

  }

  login(email: string, password: string, callback: Callback) {

    let path = "user/login";
    let header: RequestHeaders = {};
    header["lang"] = "en";

    let params: any = {};
    params["username"] = email;
    params["password"] = password;

    WebPromotion.post(path, params, (response => {
      if (response.code == "success") {
        let expried = new Date(response.data.expirationTime);
        Cookie.set(CookieKey.token, response.data.accessToken, expried);
        Cookie.set(CookieKey.user, JSON.stringify(response.data.user), expried);
        AppStore.postEvent(AppEvent.setToken, response.data.token);
        callback(response)
      } else {
        callback(response)
      }
    }))
  }

  register(data: any, callback: Function){
    let path = "user";
    WebPromotion.post(path, data, (data: any) => {
      callback(data);
    })
  }

  logout() {
    Cookie.unset(CookieKey.token);
    Cookie.unset(CookieKey.user);
  }

  isLoggedIn() {
    return Cookie.get(CookieKey.token) != null
  }

  getLanguage() {
    return Cookie.get(CookieKey.language) || "en"
  }

  saveLanguage(language: any) {
    return Cookie.set(CookieKey.language, language)
  }
}

