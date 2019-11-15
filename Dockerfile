FROM fcgomes92/nginx-node:latest
EXPOSE 80
EXPOSE 3000

COPY ./package.json /app

RUN if [ -d /app/node_modules ]; then rm -Rf node_modules; fi
RUN npm install --no-cache

COPY ./ /app

CMD [ "start" ]