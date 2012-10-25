/*
 * JavaScript Tools
 * xStone version:1.0
 * Michael Scofield 
 * Personal 2012/10/14
 */

// The XStone class constuctor
function XStone(){	
  this.baseExpand = {
	  methods: {
		  forEach: function(){
			  if( !Array.prototype.forEach ){
				Array.prototype.forEach = function(fun /* ,thisp */){
					  var len = this.length >>> 0 ;//无符号右移？？
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
		  bind: function(){
		     if(!Function.prototype.bind){
			     Function.prototype.bind = function(o/*,args*/){
					 var self = this, boundArgs = arguments;//将调用者fn的this保存，以便在闭包中使用
					 return function(){
					    var args = [],i;
						for(i = 1; i<boundArgs.length; i++) args.push(boundArgs[i]);
						for(i = 0; i<arguments.length; i++) args.push(arguments[i]);
						//alert(args[1]);
						return self.apply(o,args);
					 }
				 }	 
			 } 
		  },
		  create: function(obj){
		    if(typeof Object.create !== 'function'){
				//alert(Object.create);
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

            };///tar.prototype.Interface 
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
		
	  },
	  
	  classOf: function(o,note){
          if (o === null) return 'Null';
          if( o === undefined) return 'Undefined';
		  if( !note ) return Object.prototype.toString.call(o).slice(8,-1);
		  if(note) return Object.prototype.toString.call(o);
	  }//classOf
	  
  },//this.MVC
  this.EventUtil = {
	    _handleHash : {},
		_handlerIndex : 0,
		addHandler: function(element, type, handler, scope){
			    if( scope && (!(scope instanceof Object)) ) throw new Error('Invalid scope!');
			    if(scope)  handler = handler.bind(scope); //放回一个绑定了作用域的新的函数
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
		}  
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
	    parseObject: function(url){//把传递的URL解析成Object
			return (new Function('return' +	
			' {' + 
			      url.substring(url.indexOf('?')+1).replace(/&/g,'",').replace(/=/g,': "') +
			'" }'))();//最后在}前加上"是为了结束结尾一个参数，比如rs=true  那么就是 rs: "true 所以还需要 "  来结束这个参数
		},
		addCss: function(str){
			var style = document.createElement('style');
			style.textContent = str;
			document.getElementsByTagName('name')[0].appendChild(style);
		},
		getScript: function (src) {
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
		formSerialize : function(form){//未完成  表单序列化，共ajax利用post  xhr.send(formData)发送
			var parts = [],
			    field = null;
		},
		imgPing : function(url, callback){
			var img = new Image();
			img.onload = img.onerror = callback;
			img.src = url;
		},
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
  
};///XStone 构造函数

/*
//Interface Class Constructor

var Interface = function(name,methods){
  if( arguments.length != 2){
  throw new RangeError('Interface constructor called with ' + arguments.length +
	  'arguments, but expected exactly 2.');
  }

  this.name = name;
  this.methods = [];
  for(var i = 0, len = methods.length; i < len; ++i){
    if(typeof methods[i] !== 'string'){
	  throw new TypeError('Interface constructor expects method names to be passed in as a string.');
	}
	this.methods.push(methods[i]);
  }

};///var Interface

//add Static class method for Interface

Interface.ensureImplements = function(object){
	if(arguments.length < 2){
		throw new RangeError('Function Interface.ensureImplements called with ' + arguments.length +
			'arguments, but expected at least 2.');
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
};///Interface.ensureImplements

//fn throwError

function throwError(errType,errMes,config,e){
	var e = e || { message:'There is UnDescribed an Error'}, config = config || 'throw',errType = errType || 'ErrorFound', errMes = errMes || e.message || 'There is an UnDescribed Error.';
	
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

*/



//----------------------------------------------------------------- Test Area ----------------------------








