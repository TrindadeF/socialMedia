export type Post = {
  _id: string;
  media: any;
  content: string;
  owner: string;
  createdAt: Date;
  likes: string[];
  ownerName: string;
  imageUrl: string;
  videoUrl: string;
  comments: string;
  ownerProfileImageUrl: string;
};


export type User = {
  name: string;
  age: number;
  profilePic: string;
  email: string;
  gender: Gender;
  password: string;
  description: string;
  nickName: string;
};

type Gender = 'M' | 'F' | 'NB' | 'BI' | 'TR' | 'HOM';
