FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm i --save validator class-validator class-transformer

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]
