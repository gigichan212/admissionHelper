FROM node:14-alpine

WORKDIR /user/src/app

COPY . .

CMD yarn install && \
    yarn knex migrate:latest && \
    node --max-old-space-size=4096 -- $(yarn bin)/ts-node -P tsconfig.json main.ts