FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update

RUN yes | apt-get install libgd-dev

COPY . .

RUN npm i

EXPOSE 8080

USER node

CMD [ "npm", "run", "start" ]
