import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import { AccountSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { providerAccountId } = await request.json();

  try {
    const validatedData = AccountSchema.partial().safeParse({
      providerAccountId,
    });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const account = await User.findOne({ providerAccountId });

    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (err) {
    return handleError(err, "api") as APIErrorResponse;
  }
}
