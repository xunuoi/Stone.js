//@setting UTF-8
/*
	Dmimi version v1.0.9 
	Copyright (c) 2012,linchangyuan 
	developer more intimate more intelligent  
	
	“ 赞助作者 https://me.alipay.com/linchangyuan ”

	updata
		2012-5-10
		1.Dmimi 开始起草，建立 core cpu selector event tool net 模型
		2.完成Dmimi.js 核心代码

		2012-5-11
		1.Dmimi.init.js 打包封装个模型块
		
		*项目紧张暂停2个月

		2012-7-23
		1.开发selector模型，编写日常使用率最高的几种查询器id class attr 等

		2012-7-26
		1.优化CPU参数传递模式.
		2.工具包中增加各种dom操作

		2012-7-27
		1.Dmimi框架基本成型。发布demo1.0;
		2.解决tool html()功能的bug

		2012-7-30
		1.解决 append after 等文档操作插入string 和 dom类型不同的bug

		2012-7-31
		1.Dmimi plugin 开发模式确定

		2012-8-4
		1.Dmimi event drag 改良

		2012-8-7
		1.Dmimi DMIMI_ELE 方法改名为 current 并且优化

		2012-8-9
		1.SVG VML CANVAS 技术研究对比，决定不准备放进Dmimi中

		2012-8-10
		1.Dmimi ready 开发
		2.解决由于HTMLcollection 导致对象不稳定问题。

		2012-8-14
		1.drag 事件增加对于x y小于0的判断

		2012-8-15
		1.Dmimi mvdn 底层开发

		2012-8-16
		1.model 开发完成
		2.解决net层在post状态下参数传递问题

		2012-8-20~8-27
		1.Dmimi 网站的建立。

		2012-8-28
		1.提供一种能监控普通节点内容改变的方式。已加进model
		2.优化animate 算法，comparesion可以看到效果,效率提升10倍

		2012-8-29
		1.官网导航加了小ET 和音乐目前支持火狐

		2012-8-30
		1.tool 增加not选择器
		2.优化validateSelector算法
		3.hasClass 优化支持对外使用 

		2012-8-31
		1.解决comparison IE6下animaite无效果的问题 	
		2.网站增加对css3部分支持 兼容ie6	

		2012-9-3
		1.对css3 插件优化详见网站 “我的田”

		2012-9-4
		1.增加tween 缓动支持，调用方法优化中
		2.对animate 优化

		2012-9-16
		1.event 增加keyboard 事件	支持多键监听比如 ctrl + A

		2012-9-28
		1.tool 增加stop事件用于停止对象动画队列


		*由于公司项目紧张，和一波三折，Dmimi停滞了半年，也许是懒得写了:-)
		*加入淘宝后，看了kissy那肥胖的身躯，让我重新燃起了继续开发亲爱的“大咪咪”的欲望，2013 走起! o(∩_∩)o 


		2013-5-2
		1.对append等操作加入fragment方式，提高效率
		2.优化each函数，text函数

		2013-5-7
		1.增加getNodeList函数 用于插入兄弟节点的情况
		2.修改plugin层逻辑见line:251
	
*/






var DMIMI = function(elem){
	return DMIMI._selector(elem);
};

/*
	设置一个全局变量用于存储当前对象为了解决HTMLcollection 不稳定问题  (即将淘汰该变量)
*/
var DMIMI_ELE = []; 

DMIMI.Dmimi = "beta 1.0.9";
/*
	选择器主函数，selector: .class #id div []
*/

DMIMI._selector = function (selector,dom){
	var doc = dom||document;
	var domTemp;
	DMIMI.selector = selector;

	/*
		元素element		1
		属性attr		2
		文本text		3
		注释comments	8
		文档document	9
		片段fragment    11
	*/
	if(typeof selector == "object"){
		return DMIMI.classArray([selector]);
	}
	if(selector.nodeType === 1||selector.nodeType === 9){
		return DMIMI.classArray([selector]);
	}
	if(selector.indexOf("<")==0){
		//var frag = document.createDocumentFragment();
		//frag.appendChild(DMIMI.cpu.createElement(selector));
		return DMIMI.classArray([DMIMI.cpu.createElement(selector,"create")]);
	}

	if(selector.indexOf("#")==0){
		domTemp = [doc.getElementById(selector.replace("#",""))];
	}else if(selector.indexOf(".")!="-1"){

		domTemp = [];
		if(selector.indexOf(".")!=0){
			/*
				如果“.”不在第一个位置那么存在元素
			*/
			var arr = selector.split(".");
			var d = doc.getElementsByTagName(arr[0]);

			for(var i=0;i<d.length;i++){
				if(DMIMI.hasClass(arr[1],d[i].className)){
					domTemp.push(d[i]);
				}
			}
		}else{
			if(DMIMI.cpu.brower("ie")){
				var arr = doc.getElementsByTagName("*");
				var _class = selector.replace(".","");
				var len = arr.length;
				for(var i=0;i<len;i++){
					if(DMIMI.hasClass(_class,arr[i].className)){
						domTemp.push(arr[i]);
					}
				}
			}else{
				domTemp = doc.getElementsByClassName(selector.replace(".",""));
			}

		}
	}else if(selector.indexOf("[")!=-1){
		domTemp = [];

		/*
			通过cpu 我们得到一个匹配selector 的数组，0： domTemp, 1: attributes
		*/
		var object = DMIMI.cpu._test("attr",selector);

		/*
			一个匿名函数返回指定节点， 通过遍历每一个节点并且判断tagName attribute 返回匹配的节点
		*/
		var d;
		object.tagName ? d = doc.getElementsByTagName(object.tagName) : d =  doc.getElementsByTagName("*");

		
		
		for(var i=0;i<d.length;i++){
			if(DMIMI.cpu.validateSelector(d[i],object)){
				domTemp.push(d[i]);
			}
		}
	}else {
		domTemp = doc.getElementsByTagName(selector);
	}

	/*
		当存在find 需要改变当操作dom对象的时候
	*/
 
	return DMIMI.classArray(domTemp);
};

/*
	使得dom对象继承所有Dmimi方法及属性
*/
DMIMI.classArray = function(dom){
	/*
		这里的dom 是 HTMLcollection  他会随着文档的改变而改变，所以需要重新创建数组。
	*/

	var arr = [];
	var len = dom.length;

	DMIMI_ELE = [dom];
	
	for(var i in DMIMI){
		DMIMI_ELE[i] = DMIMI[i];
	}
	return DMIMI_ELE;
};

DMIMI.plugin = function(name,opt){
	return DMIMI.plugin._class[name](opt);
};
DMIMI.plugin._class = {};
DMIMI.plugin.add = function(name,fun){
	DMIMI.plugin._class[name] = fun
};
$ = DMIMI;
/*
	@ cpu
	
	desc 数据逻辑处理

*/

DMIMI.cpu = {
	brower:function(param){
		var ua = navigator.userAgent.toLowerCase();
		var s,sys = {};
		(s = ua.match(/msie ([\d.]+)/)) ? sys.ie = s[1] :
		(s = ua.match(/firefox\/([\d.]+)/)) ? sys.firefox = s[1] :
		(s = ua.match(/chrome\/([\d.]+)/)) ? sys.chrome = s[1] :
		(s = ua.match(/opera.([\d.]+)/)) ? sys.opera = s[1] :
		(s = ua.match(/version\/([\d.]+).*safari/)) ? sys.safari = s[1] : 0;
		return sys[param];
	},
	
	/*
		递归算法 参数:
			condition(条件)  callback 
	*/
	resursion:function(condition,object,callback){
		var temp = [];
		var fun = function(object){
			if(object.nodeType===1){
				if(object.childNodes&&object.childNodes[0].nodeType!==1){
					var obj = object.childNodes;
					for(var i=0;i<obj.length;i++){
						if(obj[i].childNodes&&obj[i].childNodes[0].nodeType!==1){
							fun(obj[i].childNodes);
						}else{
							temp.push(obj[i]);
						}
					}
				}else{
					temp.push(object);
				}
			}
		};
		fun(object);
		callback(temp);
	},
	_test:function(name,text){
		var results;
		var _class = {
			"attr":function(text){
				var object = {};
				if(text.indexOf(".")!=-1){
					var domTemp = [];
					if(text.indexOf(".")!=0){
						/*
							如果“.”不在第一个位置那么存在元素
						*/
						var arr = text.split(".");
						object.tagName = arr[0];
						object.arr = [{className:"class",classValue:arr[1]}];
						
					}else{
						object.arr =[{className:"class",classValue:text.replace(".","")}];

					}
					return object;
				}


				var reg1 = /^\w*/;
				var reg2 = /(\[\w+=.+]|\[\w+]*\])/gi;
				
				/*
					通过正则reg1 得到匹配的tagName
				*/
				results = text.match(reg1);
				if(results&&results.length&&results[0]!=""){
					object.tagName = results[0];
				}

				/*
					通过正则reg2 得到匹配的attribute
				*/
				object.arr = [];
				results = text.match(reg2);



				if(results&&results.length){
					//这里用来把[name=abc]多个这样的放到一个对象中准备作为过滤的条件
					for(var i=0;i<results.length;i++){
						var a = results[i],b,c;
						
						a = a.match(/\[\w*=[#\-\d\w]*\]|\[\w*\]/g);
						if(a&&a.length){
							for(var j=0;j<a.length;j++){
								 
								b = a[j].replace(/[\[\]]/g,"");
								c = b.split("=");
								object.arr[j] = {attrName:c[0],attrValue:c[1]};
							}	
						}
						
					
						//a = a.replace(/[\[\]]/g,"");
						//var aArray = a.split("=");

						//object.arr[i] = {attrName:aArray[0],attrValue:aArray[1]};
					}
				}

				return object;
			}
		};
		return _class[name](text);
	},

	/*
		用于验证dom是否符合selector条件
		object: tagName attrName attrValue
	*/
	validateSelector:function(dom,object){
		/*
			验证属性
		*/

		var attributeFun = function(dom,object){
			var n,v;

			if(object.attrName){
				if(!dom.getAttribute(object.attrName)){
					return false;
				}
			}

			if(object.attrValue){
				/*
					当属性为href的时候IE下会自动补全
				*/
				v = dom.getAttribute(object.attrName);
				if(object.attrName=="href"){
					v = dom.getAttribute(object.attrName);
					if(v.indexOf("#")!=-1){
						v = "#"+v.split("#")[1];
					}
				}
				if(v!=object.attrValue){
					return false;
				}
			}
			
			if(object.className){
				 	
				if(!DMIMI.hasClass(object.classValue,dom.className)){
					return false;
				}
			}
			
			return true;
		};

		/*
			先验证tagName因为是唯一的
		*/
		if(object.tagName){
			if(dom.tagName!=object.tagName.toUpperCase()){
				return false;
			}
		}

		/*
			验证属性需要多个
		*/

		var arr = object.arr;
		var bool = true;
		for(var j=0;j<arr.length;j++){
			bool = attributeFun(dom,arr[j]);
			/*
				只要一个不通过直接就返回false
			*/
			if(!bool){
				break;
			}
		}
		return bool;


		
	},
	
	current:function(obj){
		if(obj&&obj[0]&&obj[0][0]){
			return obj;
		}else if(DMIMI_ELE[0]&&DMIMI_ELE[0].length&&DMIMI_ELE[0][0]){ 
			return DMIMI_ELE;
		}else{
			
			if(DMIMI.cpu.brower("ie")){
				//alert(DMIMI.selector+"  undefined");
				return false;
			}else{
				//console.warn(DMIMI.error.undefined("节点不存在 ")+"“"+DMIMI.selector+"”");
			}
			return null;
		}
	},
	extend:function(a,b){
		
		var _class = {};
	
		if(b){
			for(var name in b){
				_class[name] = b[name];
				
			}
		}
		
		if(a){
			if(typeof a == "function"){
				for(var name in b ){
					a[name] = b[name];
				}
				return ;
			}
			for(var name in a){
				if(b&&b[name]==a[name]){
					continue;
				}
				_class[name] = a[name];
				
			}
		}
		return _class;
	},

	// 用于将模块属性方法合并到主干，方便用户使用
	merge:function(a,b){
		var thisExtend = function(obj){
			for(var name in obj){
				a[name] = obj[name];
			}
		};
		for(var i=0;i<b.length;i++){
			thisExtend(b[i].obj);
			delete a[b[i].name];
		}
	},
	/*
	makeArray:function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	},
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			CLASS.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			CLASS.find.matches(expr, elems);
	},
	*/
	getNodeList:function(str){
		var nodeList = [],			//返回解析好的数组
			arr,					//临时数组用于堆栈
			temp = str,				//复制原字符串
			name,					//父节点元素名
			i1,						//匹配的<div位置
			i2,						//匹配的</div>位置
			r = "",					//getNodeList函数局部字符串用于排除的字符存储
			nn,						//元素name length
			s;						//ref1 函数局部临时字符串存储
			
		function ref1(temp){
			name = temp.match(/^<\w*/)[0];
			name = name.replace("<","");
			if(!name){
				return;
			}
			nn = name.length;
			arr = [];
			s = r;
			function ref2(){
				i1 = temp.indexOf("<"+name);
				i2 = temp.indexOf("</"+name+">");
				rn = r.length;
				i1n = i1+1+nn;
				i2n = i2+3+nn;
				if(i2>i1&&i1!=-1){
					arr.push("dom");
					temp = temp.substring(i1n);
					r+=str.substring(rn,rn+i1n);
					ref2();
				}else{
					arr.splice(arr.length-1,1);
					temp = temp.substring(i2n);
					r+=str.substring(rn,rn+i2n);
					if(arr.length==0){
						nodeList.push(r.replace(s,""));
						if(temp.length>0){
							ref1(temp);
						}
						return;
					}
					ref2();
				}
			}
			ref2(0);
		}
		ref1(temp);
		return nodeList;
	},
	createElement:function(data,type){

		data = DMIMI.cpu.getNodeList(data);

		var reg1 = /^<\w*/; // 匹配元素name
		var frag = document.createDocumentFragment();
		for(var i=0;i<data.length;i++){
			var element;

			var results1 = data[i].match(reg1);
			results1 = results1[0].replace("<",""); // 元素name
			
			
			/*
				这个正则获取元素属性包括class
			*/
			var reg2 = /\w*=['"][^=]*['"]/g;

			var firstH = data[i].indexOf(">");

			/*
				这里过滤一下，只要最外层元素及属性,
			*/
			var data1 = data[i].substring(0,firstH+1); 

			var results2 = data1.match(reg2);
			
			/*
				这个html 得到 元素html
			*/
			var index = data[i].indexOf(">");

			var index2 = data[i].length-(3+results1.length);
			var html;
			if(index2>index){
				html = data[i].substring(index+1,index2);
			}else{
				html = "";
			}

			if(!+"\v1"){
				var eleStr = data[i].match(/<\/?[_a-zA-Z\s='";\d#:-]*>/g).join("");
				element = document.createElement(eleStr);
			}else{
				element = document.createElement(results1);
				/*
					收集元素上含有的属性
				*/

				if(results2){
					var arr = [];
					for(var j=0;j<results2.length;j++){
						var a = results2[j];
						a = a.replace(/['"]/g,"");
						var aArray = a.split("=");
						arr[j] = {attrName:aArray[0],attrValue:aArray[1]};
					}
				
					/*
						遍历收集的属性 一一对新创建的 _dom 赋值
					*/

					for(var k=0;k<arr.length;k++){
						var name = arr[k].attrName;
						var val = arr[k].attrValue;
						element.setAttribute(name,val);
					}

				}
			}
			if(element.tagName=="IFRAME"){
				return element;
			}
			element.innerHTML = html;

			frag.appendChild(element);
		}
		if(frag.childNodes.length<2){
			return element;
		}
		return frag;
	},
	setStyle:function(dom,prop){
		var name;
		for( var s in prop){
			name = s.replace(/-\w/,function(m){return m.toUpperCase();});
			name = name.replace("-","");
	

			
			if(name=="opacity"){
				if(dom.style.filter){
					dom.style.filter ="alpha(opacity="+prop[s]*100+")";
				}
			}else{
				if(name=="float"){
					name = !dom.all ? "cssFloat" : "styleFloat";
				}

				dom.style[name] = prop[s];
			}

			 
		}

	},
	/*
		用于选择器，next parent 等
	*/
	dir: function(ele,selector,dir,object ) {
		var dom = [];
		var fun = function(elem,dir,arr){
			if(elem[dir]){
				if(DMIMI.cpu.validateSelector(elem[dir],object)){
					dom.push(elem[dir]);
				}else{
					return fun(elem[dir],dir,arr);
				}
			}else{
				return false;
			}
		};
		DMIMI.each(ele,function(dom){

			fun(dom,dir,object);
		});

		return dom;
	},

	/*
		用于append prepend
	*/
	oFragment:document.createDocumentFragment(),
	pend:function(dom,pend,data){
		var fun,temp,bool,obj1,obj2,type;

		if(!data){
			return false;
		}

		if(typeof data=="string"|| typeof data=="number"){
			bool = new RegExp(/^</).test(DMIMI.trim(String(data)));
			var frag = document.createDocumentFragment();
			
			fun = function(obj,type,child,type2){
				if(bool){
					temp = DMIMI.cpu.createElement(data);
					frag.appendChild(temp);
				}else{
					temp = document.createTextNode(data);
					frag.appendChild(temp);
				}
				switch(type2){
					case "append":
						obj.appendChild(frag);
					break;
					case "prepend":
						obj.insertBefore(frag,obj.firstChild);
					break;
					case "after":
						obj[type](temp,child);
					break;
					case "before":
						obj[type](temp,child);
					break;
				}
			};
		}else{
			if(data.Dmimi){
				fun = function(dom,type,child){ 
					for(var j=0;data[0][j];j++){

						if(data[0][j]){
							dom[type](data[0][j],child);
						}
					}
				};
			}else{
				fun = function(dom,type,child){ 
					dom[type](data,child);
				};
			}
		}
		
		for(var i=0;dom[i];i++){
			switch(pend){
				case "append":
					obj1 = dom[i];
					obj2 = dom[i].firstChild;
					type = "appendChild";
				break;
				case "prepend":
					obj1 = dom[i];
					obj2 = dom[i].firstChild;
					type = "insertBefore";
				break;
				case "before":
					obj1 = dom[i].parentNode;
					obj2 = dom[i];
					type = "insertBefore";
				break;
				case "after":
					obj1 = dom[i].parentNode;
					obj2 = dom[i].nextSibling;
					type = "insertBefore";
				break;
			}
			fun(obj1,type,obj2,pend);
		}
	},

	nth: function( elem, selector, dir ) {
		var num = 0;
		for ( ; elem; elem = elem[dir] ) {
			if ( elem.nodeType === 1 ) {
				break;
			}
		}
		return elem;
	},
	/*
		这个或者兄弟节点采用递归方式，直到返回正确节点或者没有了。
	*/
	nsibling:function(dom,dir,domTemp){
		var fun = function(node){
			if(node.nodeType===1){
				return node;
			}
			if(node[dir]){
				return fun(node[dir]);
			}
			return null;
		};
		if(dom[dir]){
			var _dom = fun(dom[dir]);
			if(_dom){
				domTemp.push(_dom);
			}
		}
		return domTemp;
	},

	/*
		这里遍历兄弟节点判断nodeType返回元素，而不是空格换行等
	*/
	sibling: function(dir, n, elem ,domTemp) {
		var r = [];

		for ( ; n; n = n[dir] ) {
			if ( n.nodeType === 1 && n !== elem ) {

				if(domTemp){
					domTemp.push(n);
				}
				r.push( n );
			}
		}
		return r;
	},

	objlen:function(obj){
		var num = 0;
		for(var i in obj){
			num++;
		}
		return num;
	},
	/*
		获取currentStyle 兼容处理
	*/
	currentStyle:function(dom,name){
		if(dom.currentStyle){
			name = name.replace(/-\w/,function(m){return m.toUpperCase();});
			name = name.replace("-","");
			return dom.currentStyle[name];
		}else{
			return window.getComputedStyle(dom).getPropertyValue(name);
		}
	},
	jsonToParam:function(json){
		var arr = [];
		for(var i in json){
			arr.push(i+"="+json[i]);
		}
		arr = arr.join("&");
		return arr;
	},
	isEmpty:function(obj){
	    for (var name in obj){
	        return false;
	    }
	    return true;
	}
};/*
	工具类，

*/

DMIMI.tool = {
	w:function(){
		if(document.all){
			return document.documentElement.clientWidth;
		}else{
			return window.innerWidth;
		}
	},
	h:function(){
		if(document.all){
			return document.documentElement.clientHeight;
		}else{
			return window.innerHeight;
		}
	},
	size:function(){
		var ele = this;
		if(ele){
			return ele[0].length;
		}else{
			return 0;
		}
	},
	html:function(data){
		var ele = this;
		if(typeof data=="string"){
			DMIMI.each(ele,function(dom){
				if(document.all&&dom.tagName == "table"){
					var temp = dom.ownerDocument.createElement('div');
					temp.innerHTML = '<table><tbody>' + data + '</tbody></table>';
					dom.parentNode.replaceChild(temp.firstChild.firstChild, dom.parentNode.tBodies[0]);
				}else{
					dom.innerHTML = data;
				}
			});
			return ele;
		}

		if(typeof data=="boolean"){
			var temp = $("<div></div>");
			temp.append(ele);
			return ele.html();
		}
		if(typeof data=="undefined"){
			var arr=[];
			DMIMI.each(ele,function(dom){
				arr.push(dom.innerHTML);
			});
			if(arr.length==1){
				return arr.join("");
			}else{
				return arr;
			}
		}
	},
	text:function(data){
		var ele = this;
		if(data){
			DMIMI.each(ele,function(){
				if(typeof this.textContent=='string'){
					this.textContent = data;
				}else{
					this.innerText = data;
				}
			});
			return ele;
		}else{
			var ret = "";
			DMIMI.each(ele,function(){
				if(typeof this.textContent=='string'){
					ret+=this.textContent;
				}else{
					ret+=this.innerText;
				}
			});
			return ret;
		}

	},
	val:function(data){
		var ele = this;
		var arr = [];
		DMIMI.each(ele,function(dom){
			if(data){
				dom.value = data;
			}else{
				arr.push(dom.value);
			}
		});
		return arr.join("");
	},
	attr:function(name,value){
		var ele = this;
		if(value||value==0){
			DMIMI.each(ele,function(dom){
				dom.setAttribute(name,value);
			});
			return ele;
		}else{
			var arr=[],tmp;
			DMIMI.each(ele,function(dom){
				tmp = dom.getAttribute(name);
				if(name=="class"&&document.all){
					tmp = dom.className;
				}
				arr.push(tmp);
			});
			if(arr.length==1){
				return arr[0];
			}else{
				return arr;
			}
		}


	},
	hasClass:function(selector,className){
		if(typeof className=="undefined"){
			var ele = this;
			className = ele.attr("class");
		}
		var pattern = new RegExp("(^|\\s)"+selector+"(\\s|$)");
        return pattern.test(className);
    },
	/*
		文档空间
	*/
	position:function(){
		var ele = this;
		return {
			left:ele[0][0].getBoundingClientRect().left,
			top:ele[0][0].getBoundingClientRect().top
		}
	},
	offset:function(style){
		var ele = this;
		style = style.replace(/^\w/,function(m){return m.toUpperCase();});
		var name = "offset"+style;
		return ele[0][0][name];
	},
	offsetTop:function(data,parent){
		var ele = this;
		var offsetTop = ele[0][0].offsetTop;
		var pTop;

		$.each(ele.parent(),function(){
			if($(this).css("position")=="replative"||$(this).css("position")=="fixed"){
				pTop = $(this).offsetTop();

				offsetTop +=pTop;
			}
		});
		return offsetTop;
	},

	offsetLeft:function(){
		var ele = this;
		var offsetLeft = ele[0][0].offsetLeft;
		var pLeft;
		$.each(ele.parent(),function(){
			if($(this).css("position")=="replative"||$(this).css("position")=="fixed"){
				pLeft = $(this).offsetLeft();

				offsetLeft +=pLeft;
			}
		});
		return offsetLeft;
	},
	scroll:function(){

	},
	scrollTop:function(){
		var ele = this;
		var scrollPos;
		if (typeof window.pageYOffset != 'undefined') {
			scrollPos = window.pageYOffset; 				//Netscape
		}else if (typeof document.compatMode != 'undefined' &&
			document.compatMode != 'BackCompat') {
			scrollPos = document.documentElement.scrollTop; //Firefox、Chrome
		}else if (typeof document.body != 'undefined') {
			scrollPos = document.body.scrollTop; 			//IE
		}
		return scrollPos;
	},
	width:function(data){
		var ele = this;
		if(data){
			DMIMI.each(ele,function(dom){
				dom.style.width = data+"px";
			});
			return ele;
		}else{
			if(document.all){
				return parseInt(ele[0][0].offsetWidth);
			}else{
				var style=ele[0][0].ownerDocument.defaultView.getComputedStyle(ele[0][0], null);
				return parseInt(style["width"]);
			}
		}
		
	},
	height:function(data){
		var arr = [];
		var ele = this;
		if(ele[0][0]==window){
			return window.innerHeight;
		}
		DMIMI.each(ele,function(dom){
			if(data){
				dom.style.height = data+"px";
			}else{
				arr.push(dom.offsetHeight||dom.style.height.replace("px",""));
			}
		});
		if(arr.length==1){
			return arr[0];
		}
	},
	left:function(data){
		var arr = [];
		var ele = this;
		DMIMI.each(ele,function(dom){
			if(data){
				dom.style.left = data+"px";
			}else{
				arr.push(dom.style.left);
			}
		});
	},
	
	hide:function(speed,callback){
		var ele = this;
		if(speed){
			// 缓慢隐藏
			ele.animate({opacity:0}, speed, callback||function(){});
		}else{
			DMIMI.each(ele,function(dom,index){
				var olddisplay = this.style.display;
				this.setAttribute("olddisplay",olddisplay);
				this.style.display = "none";
			});
		}
		return ele;
	},
	show:function(speed,callback){
		var ele = this;
		var olddisplay;
		if(ele&&ele[0]&&ele.css("display")!="none"&&ele.css("opacity")!=0){
			return false;
		}
		if(speed){
			// 缓慢显示
			olddisplay = ele.attr("olddisplay")||"";
			if(olddisplay=="none"){
				olddisplay ="";
			}
			ele.css({
				display:olddisplay,
				opacity:0
			});
			ele.animate({opacity:1}, speed, callback||function(){});
		}else{
			DMIMI.each(ele,function(dom){

				$(dom).css({
					display:"block",
					opacity:1
				});
			});
		}
		return ele;
	},
	/*
		文档操作
	*/
	append:function(data){
		DMIMI.cpu.pend(this[0],"append",data);
		return this;
	},
	prepend:function(data){
		DMIMI.cpu.pend(this[0],"prepend",data);
		return this;
	},
	before:function(data){
		DMIMI.cpu.pend(this[0],"before",data);
		return this;
	},
	after:function(data){
		DMIMI.cpu.pend(this[0],"after",data);
		return this;
	},
	addClass:function(data){
		var ele = this;
		var _class;
		DMIMI.each(ele,function(dom){
			_class = dom.className;
			if(_class.indexOf(data)!=-1){return;}
			_class+=" "+data;
			dom.className = _class;
		});
		return ele;
	},
	removeClass:function(data){
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.className = DMIMI.trim(dom.className.replace(data,""));
		});
		return ele;
	},
	removeAttr:function(data){
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.removeAttribute(data);
		});
		return ele;
	},
	remove:function(){
		var ele = this;
		var div = $("<div></div>");

		DMIMI.each(ele,function(dom){
			if(dom&&dom.parentNode){
				dom.parentNode.removeChild(dom);
			}
		});
		delete ele;

	},
	clone:function(){
		var ele = this;
		var newEle = ele[0][0].cloneNode(true);
		return newEle;
	},
	eq: function( i ) {
		var ele = this;
	
		return i === -1 ?
			DMIMI.classArray([ele[0][ele[0].length-1]]) :
			DMIMI.classArray([ele[0][i]]);
	},

	first: function() {
		var ele = this;
		
		return ele.eq( 0 );
	},

	last: function() {
		var ele = this;
		if(ele){
			return DMIMI.classArray(ele[0]).eq( -1 );
		}
	},
	inArray:function(a,arr){
		for(var i = 0;i<arr.length;i++){
			if(arr[i]==a){
				return i;
			}
		}
		return -1;
	},
	/*
		匹配前后空格，去除
	*/
	trim:function(data){
		data = data.replace(/^\s*|\s*$/g,"");
		return data;
	},
	trimAll:function(data){
		return data.replace(/\s*/g,"");
	},
	/*
		forIn 无堵塞循环遍历，用于处理大数据量
	*/
	forIn:function(obj,call1,call2){
		var len = obj.length;
		var i = 0;
		var fn = function(){
			if(i<len){
				call1(i,obj[i]);
				i++;
				setTimeout(function(){
					fn();
				});
			}else{
				call2();
			}
		};
		fn();
	},
	/*
		each 遍历
	*/
	
	each:function(obj,callback){
		/*
			分段遍历策略
		*/
		if(!obj){
			return;
		}
		var len = obj[0].length,i;
		if(len<=6){
			/*
				普通方式
			*/
			for (i=0; i < len; i++) {
				if ( callback.apply( obj[0][i],[obj[0][i],i]) === false ) {
					break;
				}
			}
		}else{
			var fn = function(s){
				callback.apply( obj[0][s],[obj[0][s],s]);
				callback.apply( obj[0][s+1],[obj[0][s+1],s+1]);
				callback.apply( obj[0][s+2],[obj[0][s+2],s+2]);
				callback.apply( obj[0][s+3],[obj[0][s+3],s+3]);
				callback.apply( obj[0][s+4],[obj[0][s+4],s+4]);
				callback.apply( obj[0][s+5],[obj[0][s+5],s+5]);
			};
			var remainder = len % 6;
			var section = Math.floor( len / 6);
			if(section){
				i = 0;
				while(i<section){
					fn(i*6);i++;
				}
			}
			if(remainder){
				i = len-remainder;;
				while(i<len){
					callback.apply( obj[0][i],[obj[0][i],i]);i++;
				}
			}
		}
	},

	/*
		css
	*/
	css:function(obj){
		var ele = this;
		var name,arr;

		if(obj&&typeof obj =="string"){
			if(document.all){
				return ele[0][0].currentStyle[obj];
			}else{
				name = obj.replace(/-\w/,function(m){return m.toUpperCase();});
				name = name.replace("-",""); 
				return ele[0][0].style[name];
			}
		}else if(obj){
			DMIMI.each(ele,function(dom){
				DMIMI.cpu.setStyle(dom,obj);
			});
		}else{

			if(document.all){
				return ele[0][0].currentStyle;
			}else{
				var style=ele[0][0].ownerDocument.defaultView.getComputedStyle(ele[0][0], null);
				return style;
			}
		}
		return ele;
	},
	/*
		停止当前对象所有动画
	*/
	stop:function(){
		var ele = this;
		if(ele.attr("animate")){
			var key = ele.attr("animate").split(",");
			for(var i=0;i<key.length;i++){
				clearInterval(key[i]);
			}
		}
	},
	templete:function(obj,opt){
		var str,
			fun = function(str){
				var arr = str.match(/{\w*}/);
				for(var i=0;arr[i];i++){
					str = str.replace(arr[i],opt[arr[i].replace(/[{}]/g,"")]);
				}
				return str;
			};
		if(typeof obj == "string"){
			str = obj;
			return fun(str);
		}else{
			$.each(obj,function(){
				str = String(this.innerHTML);
				this.innerHTML = fun(str);
			});
			return obj;
		}
	},
	//$.templete($(".first"),{name:"abc"});
	/*
		是否存在这个dom
	*/
	alive:function(){
		var ele = this;
		if(ele&&ele.parent().size()>0){
			return true;
		}else{
			return false;
		}
	},

	/*
		广度搜索法
		@param v：广度
		@param array: 返回基于原点0,0的广度坐标
	*/
	breadthSearch:function(v) {
		var arr = [];
		var array = [];
		arr.push(0);

		/*	
			此函数用于实现x-2,x-1,x,x+1,x+2;
		*/
		var fn = function(i) {
			arr.push(-i);
			arr.push(i);
			i--;
			if (parseInt(i) > 0) {
				fn(i);
			}
		};
		fn(v);
		for (var x = 0; x < arr.length; x++) {
			for (var y = 0; y < arr.length; y++) {
				if (
						(arr[x] == 0 && (arr[y] == -v || arr[y] == v)) 
						|| 
						(arr[x] == v && arr[y] <= v) || (arr[x] == -v && arr[y] <= v)
						|| 
						(arr[y] == 0 && (arr[x] == -v || arr[x] == v))
						||
						(arr[y] == v && arr[x] <= v)
						||
						(arr[y] == -v && arr[x] <= v)
				){
					array.push([arr[x], arr[y]]);
				}
			}
		}
		return array;
	},
	/*
		.animate({height:100,width:400,left:400},200,function(){
		
		默认 小到大、透明到显示 存在easing 相反
	*/

	animate:function(prop, speed, callback ,frameCallback){

		var ele = this;
		var len = DMIMI.cpu.objlen(prop);
		var speed = speed||400;
		var t = 0,bl,py;
		var animateKeyArray = [];
		
		var fun = function(v1,v2,s,d,name,num,cl){

			var abs = Math.abs(v2-v1); // 偏移量
			var tmp = v1;
			var n = s/10; // 得到次数
			var date1 = new Date(),date2;
			var key = setInterval(function(){
				date2 = new Date();
				t = date2-date1;
				bl = t/speed;
				py =abs*bl;

				if(v2<v1){
					py = v1-py;

				}else{
					py = v1+py;

				}
				if(t>=speed){
					stopFun(key,len,num,d,callback);
					py = v2;
				}

				cl(py,name);
				if(frameCallback){
					frameCallback();
				}
			},10);
			return key;
		};
		var stopFun = function(key,len,num,d,callback){
			clearInterval(key);
			if(len==num){
				if(callback){
					callback(d);
				}
				ele.removeAttr("animate");
			}
		};

		DMIMI.each(ele,function(dom){
			var num=0;
			if($(dom).attr("animate")){
				animateKeyArray = $(dom).attr("animate").split(",");
				for(var i=0;i<animateKeyArray.length;i++){
					clearInterval(animateKeyArray[i]);
				}
			}
			for(var i in prop){
				num++;

				if(i=="opacity"){
					var opacityValue,name,value;
					if(dom.filters){
						opacityValue = dom.style.filter||100;
						opacityValue = opacityValue.replace(/[a-z()=]/g,"");
						value = parseInt(prop[i])*100;
					}else{
						opacityValue = dom.style.opacity||1;
						value = parseInt(prop[i]);
					}
					fun(parseInt(opacityValue),value,parseInt(speed),dom,i,num,function(tmp){	
						if(dom.filters){
							dom.style.filter ="alpha(opacity="+tmp+")";
						}else{
							dom.style.opacity=tmp;
						}
					});
				}else if(i=="background"){
					animateKeyArray.push(fun(parseInt($(dom).css(i))||parseInt($(dom).css(i))||0,parseInt(prop[i]),parseInt(speed),dom,i,num,function(tmp,name){
						var temp = {};
						temp[i] = "#"+tmp;
						$(dom).css(temp);
					}));
				}
				else{

					animateKeyArray.push(fun(parseInt($(dom).css(i))||parseInt($(dom).css(i))||0,parseInt(prop[i]),parseInt(speed),dom,i,num,function(tmp,name){

						var temp = {};
						temp[name] = tmp+"px";
						$(dom).css(temp);
					}));
					
				}
			}
			$(dom).attr("animate",animateKeyArray.join(","));
		});
		return ele;
	},
	not:function(selector){
		var ele = this;
		var object = DMIMI.cpu._test("attr",selector);
		var num = [];

		DMIMI.each(ele,function(dom,index){

			if(DMIMI.cpu.validateSelector(this,object)){

				num.push(index);
			}
		});
		for(var i=0;i<num.length;i++){
			ele[0].splice(num[i],1);
		}
		return ele;
	},
	/*
		开始监听
	*/
	lisen:function(){
		var ele = this;
	},
	selectText:function(element) {
		var text = document.getElementById(element);
		if (document.all) {
			var range = document.body.createTextRange();
			range.moveToElementText(text);
			range.select();

		}else{
			var selection = window.getSelection();
			var range = document.createRange();
			range.selectNodeContents(text);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	},
	rcolor:function(){
		return Math.ceil(Math.random()*16777215).toString(16);
	},
	ieErrorOut:function(msg){
		if(document.all){
			if($("#ieErrorTextArea").size()==0){
				var textarea = "<textarea id='ieErrorTextArea' style='position:absolute;right:0px;top:0px;z-index:1001'></textarea>";
				$("body").after(textarea);
			}else{
				var val = $("#ieErrorTextArea").val();
				val+=msg+"<br/>";
				$("#ieErrorTextArea").val(val);
			}
		}
	},
	/*	
		options
			@param number	循环次数 默认无穷
			@param condition 条件false 停止
			@param callback 每一次调用
			@param time 间隔

	*/
	timer:function(callback,time,condition,number){
		number = number||"all";
		time = time||400;
		var bool = true;
		var innerFn = function(){
			var key = setTimeout(function(){
				if(number=="all"){
					bool = true;
				}else{
					number--;
					if(number<=0){
						bool=false;
					}
				}
				callback();
				if(bool&&condition){
					innerFn();
				}else{
					clearTimeout(key);
				}
			},time);
		};
		innerFn();
	},
	toggleClass:function(data){
		var ele = this;
		if(ele.hasClass(data)){
			ele.removeClass(data);
		}else{
			ele.addClass(data);
		}
	},
	include:function(data,callback){
		if(typeof data=="string"){
			data = [data];
		}

		var len = data.length;
		var n = 0;
		var dataType;
		var time = +new Date();
		for(var i=0;i<len;i++){
			if($.includeHistory[data[i]]){
				n++;
				continue;
			}
			if(data[i].indexOf(".js")!=-1){
				dataType = "javascript";
			}
			if(data[i].indexOf(".css")!=-1){
				dataType = "css";
				var link = document.createElement("link");
				link.href = data[i]+"?"+"time="+time;
				link.rel = "stylesheet";
				link.type = 'text/css';
				document.head.appendChild(link);
				var linkKey = setInterval(function(){
					try{
						link.sheet.cssRules
						clearInterval(linkKey);
						n++;
					}catch(e){};
				},20);
			}else{
				$.ajax({
					url:data[i]+"?"+"time="+time,
					dataType:dataType,
					success:function(){
						n++;
					}
				});
			}
			$.includeHistory[data[i]] = true;
		}
		var date = new Date();
		var key = setInterval(function(){
			if(n>=len){
				clearInterval(key);
				callback();
			}else{
				if(new Date-date>200){
					clearInterval(key);
					console.log("timeout");
				}
			}
		},20);
	},
	includeHistory:{},
	/*
		用于判断所有空
	*/
	is:function(obj){
		for( var i in obj){
			if(!i){
				return false;
			}else{
				return true;
			}
		}
	},
	parseJSON:function(data){
		if ( !data || typeof data !== "string") {
			return null;
		}
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}
		return ( new Function( "return " + data ) )();
	},
	stringify:function(obj) {
		if(window.JSON&&window.JSON.stringify){
			return JSON.stringify(obj);
		}
        switch(typeof(obj)){   
            case 'string':   
                return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';   
            case 'array':   
                return '[' + obj.map($.stringify).join(',') + ']';   
            case 'object':   
                 if(obj instanceof Array){   
                    var strArr = [];   
                    var len = obj.length;   
                    for(var i=0; i<len; i++){   
                        strArr.push($.stringify(obj[i]));   
                    }   
                    return '[' + strArr.join(',') + ']';   
                }else if(obj==null){   
                    return 'null';   
  
                }else{
                    var string = [];   
                    for (var property in obj) string.push($.stringify(property) + ':' + $.stringify(obj[property]));   
                    return '{' + string.join(',') + '}';   
                }   
            case 'number':   
                return obj;   
            case false:   
                return obj;   
        }   
    },
	/*
		dom ready 实现研究

		综合执行顺序为：
	    oncontentready，DOM树完成
	    script defer，外链script完成
	    ondocumentready complete，这时可以使用HTC组件与XHR
	    html.doScroll  HTML元素使用doScroll方法 例如textarea 或者设置了scroll 属性的元素
	    window.onload  图片、flash等资源都加载完毕
	*/
	ready:function(callback){

		var dom = [];
		dom.isReady = false;
		dom.isFunction = function(obj){
			return Object.prototype.toString.call(obj) === "[object Function]";
		};
		dom.ready = function(fn){
			dom.initReady();//如果没有建成DOM树，则走第二步
			if(dom.isFunction(fn)){
				if(dom.isReady){
					fn();//如果已经建成DOM
				}else{
					dom.push(fn);//存储加载事件
				}
			}
		};
		dom.fireReady =function(){
			if (dom.isReady){
				return;
			}
			dom.isReady = true;
			for(var i=0,n=dom.length;i<n;i++){
				var fn = dom[i];
				fn();
			}
			dom.length = 0;//清空事件
		};
		dom.initReady = function(){

			if (document.addEventListener) {
				document.addEventListener( "DOMContentLoaded", function(){
					document.removeEventListener( "DOMContentLoaded", arguments.callee, false );//清除加载函数
					dom.fireReady();
				}, false );
			}else{
				document.write("<script id='ie-domReady' defer='defer' src='//:'></script>");

				document.getElementById("ie-domReady").onreadystatechange = function() {
					if (this.readyState === "complete") {
						dom.fireReady();
						this.onreadystatechange = null;
						this.parentNode.removeChild(this);
					}
				};
			}
		};
		dom.ready(callback);
	}
};


/*
	这里的event模块理解为用户动作，包括鼠标事件 键盘事件 和一系列基于基本事件的衍生事件，比如拖拉
*/
DMIMI.event = {
	/*
		绑定事件监听
	*/
	on:function(type,callback){
		var ele = this;
		callback = callback||function(){};
		DMIMI.each(ele,function(){
			if(DMIMI.cpu.brower("ie")){
				if(type=="mouseover"){
					type = "mouseenter";
				}
				if(type=="mouseout"){
					type = "mouseleave";
				}
				
				this.attachEvent("on"+type,function(){
					callback.apply(this);
				}); // 已解决ie6 得不到this 问题
			}else{
				
				this.addEventListener(type,callback);
			}
		});
	},
	/*
		移除事件监听
	*/
	off:function(type,callback){
		var ele = this;
		callback = callback||function(){};
		DMIMI.each(ele,function(dom){
			if(DMIMI.cpu.brower("ie")){
				dom.detachEvent("on"+type,callback);
			}else{
				dom.removeEventListener(type,callback);
			}
		});
		return ele;
	},
	/*
		$("div").delegate("li","click",function(){})

	*/
	delegate:function(selector,type,callback){

		var ele = this;

		ele.on(type,function(e){
			e = e||window.event;
			var dom = DMIMI._selector(selector,ele[0][0]);
			
			var target = e.target||e.srcElement;
			$.each(dom,function(){
				if(target==this){
					callback.apply(this);
					return;
				}
			})
			/*
			var object = DMIMI.cpu._test("attr",selector);

			
			var bool;
			if(object.tagName){
				if(e.target.tagName==object.tagName){
					bool = true;
				}
			}
			if(object.arr){
				var arr = object.arr;
				var thisDomBool = false;
				for(var j=0;j<arr.length;j++){
					thisDomBool = DMIMI.cpu.validateSelector(thisDom,{
						attrName:arr[j].attrName,
						attrValue:arr[j].attrValue
					});
					if(!thisDomBool){
						break;
					}
				}

			}
			*/
			
		});
	},
	focus:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			if(callback){
				dom.onfocus = callback;
			}else{
				dom.focus();
			}
		});
		return ele;
	},
	blur:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			if(callback){
				dom.onblur = callback;
			}else{
				dom.blur();
			}
		});
		return ele;
	},
	click:function(callback){
		var ele = this;

		DMIMI.each(ele,function(dom){
			
			if(callback==null){
				dom.onclick = null;
				return;
			}
			if(callback){
				dom.onclick = callback;
			}else{
				dom.onclick();	
			}
		});
		return ele;
	},
	mouseover:function(callback){
		
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.onmouseenter = callback;
		});
		return ele;
	},
	mouseout:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.onmouseleave = callback;
		});
		return ele;
	},
	mousedown:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.onmousedown = callback;
		});
		return ele;
	},
	mousemove:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.onmousemove = callback||function(){};
		});
		return ele;
	},
	mouseup:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			if(callback){
				dom.onmouseup = callback||function(){};
			}
		});
		return ele;
	},
	drag:function(downCallback,moveCallback,upCallback){
		var ele = this;
		if(!ele[0][0]){
			return;
		}
		var downCallback = downCallback || function(){};
		var moveCallback = moveCallback || function(){};
		var upCallback = upCallback || function(){};
		var _x,_y,body = $("body")[0][0];
		var fnX = function(e){
			thisX = e.clientX + (body && body.scrollLeft || 0)  - (body && body.clientLeft || 0);
			return thisX ;
		};
		var fnY = function(e){
			thisY = e.clientY + $(window).scrollTop() - (body.clientTop  || 0);
			return thisY ;
		};
		DMIMI.each(ele,function(dom){
			dom.downCallback = downCallback;
			dom.moveCallback = moveCallback;
			dom.upCallback = upCallback;

			$(dom).css({cursor:"move"});
			$(dom).mousedown(function(e){
				e = e||event;
				_x = e.x ? fnX(e) : e.pageX;
				_y = e.y ? fnY(e) : e.pageY;
				$("body").attr("style","-moz-user-select:none");
				dom.downCallback(e,_x,_y);
				$(document).mousemove(function(e){
					e = e||event;
					_x = e.pageX || fnX(e)||0;
					_y = e.pageY || fnY(e) ||0;
					window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
					dom.moveCallback(e,_x,_y);
	            });
	            $(document).mouseup(function(e){
	            	e = e||event;
	            	_x = ( e.x ? fnX(e) : e.pageX )||0;
					_y = ( e.y ? fnY(e) : e.pageY )||0;
					$(document).off("mousemove",$(document).mousemove());
					$(document).off("mouseup",$(document).mouseup());
					//$(document).off("mousedown",$(document).mousedown());
					$(document).mouseup(function(){});
					$("body").removeAttr("style");
					dom.upCallback(e,_x,_y);
				});
			});
		});
		return ele;
	},
	undrag:function(){
		var ele = this;
		ele.mousedown(function(){});
		ele.mouseup(function(){});
		ele.css({cursor:"default"});
		return ele;
	},
	resize:function(callback){
		if(document.all){
			setTimeout(function(){
				window.onresize = callback;
			},100);
		}else{
			window.onresize = callback;
		}
	},
	scroll:function(callback){
		var ele = this;
		ele[0][0].onscroll = callback;
		return ele;
	},
	wheel:function(callback){
		var ele = this;
		var obj = ele[0][0];
		var wheelFun = function (event){
			var ev = event || window.event;
			var delta = ev.wheelDelta ? (ev.wheelDelta / 120) : (- ev.detail / 3); 
			callback.apply(obj,[delta]);
			ev.returnValue = false;
			if(!!-[1,]){//ie
				ev.preventDefault();
			}
		};
		// different events between Firefox and IE	
		window.addEventListener ? 
			obj.addEventListener("DOMMouseScroll", wheelFun, false) : (obj.onmousewheel = wheelFun);
		return ele;
	},
	keyDown:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.onkeydown = function(e){
				var e = e||window.event;     
				var key = e.charCode||e.keyCode;
				callback(key)
			};
		});
		return ele;
	},
	keyUp:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.onkeyup = function(e){
				var e = e||window.event;     
				var key = e.charCode||e.keyCode;
				callback(key);
			};
		});
		return ele;
	},


	keyboard:function(downcallback,upCallback){
		var ele = this;
		var keyboardObject = {};
		var keyDownFn = function(e){
			var e = e||window.event;     
			var code = e.charCode||e.keyCode;
			if(keyboardObject[code]){
				return false;
			}
			keyboardObject[code]=setInterval(function(){
				downcallback.apply(ele[0][0],[keyboardObject]);
			},10);
		};
		var keyUpFn = function(e){
			var e = e||window.event;     
			var code = e.charCode||e.keyCode;
			clearInterval(keyboardObject[code]);
			delete keyboardObject[code];
			upCallback.apply(ele[0][0],[keyboardObject]);
		};
		
		

		$(document).on("keydown",keyDownFn);
		$(document).on("keyup",keyUpFn);
		return ele;
	},

	trigger:function(event,param){
		var ele = this;
		var element = ele[0][0];

		if (document.createEventObject){
			// dispatch for IE
			var evt = document.createEventObject();
			return element.fireEvent('on'+event,evt);
		}
		else{
			// dispatch for firefox + others
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent(event, true, true ); // event type,bubbling,cancelable
			for(var i in param){
				evt[i] = param[i];
			}
			return !element.dispatchEvent(evt);
		}
   },
	/*
		

		
	*/
	change:function(callback){
		var ele = this;
		DMIMI.each(ele,function(dom){
			dom.onchange = callback||function(){};
		});
		return ele;
	}
};


/*
	为了解决IE scrollTop 初始取值为0的bug

scrollTop = 0;
var defaultscrollfn = function(){
	scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
};
DMIMI(window).on("scroll",defaultscrollfn);

*/
/*
	节点操作
*/

DMIMI.selector = {
	find:function(selector){
		var ele = this;
		var domTemp = [];

		if(selector){
			var object = DMIMI.cpu._test("attr",selector);
			DMIMI.each(ele,function(dom){
				domTemp = DMIMI._selector(selector,dom,"find");
			});

			return domTemp;
		}else{
			return null;
		}
		
	},
	parent: function( selector ) {
		var ele = this;
		var domTemp = [];
		if(selector){
			var object = DMIMI.cpu._test("attr",selector);
			domTemp = DMIMI.cpu.dir(ele,selector,"parentNode",object);
			return DMIMI.classArray(domTemp);
		}else{
			DMIMI.each(ele,function(dom){
				if(dom.parentNode){
					domTemp.push(dom.parentNode);
				}
			});
			return DMIMI.classArray(domTemp);
		}
		//var parent = selector.parentNode;
		//return parent && parent.nodeType !== 11 ? parent : null;
	},
	next: function( selector ) {
		var ele = this;
		var domTemp = [];
		if(selector){
			var object = DMIMI.cpu._test("attr",selector);

			domTemp = DMIMI.cpu.dir(selector,"nextSibling",object);
			
		}else{
			DMIMI.each(ele,function(dom){
				DMIMI.cpu.nsibling(dom,"nextSibling",domTemp);
			});
		}

		DMIMI_ELE[0] = domTemp;
		return DMIMI_ELE;

		//return DMIMI.cpu.nth( DMIMI_ELE[0][0], selector, "nextSibling" );
	},
	prev: function( selector ) {
		var ele = this;
		var domTemp = [];
		if(selector){
			var object = DMIMI.cpu._test("attr",selector);
			domTemp = DMIMI.cpu.dir(selector,"previousSibling",object);
			return DMIMI.classArray(domTemp);
		}else{
			DMIMI.each(ele,function(dom){
				DMIMI.cpu.nsibling(dom,"previousSibling",domTemp);
			});
			return DMIMI.classArray(domTemp);
		}

		//return DMIMI.cpu.nth( selector, 2, "previousSibling" );
	},
	nextAll: function( selector ) {
		var ele = this;
		var domTemp = [];
		if(selector){
			var object = DMIMI.cpu._test("attr",selector);
			
			DMIMI.each(ele,function(dom){
				var _dom = [];
				DMIMI.cpu.sibling("nextSibling",dom,dom,_dom);
				for(var j=0;j<_dom.length;j++){
					if(DMIMI.cpu.validateSelector(_dom[j],object)){
						domTemp.push(_dom[j]);
					}
				}
			});
			return DMIMI.classArray(domTemp);
		}else{
			DMIMI.each(ele,function(dom){
				DMIMI.cpu.sibling("nextSibling",dom,dom,domTemp);
			});
			return DMIMI.classArray(domTemp);
		}
		//return DMIMI.cpu.dir( selector, "nextSibling" );
	},
	prevAll: function( selector ) {
		var ele = this;
		var domTemp = [];
		if(selector){
			var object = DMIMI.cpu._test("attr",selector);
			
			DMIMI.each(ele,function(dom){
				var _dom = [];
				DMIMI.cpu.sibling(dom,dom,_dom);
				for(var j=0;j<_dom.length;j++){
					if(DMIMI.cpu.validateSelector(_dom[j],object)){
						domTemp.push(_dom[j]);
					}
				}
			});
			return DMIMI.classArray(domTemp);
		}else{
			DMIMI.each(ele,function(dom){
				DMIMI.cpu.sibling("previousSibling",dom,dom,domTemp);
			});
			return DMIMI.classArray(domTemp);
		}
		//return DMIMI.cpu.dir( selector, "previousSibling" );
	},
	siblings: function( selector ) {
		var ele = this;
		var domTemp = [];
		if(selector){
			var object = DMIMI.cpu._test("attr",selector);

			DMIMI.each(ele,function(dom){
				var _dom = [];
				DMIMI.cpu.sibling("nextSibling",dom.parentNode.firstChild,dom,_dom);
				for(var j=0;j<_dom.length;j++){
					if(DMIMI.cpu.validateSelector(_dom[j],object)){
						domTemp.push(_dom[j]);
					}
				}
			});
			return DMIMI.classArray(domTemp);
		}else{
			DMIMI.each(ele,function(dom){
				DMIMI.cpu.sibling("nextSibling",dom.parentNode.firstChild,dom,domTemp);
			});
			return DMIMI.classArray(domTemp);
		}


		//return DMIMI.cpu.sibling( selector.parentNode.firstChild, selector );
	},
	children: function( selector ) {
		/*
			判断当父节点为空的时候 children 肯定也是空
		*/
		var ele = this;
		/*
			这时候需要对selector进行解析
		*/

		if(selector){
			var object = DMIMI.cpu._test("attr",selector);
			var tempDom = [];

			DMIMI.each(ele,function(dom){
				var b = DMIMI.cpu.sibling("nextSibling",dom.firstChild);

				for(var j=0;j<b.length;j++){
					if(DMIMI.cpu.validateSelector(b[j],object)){
						tempDom.push(b[j]);
					}
				}
			});
			return DMIMI.classArray(tempDom);
		}else{
			var arr = [];
			DMIMI.each(ele,function(){
				 this.childNodes;
				for(var i=0;i<this.childNodes.length;i++){
					if(this.childNodes[i].nodeType===1){
						arr.push(this.childNodes[i]);
					}
				}
			});
			
			return DMIMI.classArray(arr,true);
			 
		}
	},
	contents: function( selector ) {
		return DMIMI.cpu.nodeName( selector, "iframe" ) ?
			selector.contentDocument || selector.contentWindow.document :
			DMIMI.makeArray( selector.childNodes );
	}
};/*
	网络层
*/
DMIMI.net = {
	ajax:function( options ) {
		var opts = {
			async:true,
			type:"POST",
			dataType:"json",
			error:function(state,status,response){
			},
			success:function(){}
		};

		var o = DMIMI.cpu.extend(options,opts);
		
		var xmlhttp;

		/*
			内部回调函数
		*/
		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;
		var scriptArray = [];
		var loadScript = function( url,len,callback) {
			script = document.createElement( "script" );

			script.async = "async";

			script.src = url;
			//alert(len)
			var scriptCallback = function(){
				scriptArray.push(1);
				if(scriptArray.length==len){
					callback&&callback();
				}
			}
			script.onload = script.onreadystatechange = function( _, isAbort ) {
				
				if ( script.readyState&&/loaded|complete/.test(script.readyState)) {
					 //alert(script.readyState)
					scriptCallback();
				}
				if(!document.all){
					scriptCallback();
				}
			}
			
			
			head.insertBefore( script, head.firstChild );
		}

		if (window.XMLHttpRequest){
		// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		}else{
		// code for IE6, IE5
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		

		var loadingId;
		if(o.loading){
			var ele = $.cpu.current(this);
			loadingId = "loadingAjax";
			var loading = '<div id="'+loadingId+'" style="position:absolute;right:10px;top:10px;float:right;background:red;color:#fff;font-size:12px;padding:2px 3px;">loading...</div>';
			ele.append(loading);
		}
		if(o.async){

			xmlhttp.onreadystatechange = function(){

				//o.complete(xmlhttp.readyState,xmlhttp.status,xmlhttp.responseText);
				if (xmlhttp.readyState==4 && xmlhttp.status==200){
					var script;
					var data = xmlhttp.responseText;
					if(o.dataType=="javascript"){
						new Function(data)();
						o.success();
						return;
					}
					if(o.dataType=="css"){
						o.success();
						return;
					}
					if(o.dataType=="json"){
						data = eval("("+data+")");
					}

					o.success(data);
					if(o.dataType=="html"&&data.indexOf("<script")!=-1){
						var str = data;
						var resultUrl = str.match(/<script[\w=\/'"\s]*src[='"\w\/\s.]*>/g);
						var temp,url=[];
						if(resultUrl&&resultUrl.length>0){
							for(var i=0;i<resultUrl.length;i++){
								temp = resultUrl[i].match(/src[='"\w\/\s.]*/).join("");
								temp = temp.replace(/src=/g,"").replace(/["']/g,"");
								url.push(temp);
							}
						}
						str = str.replace(/\s/g," ");
						var resultScript = str.match(/<script>.*<\/script>/);
						result = resultScript[0].match(/>.*</);
						result = result[0].replace(/^>/,"");
						result = result.replace(/<$/,"");
						if(url.length>1){
							for(var i=0;i<url.length;i++){
								loadScript(url[i],url.length,function(){
									new Function(result)();
								});
							}
						}else{
							new Function(result)();
						}
						//xmlhttp.detachEvent("onreadystatechange");
					}

					delete data;
			    }else{
			    	//o.error(xmlhttp.readyState,xmlhttp.status,xmlhttp.responseText);
			    }

			};
		}else{
			if (xmlhttp.readyState==4 && xmlhttp.status==200){
		    	var data = xmlhttp.responseText;
		    	
				if(o.dataType=="json"){

					data = eval("("+data+")");
				}
		    }else{
		    	//o.error(xmlhttp.readyState,xmlhttp.status,xmlhttp.responseText);
		    }
		}
		var param = DMIMI.cpu.jsonToParam(o.data);
		xmlhttp.open(o.type.toUpperCase(),o.url,o.async);

		var accepts = {
			html: "text/html,text/css",
			text: "text/plain",
			json: "application/json, text/javascript"

		};
		xmlhttp.setRequestHeader("Content-Type",accepts[o.dataType]);

		xmlhttp.send(param);
		
		return false;
	}
	
};
var locationWrapper = {
    put: function(hash, win) {
        (win || window).location.hash = this.encoder(hash);
    },
    get: function(win) {
 
        var hash = ((win || window).location.hash).replace(/^#/, '');
        try {

            return $.cpu.brower("ie") ? hash : decodeURIComponent(hash);
        }
        catch (error) {
            return hash;
        }
    },
    encoder: encodeURIComponent
};

var iframeWrapper = {
    id: "Dmimi_history",
    init: function() {

        var html = '<iframe id="'+ this.id +'" style="display:none;width:100px" src="javascript:false;"></iframe>';

        $("body").prepend(html);
        return this;
    },
    _document: function() {
        return $("#"+this.id)[0][0].contentWindow.document;
    },
    put: function(hash) {
        var doc = this._document();
        doc.open();
        doc.close();

        locationWrapper.put(hash, doc);

    },
    get: function() {
        return locationWrapper.get(this._document());
    }
};
/*
function initObjects(options) {
    options = $.cpu.extend({
            unescape: false
        }, options || {});

    locationWrapper.encoder = encoder(options.unescape);

    function encoder(unescape_) {
        if(unescape_ === true) {
            return function(hash){ return hash; };
        }
        if(typeof unescape_ == "string" &&
           (unescape_ = partialDecoder(unescape_.split("")))
           || typeof unescape_ == "function") {
            return function(hash) { return unescape_(encodeURIComponent(hash)); };
        }
        return encodeURIComponent;
    }

    function partialDecoder(chars) {
        var re = new RegExp($.map(chars, encodeURIComponent).join("|"), "ig");
        return function(enc) { return enc.replace(re, decodeURIComponent); };
    }
}
*/
var implementations = {};

implementations.base = {
    callback: undefined,
    type: undefined,
    intervalKey:null,
    check: function() {},
    load:  function(hash) {},
    init:  function(callback, options) {

        if($.cpu.brower("ie")) {
            var current_hash = locationWrapper.get();
            self._appState = current_hash;
            iframeWrapper.init().put(current_hash);
            callback(current_hash);

            intervalKey = setInterval(function() {
                var iframe_hash = iframeWrapper.get(),
                    location_hash = locationWrapper.get();

                if (location_hash != iframe_hash) {
                    if (location_hash == self._appState) {    // user used Back or Forward button

                        self._appState = iframe_hash;
                        locationWrapper.put(iframe_hash);
                        callback(iframe_hash); 
                    } else {                              // user loaded new bookmark

                        self._appState = location_hash;  
                        iframeWrapper.put(location_hash);
                        callback(location_hash);
                    }
                }
            }, 1);
        }else{
            callback(locationWrapper.get());
            var callget = function(){
                callback(locationWrapper.get());
                self._options = options;
            };
            if(self._options == options){
                return;
            }
            $(window).on('hashchange', callget);
        }
        //initObjects(options);
        //self.callback = callback;
        
        //self._init();
    },

    _init: function() {},
    _options: {}
};
/*
implementations.timer = {
    _appState: undefined,
    _init: function() {
        
        var current_hash = locationWrapper.get();
        
        self._appState = current_hash;
        self.callback(current_hash);
        setInterval(self.check, 100);
    },
    check: function() {
        var current_hash = locationWrapper.get();
        if(current_hash != self._appState) {
            self._appState = current_hash;
            self.callback(current_hash);
        }
    },
    load: function(hash) {
        if(hash != self._appState) {
            locationWrapper.put(hash);
            self._appState = hash;
            self.callback(hash);
        }
    }
};
*/
implementations.iframeTimer = {
    _appState: undefined,
    _init: function(callback) {

        var current_hash = locationWrapper.get();
       
        self._appState = current_hash;
        iframeWrapper.init().put(current_hash);

        callback(current_hash);
        setInterval(self.check, 100);
    },
    check: function() {
        var iframe_hash = iframeWrapper.get(),
            location_hash = locationWrapper.get();

        if (location_hash != iframe_hash) {
            if (location_hash == self._appState) {    // user used Back or Forward button
                self._appState = iframe_hash;
                locationWrapper.put(iframe_hash);
                self.callback(iframe_hash); 

            } else {                              // user loaded new bookmark
                self._appState = location_hash;  
                iframeWrapper.put(location_hash);
                self.callback(location_hash);

            }

        }
    },
    load: function(hash) {
        if(hash != self._appState) {
            locationWrapper.put(hash);
            iframeWrapper.put(hash);
            self._appState = hash;
            self.callback(hash);
        }
    }
};

implementations.hashchangeEvent = {
    _init: function() {
        self.callback(locationWrapper.get());
        $(window).bind('hashchange', self.check);
    },
    check: function() {
        self.callback(locationWrapper.get());
    },
    load: function(hash) {
        locationWrapper.put(hash);
    }
};

var self = $.cpu.extend({}, implementations.base);

if($.cpu.brower("ie")) {
    self.type = 'iframeTimer';
} else if("onhashchange" in window) {
    self.type = 'hashchangeEvent';
} else {
    self.type = 'timer';
}

self = $.cpu.extend(self, implementations[self.type]);

$.history = self;
/*
	打包模块
*/

DMIMI.cpu.merge(DMIMI,[
	{
		name:"selector",
		obj:DMIMI.selector
	},
	{
		name:"tool",
		obj:DMIMI.tool
	},
	{
		name:"net",
		obj:DMIMI.net
	},
	{
		name:"event",
		obj:DMIMI.event
	}
]);


define({dmimi: DMIMI});