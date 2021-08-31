FROM node:16-slim

RUN mkdir /home/app

WORKDIR /home/app

RUN apt-get update

RUN yes | apt-get install python3 build-essential libgd-dev

COPY . .

RUN npm i

EXPOSE 8080

USER node

CMD [ "npm", "run", "start" ]
