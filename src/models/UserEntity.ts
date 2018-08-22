import {Model} from "./Model";

export default interface UserEntity extends Model {
  /**
   * First name
   */
  firstName: string;

  /**
   * Last name
   */
  lastName: string;

  /**
   * Username
   */
  username: string;

  /**
   * Email
   */
  email: string;

  /**
   * Role
   */
  role: string;

  /**
   * Phone
   */
  phone: string;

  /**
   * Avatar
   */
  avatar: string;
}