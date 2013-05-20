define(['e'], function (e) {
    //alert('c define function has runed');
    return {
        'hello': function(){
            stone.divLog('hello, i am mod c');
        },
        getE: function(){
        	return e;
        }
    }
});