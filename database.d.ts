export type Post = {
  id: string;
  _id: string;
  media: any;
  content: string;
  owner: User;
  ownerId: string,
  createdAt: Date;
  likes: string[];
  ownerName: User;
  imageUrl: string;
  videoUrl: string;
  comments: string;
  ownerProfileImageUrl: string;
  

};

export type User = {
  _id: string;
  name: string;
  age: number;
  profilePic: string;
  email: string;
  gender: Gender;
  password: string;
  description: string;
  nickName: string;
  followerCount?: number;
  isAnonymous?: boolean;
  
  
};

export type Chat = {
  _id: any;
  userId: any;
  participants: User[];
  lastMessage: Message;
  messages: Message[];
  userName: string;
};

export type Message = {
  sender: string;
  receiver: string;
  content: string;
  timestamp: Date;
};

export type Comment = {
  _id: string;
  content: string;
  owner: User;
  createdAt: string;
};

type Gender = 'M' | 'F' | 'NB' | 'BI' | 'TR' | 'HOM';
