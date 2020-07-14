let _ = require('lodash');
let reg = require('../core/reg');
let rk = require('../../utils/rk');

var getPath = function(requreResults){
    var pathReg = reg.PATH_REGEX;
    let requirefun = (str)=>{return str;}//用于eval中
    for(var x = 0, lenx = requreResults.length; x < lenx; x++) {
        var item = requreResults[x];
        let isobj = (typeof item === 'object');
        let rawPath = isobj ? item.rawPath : item;
        rawPath = _.trim(rawPath);
        //console.log(rawPath)
        eval(`rawPath = ${rawPath.replace(/^require/, 'requirefun')}`);
        isobj?(
            requreResults[x].rawPath = rawPath
        ):(
            requreResults[x] = rawPath
            )
    };
    requreResults = _.compact(requreResults);
    requreResults = _.uniq(requreResults);
    return requreResults;
};
let reduceContentAsLines = (raw_jscontent)=>{
    raw_jscontent = rk_formatLineBreaker(raw_jscontent);
    /***
     * 有些require的写法时换行的，比如：
     *  var a = require(
     *    'aaa/bbb/ccc.js'
     *  )
     *  这样的，就需要整理成一行才能争取解析
     *  
     */
    raw_jscontent = raw_jscontent.replace(/\brequire\b\s{0,}\(\s{1,}('|"|`)/g, (str)=>{ 
        //console.log('last=', str);
        let last = str.charAt(str.length-1); 
        str=str.substring(0, str.length-1);
        // console.log('last=', last);
        // console.log('str=', str);
        return str.replace(/\s{1,}/g, '')+last; 
    })
    raw_jscontent = raw_jscontent.replace(/\s{1,}\)/g, ')') //有的require，后半个括号也折行，所以得补一个
    let arr = raw_jscontent.split('\n')
    let lines = [];
    arr.forEach((linetxt)=>{
        linetxt = _.trim(linetxt);

        // if(!linetxt.match(/^\s?\/{2,}/))//不要注释的
        // if(linetxt.match(/require/)) lines.push(linetxt);

        linetxt = linetxt.replace(/\.require/g, 'xxxxxx');//不要 sth.require() 的形式，seajs没这种语法
        if(!/^\s{0,}\/{2,}/.test(linetxt) && /\brequire\b(\s|\()/.test(linetxt)) lines.push(linetxt);
    })
    return lines;
}
let reduceContent = (raw_jscontent)=>{
    let lines = reduceContentAsLines(raw_jscontent);
    return lines.join('\n');
}
let getRequires = (jscontent)=>{
    let lines = reduceContentAsLines(jscontent);
    if(lines.length===0) return [];
    let requires = [];
    lines.forEach((line)=>{
        // let a = require
        // fun( requre()
        // fun(a, require())
        // a= [require()]
        // a= [1, require()]
        let withExport = !!/\=[\s]{0,}require/.test(line)//!!line.match(/\=[\s]{0,}require/);
        let arr = line.match(reg.REQUIRE_REGEX);
        if(arr){
            arr.forEach((rawPath)=>{
                requires.push({
                    rawPath,
                    withExport
                })
            });
        }
    })
    return getPath(requires)
};
let parse = (jscontent)=>{
    let requireList = getRequires(jscontent);
    let requireAsyncList = [];
    return {
        requireList,
        requireAsyncList
    }
};
module.exports = {
    parse
};