
alert('2 is loading');

define('2',function(require,exports){

    exports.per2 = function(value,total){
        return ( (value / total) * 100 ) ;
    };
    exports.hello = function(str){
    	alert('I\'m hello in 2.js'+str);
    }
});

