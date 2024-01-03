FROM lwthiker/curl-impersonate:0.5-chrome


# Install dependencies for Node.js
RUN apk add --no-cache libstdc++ libgcc

# Install Node.js and npm
RUN apk add --no-cache curl && \
    curl -fsSL https://unofficial-builds.nodejs.org/download/release/v18.19.0/node-v18.19.0-linux-x64-musl.tar.xz | tar -xJ -C /usr/local --strip-components=1 && \
    apk del curl

# Verify that Node.js and npm are installed
RUN node -v && npm -v

ENV CURL_PROCESS=curl_chrome110

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY ./src ./src
COPY tsconfig.json .
COPY .env .

CMD ["npm", "start"]