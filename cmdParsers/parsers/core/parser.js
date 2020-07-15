let fs = require('fs');
let pathutil = require('path');
let rk = require('../../../utils/rk')
const regParser = require('../regParser');
const astParser_v2 = require('../astParser2');
const detParser = require('../detParser');
const regParser_v2 = require('../regParser2');

let getRequiresAsArray = (deps)=>{
    let arr = [];
    deps.forEach((o)=>{
        arr.push(o.rawPath);
    })
    arr = _.uniq(arr);
    return arr;
};
let selfTest = (types)=>{

};
let parse = (type, fpath)=>{
    if(type === 'reg')  parser = regParser;
    if(type === 'reg2')  parser = regParser_v2;
    if(type === 'ast2')  parser = astParser_v2;
    if(type === 'det')  parser = detParser;

    if(!rk.isCookedJsPath(fpath)){
        let content = fs.readFileSync(fpath, 'utf-8');
        if(!rk.isCookedJs(content)){
            let result = parser.parse(content, fpath);
            return result;
        }
    }    
};
module.exports = {
    selfTest,
    parse
};