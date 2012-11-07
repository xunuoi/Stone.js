//Mahts.js

define('Application',['1','2','jquery-1.7.2.min'],function(require,exports,module){
	
	exports.say = function(){
		alert('hello ,I\'m exports.say of Application');
	}
    
	require('2').hello('来自Application的调用');


});

