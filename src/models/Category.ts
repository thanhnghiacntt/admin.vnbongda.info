export interface Category {

  name?: string,

  description?: string,

  parentId?: string,

  id?: string,

  parentName?: string,

  children?: Category[];

  hasChildren?: boolean;

  isLoading?: boolean;

  isSelected?: boolean;

  isExpand?: boolean;

  slug?: string;

  orderBy?: number;
}
export var categoryResponseCode =
{
  Successful: "success",
  Error: 1,
  Duplicated: 2,
  NotFound: 3,
  MissingRequired: 4,
  InvalidRequest: 5,
  NoPermission: 6,
  category_slug_existed: "category_slug_existed"
};
