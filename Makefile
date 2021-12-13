run:
	npm run build

install:
	npm ci

lint:
	npx eslint .

start:
	npm start

build:
	rm -rf dist
	NODE_ENV=production npx webpack
