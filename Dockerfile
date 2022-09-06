FROM node:18 AS build-env
WORKDIR /app

COPY package.json .
COPY yarn.lock ./
COPY tsconfig.json ./
RUN yarn install

COPY . .
RUN yarn build

FROM node:18 AS runtime-env
WORKDIR /app

COPY --from=build-env /app/dist/ .
COPY --from=build-env /app/node_modules ./node_modules

HEALTHCHECK --interval=10s --timeout=10s --start-period=5s --retries=3 CMD curl --fail http://localhost:3000/health || exit 1
EXPOSE 3000
CMD ["node", "src/index.js"]