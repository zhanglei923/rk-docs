var fs = require('fs');
let _ = require('lodash');
var babel = require("@babel/core");
const espree = require("espree"); 

let reg = require('../core/reg');
let rk = require('../../utils/rk');

let getRequires = (jscontent)=>{
    let lines = reduceContentAsLines(jscontent);
    if(lines.length===0) return [];
    let requires = [];

    return getPath(requires)
};
let parse = (jscontent, fpath)=>{
    if(jscontent.indexOf('require')<0) return jscontent;//没有require，不需要解析
    try{
        var result = babel.transform(jscontent, {
            plugins: [
                // "@babel/plugin-proposal-object-rest-spread",
                // "@babel/plugin-transform-arrow-functions"
            ],
            "presets": [//presents 是plugins的集合，npm里有其他定制的presets可用
                [
                  "@babel/preset-env",
                  {
                    "useBuiltIns": false//"entry"
                  }
                ]
            ]
          });
          jscontent = result.code;
        const ast = espree.parse(jscontent, { 
            ecmaVersion: 10 
        });
        
    }catch(e){
        throw e;
    }

    let requireList = [];
    let requireAsyncList = [];
    return {
        requireList,
        requireAsyncList
    }
};
module.exports = {
    parse
};