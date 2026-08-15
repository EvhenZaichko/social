import { Model, Types } from 'mongoose';

export interface IUser {
    _id: Types.ObjectId;
    username: string;
    displayName: string;
    email: string;
    password: string;
    bio: string;
    avatar: string;
    banner: string;
    location: string;
    website: string;
    verified: boolean;
    followers: Types.ObjectId[];
    following: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

declare const UserModel: Model<IUser>;
export default UserModel;
