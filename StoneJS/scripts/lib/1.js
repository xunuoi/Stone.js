
alert('1 is loading');
define('1',function(require,exports){

    exports.per = function(value,total){
        return ( (value / total) * 100 ) ;
    };
    exports.say1 = function(){
    	alert('我是say1 in 1.js');
    };
});

