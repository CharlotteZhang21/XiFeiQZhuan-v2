const fs = require('fs');
const pjson = require('../package.json');

var iecSettings = JSON.parse(fs.readFileSync('./iec-settings.json', 'utf8'));

iecSettings.version.forEach(function(version){
	fs.appendFileSync('dist/' + pjson.name )
});