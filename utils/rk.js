var fs = require('fs');
var pathutil = require('path');
var _ = require('lodash');
var decomment = require('decomment');
var stripcomments = require('strip-comments')

global.rk_formatLineBreaker = (content)=>{
    if(!content) return content;
    return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
};

var rk = {      
    isCmdFile: function(content){
        if(!content) return false;
        let definetype1 = /\bdefine\b\s{0,}\(\s{0,}function\s{0,}\(\s{0,}require\s{0,}\,\s{0,}exports\s{0,}\,\s{0,}module\s{0,}\)/;//没有g参数，不是用来查找所有
        return !!content.match(definetype1);
    },
    mightBeCmdFile: function(content){
        if(!content) return false;
        return !!content.match(/define\s{0,}\(/);
    },
    isCookedJsPath: function(fpath){
        if(fpath.match(/\.min\.js/) || 
            fpath.match(/\.bundle\.js/) || 
            fpath.match(/\-sdk\-rk\.js/) ||
            fpath.match(/node_modules/)
        ){
            return true;
        }
        //一些特殊名字处理
        if(fpath.indexOf(`handsontable.full`)>=0) return true;
        return false;
    },
    isCommonRequirePath: (raw_path)=>{
        raw_path = _.trim(raw_path);
        let isnormal = true;
        if(raw_path.indexOf('{')>=0) isnormal = false;
        if(raw_path.match(/^http/)) isnormal = false;
        if(raw_path.match(/^\//)) isnormal = false;
        return isnormal;
    },
    isLibJsPath: function(fpath){
        fpath = rk_formatPath(fpath)
        if(fpath.match(/\/lib\//g)
        ){
            return true;
        }
        return false;
    },
    fetchChinese: function(src){
        var arr = []
        if(/[\s?\u4e00-\u9fa5\，\。\：\,]+/ig.test(src)){
            var words0 = src.match(/[\s?\u4e00-\u9fa5\，\。\：\,]+/ig);
            var words = [];
            for(var j =0; j<words0.length;j++){
                var w = _.trim(words0[j]);
                if(w){
                    w = _.trim(w)
                    if(w && w !== '?' && w !== ',' && w !== '.' && w !== ':' && w.replace('?')) {
                        arr.push(w);
                    }
                }
            }
        }
        return arr;
    },
    htmlEscape: function (s) {
        var type = typeof s;
        if (!s || type != 'string') return s;
        return (s + '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/'/g, '&#039;')
            .replace(/"/g, '&quot;')
            .replace(/\n/g, '<br />');
    },
    onlyCleanLineComment: function(str){
        //不建议，这个函数无法去掉类似这种的情况：
        /**
         *   这是代码 //这里的就去不掉         * 
         * 
         */
        if(typeof str !== 'string') return str;
        if(!str) return str;

        str = rk_formatLineBreaker(str);
        str = str.split('\n');
        let arr = []
        str.forEach((line)=>{
            if(!line.match(/^\s{0,}\/\//)) arr.push(line)
        })    
        let newstr = arr.join('\n');
        return newstr;
    },
    cleanCommentsFast2: function(str){
        //不建议，这个函数无法去掉类似这种的情况：
        /**
         *   这是代码 //这里的就去不掉         * 
         * 
         */
        if(typeof str !== 'string') return str;
        if(!str) return str;

        str = rk_formatLineBreaker(str);
        str = str.split('\n');
        let arr = []
        str.forEach((line)=>{
            if(!line.match(/^\s{0,}\/\//)) arr.push(line)
        })    
        let newstr = arr.join('\n');
        return newstr;
    },
    cleanCommentsFast: function(str){
        if(typeof str !== 'string') return str;
        if(!str) return str;
        let marker =  'httt'+Math.random()+'tttttp'.replace(/\./g,'');
        let markers = 'htttttt'+Math.random()+'ttttps'.replace(/\./g,'');
        str = str.replace(/(http\:\/\/)/g, marker)
        str = str.replace(/(https\:\/\/)/g, markers)
        //console.log(str)
        //可能不是javascript，比如tpl什么的
        //by: http://upshots.org/javascript/javascript-regexp-to-remove-comments
        let newstr = str.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '');
        newstr = newstr.replace(new RegExp(marker, 'g'), 'http://')
        newstr = newstr.replace(new RegExp(markers, 'g'), 'https://')
        return newstr;
    },
    cleanComments: function(str){
        let cachekey = 'rk_cleanComments';
        let md5 = cacheUtil.md5(str);
        let cached = cacheUtil.getCache(cachekey, md5)
        if(cached) return cached;
        let code = str;
        try{
            code = stripcomments(str);
        }catch(e){
            console.log('[stripcomments]: bad javascript!')
        }
        cacheUtil.setCache(cachekey, md5, code)
        return code;
    }
}
module.exports = rk;