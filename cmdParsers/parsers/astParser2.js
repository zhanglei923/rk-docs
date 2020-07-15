var fs = require('fs');
let pathutil = require('path');
let _ = require('lodash');
let makeDir = require("make-dir")
var babel = require("@babel/core");
const espree = require("espree"); 

let reg = require('./core/reg');
let rk = require('../../utils/rk');

let thisdir = pathutil.parse(__filename).dir;
let reportfolder = pathutil.resolve(thisdir, '../debug');
makeDir.sync(reportfolder);

var doPush = function(urlMap, result, path, url, ntype){
    if(!url)return;
	if(url.indexOf('!')>=0) return;//不支持含！的路径
	if(/^http(s)?\:\/\//ig.test(url)) return;//放过http请求
	if(url.indexOf('?')>=0) url=url.split('?')[0]
	if(!urlMap[url] && url)result.push(url)
	urlMap[url] = true;
};
let forEveryNode = (node, callback, keyname)=>{
    if(typeof node !== "string"){
        if(_.isArray(node)){
            for(var i = 0, len = node.length; i < len; i++ ){
                //console.log(s)
                forEveryNode(node[i], callback, i);
            }
        }else{
            for(var s in node){
                //console.log(s)
                forEveryNode(node[s], callback, s);
            }
        }
    }
    (callback)(node, keyname);
};
let parseAst = (syntaxJson, path)=>{
    var result = [];
    var GrandFileList = {};
    var urlMap = {}
    //console.log(JSON.stringify(syntaxJson, null, 4));
    forEveryNode(syntaxJson , function(n, keyname){
        //if(n.type)console.log(n.type)
        if(n && n.type === 'ExpressionStatement' && n.expression && n.expression.type === 'CallExpression' && n.expression.callee && n.expression.callee.type === 'Identifier' && n.expression.arguments)
            if(n.expression.callee.name === 'require' && n.expression.arguments[0]){
                var url = n.expression.arguments[0].value;
                doPush(urlMap, result, path, url, n.type)
            }
        //比如：var rk = require(''rk)
        if(n && n.type === 'VariableDeclaration' && _.isArray(n.declarations)){
            var declarations = n.declarations[0];
            if(declarations.type==='VariableDeclarator' && declarations.init)
            if(declarations.init.type==='CallExpression'&&declarations.init.callee&& declarations.init.callee.name==='require'&&_.isArray(declarations.init.arguments)){
                try{
                    var url = declarations.init.arguments[0].value;
                    doPush(urlMap, result, path, url, n.type)
                }catch(e){
                    console.log('catched exception: ', srcPath, path);
                    throw e;
                }
            }
        }
        if(n && n.type === 'CallExpression' && n.callee&&n.callee.name==='require'&&_.isArray(n.arguments)){
            if(n.arguments[0]){
                var url = n.arguments[0].value;
                doPush(urlMap, result, path, url, n.type)                                
            }
        }
        if(n&&n.type==='MemberExpression'&&n.object){
            var object = n.object;
            if(object.callee&&object.callee.type=='MemberExpression'&&object.callee.property&&object.callee.property.name==='require'&&_.isArray(object.arguments)){
                var url = object.arguments[0].value;
                doPush(urlMap, result, path, url, n.type)
            }
        }
    })
    // console.log(path)
    // console.log(result)
    // GrandFileList[path] = _.uniq(result);
    result = _.uniq(result);
    return result;
}

let getRequires = (jscontent)=>{
    let lines = reduceContentAsLines(jscontent);
    if(lines.length===0) return [];
    let requires = [];

    return getPath(requires)
};
let parse = (jscontent, fpath)=>{
    if(jscontent.indexOf('require')<0) return jscontent;//没有require，不需要解析
    let requireList = [];
    let requireAsyncList = [];
    try{
        const ast = espree.parse(jscontent, { 
            ecmaVersion: 10 
        });
        let arr = parseAst(ast, fpath);
        arr.forEach((rawPath)=>{
            requireList.push({
                rawPath,
                withExport: null
            })
        })
        if(0)fs.writeFileSync(pathutil.resolve(reportfolder, fpath.replace(/\//g, '~')+'.json'), JSON.stringify(ast));
    }catch(e){
        console.log('fail', fpath)
        //throw e;
    }

    return {
        requireList,
        requireAsyncList
    }
};
module.exports = {
    parse
};