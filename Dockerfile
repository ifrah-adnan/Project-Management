# Builder stage
FROM node:20-alpine as builder

WORKDIR /build

RUN apk add --no-cache openssl

RUN npm i prisma -g

COPY package*json ./ 

RUN npm i  

COPY ./ ./

RUN npx prisma generate

RUN npm run build:experimental

# Production stage
FROM node:20-alpine

ENV NODE_ENV production

WORKDIR /app

# Install necessary libraries
RUN apk add --no-cache openssl

RUN npm i prisma -g

COPY package*json ./ 

RUN npm i --production

COPY --from=builder --chown=node:node /build/public ./public
COPY --from=builder --chown=node:node /build/.next ./.next
COPY --from=builder --chown=node:node /build/prisma ./prisma
COPY --from=builder --chown=node:node /build/create-sys-admin.js ./create-sys-admin.js

RUN npx prisma generate

USER node

CMD ["/bin/sh", "-c", "node create-sys-admin.js && npx prisma db push && npm start"]