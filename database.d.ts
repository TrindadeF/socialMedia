export type Post = {
age: any;
nickName: any;
  id: string;
  _id: string;
  media: any;
  content: string;
  owner: User;
  postOwnerId: string;
  createdAt: Date;
  likes: string[];
  ownerName: User;
  imageUrl: string;
  videoUrl: string;
  comments: string;
  ownerProfileImageUrl: string;
  ownerId: string;
  
 
};

export type User = {
  _id: string;
  name: string;
  age: number;
  media: any;
  profilePic: string;
  email: string;
  gender: Gender;
  password: string;
  description: string;
  nickName: string;
  followerCount?: number;
  isAnonymous?: boolean;
  secondPosts?: Post[];
  primaryPosts?: Post[];
  blockedUsers: string[];
  unblockedUsers: string[];
 
 


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
