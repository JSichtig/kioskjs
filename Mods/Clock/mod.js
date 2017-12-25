/*
    Todo: turn this into a flip clock with an svg
    display and hide numbers based on the time...
    --> SCALEABLE!!! :)
*/


var script = {};

/* 
    Assigned jquery object to manipulate.
    Modifying any other object in the dom is discouraged
    as it may interfere with other modules.
*/
script.$assigned = null;
script.me = null;

script.getTime = function(format){
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    
    var value = format;
    value = value.replace(/hh/g, hours > 9 ? hours : "0" + hours);
    value = value.replace(/mm/g, minutes > 9 ? minutes : "0" + minutes);
    value = value.replace(/ss/g, seconds > 9 ? seconds : "0" + seconds);

    return value;
}

script.update = function(){
    var time = script.getTime("hhmm");
    $("#spanHoursLeft").html(time[0]);
    $("#spanHoursRight").html(time[1]);
    $("#spanMinutesLeft").html(time[2]);
    $("#spanMinutesRight").html(time[3]);
}

script.init = function() {
    kioskjs.toggleActive(script.me);
    script.update();
    setInterval(script.update, 1000);
}

script;