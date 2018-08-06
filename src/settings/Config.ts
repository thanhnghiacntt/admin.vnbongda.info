/**
 * Created by Kem on 10/31/2016.
 */


export class Config {
  static get env(){
    if (/dev/.test(window.location.hostname) || /localhost/.test(window.location.hostname))
      return "dev"
    else
      return ""
  }

    static get portalLoginUrl() {
      if (/dev/.test(window.location.hostname))
          return "//dev.xinkciti.com/Login"
      else
        return "//xinkciti.com/Login"
    }

    static get apiEndpoint() {
        return window.location.protocol + "//mapapi.xinkciti.com/api"
    }

    static get resourceServer() {
      return window.location.protocol + "//map" + this.env + ".xinkciti.com"
    }

    static get previewLink() {
      return window.location.protocol + "//map" + this.env + ".xinkciti.com"
    }
}