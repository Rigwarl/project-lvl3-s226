install:
	npm install

lint:
	npm run eslint -- ./src

test:
	npm test

start:
	NODE_ENV=development npm run webpack-serve
	
build:
	rm -rf dist
	NODE_ENV=production npm run webpack
	
deploy:
	make build
	npm run surge -- --domain rigwarl-ssh.surge.sh ./dist
