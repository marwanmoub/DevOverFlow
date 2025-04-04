"use server";

import Question from "@/database/question.model";
import { QuestionInterface, QuestionInterface } from "@/types/global";
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
} from "../validations";
import handleError from "../handlers/error";
import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import mongoose from "mongoose";
import Tag, { ITagDoc } from "@/database/tag.model";
import TagQuestion from "@/database/tag-question.model";

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}

interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}

interface GetQuestionParams {
  questionId: string;
}

export async function createQuestion(
  questionDetails: CreateQuestionParams
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

export async function editQuestion(
  questionDetails: EditQuestionParams
): Promise<ActionResponse<QuestionInterface>> {
  const validatedData = await action({
    params: questionDetails,
    schema: EditQuestionSchema,
    authorize: true,
  });

  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }

  const { title, content, tags, questionId } = validatedData.params!;
  const userId = validatedData?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    if (question.author.toString() !== userId) throw new Error("unauthorized");

    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    const tagsToAdd = tags.filter(
      (tag) => !question.tags.includes(tag.toLowerCase())
    );
    const tagsToRemove = question.tags.filter(
      (tag: ITagDoc) => !tags.includes(tag.name.toLowerCase())
    );

    const newTagDocuments = [];
    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          {
            name: { $regex: new RegExp(`^${tag}$`, "i") },
          },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session }
        );

        if (existingTag) {
          newTagDocuments.push({
            question: questionId,
            tag: existingTag._id,
          });

          question.tags.push(existingTag._id);
        }
      }
    }

    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag: ITagDoc) => tag._id);

      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { question: -1 } },
        { session }
      );

      await TagQuestion.deleteMany(
        {
          tag: { $in: tagIdsToRemove },
          question: questionId,
        },
        { session }
      );

      question.tags = question.tags.filter(
        (tagId: mongoose.Types.ObjectId) => !tagsToRemove.includes(tagId)
      );
    }

    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }

    await question.save({ session });
    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (err) {
    await session.abortTransaction();
    return handleError(err) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getQuestion(
  questionDetails: GetQuestionParams
): Promise<ActionResponse<QuestionInterface>> {
  const validatedData = await action({
    params: questionDetails,
    schema: GetQuestionSchema,
    authorize: true,
  });

  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }

  const { questionId } = validatedData.params!;

  try {
    const question = await Question.findById(questionId).populate("tags");
    if (!question) {
      throw new Error("Question not found");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (err) {
    return handleError(err) as ErrorResponse;
  }
}
