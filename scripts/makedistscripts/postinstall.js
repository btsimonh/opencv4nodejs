console.log("doing postinstall");

if (process.platform !== 'win32'){
  // for linux, make links like .3.4 from files like .3.4.1
  var fs = require('fs');
  var path = require('path');
  var libfolder = path.resolve(__dirname, '../build/Release');
  var foldercontent = fs.readdirSync( libfolder );
  for (var i = 0; i < foldercontent.length; i++){
    var file = foldercontent[i];
    var filesplit = file.split('.');
    if (filesplit.length >= 5){
      filesplit = filesplit.slice(0, -1);
      var linkname = filesplit.join('.');
      console.log("linking " + file + " to "+ linkname);
      fs.symlinkSync( './'+file, libfolder+'/'+linkname);
    }
  }
}
