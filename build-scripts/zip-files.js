const glob = require('glob');
const execSync = require('child_process').execSync;

glob("./dist/*/settings.js", function(er, files) {
	files.forEach(function(f) {
		var label = f.substring(f.indexOf("dist/") + 5, f.indexOf("/settings.js"));
		console.log(label);

		execSync('cd dist/' + label + ' && ' +
                        'zip -r ' + label + '.zip * -x "*.DS_Store" -x "__MACOSX/\\*" -x "*.original" && ' +
                        'unzip -l ' + label + '.zip && ' +
                        'cd .. && ' +
                        'mv ' + label + '/' + label + '.zip ./');
	});
});