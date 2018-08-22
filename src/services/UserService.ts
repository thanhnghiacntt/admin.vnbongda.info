import {Cookie} from "../helpers/Cookie";
import {Callback} from '../helpers/HttpClient';
import {CookieKey} from "../helpers/CookieKey";
import {ResourceService} from "./ResourceService";

export class UserService extends ResourceService{
  constructor() {
    super("user")
  }

  login(email: string, password: string, callback: Callback) {
    let data: any = {
      "username":email,
      "password":password
    };
    this.post("login", data, callback);
  }

  register(data: any, callback: Callback){
    this.save("create", data, callback);
  }
}

