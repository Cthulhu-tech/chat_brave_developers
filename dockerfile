FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm i --force

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]
