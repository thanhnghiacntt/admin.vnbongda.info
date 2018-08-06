
import {TokenService} from "../services/TokenService";
import {Cookie} from "./Cookie";
import {Config} from "../settings/Config";
import {Url} from "./Url";
import {ResponseCode} from "../common/network/ResponseCode";
import {Response} from "../common/network/HttpClient";

const AuthenticationKey = {
  portalToken: "access_token",
  token: "map_access_token",
  user: "map_user",
};

export class Authentication {

  /**
   * Check URL and remove token to set token
   */
  public static async check(callback: Function) {
    try {
      let tokenService = new TokenService();
      let token = Url.getParameterByName(AuthenticationKey.portalToken);
      if (token != null && token.length > 0) {
        let response = (await tokenService.verifyTokenFromPortal(token)) as Response;
        if (response.code == ResponseCode.success){
          this.save(response.data)
        }
        callback()
      } else {
        token = Url.getParameterByName(AuthenticationKey.token);
        if (token != null && token.length > 0) {
          let response = await tokenService.loginByToken(token);
          if (response.code == ResponseCode.success){
            this.save(response.data)
          }
          callback()
        }
      }
    } catch (error) {
      callback()
    }
  }

  /**
   * Call back function when verify from portal,
   * Page will be reloaded
   * @param data
   */
  public static save(data) {
    if (data != null && data.accessToken != null && data.user != null) {
      let date = new Date(data.expirationTime);
      Cookie.set(AuthenticationKey.token, data.accessToken, date);
      Cookie.set(AuthenticationKey.user, JSON.stringify(data.user), date);
    }
  }

  public static saveUser(user){
    Cookie.set(AuthenticationKey.user, JSON.stringify(user));
  }

  /**
   * Get user of cookie
   */
  public static getUser() {
    let user = Cookie.get(AuthenticationKey.user);
    if (user != null) {
      return JSON.parse(user);
    }
    return null;
  }

  /**
   * Get name of user
   */
  public static getName() {
    let user = this.getUser();
    if (user != null) {
      return (user.firstName || "").trim() + " " + (user.lastName || "").trim();
    }
    return null;
  }

  /**
   * Get avatar of user
   */
  public static getAvatar() {
    let user = this.getUser();
    if (user != null) {
      return user.avatar;
    }
    return null;
  }

  public static getToken(){
    return Cookie.get(AuthenticationKey.token)
  }

  /**
   * Is authentication
   * @returns {boolean}
   */
  public static isAuthentication(): boolean {
    let value = Cookie.get(AuthenticationKey.token)
    if (value != null && value.trim().length > 0) {
      return true;
    }
    return false;
  }

  /**
   * check is admin or not
   * @returns {boolean}
   */
  public static isAdministrator() {
    let userString = Cookie.get(AuthenticationKey.user);
    if (userString) {
      try {
        let user = JSON.parse(userString);
        // for (let role of user.roles) {
        if (user.role == "Administrator") {
          return true;
        }
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  /**
   * Logout
   */
  public static logout() {
    Cookie.unset(AuthenticationKey.token);
    Cookie.unset(AuthenticationKey.user);
  }

  /**
   * Login
   */
  public static async login(user: string = null, password: string = null, callback: Function = null) {
    try {
      if (user != null && user.trim().length > 0 && password != null && password.trim().length > 0) {
        let tokenService = new TokenService();
        let response = await tokenService.login(user, password);
        let value = response.data;
        Authentication.save(value);
        callback(value);
      } else {
        window.location.href = Config.portalLoginUrl + "?returnurl=" + window.location.origin + window.location.pathname;
      }
    } catch (error) {
      console.log(error)
      Authentication.logout()
      callback(null);
    }
  }
}