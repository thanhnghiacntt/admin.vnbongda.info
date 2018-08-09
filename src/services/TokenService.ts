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
  async loginByToken(token: string) {
    let data = token;
    return await this.client.post("/users/loginByToken", data);
  }


  /**
   * Login API
   * @param user
   * @param password
   * @param callback
   */
  async login(user: string, password: string) {
    let data = {
      "username": user,
      "password": password
    };
    let rs =  await this.client.post("/user/login", data);
    return rs;
  }
}
