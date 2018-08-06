import {Config} from "../settings/Config";
import {HttpClient} from "../common/network/HttpClient";

/**
 * the texture service
 */
export class TokenService {
  /**
   * the shared http client
   */
  protected client: HttpClient = new HttpClient(Config.apiEndpoint);

  /**
   * Verify token from portal and base on it to create new token of API
   * @param token
   * @param callback
   */
  verifyTokenFromPortal(token: string) {
    let data = {"token": token};
    return this.client.post("/users/verifyPortalAccessToken", data);
  }


  /**
   * login by token
   * @param token
   * @param callback
   */
  loginByToken(token: string) {
    let data = token;
    return this.client.post("/users/loginByToken", data);
  }


  /**
   * Login API
   * @param user
   * @param password
   * @param callback
   */
  login(user: string, password: string) {
    let data = {
      "userName": user,
      "password": password
    };
    return this.client.post("/users/authenticate", data);
  }
}
