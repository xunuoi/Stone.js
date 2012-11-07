

/*
//1--测试 增加未实现 方法工具

xs.baseExpand.init('parts',['forEach','sdfff','reduce','shit']);
xs.baseExpand.init('all');

//xs.Utils.addCss('body { background:#A8E}');

*/
/*
//2--测试 Object.create
var dog = {
    name:'dog'	
};
dog.sayName = function(){alert(this.name)};
var ne = Object.create(dog);
//alert(ne);
ne.sayName();

*/

//3--setTimeout实现的 重复定时器测试

//xs.Utils.repeatTimer(function(){  alert('hi,bogy');	},3000);

/*
 * 4 函数工具 测试
 //函数注册到全局
 
xs.fnTools.regToGlobal(['throwError'],xs.fnTools.fns.throwError);

throwError();
 
//添加函数到fns并注册到全局
 xs.fnTools.addFn('boy',function(){
  alert('hi,boy');	 
}).regToGlobal(['boy']);;

boy();

//---

//alert(throwError);
xs.fnTools.regToGlobal();
throwError();
*/
/*
 * 5开启接口模式 全局变量总 增加 接口类  Interface
 
 xs.fnTools.onInterface();
 alert(Interface.ensureImplements());
 
/* 6 生成伪 GUID
 * 
  var rs = xs.fnTools.fns.getGUID();
 alert(rs);
 
 

 7基本测试 filter和 forEach
 // alert( Array.prototype.filter);
 Array.prototype.forEach = null;
 Array.prototype.filter = null;

 xs.baseExpand.init('all');
 
//alert( Array.prototype.filter);
var numbers = [1,2,3,4,5,4,3,2,1];
var filterRs = numbers.filter(function(item,index,array){

    return (item > 2);	
});

//alert(filterRs);

var eachRs = numbers.forEach(function(item,index,array){
    alert(item);
});
alert(numbers);

 */
 //------------------------------------截取混合字符串函数------
 //var s = '小猫abc你好啊23df同学';

//alert(xs.utils.mixSubstr(s,8));

/*
function cutString(str,keeplen){
	var len =   str.replace(/[^\x00-\xff]/g, function(word){
		  return word = 'CH';
		} ).length;	
	
	alert(str+'测试长度是 '+ len);
		
	
	if (len == str.length){
		 return str.substring(0,len-1);
	}
	else {
	    return str.substring(0,Math.floor(keeplen/2)-1);	
	}
	
}
// alert(s.length);

var rs = cutString(s,4);
alert('截取结果是: '+rs);

*/
//------------------------------------------------------------
//call 测试
/*
(function(){
var o = {color:'red'};
window.color = 'blue'

function run(){
    alert(this.color);
}

run.call(this);
run.call(window);
run.call(o);

})();
*/

/* bind 测试 

Function.prototype.bind = null;
xs.baseExpand.init('all');
window.color = 'red';
var o = { color:'blue'}

function sayColor(word,hello){
	for( os in arguments){
	  alert('获得的参数组是： '+arguments[os]);
	}
    alert(this.color+'-------'+word+hello);   
}
var  t = sayColor.bind(o,'shit');

t(' is good');
*/
/*
xs.fnTools.onInterface();

var bk = {o:'ss',d:11}
*/

//alert(addEventListener);


var btn = document.getElementById('btn');

var handler = {
	message: 'Event handled',
	
	handleClick: function(event){
		alert(this.message);
	}

};

var e1 = st.EventUtil.addHandler(btn,'click',function(){
	alert(this.message);
	},handler);
st.EventUtil.removeHandler(btn,'click',handler.handleClick,e1);

//测试parseObject

/*
var obj = xs.utils.parseObject('www.sb.com/ss/sdfa.php?a=2ds&bcd=653d&ef=sd');
//alert(obj.ef);


alert(obj.toString());

function tfn (){
	var s = 1;
}

alert(tfn);
*/
/*
function H(){

  // alert(Object instanceof Function);//true
 //  alert(Function instanceof Object);//true
  // alert(Array instanceof Object);  //true
    alert(Array instanceof Function);//true
}


H();
alert(H.caller);

*/
//arguments.callee 和fn.caller
/*
function write(anObject) {
    document.write('<pre>' + (anObject == null ? 'null' : anObject.toString()) + '</pre>');
}

function testCaller() {
    var caller = testCaller.caller;
    write(caller);
}

function aCaller() {
    testCaller();
}

testCaller();
aCaller();

function a(){
	alert(a.caller);
}
a();

function b(){
	a();
}

b();

*/


//img onerro 测试
/*

function counter(){
	var num = 1;
	return function(){

		alert(num++);
	}();
}
var imgUrl = 'http://localhost:8080/Stone/view/index.html';
//var imgUrl = 'http://localhost:8080/Stone/UI/cloudLogo.png';

function run(){
	document.write("<img src="+imgUrl+" onerror=alert('dd') />");
}


run();
*/


//测试JSONP功能--------------------------------------------------------------------------------------------
/*function JSONPCallback(data){
	//alert(data.name);

}

function test(){
	var url = 'http://localhost:8080/Stone/test/jsonp/view/JSONPReceiver.jsp?name=longlonglong';
	st.utils.getScript(url,function(){
	//	alert('脚本载入完毕');	
	});
	
}


test();
*/


//-----------测试JSONP封装

/*var ptu = {
	name: '许文龙s888df',
	age: 'fffsdsd'
};


st.utils.getJSONP({
	url: 'http://localhost:8080/Stone/test/jsonp/view/JSONPReceiver.jsp',
	data: ptu,
	success: function(data){

		alert(data.name);
	},
	error: function(){

		alert('JSONP失败了啊亲！');
	}

});*/

/*st.utils.getScript('../scripts/lib/Application.js',function(){

	alert('载入Application成功!'+exports.say);

	app = require('Application');
	app.say();


});
*/
//-----------------------------------------------

//alert(exports);

//require('Concurrent.Thread');

/*     Concurrent.Thread.create(function(){
         var i = 0;
         while ( 1 ) {
             document.body.innerHTML += i++ + "<br>";
         }
     });

*/

//框架 以来管理测试 -0-------------------------------------------------------------------

//require
require(['Application'],['1','2','jquery-1.7.2.min'/*这里是Application的依赖模块，按照这种格式，将返回Application单体*/],function(rs){ //因为application需要他的依赖模块全部加载完毕的时候，她才能注册到module，所以下面不一定能获得module;
	//alert(rs[2].per2);
	//alert(rs['jquery-1.7.2.min'].$);
	//rs.Application.say();
	//alert(rs['1'].per);

/*	for(var key in rs){
		alert(key);
	}*/
	//alert(rs.getExportsCounter())
	//alert(rs['jquery-1.7.2.min'].$);


	//rs.say();

	//require('2').hello();
	//rs.say();

	useModule('jquery-1.7.2.min').$('#url1').bind('click',function(event){
		alert('我被点击了，我是'+event.target);
	});
	var mods = useModule(['1','2','jquery-1.7.2.min']);
	mods['1'].say1();
	mods['2'].hello('来自test的调用');
	mods['jquery-1.7.2.min'].test();



});





