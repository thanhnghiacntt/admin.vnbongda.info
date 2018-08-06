export class Url {
  static token = "token";
  /**
   * Get parameter form url
   * @param name
   * @param url
   * @returns {any}
   */
  public static getParameterByName(name: string, url: string = null) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?|&|#]" + name + "(=([^&#]*)|&|#|$)");
    let results = regex.exec(url);
    if (!results) {
      return null;
    }

    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }


  /**
   * Validate url
   * @param url
   * @returns {boolean}
   */
  public static validate(url: string): boolean {
    if (url == null || url.length == 0) {
      return false;
    }
    let exp = new RegExp('(http|ftp|https)://[\\w-]+(\\.[\\w-]+)+([\\w-.,@?^=%&:/~+#-]*[\\w@?^=%&;/~+#-])?');
    return exp.test(url);
  }

  /**
   * Remove token outof url
   * @param url
   * @returns {string}
   */
  public static removeToken(url: string = null) {
    if (!url) {
      url = window.location.href;
    }
    let exp = "[?|&|#]" + Url.token + "(=[^&#]*|&|#|$)";
    let regex = new RegExp(exp);
    let results = url.replace(regex, "");
    return results;
  }
}