const regParser = require('./parsers/regParser');
const astParser = require('./parsers/astParser');
const detParser = require('./parsers/detParser');
const regParser_v2 = require('./parsers/regParser_v2');

let getRequiresAsArray = (jscontent)=>{
    let deps = getRequires(jscontent);
    let arr = [];
    deps.forEach((o)=>{
        arr.push(o.rawPath);
    })
    arr = _.uniq(arr);
    return arr;
}
let parse = (type, content)=>{
    if(type === 'reg')  parser = regParser;
    if(type === 'reg2')  parser = regParser_v2;
    if(type === 'ast')  parser = astParser;
    if(type === 'det')  parser = detParser;
    
    let result = parser.parse(content);
    return result;
}
module.exports = {
    parse
};