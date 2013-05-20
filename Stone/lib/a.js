define(['b', 'w'], function (b) {
    return {
        'hello': function(){
            alert('hello, i am mod a');
        },
        getB: function(){
        	return b;
        }
    };
});

/*require(['b'], function (b) {
    b.hello();
    //w.hello();
});*/