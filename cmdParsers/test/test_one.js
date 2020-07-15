let fs = require('fs');
let pathutil = require('path');
let parser = require('../parsers/core/parser');
var minimist = require('minimist');
let makeDir = require("make-dir")
let jsonformat = require('json-format')
let eachcontentjs = require('eachcontent-js');

let rk = require('../../utils/rk');

// node test --type arg2
// node test --type reg2

var args = process.argv.splice(2)
let parsertype = args[1];//'det';//'reg2';
console.log('type=', parsertype)

let thisdir = pathutil.parse(__filename).dir;
let reportfolder = pathutil.resolve(thisdir, './report');
makeDir.sync(reportfolder);

let srcfolder = `E:/workspaceGerrit/apps-i${'ngag'}e-web/src/main/webapp/static/source`;

let report = {};
let t0 = new Date()*1;

let fpath = `E:/workspaceGerrit/apps-ingage-web/src/main/webapp/static/source/core/rk.js`;
fpath = `./cases/case1.js`;

try{
    let result = parser.parse(parsertype, fpath);
    report[fpath] = result;
}catch(e){
    console.log(e);
    console.log('error:', fpath);
}
//console.log(result)
let t1 = new Date()*1;
console.log('cost:', t1-t0);

// //eachcontentjs.eachContent(``)
// let file = pathutil.resolve(srcfolder, './core/rk.js')
// let content = fs.readFileSync(file, 'utf-8');


fs.writeFileSync(pathutil.resolve(reportfolder, `./parser_${parsertype}.json`), jsonformat(report))