{
    "optimize": "uglify2",
    "removeCombined": true,
    "generateSourceMaps": false,
    "preserveLicenseComments": false,
    "optimizeCss": "none",
    "mainConfigFile": "../dev/js/common.js",
    "appDir": "../dev",
    "dir": "../build",
    "baseUrl": "js/lib",
    "modules": [{
        "name": "../config"
    }, {
        "name": "../common",
        "include": [],
        "exclude": ["../config"]
    }, {
        "name": "../main",
        "include": ["app/main"],
        "exclude": ["../config", "../common"]
    }]
}