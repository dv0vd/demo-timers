FROM docker.io/node:24.5.0-alpine

COPY ./ /app

WORKDIR /app

RUN apk add --no-cache \
    gettext

RUN npm ci --verbose --omit=dev

ENTRYPOINT ["sh", "entrypoint.sh"]
