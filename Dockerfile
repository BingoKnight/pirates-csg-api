FROM node:lts-slim
WORKDIR /code

COPY ./common ./common
COPY ./crud ./crud
COPY ./models ./models
COPY ./routes ./routes
COPY ./services ./services
COPY ./schemas ./schemas
COPY ./utils ./utils
COPY ./app.js ./app.js
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm ci

CMD ["node", "app.js"]

