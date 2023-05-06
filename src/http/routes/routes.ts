export const routes = {
  quiz: {
    getSessionToken: {
      path: "/quiz/get_session_token",
      needAuth: true,
    },
    getActiveQuizzes: {
      path: "/get_active_quizzes",
      needAuth: true,
    },
  },
  user: {
    getAccessToken: {
      path: "/user/getAccessToken",
      needAuth: false,
    },
  },
};
