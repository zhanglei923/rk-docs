let fs = require('fs');
let pathutil = require('path');
let makeDir = require("make-dir")
let jsonformat = require('json-format')

let compare = require('../cmdParsers/parsers/core/compare');

//说明：
//这里是供外部工程，通过shell命令调用的接口，
//建议的执行方法是：> node ../run_generate_static_hotfiles.js %encode过的json字符串%
//也可以看./test/test_run_generate_static_hotfiles.js里的使用方法

var args = process.argv.splice(2)
console.log('args=', args);

let configJsonTxt = args[0];
if(!configJsonTxt){
    console.log('need arguments');
    process.exit(1);
}
configJsonTxt = decodeURIComponent(configJsonTxt);
let configJson = JSON.parse(configJsonTxt);
console.log('configJson=', configJson)

let sourcefolder = configJson.sourcefolder;//`E:/workspaceGerrit/_sub_separation_test/apps-ingage-web`
let reportfolder = configJson.reportfolder;
console.log('compare start:')
let rpt = compare.compare(sourcefolder, reportfolder);
console.log('compare end:')
if(fs.existsSync(reportfolder)){
    let rpt_prefix = configJson.rpt_prefix ? configJson.rpt_prefix : '';
    fs.writeFileSync(pathutil.resolve(reportfolder, `./${rpt_prefix}report1.json`), jsonformat(rpt.report1));
    fs.writeFileSync(pathutil.resolve(reportfolder, `./${rpt_prefix}report2.json`), jsonformat(rpt.report2));
    fs.writeFileSync(pathutil.resolve(reportfolder, `./${rpt_prefix}errors.json`), jsonformat(rpt.errors));
}