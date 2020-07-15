let fs = require('fs');
let pathutil = require('path');
let parser = require('./parser');
var minimist = require('minimist');
let makeDir = require("make-dir")
let jsonformat = require('json-format')
let eachcontentjs = require('eachcontent-js');
const { first } = require('lodash');

let thisdir = pathutil.parse(__filename).dir;

let compare = (srcfolder, reportfolder)=>{
    let report1 = {};
    let report2 = {};
    let t0 = new Date()*1;
    eachcontentjs.eachContent(srcfolder, [/\.js$/], (content, fpath)=>{
        try{
            let result1 = parser.parse('reg2', fpath);
            let result2 = parser.parse('ast2', fpath);
            report1[fpath] = result1;
            report2[fpath] = result2;
        }catch(e){
            //console.log(e);
            console.log('error:', fpath);
        }
    })
    let t1 = new Date()*1;
    console.log('cost:', t1-t0);

    fs.writeFileSync(pathutil.resolve(reportfolder, './report1.json'), jsonformat(report1));
    fs.writeFileSync(pathutil.resolve(reportfolder, './report2.json'), jsonformat(report2));
};

module.exports = {
    compare
};