FROM node:12-alpine
RUN mkdir -p /src/app
WORKDIR /src/app
COPY . /src/app
RUN npm install
EXPOSE 2002
CMD npm run webpack && npm run start