FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build:prod

FROM nginx:1.27-alpine

COPY --from=build /app/dist/browser /usr/share/nginx/html

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf.template
COPY docker/entrypoint.sh /docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
