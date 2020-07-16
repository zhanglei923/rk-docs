require.async("z1")
require.async('z2')
require.async(`${z3}`)//这种支持！
require.async('https://www.xiaoshouyi.com?a=1')
require.async(`https://www.${'xiaoshouyi'}.${sub}.com?a=1`)

require.async("y1", (arg1,arg2,arg3)=>{

})
require.async('y2/y21/y22', function1)
require.async(`111${y3}222`, function2)//这种不支持

require.async(['a1','b1', 'c1'], callback)
require.async(['a12',
                  'b12', 
                  'c12'], callback)
require.async('a13', callback)

require.async([`a2`,`b2`, `c2`], (arg1,arg2,arg3)=>{
                      
})
require.async([`a22`,
                  `b22`, 
                  `c22`], callback)
require.async(`a23`, callback)

require.async(["a3","b3", "c3"], callback)
require.async(["a32",
                  "b32", 
                  "c32"], callback)
require.async("a33", callback)

let a = require.async(["d3","d3", "d3"], callback)
let b = require.async(["d32",
                  "d32", 
                  "d32"], callback)
let c = require.async("d33", callback)


let a = require.async(["e3","e3", "e3"],)
let b = require.async(["e321",
                  "e322", 
                  "e323"])
let c = require.async("e331")

let b = require.async(["e343",
                  "e344", 
                  "e345"], ()=>{

                  })


require.async(url
    );
require.async(url1, url2, url3
    , callback);
require.async(url4, url5, url6
        , ()=>{
            arr = _.sortBy(arr, (o)=>{return o.birthtimeMs;});//执行最早的那个
            if(arr.length > 0){
                let task = arr.shift();
                execSh(`cd ${parentfolder} && sh ./run.sh ${task.branchName}`, {}, function(err, stdout, stderr){
                    fs.unlinkSync(task.fpath);
                    console.log(`[done]: ${task.branchName}`);
                });
            }
        });
// require.async(['a'+value+'b'], callback) <--这种不支持
// require.async('a'+value+'b', callback) <--这种不支持
// require.async(`a/${b}/c`, callback) <--这种不支持