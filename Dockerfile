FROM lwthiker/curl-impersonate:0.5-chrome-alpine

ARG NOVE_VERSION=20.10.0
ARG NODE_PACKAGE_URL=https://unofficial-builds.nodejs.org/download/release/v$NOVE_VERSION/node-v$NOVE_VERSION-linux-x64-musl.tar.xz

# Installing Node.js
RUN apk add --no-cache curl libstdc++
RUN curl -fsSL $NODE_PACKAGE_URL | tar -xJ -C /usr/local --strip-components=1
RUN node -v && npm -v

# Installing node dependencies
WORKDIR /app

COPY package*.json ./
RUN npm install

# Copying source code
COPY ./src ./src
COPY tsconfig.json .
COPY .env .

# Running
ENV CURL_PROCESS=curl_chrome110
CMD ["npm", "start"]