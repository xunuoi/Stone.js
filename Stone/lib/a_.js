aket;
define('a', ['b'], function (b) {
    return {
        'hello': function(){
            alert('hello, i am mod a');
        },
        getB: function(){
        	return b;
        }
    };
});