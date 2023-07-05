FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm i --save validator class-validator

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]
