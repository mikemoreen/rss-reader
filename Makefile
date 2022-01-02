build:
	npm run build

install:
	npm ci

lint:
	npx eslint .

start:
	npm start

run:
	NODE_ENV=production npx webpack
