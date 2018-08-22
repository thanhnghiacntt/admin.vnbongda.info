import {Model} from "./Model";

export default interface GalleryEntity extends Model {
  /**
   * Image url
   */
  image: string;

  /**
   * Title
   */
  title: string;

  /**
   * Description
   */
  description: string;
}