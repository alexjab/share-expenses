build:
	babel ./src/ShareApp.React.js -o ./lib/ShareApp.React.js

watch:
	babel --watch src/ --out-dir lib/
