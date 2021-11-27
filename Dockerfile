From node:10

WORKDIR /homiefy

COPY package.json .

RUN npm install

COPY . ./

EXPOSE 8001

CMD ["node","server.js"]

