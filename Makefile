build:
	browserify -t reactify ./src/ShareApp.React.js -o ./lib/ShareApp.js

watch:
	watchify -t reactify ./src/ShareApp.React.js -o ./lib/ShareApp.js
