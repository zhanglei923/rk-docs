let fs = require('fs');
let pathutil = require('path');
let makeDir = require("make-dir")
let jsonformat = require('json-format')

let compare = require('../parsers/core/compare');

let thisdir = pathutil.parse(__filename).dir;
let reportfolder = pathutil.resolve(thisdir, './report');
makeDir.sync(reportfolder);


let rpt = compare.compare(`E:/workspaceGerrit/apps-ingage-web/src/main/webapp/static/source`, reportfolder);

if(rpt.errors.length > 0){
    fs.writeFileSync(pathutil.resolve(reportfolder, './report1.json'), jsonformat(rpt.report1));
    fs.writeFileSync(pathutil.resolve(reportfolder, './report2.json'), jsonformat(rpt.report2));
    fs.writeFileSync(pathutil.resolve(reportfolder, './errors.json'), jsonformat(rpt.errors));
}else{
    console.log('reg==ast!')
}
