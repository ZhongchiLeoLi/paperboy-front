FROM node:12-alpine

WORKDIR /paperboy-front-docker
COPY package*.json ./
RUN npm install
COPY . .

ENV PAPERBOY_BACK host.docker.internal
ENV PORT 4000

EXPOSE 4000

CMD ["node", "app.js"]