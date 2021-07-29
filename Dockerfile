FROM node:14.15.4
WORKDIR /node-docker
COPY package.json .
RUN npm install
COPY . ./
EXPOSE 5000
CMD ["node", "index.js"]