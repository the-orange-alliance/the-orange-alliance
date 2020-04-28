FROM node:10
WORKDIR .
COPY package*.json ./
COPY . .
RUN npm install --no-optional && npm cache clean --force && npm run build
EXPOSE 3000
CMD ["node", "build/index.js"]