export type Post = {
  id: number;
  content: string;
  owner: string;
  createdAt: Date;
  likes: number;
  ownerName: string;
  imageUrl: string;
  videoUrl: string;
  comments: string;
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

