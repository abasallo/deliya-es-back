FROM node:14.2-alpine

RUN mkdir -p /src
COPY package.json src/package.json
WORKDIR /src

RUN npm install --only=production --silent

COPY . /src

RUN npm run build

EXPOSE 4000:4000

CMD npm start
