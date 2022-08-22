FROM node:16 AS build-env
WORKDIR /app

COPY package.json .
COPY yarn.lock ./
COPY tsconfig.json ./
RUN yarn install

COPY . .
RUN yarn build

FROM node:16 AS runtime-env
WORKDIR /app

COPY --from=build-env /app/dist/ .
COPY --from=build-env /app/node_modules ./node_modules

LABEL version="0.2.0" maintainer="Luna Simons <luna@bddvlpr.com>"
LABEL org.opencontainers.image.source https://github.com/bddvlpr/untis-ics-sync
HEALTHCHECK --interval=10s --timeout=10s --start-period=5s --retries=3 CMD curl --fail http://localhost:3000/health || exit 1
EXPOSE 8080/tcp 8443/tcp
CMD ["node", "index.js"]