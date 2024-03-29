FROM node:20 AS build-env

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile --network-timeout 1000000

COPY . .
RUN yarn build

FROM node:20 AS runtime-env

WORKDIR /app

COPY --from=build-env /app/package.json .
COPY --from=build-env /app/yarn.lock .
COPY --from=build-env /app/dist ./dist

RUN yarn --frozen-lockfile install --production --network-timeout 1000000

LABEL org.opencontainers.image.source=https://github.com/bddvlpr/untis-ics-sync

CMD ["node", "dist/main.js"]
