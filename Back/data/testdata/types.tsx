type ArtItem = {
  collection: string
  artTitle: string;
  artist: string;
  imageUrl:string
};

export type Profile = {
  firstname: string;
  surname: string;
  email: string;
  collection: ArtItem[];
};