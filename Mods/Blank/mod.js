var script = {};

/* 
    Assigned jquery object to manipulate.
    Modifying any other object in the dom is discouraged
    as it may interfere with other modules.
*/
script.$assigned = null;
script.me = null;

// init functions. called upon loading
script.init = function() {
    
}

// activated function. called upon usage of toggleActive
script.activated = function(data) {
    
}

// test functions and variables
script.testVal = "test";
script.test = function(){
    console.log(test);
}


script; // return script obj to eval. may be accessed by mod.script