FROM node:18.14.0-slim as build
COPY . .
RUN npm install && npm run build

FROM ghcr.io/zboyco/webrunner:0.0.3
COPY --from=build /build/ /usr/share/nginx/html/