FROM node:16

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install ts-node -g

EXPOSE 3000
CMD [ "npm", "run", "start" ]