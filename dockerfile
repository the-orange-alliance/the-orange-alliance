FROM node:10
WORKDIR .
COPY package*.json ./
COPY . .
RUN npm install && npm run build && rm -rf node_modules
EXPOSE 3000
CMD ["node", "build/index.js"]