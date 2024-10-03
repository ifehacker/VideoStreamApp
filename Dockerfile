FROM node:22.9.0-alpine As development

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=development
COPY . .
EXPOSE 8080
RUN npm run build

FROM node:22.9.0-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]