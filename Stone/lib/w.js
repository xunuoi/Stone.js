define(['f'], function (f) {
    //alert('w define function has runed');
    f.hello();
    //console.log(f.json);
    return {
        'hello': function(){
            stone.divLog('hello, i am mod w');
        },
        getF: function(){
        	return f;
        }
    }
});