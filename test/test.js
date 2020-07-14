let fs = require('fs');
let pathutil = require('path');
let parser = require('../cmdParsers/core/parser');
const { fieldSize } = require('tar');
let rk = require('../utils/rk')
let makeDir = require("make-dir")
let jsonformat = require('json-format')
let eachcontentjs = require('eachcontent-js');

let thisdir = pathutil.parse(__filename).dir;
let reportfolder = pathutil.resolve(thisdir, '../report');
makeDir.sync(reportfolder);

let srcfolder = `E:/workspaceGerrit/apps-i${'ngag'}e-web/src/main/webapp/static/source`;
let regtype = 'ast2';//'det';//'reg2';
let report = {};
let t0 = new Date()*1;
eachcontentjs.eachContent(srcfolder, [/\.js$/], (content, fpath)=>{
    content = rk.cleanCommentsFast(content);
    if(rk.isCookedJsPath(fpath))
    try{
        let result = parser.parse(regtype, content);
        report[fpath] = result;
    }catch(e){
        console.log(e);
        console.log('error:', fpath);
    }
    //console.log(result)
})
let t1 = new Date()*1;
console.log('cost:', t1-t0);

// //eachcontentjs.eachContent(``)
// let file = pathutil.resolve(srcfolder, './core/rk.js')
// let content = fs.readFileSync(file, 'utf-8');


fs.writeFileSync(pathutil.resolve(reportfolder, `./${regtype}.json`), jsonformat(report))