import {AppEvent, AppStore} from "../redux/AppStore";
import * as moment from "moment";
import UserEntity from "../models/UserEntity";
import GalleryEntity from "../models/GalleryEntity";
import CategoryEntity from "../models/CategoryEntity";

/**
 * Class helper utils
 */
export class Helper {

  /**
   * Convert
   * @param data
   * @param {string} obj
   * @returns {any}
   */
  public static convert(data: any, obj: string){
    if(Array.isArray(data)){
      let rs: Array<any> = [];
      data.forEach((value, index)=>{
        let temp = Helper.converObjectToObject(value, obj);
        rs.push(temp);
      });
      return rs;
    }else{
      return Helper.converObjectToObject(data, obj);
    }
  }

  /**
   *
   * @param objSrc is UserEntity or CategoryEntity or GallerEntity
   * @param {string} objDest
   */
  public static converObjectToObject(objSrc: any, objDest: string): any{
    switch (objDest){
      case "UserEntity":
        let user : UserEntity = {
          id : objSrc["id"],
          firstName: objSrc["first_name"],
          lastName: objSrc["last_name"],
          username: objSrc["username"],
          email: objSrc["email"],
          phone: objSrc["phone"],
          avatar: objSrc["avatar"],
          role:objSrc["role"]
        };
        return user;

      case "CategoryEntity":
        let category : CategoryEntity = {
          id : objSrc["id"],
          description: objSrc["description"],
          name: objSrc["name"],
          orderBy: objSrc["order_by"],
          parentId: objSrc["parent_id"],
          slug: objSrc["id"]
        };
        return category;

      case "GallerEntity":
        let gallery : GalleryEntity = {
          id : objSrc["id"],
          image: objSrc["image"],
          description: objSrc["description"],
          title: objSrc["title"]
        };
        return gallery;
    }
    return null;
  }

  /**
   * Check is null or empty
   * @param value
   * @returns {boolean}
   */
  public static isNullOrEmpty(value: string): boolean {
    return value == null || value == "";
  }

  /**
   * Object to parameter
   * @param opts
   * @returns {string}
   */
  public static objectToParams(opts: any) {
    var params = "";
    for (var key in opts) {
      if (params != "") {
        params += "&";
      }
      params += key + "=" + encodeURIComponent(opts[key]);
    }
    return params;
  }

  public static navigateTo(path: any){
    AppStore.postEvent(AppEvent.redirect, path);
  }

  public static setPageTitle(title: string = "") {
    AppStore.postEvent(AppEvent.changePageTitle, title);
  }


  public static findItemByKey(collection: Array<any>, keyName: string, keyValue: any): any {
    let result = null;
    if (collection) {
      collection.map((x)=> {
        if (x[keyName] == keyValue) result = x;
      })
    }

    return result;
  }

  /***
   * Soft array which name
   * @param list
   * @returns {null}
   */
  public static sortName(list: any): any {

    if (list != null && Array.isArray(list)) {
      list.sort(function (first, second) {
        return Helper.compare(first.name, second.name);
      })
    }
    return [];
  }

  /***
   * Compare unicode
   * @param first
   * @param second
   * @returns {number}
   */
  public static compare(first: string, second: string) {
    if (first == null || second == null) {
      return 0;
    }
    if (first == second) {
      return 0;
    }
    let str1 = first.toLowerCase();
    let str2 = second.toLowerCase();
    let len1 = str1.length;
    let len2 = str2.length;
    let len = len1 < len2 ? len1 : len2;
    for (var i = 0; i < len; i++) {
      let a = str1[i];
      let b = str2[i];
      if (a == null || b == null) {
        return 0;
      }
      if (Helper.comp[a] < Helper.comp[b]) {
        return -1;
      }
      if (Helper.comp[a] > Helper.comp[b]) {
        return 1;
      }
    }
    if (len1 > len2) {
      return 1;
    } else {
      if (len1 < len2) {
        return -1;
      }
    }
    return 0;
  }


  //validate email.
  public static validateEmail(email: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  public static validUserName(username: string) {
    var re = /^[A-Za-z0-9]*$/;
    return re.test(username) && !this.isNullOrEmpty(username) && username.length >= 5 && username.length <= 50;
  }

  public static isEmpty(str: string){
    if(str == null || str.trim().length == 0){
      return true;
    }
    return false;
  }

  /**
   * Format date
   * @param date
   * @returns {string}
   */
  static dateFormart(date: any): string {
    let mdate = moment(date)
    if (mdate.isValid) {
      return mdate.format("DD/MM/YYYY")
    }
    return
  }


  // Table unicode to compare
  public static comp: any = {
    "a": 10, "à": 11, "á": 12, "ạ": 13, "ả": 14, "ã": 15,
    "ă": 20, "ằ": 21, "ắ": 22, "ặ": 23, "ẳ": 24, "ẵ": 25,
    "â": 30, "ầ": 31, "ấ": 32, "ậ": 33, "ẩ": 34, "ẫ": 35,
    "b": 40, "c": 50, "d": 60, "đ": 70,
    "e": 80, "è": 81, "é": 82, "ẹ": 83, "ẻ": 84, "ẽ": 85,
    "ê": 90, "ề": 91, "ế": 92, "ệ": 93, "ể": 94, "ễ": 95,
    "f": 100, "g": 110, "h": 120,
    "i": 130, "ì": 131, "í": 132, "ị": 133, "ỉ": 134, "ĩ": 135,
    "j": 140, "k": 150, "l": 160, "m": 170, "n": 180,
    "o": 190, "ò": 191, "ó": 192, "ọ": 193, "ỏ": 194, "õ": 195,
    "ô": 200, "ồ": 201, "ố": 202, "ộ": 203, "ổ": 204, "ỗ": 205,
    "ơ": 210, "ờ": 211, "ớ": 212, "ợ": 213, "ở": 214, "ỡ": 215,
    "p": 220, "q": 230, "r": 240, "s": 250, "t": 260,
    "u": 270, "ù": 271, "ú": 272, "ụ": 273, "ủ": 274, "ũ": 275,
    "ư": 280, "ừ": 281, "ứ": 282, "ự": 283, "ử": 284, "ữ": 285,
    "v": 290, "w": 300, "x": 310,
    "y": 320, "ỳ": 321, "ý": 322, "ỵ": 323, "ỷ": 324, "ỹ": 325,
    "0": 400, "1": 401, "2": 402, "3": 403, "4": 404, "5": 405, "6": 406, "7": 407, "8": 408, "9": 409
  };
}
