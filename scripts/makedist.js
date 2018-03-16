
var ncp = require('ncp').ncp;
var path = require('path');
var fs = require('fs-extra');
var child_process = require('child_process');


console.log("starting dist creation");

var dir = path.resolve(__dirname,'../dist');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}


dir = path.resolve(__dirname,'../dist/lib');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

dir = path.resolve(__dirname,'../dist/build');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

dir = path.resolve(__dirname,'../dist/build/Release');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

dir = path.resolve(__dirname,'../dist/scripts');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}


var copycmd = 'cp ';
if(process.platform === 'win32'){
    copycmd = 'copy ';
}

var cmd = copycmd + 
    path.resolve(__dirname,'../build/Release/opencv4nodejs.node') + ' ' +
    path.resolve(__dirname,'../dist/build/Release/opencv4nodejs.node');


// any problems - will throw    
child_process.execSync( cmd );
console.log('.node file copied');

var cmd = copycmd + 
    path.resolve(__dirname,'../scripts/makedistscripts/postinstall.js') + ' ' +
    path.resolve(__dirname,'../dist/scripts/postinstall.js');
// any problems - will throw    
child_process.execSync( cmd );
console.log('postinstall.js file copied');


if(process.platform === 'win32'){
    copycmd = 'robocopy ';
    cmd = copycmd + 
        path.resolve(__dirname,'../lib/') + ' ' +
        path.resolve(__dirname,'../dist/lib/') + ' *.* /s';
    child_process.execSync( '('+cmd+') ^& IF %ERRORLEVEL% LEQ 4 exit /B 0' );
} else {
    copycmd = 'cp -rd ';
    cmd = copycmd + 
        path.resolve(__dirname,'../lib/') + ' ' +
        path.resolve(__dirname,'../dist/lib/');
    child_process.execSync( cmd );
}

    
console.log('lib folder copied');

if(process.platform === 'win32'){
    cmd = copycmd + 
        path.resolve(__dirname,'../node_modules/opencv-build/opencv/build/bin/Release/') + ' ' +
        path.resolve(__dirname,'../dist/build/Release/') + ' *.* /s';
    child_process.execSync( '('+cmd+') ^& IF %ERRORLEVEL% LEQ 4 exit /B 0' );
} else {
    cmd = copycmd + 
        path.resolve(__dirname,'../node_modules/opencv-build/opencv/build/lib/*') + ' ' +
        path.resolve(__dirname,'../dist/build/Release/');
    child_process.execSync( cmd );
}
    
console.log('opencv folder copied');

if(process.platform === 'win32'){
    copycmd = 'copy ';
}

cmd = copycmd + 
    path.resolve(__dirname,'./package.dist.json') + ' ' +
    path.resolve(__dirname,'../dist/package.json');
child_process.execSync( cmd );

console.log('All done.  Now you can install using:');
console.log('npm install '+path.resolve(__dirname,'../dist'));
console.log('into other node projects');
console.log('and require(\'opencv4nodejsdist\')');

