import {Model} from "./Model";

/**
 * Category entity
 */
export default interface CategoryEntity extends Model{
  /**
   * Name category
   */
  name?: string;

  /**
   * Description category
   */
  description?: string;

  /**
   * Slug category
   */
  slug?: string;

  /**
   * Parent id category
   */
  parentId?: number;

  /**
   * Order by category
   */
  orderBy?: number
}