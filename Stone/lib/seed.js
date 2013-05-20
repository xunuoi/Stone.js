require(['a','jquery' ,'w'], function(a, $, w){
    stone.divLog(arguments);
    w.hello();
    a.getB().hello();
    
	stone.ready(function(event){
		alert('stone doc ready');
	});
    var blockW = require('w');
    stone.divLog(blockW);
    
});

var eb = require('e');
stone.divLog(eb);
