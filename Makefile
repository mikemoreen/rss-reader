run:
	npm run build

install:
	npm ci

lint:
	npx eslint .

develop:
	npx webpack-dev-server

build:
	rm -rf dist
	NODE_ENV=production npx webpack
