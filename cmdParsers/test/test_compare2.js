let fs = require('fs');
let pathutil = require('path');
let makeDir = require("make-dir")

let compare = require('../parsers/core/compare');

let report1 = JSON.parse(fs.readFileSync(`E:/workspaceGerrit/rk-docs/cmdParsers/test/report/report1.json`))
let report2 = JSON.parse(fs.readFileSync(`E:/workspaceGerrit/rk-docs/cmdParsers/test/report/report2.json`))


let errors = compare.judge(report1, report2);
if(errors.length > 0){
    console.log(errors)
}else{
    console.log('reg==ast!')
}