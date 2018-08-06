export interface Category {

  name?: string,

  description?: string,

  parentId?: string,

  id?: string,

  parentName?: string,

  color?: string ,

  icon?: string,

  children?: Category[];

  hasChildren?: boolean;

  isLoading?: boolean;

  isSelected?: boolean;

  isExpand?: boolean;

  slug?: string;

  minZoom?: number;

  maxZoom?: number;

  isOn?: boolean;
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
