let fs = require('fs');
let pathutil = require('path');
let makeDir = require("make-dir")

let compare = require('../parsers/core/compare');

let thisdir = pathutil.parse(__filename).dir;
let reportfolder = pathutil.resolve(thisdir, './report');
makeDir.sync(reportfolder);
compare.compare(`E:/workspaceGerrit/apps-ingage-web/src/main/webapp/static/source`, reportfolder);