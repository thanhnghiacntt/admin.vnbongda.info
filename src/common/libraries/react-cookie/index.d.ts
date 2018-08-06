declare module "react-cookie" {

  /**
   * the option for cookie
   */
  interface CookieOption {

    /**
     * path of the cookie
     */
    path?: string;

    /**
     * time to expires
     */
    expires?: Date;

    /**
     * max age in seconds
     */
    maxAge?: number;

    /**
     * domain of the cookie
     */
    domain?: string;

    /**
     * is a secure cookie
     */
    secure?: boolean;

    /**
     * is http only
     */
    httpOnly?: boolean;
  }

  /**
   * the react cookie
   */
  interface CookieManager {
    /**
     * save a cookie
     * @param name name of the cookie
     * @param value value of the cookie
     * @param options the options
     */
    save(name: string, value: any, options?: CookieOption);

    /**
     * remove a cookie
     * @param name name of the cookie to remove
     * @param options options
     */
    remove(name: string, options?: CookieOption);

    /**
     * load a cookie
     * @param name name of the cookie
     * @param doNotParse
     */
    load(name: string, doNotParse?: boolean): any;


    /**
     * select cookie regular expression
     * @param regexp the regular expression
     * @return name of cookies
     */
    select(regexp: RegExp): string[];


    /**
     * set raw cookie
     * @param rawCookies cookies to set
     */
    setRawCookie(rawCookies: any);

    /**
     * plug cookie into a request, use for nodejs
     * @param request the request
     * @param response the response stream
     */
    plugToRequest(request, response): Function;

  }

  /**
   * the cookie to export
   */
  var cookie: CookieManager;

  /**
   * default export
   */
  export = cookie;
}