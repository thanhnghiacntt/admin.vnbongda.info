import {UserService} from "../services/UserService";
import {Cookie} from "./Cookie";
import {CookieKey} from "./CookieKey";


export class Authentication {

  /**
   * Check URL and remove token to set token
   */
  public static async check(callback: Function) {
    try {
      let tokenService = new UserService();

    } catch (error) {
      callback()
    }
  }

  /**
   * Call back function when verify from portal,
   * Page will be reloaded
   * @param data
   */
  public static save(data: any) {
    if (data != null && data.token != null && data.user != null) {
      let date = this.getExpritime(data.token);
      Cookie.set(CookieKey.token, data.token, date);
      Cookie.set(CookieKey.user, JSON.stringify(data.user), date);
    }
  }

  /**
   * Save user
   * @param user
   */
  public static saveUser(user: any){
    Cookie.set(CookieKey.user, JSON.stringify(user));
  }

  /**
   * Get user of cookie
   */
  public static getUser() {
    let user = Cookie.get(CookieKey.user);
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

  /**
   * Get token
   * @returns {any}
   */
  public static getToken(){
    return Cookie.get(CookieKey.token)
  }

  /**
   * Is authentication
   * @returns {boolean}
   */
  public static isAuthentication(): boolean {
    let value = Cookie.get(CookieKey.token)
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
    let userString = Cookie.get(CookieKey.user);
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
   * Get language
   * @returns {*}
   */
  public static getLanguage() {
    return Cookie.get(CookieKey.language) || "en"
  }

  /**
   * Save language
   * @param language
   */
  public static saveLanguage(language: any) {
    return Cookie.set(CookieKey.language, language)
  }

  /**
   * Check login
   * @returns {boolean}
   */
  public static isLogin(){
    let userString = Cookie.get(CookieKey.user);
    if (userString) {
      try {
        let user = JSON.parse(userString);
        // for (let role of user.roles) {
        if (user.role != null) {
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
    Cookie.unset(CookieKey.token);
    Cookie.unset(CookieKey.user);
  }

  /**
   * Login
   * @param {string} username is username
   * @param {string} password is password
   * @param {Function} callback after login
   */
  public static login(username: string = null, password: string = null, callback: Function = null) {
    try {
      if (username != null && username.trim().length > 0 && password != null && password.trim().length > 0) {
        let userService = new UserService();
        let response = userService.login(username, password, function (response) {
          let value = response.data;
          Authentication.save(value);
          callback(value);
        });
      }
    } catch (error) {
      console.log(error);
      Authentication.logout();
      callback(null);
    }
  }

  /**
   * Parse JWT
   * @param {string} token
   * @returns {any}
   */
  public static parseJWT(token: string){
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  /**
   * Parse JWT
   * @param {string} token
   * @returns {any}
   */
  public static getExpritime(token: string): Date {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    let payload = JSON.parse(window.atob(base64));
    let date = new Date(payload.exp * 1000);
    return date;
  }
}