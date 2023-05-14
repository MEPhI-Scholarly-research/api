const basePath = "/api/v1"

export const routes = {
  quiz: {
    quizPost: basePath+"/quiz/",
    quizGet: basePath+"/quiz/:uuid",
    quizStartGet: basePath+"/quiz/start/:uuid",
  },
  user: {
    register: basePath+"/register",
    login: basePath+"/login",
  },
};
