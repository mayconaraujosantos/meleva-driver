FROM node:20-alpine3.18 as base

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY . .

RUN npm ci && npm run build


FROM node:20-alpine3.18

WORKDIR /app

COPY package*.json ./
RUN  npm ci --production
COPY --from=base /app/build ./build

RUN addgroup -S nonroot \
	&& adduser -S nonroot -G nonroot

USER nonroot

EXPOSE 8080

CMD ["npm", "start"]
