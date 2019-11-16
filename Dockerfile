FROM fcgomes92/nginx-node:latest

COPY ./package.json /app

RUN if [ -d /app/node_modules ]; then rm -Rf node_modules; fi
RUN npm install --no-cache

COPY ./ /app

ARG PORT
ENV PORT=$PORT

CMD [ "node" ]