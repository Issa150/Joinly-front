FROM node:22-alpine AS builder

WORKDIR /app

# COPY package*.json /app/
COPY package.json package-lock.json ./

RUN npm install

RUN npm i @rollup/rollup-linux-x64-musl

ENV ROLLUP_SKIP_NODEJS_NATIVE=1

COPY . /app/

ARG URL_BACK
ENV VITE_API_BASE_URL=${URL_BACK:-"http://localhost:3000/"}

RUN npm run build

# Stage 2: Production image
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
# COPY ./nginx/prod.conf /usr/share/nginx/conf
COPY ./nginx/prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]