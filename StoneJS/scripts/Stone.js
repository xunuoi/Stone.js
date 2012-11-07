/*
 * JavaScript Tools
 * Stone version:1.1
 * Michael Scofield 
 * Personal 2012/11/2
 *
 */

// The Stone class constuctor
function Stone(){
  
  this.noop = function(){};

  this.baseExpand = {
	  methods: {
		  forEach: function(){
			  if( !Array.prototype.forEach ){
				Array.prototype.forEach = function(fun /* ,thisp */){
					  var len = this.length >>> 0 ;//无符号右移
					  if(typeof fun != 'function') throw new TypeError('Not an Function');
					  var thisp = arguments[1];//这个没有容错
					  for(var i = 0; i < len; ++i){
						  if(i in this) fun.call(thisp,this[i],i,this);
					  }
					};  
			  }
			} ,
		  filter: function(){
			 if( !Array.prototype.filter){
		      Array.prototype.filter = function(fn,thisObj){
			    var scope = thisObj || window;
				var a = [];
				for ( var i = 0, len = this.length; i<len; ++i){
				    if( !fn.call(scope,this[i],i,this) ){
					    continue;	
					}
					a.push(this[i]);	
				} 
				return a; 
			  };
			}
	  	  },
		  reduce: function(){
			//alert('Im reduce method of Array,but not define');	  	
		  } ,
		  map: function(){
		    if(!Array.prototype.map){
			    Array.prototype.map = function(a,f){
					var rs  = [];
					for(var i = 0,len = a.length; i<len; i++){
					    if(i in a) rs[i]  = f.call(null,a[i],i,a);
					}
					return rs;
				}	
			}
		  },
		  trim: function(){
		  	if(typeof String.prototype.trim == 'undefined'){
		  		String.prototype.trim = function(){
						var str = this.replace(/^\s+/, '');
						for (var i = (str.length - 1); i >= 0; i--) {
							if (/\S/.test(str.charAt(i))) {
								str = str.substring(0, i + 1);
								break;
							}
						}
						return str;
				}
		  	}
		  },
		  bind: function(){
		     if(!Function.prototype.bind){
			     Function.prototype.bind = function(o/*,args*/){
					 var self = this, boundArgs = arguments;//将调用者fn的this保存，以便在闭包中使用
					 return function(){
					    var args = [],i;
						for(i = 1; i<boundArgs.length; i++) args.push(boundArgs[i]);
						for(i = 0; i<arguments.length; i++) args.push(arguments[i]);
						return self.apply(o,args);
					 }
				 }	 
			 } 
		  },
		  create: function(obj){
		    if(typeof Object.create !== 'function'){
			    Object.create = function(obj){
				    function F(){}
					F.prototype = obj;
					return new F();	
				}
			}	
		  }	  
	  },///methods[]
	  init: function(type,methodArray){
		//1.Enable forEach Method
		var noMethods = [];
		var type = type || 'all';//默认是all，初始化全部方法
		if( type == 'all'){
			for(var p in this.methods){
				this['methods'][p]();
			}
		}else if ( type == 'parts'){
			if(!methodArray instanceof Array) throw new TypeError(' Methods Expected to be an Array ');
				for(var t = 0, len = methodArray.length; t<len; t++){
					if (this['methods'][methodArray[t]] == undefined) { 
					  noMethods.push(methodArray[t]);
					  continue;
					}
					else { 
					     this['methods'][methodArray[t]]();
					}
			     }
				 if(noMethods.length){
						//throwError('TypeError', 'The method ['+noMethods+ '] was not found in baseTools.methods, check your methodArray'); 
				 }
		}
	  }
  };///this.baseToolls
  this.fnTools = {
	  fns:{},//方法集	  
	  addFn: function(fnName,fn){
		if(typeof fn == 'function' ){
			this.fns[fnName] = fn ;
			return this;//支持链式操作
		}else{
		    throw new TypeError('fn Expected to be function ,but here is '+(typeof fn));	
		}	

	  }
  };//
  this.MVC = {
	  onInterface: function(scope){//开启 接口模式 全局变量中增加 Interface 对象
			 //Interface Class Constructor
		var tar = scope || window;
        tar.Interface = function(name,methods){
               if( arguments.length != 2){
                 throw new RangeError('Interface constructor called with ' + arguments.length +
	             ' arguments, but expected exactly 2.');
                }

               this.name = name;
               this.methods = [];
               for(var i = 0, len = methods.length; i < len; ++i){
                  if(typeof methods[i] !== 'string'){
	                throw new TypeError('Interface constructor expects method names to be passed in as a string.');
	              }
	              this.methods.push(methods[i]);
              }

        };///tar.Interface 
            //add Static class method for Interface
        tar.Interface.ensureImplements = function(object){
	            if(arguments.length < 2){
		           throw new RangeError('Function Interface.ensureImplements called with ' + arguments.length +
			       ' arguments, but expected at least 2.');
                }

	      		for(var i = 1,len = arguments.length; i < len; ++i){
		    		 var interface = arguments[i];
		     		if(interface.constructor !== Interface){
			    		throw new TypeErrow('Function Interface.ensureImplements expects arguments 2 and above to be instance of Interface');
		     		}
		      		for(var j = 0,methodsLen = interface.methods.length; j < methodsLen; j++){
		        		 var method = interface.methods[j];
		         			if(!object[method] || typeof object[method] !== 'function'){
			       				throw new Error('Function Interface.ensureImplements: object does not implements the ' 
			       				+ interface.name + ' interface.Method ' + method + 'was not found.');			  
		         			}	
		      		}
	       		}	
        };///tar.Interface.ensureImplements
		//extend fn
		tar.extend = function (subClass,superClass){
            if( arguments.length != 2){
                 throw new RangeError('extend called with ' + arguments.length +
	             ' arguments, but expected exactly 2.');
            }			
			var F = function(){};
			F.prototype = superClass.prototype;
			subClass.prototype = new F();//继承superClass的原型
			subClass.prototype.constructor = subClass;
			
			subClass.superclass = superClass.prototype;
			if(superClass.prototype.constructor == Object.prototype.constructor){
				superClass.prototype.constructor = superClass;
			}
			 
		};///tar.extend
		
	  }///onInterface
	  
	  
  },//this.MVC
  this.EventUtil = {
	    _handleHash : {},
		_handlerIndex : 0,//保持自增
		addHandler: function(element, type, handler, scope){
				var scope = scope || null;
			    if( scope && (!(scope instanceof Object)) ) throw new Error('Invalid scope!');
			    if(scope)  handler = handler.bind(scope); //返回一个绑定了作用域的新的函数
				if (element.addEventListener){
					element.addEventListener(type, handler, false) ;
				} else if (element.attachEvent){
					element.attachEvent('on' + type, handler);
				}else {
					element['on' + type] = handler ;
				}
				this._handleHash[++ this._handlerIndex] = {"handler": handler};
				return this._handlerIndex;//用于保存对匿名函数的引用索引
		},
		removeHandler: function(element, type, handler,handlerIndex){
			    if(handlerIndex) handler = this._handleHash[handlerIndex].handler;
				if(element.removeEventListener){
			        element.removeEventListener(type, handler, false) ;
				} else if (element.detachEventListener){
				    element.detachEventListener('on' + type, handler);
				} else {
					element['on' + type] = null;//解除所有事件绑定，这样处理有问题
				}
		},
		getEvent: function(event){
			return event ? event : window.event;
		},
		getTarget: function(event) {//currentTarget是处理事件的调用者，如果document.body.onclick = function(event){}中event.currentTarget ===this===document.body  target是目标
			return event.target || event.srcElement;
		},
		
		preventDefault: function(event){
			if (event.preventDefault) {event.preventDefault;}
			else {event.returnValue = false;}//for IE
		},
		stopPropagation: function(event){
			if(event.stopPropagation) event.stopPropagation;
			else event.cancelBubble = true;
		}
  },
  this.DateUtil = {//和JAVA相同，采用UTC时间，日期的计时开始于1970年1月1日 
		compareDate: function(a,b){ //for yyyy-mm-dd
			var arr = a.split('-'),
			    starttime = new Date(arr[0],arr[1],arr[2]),
				startTimes = starttime.getTime();//返回日期的毫秒数
				
			var arr2 = b.split('-'),
				lktime = new Date(arr2[0],arr2[1],arr2[2]),
				lkTimes = lktime.getTime();
				
			if(startTimes >= lkTimes) { return false;}
			else {return true;}
			    
		},  
		compare: function (beginTime,endTime) {
  				//var beginTime = "2009-09-21 00:00:00";
    			//var endTime = "2009-09-21 00:00:01";
    			var beginTimes = beginTime.substring(0, 10).split('-');
    			var endTimes = endTime.substring(0, 10).split('-');

    			beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
    			endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);
		

  		 		 var rs = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
    			 if (rs < 0) {
        			alert("endTime小!");
					return 1;
    			} else if (rs > 0) {
    	    		alert("endTime大!");
					return -1;
	    		} else if (rs == 0) {
        			alert("时间相等!");
					return 0;
    			} else {
        			return 'exception'
    			}
   		},
		getCHTime: function () { //获取中国格式的时间
        var now = new Date();
       
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
       
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
       
        var clock = year + "-";				//clock 是最终显示的时间
       
        if(month < 10){
           clock += "0";
         }
           clock += month + "-";
		
        if(day < 10){
           clock += "0";
          }   
          clock += day + " ";
		
        if(hh < 10){
          clock += "0";
         }   
          clock += hh + ":";
		
        if (mm < 10) {
		  clock += '0'; 
        }
		  clock += mm; 
		
        return(clock); 
	}///funtion getTime 
  },
  this.CookieUtil = {
		get: function(name){
			var cookieName = encodeURIComponent(name) + '=',
				cookieStart = document.cookie.indexOf(cookieName),
				cookieValue = null;
			
			if (cookieStart > -1){
				var cookieEnd = document.cookie.indexOf(';',cookieStart);//从cookieStart这个位置向后查找
				if (cookieEnd == -1) {
					cookieEnd = document.cookie.length;
				}
				cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
			}
			
			return cookieValue;
		},
		
		set: function(name,value,expires,path,domain,secure){
			var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
			
			if (expires instanceof Date) {
				cookieText += '; expires=' + expires.toGMTString();
			}
			
			if (path) {
				cookieText += '; path=' + path;
			}
			
			if (domain) {
				cookieText += '; domain=' + domain;
			}
			
			if (secure) {
				cookieText += '; secure';
			}
			
			document.cookie = cookieText;
		},
		
		unset: function (name, path, domain, secure){
			this.set(name,"",new Date(0), path, domain,secure);
		}  
  },
  this.utils = {
	  	getScript: function(url,callback,scriptId){//script脚本延迟载入工具
			var script = document.createElement('script');
			script.type = 'text/javascript';
		
			if(scriptId != undefined && typeof scriptId == 'string' ) { script.setAttribute('id',scriptId ); }
			
			//module.registerModule(moduleName,module,path,scriptId);
			
			var onloadfn = callback;//回调函数

			if(script.readyState){ //for IE
				script.onreadystatechange = function(){
					
					if(script.readyState == 'loaded' || script.readyState == 'complete') {
						script.onreadystatechange = null;
						if(onloadfn) onloadfn();

					}
				};
			} else {//other browser
				script.onload = function(event){
					script.onload = null;
					
					if(onloadfn && !onloadfn.isJSONPLoadedCallback ) {//如果回调函数存在，并且不是JSONP的回调函数
						onloadfn();
					}
				};
				script.onerror = function(){
					script.onerror = null;
					//alert('触发了script的onerror事件');
					if(onloadfn) onloadfn();
				};
			}
			
			script.src = url;
			document.body.appendChild(script);
		
		},
		getJSONP: function(obj){ //obj = {url,data,callback}
			
			st.utils.typeCheck(obj,'object');

			var url = obj.url, dataObj = obj.data, success = obj.success || st.noop, error = obj.error || st.noop  ;

			if(url.indexOf('?') > -1) {

				url += '&';
			}else {
				url += '?';
			}

			

			url += st.utils.resolveJSON(dataObj);


			var scriptId = st.utils.getGUID() +'-'+ new Date().getTime();

			st.JSONPCallback = function(dataGot){
				document.getElementById(scriptId).setAttribute('guid',scriptId);//设置guid属性
				success(dataGot);//获取服务器返回的数据JSON
				
			};

			var JSONPLoaded = function(){//错误的回调函数 ，兼容IE和其他浏览器
				

				if(st.utils.isIE()){
						if( document.getElementById(scriptId).getAttribute('guid') != scriptId) {
							error();//如果没有返回执行st.JSONCallback ，那么执行error回调函数
						}
				}else {
					error();
				}
			};

			JSONPLoaded.isJSONPLoadedCallback = true;//设置函数标志

			st.utils.getScript(url,JSONPLoaded,scriptId);


		},
		sendImgPing : function(url,dataObj,callback){
			var img = new Image();
			img.onload = img.onerror = callback;
			img.src = url;
		},
	    parseObject: function(url){//把传递的URL解析成Object
			return (new Function('return' +	
			' {' + 
			      url.substring(url.indexOf('?')+1).replace(/&/g,'",').replace(/=/g,': "') +
			'" }'))();//最后在}前加上"是为了结束结尾一个参数，比如rs=true  那么就是 rs: "true 所以还需要 "  来结束这个参数
		},

		resolveJSON: function(obj){
			st.utils.typeCheck(obj,'object');
			var str = '';
			for(var i in obj){
				str += ( i + '=' + encodeURIComponent(obj[i]) + '&' );	

			}
			str = str.slice(0,-1);
			return str;

		},

		classOf: function(o,note){
		          if (o === null) return 'Null';
		          if( o === undefined) return 'Undefined';
				  if( !note ) return Object.prototype.toString.call(o).slice(8,-1);
				  if(note) return Object.prototype.toString.call(o);
		  },//classOf
		 typeCheck: function(obj,type,mes){
		 	var errorMes = 'TyperError';
		 	
		 	if(st.utils.classOf(obj) == 'Array'){//如果是一个需要检查类型的数组集合
		 		for(var p = 0, len = obj.length; p < len; p++){
		 			if(obj[p][1].toLowerCase() == 'array'){
		 				if( st.utils.classOf(obj[p][0]).toLowerCase() != 'array'){
		 						errorMes = mes || 'The Parameter Type Expected to be '+obj[p][1]+' But got '+st.utils.classOf(obj[p][0]);
	  							throw new TypeError(errorMes);

		 				}
		 			}
		 			else if (typeof obj[p][0] != obj[p][1] ){
		 				errorMes = mes || 'The Parameter Type Expected to be '+obj[p][1]+' But got '+(typeof obj[p][0]) ;
	  					throw new TypeError(errorMes);

		 			}

		 		}
		 		return true;//检测完毕，没有错误
		 	}

	 	 	else if(typeof obj != type) {//其他类型的检测
	  			errorMes = mes || 'The Parameter Type Expected to be '+type+' But got '+(typeof obj) ;
	  			throw new TypeError(errorMes);

	  		}
	  		return true;//检测完毕，没有错误

	 	 },//typeCheck
	 	 cloneObj: function(obj){
	 	 	var objClone ;
	 	 	if (obj.constructor == Object){
				objClone = new obj.constructor();
			}else{
				objClone = new obj.constructor(obj.valueOf());
			}

			for(var key in obj){

				if ( objClone[key] != obj[key] ){
					if ( typeof obj[key] == 'object' ){
						objClone[key] = cloneObj(obj[key]);//深度克隆
					}else{
						objClone[key] = obj[key];
					}
				}
			}

			objClone.toString = obj.toString;
			objClone.valueOf = obj.valueOf;

			return objClone;

	 	 },

	 	 fixFileExtName : function(ori,ext,type){
	 	 	if(ori == '') {
	 	 		st.throwError('Error','The original FileName can\'t be empty!');
	 	 	}

	 	 	st.utils.typeCheck([[ori,'string'],[ext,'string']]);
	 	 	var rs = ori;

	 	 	var pt = new RegExp('$'+ext,'g');

	 	 	
	 	 	(!type) && (ori.indexOf(ext) == -1) && (!pt.test(ori)) && (rs+=('.'+ext)) ;//------------------------------------------------没有全部完成

	 	 	return rs;
	 	 	
	 	 },

	 	 fixFileShortName: function(ori,ext,type){

	 	 	if(ori == '') {
	 	 		st.throwError('Error','The original FileName can\'t be empty!');
	 	 	}
	 	 	st.utils.typeCheck([[ori,'string'],[ext,'string']]);

	 	 	var rs = ori, pt = new RegExp('$'+ext,'g');

	 	 	(!type) && (pt.test(ori)) && (rs.replace(pt,'')) ;//----删除缩略名

	 	 	return rs;


	 	 },

		addLinkCss: function(href,callback){
			var link = document.createElement('link');
			link.type = 'text/css';
			link.rel = 'stylesheet';
			st.EventUtil.addHandler(link,'load',function(event){
					callback ? callback() : void(0);
				});
			link.href = href;
			document.getElementsByTagName('head')[0].appendChild(link);
		},
		addCss: function(str){
			var style = document.createElement('style');
			style.textContent = str;
			document.getElementsByTagName('name')[0].appendChild(style);
		},
		addScript: function (src) {
			if(typeof src != 'string'){
			    throw new TypeError('script src expected to be string');	
		    }
			var script = document.createElement('script');
			script.src = src;
			document.body.appendChild(script);
		},
		delay: function (time,callback){
			return function(time,callback){
		       window.setTimeout(function(){
				   callback ? callback() : void(0) ;
			  },time);
			}();	
		},
		repeatTimer: function(callback,time){
			setTimeout(function(){
			    callback ? callback() : void(0);
				setTimeout(arguments.callee,time);	
			},time);
		},
		isIE : function (verson){//对IE浏览器进行版本检测
	         var num = verson || '';
          	 var IEtester = document.createElement('div');
	         IEtester.innerHTML = '<!--[if IE ' + num + ']><i></i><![endif]-->';
	
	         isIE = function(){
                        return !!IEtester.getElementsByTagName('i')[0];
		            };
             return !!IEtester.getElementsByTagName('i')[0];
	    },
		addURLParam : function(url,name,value){//将请求参数追加到url
			url += (url.indexOf('?') == -1 ? '?' : '&');
			url += encodeURIComponent(name) + '=' + encodeURIComponent(value);
			return url;
		},
		createXHR : (function(){
			if (typeof XMLHttpRequest != 'undefined'){
				return function(){
					return new XMLHttpRequest();
				};
			} else if (typeof ActiveXObject != 'undefined'){
				return function(){
					if (typeof arguments.callee.activeSring != 'string'){
						var versions = ['MSXML2.XMLHttp.6.0','MSXML2.XMLHttp.3.0','MSXML2.XMLHttp'], i, len;
						for ( i =0, len = versions.length; i<len; i++){
							try {
							    new ActiveXObject(versions[i]);
								arguments.callee.activeXString = versions[i];
								break;
							} catch(ex){
								//skip
							}
						}
					}
					return new ActiveXObject(arguments.callee.activeXString);
				};
			} else {
				return function(){
					throw new Error('The XMLHttpRequest object is not available');
			    }
		    }m
		})(),
		formSerialize : function(form){//----------------------------------------未完成  表单序列化，共ajax利用post  xhr.send(formData)发送
			var parts = [],
			    field = null;
		},

		scrollToBot: function(divObj){ //滚动条控制
   			var scH = divObj.scrollHeight;
   			$(divObj).scrollTop(scH);
	
		},///function scrollToBot-----------------------未完成
		submixstr : function(str,cutLen){
       //解析到数组
	    var pt = /[^\x00-\xff]/,temp = [],rs=[];
	    if ( !pt.test(str))  return str.substring(0,len-1);
	    else {
	       for(var i=0, len = str.length; i<len; i++){
               pt.test(str[i]) ? temp.push([str[i],2]) : temp.push([str[i],1]);
	       }
	    }
	    for(var p =0,lenCounter = 0; p<len; p++){
		  var tStr = temp[p][0];
		  rs.push(tStr);
	      if( (lenCounter+=temp[p][1]) >= cutLen ){return rs.join('');}
	    }
       },
		getGUID: function(){//产生GUID
		    return 'xxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
			    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);	
			}).toUpperCase();	
		},
        throwError: function (errType,errMes,config,e){
	    var e = e || { message:'There is an UnDescribed customError.'}, config = config || 'throw',errType = errType || 'ErrorFound', errMes = errMes || e.message || 'There is an UnDescribed customError.';
	
	    switch(config){
		  case 'throw':
		    throw new Error(errType+': ' +errMes);
		    break;
		  case 'alert':
		    alert(errType+': ' +errMes);
		    break;
		  case 'define':
		  
		    break;
	     }
       }
  };
  
};///Stone 构造函数



//----------------------------------------------------------------- CommonJS Area ----------------------------


var st = new Stone();
st.baseExpand.init('all');


//CommonJS 规范 模块化载入和管理-------------------------------------------

(function(){

var g = window;

function Exports(){

	//计数器增加
	Exports.prototype.exportsCounter ++;
	//alert('本姑娘被调用了');
		
}

Exports.prototype.exportsCounter = -1;

Exports.prototype.getExportsCounter = function(){
	return this.exportsCounter/2;
}


g.exports = new Exports();///g.exports


g.module = function(){

	//声明私有变量
	var basePath = '../scripts/lib/';
	var moduleLibrary = [];
	var moduleLib = {};//临时的中转站


	return {
		setPath: function(value){
			st.utils.typeCheck(value,'string');
			basePath = value;
		},
		getPath: function(){
			return basePath;
		},
		getModule: function(moduleName){
			//st.utils.typeCheck(moduleName,'string');
			var rsMods = {};
			if(st.utils.classOf(moduleName) === 'String') {
				var moduleName = moduleName.replace(/$\.js/g,'').trim() ;//去掉js后缀名和首尾空格//!!!!!!注意，如果扩展方法，IE旧版本会报错，不支持trim
				
				if (typeof moduleLibrary[moduleName] != 'undefined') {
					return moduleLibrary[moduleName].entity;//0返回的是module实体而不是exports;返回单个实体
				} else {
					return false;//返回false共require判断
					//st.utils.throwError('TyperError','Sorry but not found the module '+moduleName +',please check.');
				}

			}else if (st.utils.classOf(moduleName) === 'Array') {
				var curName,curMod;
				while(moduleName.length){
					curName = moduleName.shift();
					
					st.utils.typeCheck(curName,'string');//类型检测

					curMod = module.getModule(curName);//按照先后顺序加载,如果curMod不为false
					curMod ? rsMods[curName] = curMod : st.utils.throwError('ReferenceError','Module '+curName+' Not Found, Please Check!');
				}

				return rsMods;//返回结果集

			}else {
				st.utils.throwError('TypeError','Expected Sring or Array Parameters in module.getModule(), but got '+st.utils.classOf(moduleName))+ ' !';
			}

		},
		registerModule: function(moduleName,curExports,module,path,id,requireMods) {//注册到module模块中----moduleName,curExports,rsModule
			
			st.utils.typeCheck([[moduleName,'string'],[curExports,'object']]);
			
			moduleLib = {};//清空中转站
			
			moduleLib.entity = module;//传递return的实体
			moduleLib.exports = curExports;//暴露出来的api

			for(var key in moduleLib.exports){//合并exports的api到entity上
				if ((typeof moduleLib.entity.key) == 'undefined' ) {

					moduleLib.entity[key]  = moduleLib.exports[key];//==============================================need to adjust this
				} else {
					st.utils.throwError('Error','Find Repeat API statement:' + key +' in exports and moduleEntity. Please check!');
				}
			}

			moduleLib.path= path || basePath;
			moduleLib.id = id || (st.utils.getGUID() + new Date().getTime) ;
			moduleLib.requireMods = requireMods || [] ;//未完成依赖列表;

			moduleLibrary[moduleName] = moduleLib ;

		}///registerModule


	};///return
}();

g.require = function(moduleName,callback,loadPt){//目前只用来加载js文件//还有一个可能的第二个参数 requireMods

	var moduleName = moduleName || '';
	var callback = callback || st.noop;
	
	var loadPt = loadPt || true;// true时按照依赖顺序载入，false按浏览器载入;配置项目

	var basePath = module.getPath() ;

	var returnSingle = false;//返回require后的模块单体，用于带有依赖模块的载入，返回主模块

	st.utils.classOf(arguments[1]) == 'Array' ? (returnSingle = true, moduleName = arguments[1].concat(moduleName), callback = arguments[2] || st.noop, loadPt = arguments[3] || true ) : '';//如果第二个参数是一个依赖模块数组
	
	st.utils.typeCheck(callback,'function');//类型检测

	if (typeof moduleName == 'string' && moduleName.length > 0) {//如果载入的是单个文件
		
		var moduleFullName = st.utils.fixFileExtName(moduleName,'js');//不能放在前面，因为有可能是个数组
		var shortName = st.utils.fixFileShortName(moduleName,'js');

		//moduleName = moduleName.substring(0,moduleName.indexOf('.js'));//moduleName不包含.js
		//   /\.js$/g.test(moduleName) ? '' : moduleName+='.js' ;//moduleName是否已.js结尾，如果没有包含，那么加上

		var getMod = module.getModule(shortName);//查询已载入数据，同步调用（阻塞）

		if(getMod) {//如果已经加载该模块,那么直接获取调用并返回
			callback(getMod);
			return getMod;
		}else{//如果没有在module中查询到该模块，那么用script标签加载
			
			var rsModule;
			//alert(basePath+ moduleFullName);
			st.utils.getScript(basePath+ moduleFullName, function(){//注意这里是异步的
					rsModule = module.getModule(shortName);//附加了暴露在exports中的api,尽量不能重复
					alert('这儿是rsModule,name是:'+shortName+' : '+rsModule);//=======================99999999999999999999=========xxxxxxxxxxxxxxxxxxxxxxxxxxxx
					callback(rsModule);//执行回调 
			});
			return true;//这里返回的是undefined，因为是无阻塞载入的
		}
		
	}///if

	else if(st.utils.classOf(moduleName) === 'Array' && moduleName.length > 0 ) {//------------------------------这个类型检测不对哈哈

		var ctn = moduleName;//重新命名为ctn 数组容器
		var rsBox = [];//可以预留着保存getModule的module，然后传递个callback（）来使用，现在没增加
		var tempMod = null;
		
		if(loadPt){//默认是依次序载入
		//	alert(ctn);
			function loadCycle(){//递归按照依赖顺序依次载入script

				var tempMod = ctn[0];
				var lastMod = ctn[ctn.length-1];//获取最后一个模块的名字，供后面查询使用
				var getMod = module.getModule(tempMod);//获取的是module实体的引用
				if(getMod) {//如果获取到了module，模块已经加载，那么可以直接调用
					//alert('这里是从已载入的模块中查询出的： '+tempMod);
					rsBox[tempMod] = getMod;
					ctn.shift();//将查询到的模块从数组中移除
					
					if(ctn.length > 0) {
						loadCycle();//重新开始载入
					}else {

						returnSingle ? callback(rsBox[lastMod]) : callback(rsBox);
						return rsBox;
					}

				} else {//如果模块还没有被载入，那么用script加载,异步加载模式
					//alert('这里是从要从script加载的： '+ctn[0]);
					(ctn.length > 0) ? (tempMod = ctn.shift(),st.utils.getScript(basePath + st.utils.fixFileExtName(tempMod,'js'),function(){
						rsBox[tempMod] = module.getModule(st.utils.fixFileShortName(tempMod,'js'));//将查询到的module缓存
						if(ctn.length > 0) {//如果已经全部载入完毕，那么执行回调函数
							
							loadCycle();

						}
						else {
							//alert(rsBox);
							returnSingle ? (callback(rsBox[lastMod]),delete rsBox) : (callback(rsBox),delete rsBox);
							return true;
						}

					})) : (delete ctn) ;///(ctn.length > 0 )...
				}
			}///function loadCyele()

			loadCycle();


			return true;//返回----------------------- 返回无效

		} else {//直接添加标签,不保证按照依赖顺序添加

			for (var i = 0, len = ctn.length; i < len; i++) {
				st.utils.getScript( basePath + st.utils.fixFileExtName(ctn[i],'js') );
			}

			return 	callback();
		}

	}/// else if

};///g.require

g.define = function(moduleName,requiredModule,factory){/*require,exports,module*/
/*	var moduleName = moduleName || '';
	var requiredCtn = [];
	var factory = factory || st.noop;*/

	var requiredCtn = [];

	if(arguments.length == 2){
		var moduleName = moduleName || '';
		var factory = requiredModule;
		requiredModule = [];
	}


	(typeof requiredModule) == 'string' ? requiredCtn.push(requiredModule) :  (st.utils.classOf(requiredModule) === 'Array') && (requiredCtn = requiredModule) ;
	


	st.utils.typeCheck([[moduleName,'string'],[requiredCtn,'array'],[factory,'function']]);

	function initModule(exports,rsModule){//初始化并注册被define的
		var curExports = st.utils.cloneObj(exports);
		exports = null;//清空exports
		g.exports = new Exports();//建立新的exports供使用
		var rsModule = rsModule || {};

		module.registerModule(moduleName,curExports,rsModule);//注册模块



	}
	//alert('当前数量'+requiredCtn.length);
	
	if(requiredCtn.length > 0 ){
		require(requiredCtn,function(){

			//alert('依赖模块的数量： '+requiredCtn.length);

			var rsModule = factory(require,exports,module);//初始化模块
			(typeof rsModule == 'undefined' || typeof rsModule == true || typeof rsModule == false) ? initModule(exports) : initModule(exports,rsModule) ;

		});//预载入依赖模块

	} else {
		var rsModule = factory(require,exports,module);//如果没有依赖模块，那么初始化模块
		(typeof rsModule == 'undefined' || typeof rsModule == true || typeof rsModule == false) ? initModule(exports) : initModule(exports,rsModule) ;
	}
	

};///g.define

g.useModule = function(mods){//只能调用已经载入的模块，否则抛出错误
	var rs = module.getModule(mods);
	if(rs){
		return rs;
	}else {
		st.utils.throwError('Error','Can\'t use modules '+mods+' !');
	}

}///function useModule


})();////

/*----------------------功能测试区--------------------------------*/
