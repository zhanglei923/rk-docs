require.async(['a1','b1', 'c1'], callback)
require.async(['a12',
                  'b12', 
                  'c12'], callback)
require.async('a13', callback)

require.async([`a2`,`b2`, `c2`], callback)
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

// require.async(['a'+value+'b'], callback) <--这种不支持
// require.async('a'+value+'b', callback) <--这种不支持
// require.async(`a/${b}/c`, callback) <--这种不支持