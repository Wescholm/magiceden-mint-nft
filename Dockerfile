FROM lwthiker/curl-impersonate:0.5-chrome-alpine as base

ARG NODE_VERSION=20.10.0
ARG NODE_PACKAGE_URL=https://unofficial-builds.nodejs.org/download/release/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64-musl.tar.xz

WORKDIR /app
RUN mkdir logs

RUN apk add --no-cache curl libstdc++ \
    && curl -fsSL $NODE_PACKAGE_URL | tar -xJ -C /usr/local --strip-components=1 \
    && node -v && npm -v

COPY package*.json ./

ENV CURL_PROCESS=curl_chrome110
ENV PROXY_URL=xxx


FROM base as development

RUN npm install

COPY ./src ./src
COPY tsconfig.json .env webpack.config.ts ./

RUN npm run webpack:build:dev

ENV NODE_ENV=development \
    LOG_LEVEL=debug

CMD ["node", "dist/main.js"]


FROM base as production

RUN npm ci

COPY ./src ./src
COPY tsconfig.json .env webpack.config.ts ./

RUN npm run webpack:build:prod \
    && rm -rf ./node_modules \
    && rm -rf ./src

ENV NODE_ENV=production \
    LOG_LEVEL=warning

CMD ["node", "dist/main.js"]
