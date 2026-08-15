import { Model, Types } from 'mongoose';

export interface IPost {
    _id: Types.ObjectId;
    author: Types.ObjectId;
    content: string;
    images: string[];
    likes: Types.ObjectId[];
    reposts: Types.ObjectId[];
    parent: Types.ObjectId | null;
    replies: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

declare const PostModel: Model<IPost>;
export default PostModel;
