FROM node:10
WORKDIR /toa-dev-website
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "build/index.js"]