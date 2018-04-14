install:
	npm install

lint:
	npm run eslint -- .

test:
	npm test
	
test-update:
	npm test -- -u

start:
	NODE_ENV=development npm run webpack-serve
	
build:
	rm -rf dist
	NODE_ENV=production npm run webpack
	
deploy:
	make build
	npm run surge -- --domain rigwarl-ssh.surge.sh ./dist
	
gh-pages:
	make build
	rm -rf docs
	cp -R dist docs
