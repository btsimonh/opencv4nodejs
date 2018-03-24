const path = require('path');
const fs = require('fs');


// find out if we are ;'dist' version, or full install
var packagejson = fs.readFileSync(path.resolve(__dirname, '../package.json' ));
var packagestruct = JSON.parse(packagejson);
switch(packagestruct.name){
    case 'opencv4nodejsdist':
        // if dist version, spoof enough
        var opencvBuild = {
            isAutoBuildDisabled: function(){return false;},
            opencvBinDir: path.resolve(__dirname, '../build/Release/' )
        };
        break;
    default:
        // full build
        var opencvBuild = require('opencv-build');
        break;
}

delete packagestruct;
delete packagejson;


// ensure binaries are added to path on windows
if (!opencvBuild.isAutoBuildDisabled() && process.platform === 'win32') {
  // append opencv binary path to node process
  if (!process.env.path.includes(opencvBuild.opencvBinDir)) {
    process.env.path = `${process.env.path};${opencvBuild.opencvBinDir};`
  }
}

let cv;
if (process.env.BINDINGS_DEBUG) {
  cv = require(path.join(__dirname, '../build/Debug/opencv4nodejs'));
} else {
  cv = require(path.join(__dirname, '../build/Release/opencv4nodejs'));
}

const { resolvePath } = require('./commons');
const promisify = require('./promisify');
const extendWithJsSources = require('./src');

// resolve haarcascade files
const { haarCascades } = cv;
Object.keys(haarCascades).forEach(
  key => cv[key] = resolvePath(path.join(__dirname, './haarcascades'), haarCascades[key]));


// promisify async methods
cv = promisify(cv);
cv = extendWithJsSources(cv);

module.exports = cv;