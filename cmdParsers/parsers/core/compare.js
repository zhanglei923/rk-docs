let fs = require('fs');
let pathutil = require('path');
let _ = require('lodash');
let parser = require('./parser');
var minimist = require('minimist');
let makeDir = require("make-dir")
let jsonformat = require('json-format')
let eachcontentjs = require('eachcontent-js');
const { first } = require('lodash');

let thisdir = pathutil.parse(__filename).dir;

let judge = (report1, report2)=>{
    //console.log(report1, report2)
    
    let errors = [];
    for(let fpath in report1){
        let o1 = report1[fpath];
        let o2 = report2[fpath];
        if(o1 && !o2){
            errors.push(`one of parser not return fpath ${fpath}`);
        }
        if(o1 && o2){
            let requireList1 = o1.requireList;
            let requireList2 = o1.requireList;
            let diff = _.difference(requireList1, requireList2);
            if(diff.length > 0){
                errors.push(`find different: ${diff.join(',')}`);
            }
        }
    }
    for(let fpath in report2){
        if(report2[fpath] && !report1[fpath]) {
            errors.push(`one of parser not return fpath ${fpath}`);
        }
    }
    errors = _.uniq(errors);
    return errors;
}
let compare = (srcfolder, reportfolder)=>{
    let report1 = {};
    let report2 = {};
    let t0 = new Date()*1;
    eachcontentjs.eachContent(srcfolder, [/\.js$/], (content, fpath)=>{
        try{
            let result1 = parser.parse('reg2', fpath);
            report1[fpath] = result1;
        }catch(e){
            console.log('error:', fpath);
        }
        try{
            let result2 = parser.parse('ast2', fpath);
            report2[fpath] = result2;
        }catch(e){
            console.log('error:', fpath);
        }
    })
    let t1 = new Date()*1;
    console.log('cost:', t1-t0);

    let errors = judge(report1, report2)
    if(errors.length > 0){
        console.log(errors)
    }else{
        console.log('reg==ast!')
    }
    return {
        report1, 
        report2,
        errors
    };
};

module.exports = {
    compare,
    judge
};