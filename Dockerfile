FROM node:18-alpine as builder

WORKDIR /build

RUN npm i prisma -g

COPY package*json ./ 

RUN npm i  

COPY ./ ./

RUN prisma generate

RUN npm run build:experimental

FROM node:18-alpine

WORKDIR /app

RUN npm i prisma -g

COPY package*json ./ 

RUN npm i  --production

COPY --from=builder --chown=node:node /build/public ./public

COPY --from=builder --chown=node:node /build/.next ./.next

COPY --from=builder --chown=node:node /build/prisma ./prisma

RUN prisma generate

USER node

CMD ["next", "start" , "-p", "3000"]  