install:  
  npm install

test:
  npm test

start:
  npm run babel-node -- src/bin/rss.js

lint:
	npm run eslint .
