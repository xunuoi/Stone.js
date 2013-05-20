define( ['c'], function (c) {
    //alert('b define function has runed');
    return {
        'hello': function(){
            stone.divLog('hello, i am mod b');
        },
        getC: function(){
        	return c;
        }
    }
});