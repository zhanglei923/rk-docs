let fs = require('fs');
let pathutil = require('path');
let parser = require('../parser');
const { fieldSize } = require('tar');
let rk = require('../../utils/rk')
let makeDir = require("make-dir")
let jsonformat = require('json-format')
let eachcontentjs = require('eachcontent-js');

let thisdir = pathutil.parse(__filename).dir;
let reportfolder = pathutil.resolve(thisdir, '../reports');
makeDir.sync(reportfolder);

let folder = `E:/workspaceGerrit/apps-i${'ngag'}e-web/src/main/webapp/static/source`;
//eachcontentjs.eachContent(``)
let file = pathutil.resolve(folder, './core/rk.js')
let content = fs.readFileSync(file, 'utf-8');
content = rk.cleanCommentsFast(content);
let result = parser.parse('reg2', content);

console.log(result)

fs.writeFileSync(pathutil.resolve(reportfolder, './reg2.json'), jsonformat(result))