export class ResponseCode {
  /**
   * Response success
   * @type {string}
   */
  public static success = "success";

  /**
   * Response error
   * @type {string}
   */
  public static error = "error";

  /**
   * Response netword error
   * @type {string}
   */
  public static network = "network_error";

  /**
   * Response exception
   * @type {string}
   */
  public static exception = "exception";

  /**
   * Delete category reference other
   * @type {string}
   */
  public static deleteReference = "delete_category_reference";

  public static prototypeIsUsedByCommon = "common_object_using";

  public static prototypeIsUsedBySObject = "special_object_using";

  public static idNotFound = "id_not_found";

  public static deleteError = "delete_error";

  // custom field response
  public  static customFieldValueUsing = "custom_field_value_using";


}