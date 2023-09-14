FROM node:18 AS build-env

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:18 AS runtime-env

WORKDIR /app

COPY --from=build-env /app/package.json .
COPY --from=build-env /app/yarn.lock .
COPY --from=build-env /app/dist ./dist

RUN yarn --frozen-lockfile install --production

LABEL org.opencontainers.image.source=https://github.com/bddvlpr/untis-ics-sync

CMD ["node", "dist/main.js"]
