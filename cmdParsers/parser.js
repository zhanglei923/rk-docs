let regParser = require('../regParser');
let astParser = require('../astParser');
let detParser = require('../detParser');
let parse = (type, content)=>{
    if(type === 'reg')  parser = regParser;
    if(type === 'ast')  parser = astParser;
    if(type === 'det')  parser = detParser;
    

}
module.exports = {
    parse
};