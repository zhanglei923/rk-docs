const regParser = require('../regParser');
const astParser_v2 = require('../astParser2');
const detParser = require('../detParser');
const regParser_v2 = require('../regParser2');

let getRequiresAsArray = (jscontent)=>{
    let deps = getRequires(jscontent);
    let arr = [];
    deps.forEach((o)=>{
        arr.push(o.rawPath);
    })
    arr = _.uniq(arr);
    return arr;
}
let parse = (type, content, fpath)=>{
    if(type === 'reg')  parser = regParser;
    if(type === 'reg2')  parser = regParser_v2;
    if(type === 'ast2')  parser = astParser_v2;
    if(type === 'det')  parser = detParser;
    
    let result = parser.parse(content, fpath);
    return result;
};
let selfTest = (types)=>{

};
module.exports = {
    selfTest,
    parse
};