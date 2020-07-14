var babel = require("@babel/core");
let fs = require('fs');

let jscontent = fs.readFileSync('./bad.js', 'utf-8')


var result = babel.transform(jscontent, {
    plugins: [
        // "@babel/plugin-proposal-object-rest-spread",
        // "@babel/plugin-transform-arrow-functions"
    ],
    "presets": [//presents 是plugins的集合，npm里有其他定制的presets可用
        [
          "@babel/preset-env",
          {
            "useBuiltIns": false,//"entry"
            "strict" : false
          }
        ]
    ]
  });