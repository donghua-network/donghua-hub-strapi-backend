FROM strapi/base:alpine@sha256:d91a598b735cfd19eb440e344389f575de9a92e593ab00b86976fc374e0fe96d

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn install

COPY ./api ./api
COPY ./config ./config
COPY ./extensions ./extensions
COPY ./public/images/ ./public/images/
COPY ./public/uploads/ ./public/uploads/

ENV NODE_ENV development

RUN yarn build

EXPOSE 1337

CMD ["yarn", "start"]