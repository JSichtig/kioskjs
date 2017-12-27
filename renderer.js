const fs = require('fs');
const path = require('path')

global.kioskjs = {};

// ###################### General purpose Functions #########################

kioskjs.toggleActive = function(mod,data){
    var _mod = mod;
    if(typeof mod === 'string'){
        // find mod with name
    }
    kioskjs.mods.forEach(function(cmod){
        cmod.script.$assigned.removeClass("d-none");
        cmod.script.$assigned.addClass("d-none");
    });
    mod.script.$assigned.removeClass("d-none");
    mod.script.activated(data);
}
kioskjs.getModByName = function(name){
    var ret = null;
    kioskjs.mods.forEach(function(mod,index){
        if(mod.name.toUpperCase() === name.toUpperCase())
            ret = mod;
    });
    return ret;
}
kioskjs.getModBySelector = function(input){
    // selectors do not really allow for semantic sentences
    // will simply search for keywords in a sentence right now and choose the best match
    // with the help of a score system . . .
    var scores = [];
    kioskjs.mods.forEach(function(mod, index){
        var matches = [];
        matches = mod.selectors.filter(sel => input.toUpperCase().indexOf(sel.toUpperCase()) > -1);
        if(matches.length > 0)
            scores.push({"mod": mod, "matches": matches, "score": matches.length});
    });
    scores.sort(function(a, b){ 
        return b.score - a.score; 
    });
    return scores.length > 0 ? scores[0].mod : null;
}
function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path+'/'+file).isDirectory();
    });
}
function hasModJson(path) {
    var _hasModJson = false;
    fs.readdirSync(__dirname+'/Mods/'+path).filter(function (file) {
        if(file==="mod.json")
        _hasModJson = true;
    });
    return _hasModJson;
}

// ###################### Finding and registering mods #########################

// register all mods
var installedMods = [];

//find directories within Mods folder
var modDirectories = getDirectories(__dirname+'/Mods');
console.log("Found " + modDirectories.length + " directories in Mods");
//filter out those without a mod.json file
installedMods = modDirectories.filter(hasModJson);
console.log("Found " + installedMods.length + " mod.js in Mods");

// turn installedMods into js objects
// read mod.js of each mod and parse content
kioskjs.mods = [];
installedMods.forEach(function(mod){
    // read mod.js
    var modjson = JSON.parse(fs.readFileSync(__dirname+'/Mods/'+mod+'/mod.json', 'utf8'));
    modjson.path = __dirname+'/Mods/'+mod;
    kioskjs.mods.push(modjson);
});
console.log(kioskjs.mods);
// evaluate given mods and assign the script objects to the kioskjs.mods.script
kioskjs.mods.forEach(function(mod,index,array){
    mod.loaded = false;

    console.log("Trying to eval() " + mod.name);
    var scriptFile = mod.path+"/"+mod.main;
    var script = fs.readFileSync(scriptFile, 'utf8');
    mod.script = eval(script);

    // parse mod template and add to dom
    var templateFile = mod.path+"/"+mod.template;
    var template = fs.readFileSync(templateFile, 'utf8');
    $("#assignedMods").append("<div class='d-none' id='mod_"+mod.name+"'></div>");
    $("#mod_"+mod.name).append(template);
    mod.script.$assigned = $("#mod_"+mod.name);
    mod.script.me = mod;
});
kioskjs.mods.forEach(function(mod){
    mod.script.init();
});

// ###################### Interactivity and eventhandling #########################

$("#terminalForm").on("change", function(event){
    // suggestions?
});

$("#terminalForm").on("submit", function(event){
    event.preventDefault();
    // load proper mod
    var mod = kioskjs.getModBySelector($("#terminalForm #terminal").val());
    if(mod !== null)
        kioskjs.toggleActive(mod, $("#terminalForm #terminal").val());
    // empty
    $("#terminalForm #terminal").val("");
});

