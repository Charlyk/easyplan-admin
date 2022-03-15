export type FacebookPageType = {
  id: string;
  access_token: string;
  category: string;
  name: string;
  category_list: FBCategoryType;
  tasks: string[];
  picture: FBPictureType;
  connected_instagram_account?: FBInstagramAccount | null;
};

export type FBInstagramAccount = {
  id: string;
  username: string;
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
