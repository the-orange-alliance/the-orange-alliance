FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install --no-optional && npm cache clean --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "build/index.js"]
