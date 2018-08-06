import {ResourceService} from "./ResourceService";

/**
 * Paging data
 */
export class PagingData<T> {

  /**
   * total number of items
   */
  count: number;

  /**
   * data of current page
   */
  data: T[];
}

/**
 * The data query
 * @usage:
 *  var query = new Query().where("fieldName").equal("data")
 *                         .where("fieldName").greaterThan("");
 */
export class Query<T> {

  /**
   * the data that store the content of the query
   */
  private data: any = null;

  /**
   * list of fields to get
   */
  private fieldList: string[];

  /**
   * start of the query
   */
  public start: number = 0;

  /**
   * number of item to take
   */
  public limit: number = 0;

  /**
   * create a query on the resource service
   * @param resourceService the resource service
   */
  constructor(private resourceService: ResourceService<T> = undefined) {
  }


  /**
   * execute the query
   * @return {Promise<>}
   */
  execute(): Promise<PagingData<T>> {
    return this.resourceService.executeQuery(this);
  }

  /**
   * query a string
   */
  get queryString() {
    return JSON.stringify(this.data);
  }

  /**
   * create a condition
   * @param field the field to check
   * @return {Condition}
   */
  where(field: string): Condition<T> {
    return new Condition<T>(this, field);
  }

  /**
   * skip number of items
   * @param itemsToSkip number items to skip
   * @return {Query}
   */
  skip(itemsToSkip: number): Query<T> {
    this.start = itemsToSkip;
    return this;
  }

  /**
   * take number of items.
   *
   * @param numberOfItems
   * @return {Query}
   */
  take(numberOfItems: number): Query<T> {
    this.limit = numberOfItems;
    return this;
  }

  /**
   * add a condition to this query
   * @param field field to apply condition
   * @param condition the condition
   * @param value value to check
   */
  addCondition(field: string, condition: string, value: any) {
    if (!this.data) {
      this.data = {};
    }
    if (!this.data[field]) {
      this.data[field] = {};
    }

    this.data[field][condition] = value;
  }

  /**
   * and with another query
   * @param query target query
   */
  and(query: Query<T>): Query<T> {
    this.data["$and"] = query.data;
    return this;
  }

  /**
   * or with another query
   * @param query the target query
   */
  or(query: Query<T>): Query<T> {
    this.data["$or"] = query.data;
    return this;
  }

  /**
   * create an all query
   */
  all(): Query<T> {
    this.data = undefined;
    return this;
  }
}


/**
 * export class query
 */
export class Condition<T> {

  /**
   * create a condition on a query
   * @param query the query contains this condition
   * @param field field to search
   */
  constructor(private query: Query<T>, private field: string) {
    this.field = field.substr(0, 1).toUpperCase() + field.substr(1);
  }

  /**
   * check if field equals
   * @param value value to check
   */
  equals(value: any) {
    return this.commit("$equals", value);
  }

  /**
   * the value
   * @param value
   */
  greaterThan(value: any) {
    return this.commit("$gt", value);
  }

  /**
   * check if fields contains
   * @param value the value to check
   * @return {Query}
   */
  contains(value: any) {
    return this.commit("$contains", value);
  }

  /**
   * commit this condition to the owner query
   *
   * @param condition the condition operator
   * @param value value to compare
   */
  commit(condition: string, value: any) {
    this.query.addCondition(this.field, condition, value);
    return this.query;
  }
}