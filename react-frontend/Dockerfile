FROM node:19-alpine as builder

WORKDIR /app

COPY . .

ENV NODE_ENV production
ENV REACT_APP_FLASK_API_URL /api

RUN npm ci
RUN npm run build

FROM nginx:1.23-alpine as production

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]