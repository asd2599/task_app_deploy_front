# Build React App
FROM node:alpine3.18 as build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .

RUN VITE_GOOGLE_CLIENT_ID=438741904598-pav154s7o1j25i4cpfgre2d7h1m8fi49.apps.googleusercontent.com npm run build



# Server Setting nginx
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/dist .
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]
