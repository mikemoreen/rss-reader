run:
	npm run build

install:
	npm ci

lint:
	npx eslint .

build:
	NODE_ENV=production npx webpack