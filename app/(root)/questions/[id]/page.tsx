import { RouteParams } from "@/types/global";
import React from "react";

const QuestionDetails = ({ params }: RouteParams) => {
  const { id } = params;
  return <div>Question Page: {id}</div>;
};

export default QuestionDetails;
