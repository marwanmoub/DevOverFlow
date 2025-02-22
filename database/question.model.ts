import { models, ObjectId, Schema, model } from "mongoose";

export interface IQuestion {
  title: string;
  content: string;
  views: number;
  answers: number;
  upvotes: number;
  downvotes: number;
  author: ObjectId;
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    views: { type: Number, required: true, default: 0 },
    answers: { type: Number, required: true, default: 0 },
    upvotes: { type: Number, required: true, default: 0 },
    downvotes: { type: Number, required: true, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Question =
  models?.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
