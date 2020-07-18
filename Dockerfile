#################
# Build the app #
#################
FROM node:12-alpine as build
WORKDIR /app
COPY package.json yarn.lock ./

RUN apk add --no-cache --update \
    yarn 

RUN yarn config set registry https://registry.npm.taobao.org --global && \
    yarn config set disturl https://npm.taobao.org/dist --global && \
    yarn install --network-timeout 1000000000

# RUN npm install
COPY . .

RUN yarn global add @angular/cli 
# RUN ng build --configuration production --output-path=/dist

# RUN yarn run build --prod --output-path=dist

RUN ng build --prod --output-path=/dist

################
# Run in NGINX #
################
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /dist /usr/share/nginx/html

COPY /_nginx/default.conf /etc/nginx/conf.d/

# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]