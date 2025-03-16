const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  ASK_QUESTION: "/ask-a-question",
  QUESTION: (id: string) => `/question/${id}`,
  PROFILE: (id: string) => `/profile/${id}`,
  TAGS: (id: string) => `/tags/${id}`,
  SIGN_IN_WITH_OAUTH: "sign-in-with-oauth",
};

export default ROUTES;
