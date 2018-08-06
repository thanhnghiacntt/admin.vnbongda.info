import {ResourceService} from "./ResourceService";
import {Request} from "../common/network/HttpClient"
import {UserFilter, User} from "../models/User";
import {Helper} from "../utils/Helper";


export class UserService extends ResourceService<User> {

  endPoint: string;

  /**
   * create a map setting service
   */

  request: Request = null;

  constructor() {
    super("/users");
  }

  getList(filter: UserFilter) {
    let url = this.name + "/list?" + Helper.objectToParams(filter);
    return this.client.get(url);
  }

  getUser(id: string) {
    let url = this.name + "/get/" + id;
    return this.client.get(url);
  }

  saveUser(user: User) {
    let url = this.name;
    if (Helper.isNullOrEmpty(user.id)) {
      return this.client.post(url, user);
    } else {
      return this.client.post(url + "/" + user.id, user);
    }
  }

  deleteUser(id: string) {
    let url = this.name + "/" + id;
    let response = this.client.delete(url);
    return response;
  }


  async authenticate(username: string, password: string) {
    let url = this.name + "/authenticate";
    let response = await this.client.post(url, {userName: username, password: password});
    return response.data.user;
  }

  cancelRequest() {

  }

  resetPassword(email: string) {
    if (!Helper.validateEmail(email)) {
      return;
    }
    let url = this.name + "/forget-password/" + email;
    return this.client.post(url);
  }

  renewPassword(password: string, token: string) {
    let url = this.name + "/reset-Password";
    return this.client.post(url, {token: token, newPassword: password, confirmPassword: password});
  }
}