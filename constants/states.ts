import ROUTES from "./routes";

export const DEFAULT_EMPTY = {
  title: "Crickets... It's Quiet In Here",
  message:
    "Looks like the data well is dry! Time to fetch some new entries and liven things up.",
  button: {
    text: "Add Data",
    href: ROUTES.HOME,
  },
};

export const DEFAULT_ERROR = {
  title: "Oops! A Glitch In The Matrix",
  message:
    "Our code stumbled, but don't worry, it's just having a moment. Let's give that request another whirl.",
  button: {
    text: "Try Again",
    href: ROUTES.HOME,
  },
};

export const EMPTY_QUESTION = {
  title: "Silence of the Questions",
  message:
    "The quest board awaits its first challenge! Be the hero and post a question to spark the conversation.",
  button: {
    text: "Ask the First Question",
    href: ROUTES.ASK_QUESTION,
  },
};

export const EMPTY_TAGS = {
  title: "Uncharted Tag Territory",
  message:
    "No tags mark the map yet. Forge new keywords and build the tag cloud from scratch!",
  button: {
    text: "Mint a New Tag",
    href: ROUTES.TAGS,
  },
};

export const EMPTY_COLLECTIONS = {
  title: "Your Personal Hoard Awaits",
  message:
    "Start gathering treasures! Create your first collection and curate your favorite finds.",
  button: {
    text: "Start Collecting",
    href: ROUTES.COLLECTION,
  },
};
