import { Request } from 'express';
import { Document } from 'mongoose';

export interface RequestExt extends Request {
  user?: {
    userID?: string;
  };
}

export interface UserData extends Document {
  userID?: string;
  email?: string;
  password?: string;
  nick?: string;
  avatar?: string;
  education?: [];
}

export interface ProfileData extends Document {
  education?: {
    id?: string
    school: string;
    degree: string;
    fieldofstudy: string;
    from: string;
    to: string;
    current: boolean;
    description: string;
  }[]
  experience?: {
    id?: string
    position: string;
    company: string;
    location: string;
    from: string;
    to: string;
    current: boolean;
    description: string;
  }[]
}

export interface ArticleData extends Document {
  userID?: string;
  topic?: string;
  intro?: string;
  description?: string;
  picture?: {
    id?: string;
    imgUrl?: string;
    imgName?: string;
  }[];
  likes?: {
    userID?: string;
  }[];
  dislikes?: {
    userID?: string;
  }[];
  comments?: {
    id?: string;
    userID?: string & {
      id?: string;
      nick?: string;
      avatar?: string;
    };
    text?: string;
    date?: string;
    likes?: {
      userID?: string;
    }[];
    dislikes?: {
      userID?: string;
    }[];
  }[]
}

export interface DecodedData {
  userID?: string;
}