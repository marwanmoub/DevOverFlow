"use server";

import Question from "@/database/question.model";
import { QuestionInterface } from "@/types/global";
import { AskQuestionSchema } from "../validations";
import handleError from "../handlers/error";
import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import mongoose from "mongoose";
import Tag from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

interface QuestionCreation {
  title: string;
  content: string;
  tags: string[];
}

export async function createQuestion(
  questionDetails: QuestionCreation
): Promise<ActionResponse<QuestionInterface>> {
  const validatedData = await action({
    params: questionDetails,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }

  const { title, content, tags } = validatedData.params!;
  const userId = validatedData?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [question] = await Question.create(
      [{ title, content, author: userId }],
      {
        session,
      }
    );

    if (!question) {
      throw new Error("Question creation failed");
    }

    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, "i") },
        },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );

      tagIds.push(existingTag!._id);
      tagQuestionDocuments.push({
        question: question._id,
        tag: existingTag._id,
      });
    }

    await TagQuestion.insertMany(tagQuestionDocuments, { session });
    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    );

    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (err) {
    await session.abortTransaction();
    return handleError(err) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
