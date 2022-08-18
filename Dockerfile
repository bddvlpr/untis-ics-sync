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

LABEL version="0.1.0" maintainer="Luna Simons <luna@bddvlpr.com>"
EXPOSE 3000
CMD ["node", "index.js"]