FROM node:12-alpine

WORKDIR /paperboy-front-docker
COPY . ./
RUN npm install

# ENV PAPERBOY_BACK host.docker.internal
# ENV PORT 4000

# EXPOSE 4000

CMD ["node", "app.js"]