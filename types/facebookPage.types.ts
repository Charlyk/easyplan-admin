export type FacebookPageType = {
  id: string;
  accessToken: string;
  category: string;
  name: string;
  categoryList: FBCategoryType;
  tasks: string[];
  picture: FBPictureType;
};

export type FBCategoryType = {
  id: string;
  name: string;
};

export type FBPictureType = {
  id: string;
  data: FBPictureData;
};

export type FBPictureData = {
  width: number;
  height: number;
  url: string;
  silhouette: boolean;
};
