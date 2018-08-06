/**
 * Created by kem on 8/27/17.
 */

export class Cookie{
  public static set(key: string, value: any, expiration: Date = null) {
    $.cookie(key, value, {expires: expiration, path: "/"});
  }

  public static unset(key: string){
    $.removeCookie(key)
  }

  public static get(name: string) {
    return $.cookie(name);
  }
}