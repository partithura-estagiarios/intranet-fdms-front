# builder
FROM node:18-alpine AS builder
RUN apk add --no-cache build-base python3

WORKDIR /app

# dependencies
COPY ./package.* ./yarn.* ./.yarnrc* ./
COPY .yarn .yarn

RUN yarn --version && \
  yarn install --immutable --inline-builds

# configs
COPY ./*.yml ./*.ts ./*.json ./

# source
COPY . .

# build
RUN npx vite build


# Certificado
FROM alpine:3.19.1 AS certificado
RUN apk add --no-cache build-base python3 openssl

WORKDIR /app
RUN openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 \
  -subj "/C=BR/ST=Rio Grande do Sul/L=Santo ângelo/O=Partithura/CN=localhost" \
  -keyout cert.key -out cert.crt


# Image
FROM caddy:2.7-alpine

RUN apk add --no-cache dumb-init tree figlet

COPY --from=builder /app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile

COPY docker/docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/usr/bin/dumb-init",  "--", "/docker-entrypoint.sh"]

ARG VITE_APP_ENDPOINT \
  VITE_URL_BACK_SERVER_EXPRESS_FOR_ARCHIVES \
  VITE_GRAPHQL_API_URL \
  VITE_DATASOURCE

ENV VITE_APP_ENDPOINT=${VITE_APP_ENDPOINT} \
  VITE_URL_BACK_SERVER_EXPRESS_FOR_ARCHIVES=${VITE_URL_BACK_SERVER_EXPRESS_FOR_ARCHIVES} \
  VITE_GRAPHQL_API_URL=${VITE_GRAPHQL_API_URL} \
  VITE_DATASOURCE=${VITE_DATASOURCE}

EXPOSE 443

CMD ["http"]
