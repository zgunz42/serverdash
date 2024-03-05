FROM node:20.10.0 as build

WORKDIR /app

COPY . .

# install yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | bash

RUN yarn install

RUN yarn prod


FROM lipanski/docker-static-website:latest

COPY --from=build /app/public .

CMD ["/busybox", "httpd", "-f", "-v", "-p", "3000", "-c", "httpd.conf"]