let fs = require('fs');
let pathutil = require('path');
let makeDir = require("make-dir")
let jsonformat = require('json-format');
const _ = require('lodash');
const eachcontent = require('eachcontent-js');
let compare = require('../parsers/core/compare');

let thisfolder = pathutil.parse(__filename).dir;
let inner_report_folder = pathutil.resolve(thisfolder, './report');
let outer_report_folder = pathutil.resolve(thisfolder, '../../../rk-docs_report_reg-ast');
let outer_report_folder_succ = pathutil.resolve(outer_report_folder, './succ');
let outer_report_folder_fail = pathutil.resolve(outer_report_folder, './fail');

makeDir.sync(inner_report_folder);
makeDir.sync(outer_report_folder_succ);
makeDir.sync(outer_report_folder_fail);

let possibleProjectRoots = [
    `/home/ingage/autopack/projects/`,
    `E:/114server/home/ingage/autopack/projects`
];
let projectRoot;
possibleProjectRoots.forEach((dir)=>{
    if(fs.existsSync(dir)) projectRoot = dir;
});
if(!projectRoot) {
    process.exit(0);
}
console.log(projectRoot)
let getChildFolders = (dir)=>{
    var results = []
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file
        var stat = fs.statSync(file)
        if (stat && stat.isDirectory()) results.push(file);
    })
    return results;
}
let prjfolders = getChildFolders(projectRoot);
let checkProject  = (prjfolder, projectName)=>{
    let sourceFolder;
    let branchfolders = getChildFolders(prjfolder);
    branchfolders.forEach((branchfolder)=>{
        let branchNickName = pathutil.relative(prjfolder, branchfolder);
        let branchName = branchNickName.replace(/\~{2}/g, '/');
        console.log(projectName, branchName)
        let realprojectpath = pathutil.resolve(branchfolder, projectName);
        console.log(projectName, branchName, realprojectpath)
        let sourceFolder;
        if(projectName === 'apps-ingage-web') {
            sourceFolder = pathutil.resolve(realprojectpath, './src/main/webapp/static/source');
        }else{
            sourceFolder = pathutil.resolve(realprojectpath, './static/source');
        }
        if(fs.existsSync(sourceFolder)){
            console.log('compare start:', sourceFolder)
            let rpt = compare.compare(sourceFolder, inner_report_folder);
            console.log(rpt.errors)
            let rptfilename = `${projectName},,,${branchNickName}.regast.report`;
            let fpath;
            if(rpt.errors.length === 0){
                fpath = pathutil.resolve(outer_report_folder_succ, rptfilename);
                fs.writeFileSync(fpath, '');
            }else{
                fpath = pathutil.resolve(outer_report_folder_fail, rptfilename);
                fs.writeFileSync(fpath, JSON.stringify(rpt));
            }
        }
    });
    console.log('compare end.');
}
prjfolders.forEach((prjfolder)=>{
    let projectName = pathutil.relative(projectRoot, prjfolder);
    checkProject(prjfolder, projectName)
})