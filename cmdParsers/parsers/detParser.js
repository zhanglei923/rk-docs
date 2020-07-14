var detective = require('detective');
var fs = require('fs');
let _ = require('lodash');
let reg = require('../core/reg');
let rk = require('../../utils/rk');

let getRequires = (jscontent)=>{
    let lines = reduceContentAsLines(jscontent);
    if(lines.length===0) return [];
    let requires = [];

    return getPath(requires)
};
let parse = (jscontent)=>{
    let requireList = detective(jscontent);
    let requireAsyncList = [];
    return {
        requireList,
        requireAsyncList
    }
};
module.exports = {
    parse
};