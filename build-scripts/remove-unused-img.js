const fs = require('fs');
const glob = require('glob');

// Unused assets from assets folder (that are not png sequences)

var assetFiles;

glob("./dist/*/settings.js", function(er, files) {
	files.forEach(function(f) {
		var path = f.substring(0,f.indexOf("settings.js"));
		removeUnusedAssetsFromFolder(path);
	});
});

function removeUnusedAssetsFromFolder(path) {

	var unusedAssets = [];

	var unusedAnimationImages = [];

	glob("./assets/*.*", function (er, files) {

		assetFiles = files;
		console.log(assetFiles);

		var indexFile = fs.readFileSync( path + 'index.html', 'utf8').toString();
		var mainCssFile = fs.readFileSync( path + 'main.css', 'utf8').toString();
		var settingsFile = fs.readFileSync( path + 'settings.js', 'utf8').toString();
		var bundleJsFile = fs.readFileSync( path + 'bundle.min.js', 'utf8').toString();

		for (var i = 0; i < assetFiles.length; i++) {
			assetFiles[i] = assetFiles[i].replace("./assets/","");
			if (indexFile.indexOf(assetFiles[i]) == -1 && 
				mainCssFile.indexOf(assetFiles[i]) == -1 && 
				bundleJsFile.indexOf(assetFiles[i]) == -1 &&
				settingsFile.indexOf(assetFiles[i]) == -1) {
				unusedAssets.push(assetFiles[i]);
			}
		}

		console.log("UNUSED ASSETS: " + unusedAssets);

		// for (var i = 0; i < unusedAssets.length; i++) {
		// 	fs.unlink( path + '' + unusedAssets[i], function (err){
		// 		if (err) throw err;
		// 		console.log("Deleted unused asset");
		// 	});
		// }

		// console.log(indexFile);
		// console.log(mainCssFile);
		// console.log(bundleJsFile);
	});


	//IMPORTANT!!! ---- This assumes that no png sequences are used in any other way than png sequences!!!

	//Unused png sequences (from particle effects slots library)

	glob("./src/animations/*.*", function (er, animationFiles) {
		console.log(animationFiles);

		var settingsFile = fs.readFileSync( path + 'settings.js', 'utf8').toString();

		//First, we make a list of the used animation files
		var usedAnimationFiles = [];
		for (var i = 0; i < animationFiles.length; i++) {
			animationFiles[i] = animationFiles[i].replace("./src/animations/", "");
			animationFiles[i] = animationFiles[i].replace(".js", "");
			if (settingsFile.indexOf(animationFiles[i]) != -1) {
				usedAnimationFiles.push(animationFiles[i]);
			}
		}
		console.log("USED ANIMATION FILES: " + usedAnimationFiles);

		//We now make a list of all animation images (from all files)
		//So we are basically ignoring the other assets here

		var allAnimationImages = [];
		for (var i = 0; i < animationFiles.length; i++) {
			var animationFile = fs.readFileSync('./src/animations/' + animationFiles[i] + '.js', 'utf8').toString();
			for (var j = 0; j < assetFiles.length; j++) {
				if (animationFile.indexOf(assetFiles[j]) != -1) {
					allAnimationImages.push(assetFiles[j]);
				}
			}
		}

		console.log("ALL ANIMATION FILES: " + allAnimationImages);

		var usedAnimationImages = [];

		//Second, we make a list of used images, on each of those files.
		for (var i = 0; i < usedAnimationFiles.length; i++) {
			//Get the string of the animation file
			var animationFile = fs.readFileSync('./src/animations/' + usedAnimationFiles[i] + '.js', 'utf8').toString();
			for (var j = 0; j < allAnimationImages.length; j++) {
				if (animationFile.indexOf(allAnimationImages[j]) != -1) {
					usedAnimationImages.push(allAnimationImages[j]);
				}
			}
		}
		console.log("USED ANIMATION IMAGES: " + usedAnimationImages);

		//Now we need to workout the difference between the last two arrays to figure out the unused png sequences
		for (var i = 0; i < allAnimationImages.length; i++) {
			var isInUsedArray = false;
			for (var j = 0; j < usedAnimationImages.length; j++) {
				if (allAnimationImages[i] == usedAnimationImages[j]) {
					isInUsedArray = true;
				}
			}
			if (!isInUsedArray) {
				unusedAnimationImages.push(allAnimationImages[i]);
			}
		}

		console.log("UNUSED ANIMATION IMAGES: " + unusedAnimationImages);

		//Unused assets
		for (var i = 0; i < unusedAssets.length; i++) {
			if (fs.existsSync( path + unusedAssets[i])) {
				fs.unlinkSync( path + unusedAssets[i]);
				console.log("Removed asset " + path + unusedAssets[i]);
			}
		}

		for (var i = 0; i < unusedAnimationImages.length; i++) {
			if (fs.existsSync( path + unusedAnimationImages[i])) {
				fs.unlinkSync( path + unusedAnimationImages[i]);
				console.log("Removed asset " + path + unusedAnimationImages[i]);
			}
		}
	});

}