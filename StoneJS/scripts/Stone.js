/* 
 * Stone.js
 * Metrictool VMware
 * @Cloud Xu: xwlxyjk@gmail.com
 * 2012/12/6 V0.3
 */
(function(_isFirstLoad){
	//Prevent Repeat Load Stone
	if(_isFirstLoad) {}else { return false; }
/* DEFINE STONE OBJECT  --------------------------------------------------------*/
	window.stone = function Stone(){
		var _handleHash = {},
			_handlerIndex = 0;

		var _guidBase = {};
		var _autoIncrement = {};
		
		var _exports =  {
			noop: function(){},
			typeCheckOff: function(){
				this.typeCheck = function(){
					return _exports;
				};
			},
			/* EventUtil Tools ============================================== */
			bind: function(element, type, handler, scope){
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
					_handleHash[++ _handlerIndex] = {"handler": handler};

					return _handlerIndex;//用于保存对匿名函数的引用索引
			},
			unbind: function(element, type, handler,handlerIndex){
				    if(handlerIndex) { handler = _handleHash[handlerIndex].handler; }
					if(element.removeEventListener){
				        element.removeEventListener(type, handler, false) ;
					} else if (element.detachEventListener){
					    element.detachEventListener('on' + type, handler);
					} else {
						element['on' + type] = null;//解除所有事件绑定，这样处理有问题
					}
			},
			getEvent: function(event){
				return event ? event : window.event; // or default e
			},
			getTarget: function(event) {//currentTarget是处理事件的调用者，如果document.body.onclick = function(event){}中event.currentTarget ===this===document.body  target是目标
				return event.target || event.srcElement;
			},
			
			preventDefault: function(event){
				if (event.preventDefault != undefined) {event.preventDefault();}
				else {event.returnValue = false;}//for IE
			},
			stopPropagation: function(event){
				if(event.stopPropagation != undefined) {event.stopPropagation();}
				else {	event.cancelBubble = true;} 
			},	
			killEvent: function(event){
				if(typeof event == 'object' && this.getTarget(event) != undefined){
					this.stopPropagation(event);
					this.preventDefault(event);
				}else {
					return false;
				}
			},

			mousePos: function(){
				var x0,y0;
				var self = this;
				var posObj = {
					x0: 0,
					y0: 0
				};

				var _initPos = function(){
					self.bind(document, 'mousemove', function(event){
						var event = self.getEvent(event);

						if(event.pageX || event.pageY){ 
							posObj = {
								x0:event.pageX, 
								y0:event.pageY
							};
						}else{						
							posObj = {
								x0: event.clientX + document.body.scrollLeft - document.body.clientLeft,
						    	y0: event.clientY + document.body.scrollTop - document.body.clientTop
						    };
						}

					    self.mousePos = _getPos;
					});///self.bindd	
				}();

				var _getPos = function(){
					return posObj;
				};

				return posObj;
			},

			//judge the mouse direction
			slideLeft: function(){},
			slideRight: function(){},
			//drag tool
			drag: function(){
				var util = {
				    index:1000, 
				    getFocus:function (target){ 
				        if(target.style.zIndex != this.index){ 
				            this.index += 2; 
				            var idx = this.index; 
				            target.style.zIndex=idx; 
				        } 
				    },
				    abs:function (element) {
				        var result = { x: element.offsetLeft, y: element.offsetTop};
				        element = element.offsetParent;
				        while (element) {
				            result.x += element.offsetLeft;
				            result.y += element.offsetTop;
				            element = element.offsetParent;
				        }
				        return result;
				    }
				};
				 
				var _drag = function (argObj){
				/*argObj = {
						ctrl: '',
						target: '',
						offSetX: '',
						offSetY: '',
						zIndex: '',
						fn: {
							onmove: stone,noop,
							onup: stone.noop,
							ondown: stone.noop
						}
					}*/
					var ctrl = argObj.ctrl || argObj.target, tar = argObj.target, offSetX = argObj.offSetX || 0, offSetY = argObj.offSetY || 0,
						index = argObj.zIndex || 1000, fnObj = argObj.fn || {};

				    ctrl = typeof(ctrl) == "object" ? ctrl : document.getElementById(ctrl);
				    tar = typeof(tar) == "object" ? tar : document.getElementById(tar);

				    var x0=0, y0=0, x1=0, y1=0, moveable=false, isOut = false, NS=(navigator.appName == 'Netscape');

				    //start drag
				    this.bind(ctrl, 'mousedown', function(e){
				        var e = stone.getEvent(e);

				        util.getFocus(tar);
				        if(e.button == (NS) ? 0 : 1)  {
				            if(!NS){this.setCapture()}
				            x0 = e.clientX ; 
				            y0 = e.clientY ; 
				            x1 = parseInt(util.abs(tar).x); 
				            y1 = parseInt(util.abs(tar).y);   
				            moveable = true; 
				        }

				        stone.killEvent(e);				    	
				    });
				    //drag;
				    this.bind(ctrl, 'mousemove', function(e){
				        var e = stone.getEvent(e);
				        if(moveable){ 
				            tar.style.left = (x1 + e.clientX - x0 - offSetX) + "px"; 
				            tar.style.top  = (y1 + e.clientY - y0 - offSetY) + "px";
				            if(typeof fnObj.onmove == 'function'){
				            	fnObj.onmove();
				            }				            
				        }
				        stone.killEvent(e);
				    });
				    this.bind(ctrl, 'mouseout', function(e){
				    	stone.killEvent(e);
						isOut = true;				    	
				    });
				    //stop drag;
				    this.bind(ctrl, 'mouseup', function(e){
				        if(moveable)  {  
				            if(!NS){this.releaseCapture();}
				            moveable = false;
				            if(typeof fnObj.onup == 'function'){
				            	fnObj.onup();
				            }
				            stone.killEvent(e);
				        }
				    });
			        
			        //prevent lost drag tar
			        this.bind(document, 'mouseup', function(e){
			            var e = stone.getEvent(e);
			            if(isOut && moveable){
				            tar.style.left = (x1 + e.clientX - x0 - offSetX) + "px"; 
				            tar.style.top  = (y1 + e.clientY - y0 - offSetY) + "px";  

				            isOut = false;
				            moveable = false;
				            if(fnObj.onup){
				            	fnObj.onup();
				            }				            
				            stone.killEvent(e);		            	
			            }			        	
			        });

				};//var _drag

				return _drag;
			}(),
			//****** not finished !===============================
			contextmenu: function(argObj){
				/*argObj: {
					target: '',
					menu: [
						{
							text: 'menu1',
							icon: 'sdf.jpg',
							click: function(){}
						},
						{
							text: 'menu2',
							icon: 'sdf.jpg',
							click: function(){}						
						}
					]
				}*/
			},
			/* /EventUtil Tools ============================================= */
			availWinSize: function() {//Get Available Window Size
				//Width
	            if (window.innerWidth){ winWidth = window.innerWidth; }
	            else if ((document.body) && (document.body.clientWidth)){ winWidth = document.body.clientWidth; }

	             //Height
	            if (window.innerHeight) { winHeight = window.innerHeight; }
	            else if ((document.body) && (document.body.clientHeight)){ winHeight = document.body.clientHeight; }
	           
	            //Hack
	            if (document.documentElement  && document.documentElement.clientHeight && document.documentElement.clientWidth)
	            {
	                winHeight = document.documentElement.clientHeight;
	                winWidth = document.documentElement.clientWidth;
	            }

	            return {
	            	width: winWidth,
	            	height: winHeight
	            };
       		},

			cloneArray: function (a) {
				var r = a.concat([]);
				return r;
			},
			//返回一个倒序的数组
			reArray: function(a){
				var b = a.concat([]).reverse()
				return b;
			},

			//ONLY FOR STRING/NUMBER ARRAY
			arrayMinus: function(a, b, intersection){
				var intersection = intersection || false;
				//rs = a - b
				this.typeCheck(a, 'array').typeCheck(b, 'array');
				var rs = [];
				var rsI = [];
				var aLen = a.length;

				for(var i=0; i<aLen; i++){
					if(!stone.inArray(a[i], b)){ // if not in b
						rs.push(a[i]);
					}else {
						rsI.push(a[i]);
					}
				}
				if(!intersection){
					return rs;
				}else {
					return rsI;
				}
			},
			//ONLY FOR STRING/NUMBER ARRAY
			arrayUnion: function(a, b){
				//rs = a + b;
				this.typeCheck(a, 'array').typeCheck(b, 'array');
				var intersection = this.arrayMinus(a, b, true);

				return this.arrayMinus(a.concat(b), intersection).concat(intersection);
			},

		  	getScript: function(url,callback,scriptId){//script脚本延迟载入工具
				var script = document.createElement('script');
				script.type = 'text/javascript';
			
				if(scriptId != undefined && typeof scriptId == 'string' ) { script.setAttribute('id',scriptId ); }	
				
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
						
						if(onloadfn) {//如果回调函数存在，并且不是JSONP的回调函数
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
				//如果此时body节点没有生成，那么将script标签加载到head里面
				if(document.body) {
					document.body.appendChild(script);
				} else {
					document.getElementsByTagName('head')[0].appendChild(script);
				}
			
			},

			sendImgPing : function(url, callback){ /*dataObj,*/
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

			urlToObj: function(url){//把传递的URL解析成Object
				return (new Function('return' +	
				' {' + 
				      url.substring(url.indexOf('?')+1).replace(/&/g,'",').replace(/=/g,': "') +
				'" }'))();//最后在}前加上"是为了结束结尾一个参数，比如rs=true  那么就是 rs: "true 所以还需要 "  来结束这个参数
			},

			objToUrl: function(parObj,curUrlRoot){
				
				this.typeCheck(parObj, 'object');
				var curUrl = curUrlRoot || '';
				for(var key in parObj) {
					if(parObj.hasOwnProperty(key)){
						curUrl = this.addURLParam(curUrl, key, parObj[key] );
					}
				}
				return curUrl;
			},

			objGetUrl: function(parObj,curUrlRoot){
				this.typeCheck(parObj, 'object');
				var curUrl = curUrlRoot || '';
				for(var key in parObj) {
					if(parObj.hasOwnProperty(key)){
						curUrl = this.addParam(curUrl, key, parObj[key] );
					}
				}
				return curUrl;
			},

			getObj: function(argObj){
				stone.typeCheck(argObj, 'object');

				var regSymbol = '^$.*+?=!:|\/()[]{}';

                var s = argObj.string,
                	a = argObj.linker,
                	b = argObj.separator;
                if(s == undefined || s == null || s == '' || s == 'undefined' || s == 'null'){
                	throw new TypeError('Invalid String : ' + s + ' ,Please Check !' );
                }

                if(regSymbol.indexOf(a) != -1){
                	a = '\\'+a;
                }
                if(regSymbol.indexOf(b) != -1){
                	b = '\\'+b;
                }   

                return (new Function('return {' + s.replace(new RegExp(b, 'g'), '",').replace(new RegExp(a, 'g'), ': "') + '" }'))();			
			},

			resolveJSON: function(obj){
				this.typeCheck(obj,'object');
				var str = '';
				for(var i in obj){
					str += ( i + '=' + encodeURIComponent(obj[i]) + '&' );	

				}
				str = str.slice(0,-1);
				return str;

			},
			//For String Util
			subMixstr : function(str,cutLen){
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

			getCookie: function(name){
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
			
			setCookie: function(name,value,expires,path,domain,secure){
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
			
			delCookie: function (name, path, domain, secure){//document.cookie = name+"=;expires="+(new Date(0)).toGMTString();
				//this.setCookie(name,"",new Date(0), path, domain,secure);
				var name = name || '';
				document.cookie = name+"=;expires="+(new Date(0)).toGMTString();
			},  
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

			now: function(){

				return (new Date()).getTime();
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
			},
			getCHDate:function(){
				return this.getCHTime().slice(0,10);
			},

			classOf: function(o,note){
			          if (o === null) return 'Null';
			          if( o === undefined) return 'Undefined';
					  if( !note ) return Object.prototype.toString.call(o).slice(8,-1);
					  if(note) return Object.prototype.toString.call(o);
			},//classOf
			typeCheck: function(obj,type,mes){
			 	var errorMes = 'TyperError';
			 	if(this.classOf(obj) == 'Array'){//如果是一个需要检查类型的数组集合
			 		if(typeof arguments[1] == 'string' ) {
			 			var obj = [ [obj, arguments[1]] ];
			 		}
			 		for(var p = 0, len = obj.length; p < len; p++){
			 			if(obj[p][1].toLowerCase() == 'array'){
			 				if( this.classOf(obj[p][0]).toLowerCase() != 'array'){
			 						errorMes = mes || 'The Parameter Type Expected to be '+obj[p][1]+' But got '+this.classOf(obj[p][0]);
		  							throw new TypeError(errorMes);

			 				}
			 			}
			 			else if (typeof obj[p][0] != obj[p][1] ){
			 				errorMes = mes || 'The Parameter Type Expected to be '+obj[p][1]+' But got '+(typeof obj[p][0]) ;
		  					throw new TypeError(errorMes);

			 			}

			 		}
			 		return this;//检测完毕，没有错误
			 	}

		 	 	else if(typeof obj != type) {//其他类型的检测
		  			errorMes = mes || 'The Parameter Type Expected to be '+type+' But got '+(typeof obj) ;
		  			throw new TypeError(errorMes);

		  		}
		  		return this;//检测完毕，没有错误

		 	},//typeCheck

		 	getType: function(t){
		 		var cur = this.classOf(t).toLowerCase();
		 		return cur;
		 	},
		 	
		 	typeIn: function(tar, ts){
		 		var curType = this.classOf(tar).toLowerCase();
		 		return this.inArray(curType, ts);
		 	},
		 	classIn: function(tar, ts){
		  		var curType = this.classOf(tar);
		 		return this.inArray(curType, ts);		
		 	},

		 	validate: function(tar, type){
		 		stone.typeCheck([[type, 'string'], [tar, 'string'] ]);
		 		
		 		switch(type) {

		 			case 'number':
		 				return _number_pt = /^\d+(\.\d+)?$/.test(tar);
					case 'integer':
						var _integer_pt = /^(-|\+)?\d+$/ ;
			            return _integer_pt.test(tar);
	
					case 'mail':
						//MAIL : "^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$",
						var _email_pt = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
			            return _email_pt.test(tar);
	
					case 'tel':
						//TEL : "^0(10|2[0-5789]|\\d{3})-\\d{7,8}$",
						var _tel_pt = /^[0-9]{3,4}(\-|\s)[0-9]{7,8}$/;
			            return _tel_pt.test(tar);
			        case 'mobile':
			            var _mobile_pt = new RegExp('^1(3[0-9]|5[0-35-9]|8[0235-9])\\d{8}$');
			            return _mobile_pt.test(tar);
			        case 'url' :
			        	var _url_pt = new RegExp('^http[s]?://[\\w\\.\\-]+$');
			        	return _url_pt.test(tar);
			        case 'idcard':
			        	var _id_pt = new RegExp('((11|12|13|14|15|21|22|23|31|32|33|34|35|36|37|41|42|43|44|45|46|50|51|52|53|54|61|62|63|64|65|71|81|82|91)\\d{4})((((19|20)(([02468][048])|([13579][26]))0229))|((20[0-9][0-9])|(19[0-9][0-9]))((((0[1-9])|(1[0-2]))((0[1-9])|(1\\d)|(2[0-8])))|((((0[1,3-9])|(1[0-2]))(29|30))|(((0[13578])|(1[02]))31))))((\\d{3}(x|X))|(\\d{4}))');		
			        	return _id_pt.test(tar);
			        case 'ip':
			       		var _ip_pt = new RegExp('^((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]|[*])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]|[*])$');
			       		return _ip_pt.test(tar);
			       	case 'chinese':
			       		var _ch_pt = new RegExp('^([\u4E00-\uFA29]|[\uE7C7-\uE7F3])*$');
			       		return _ch_pt.test(tar);

			        // default ==========================================================
					default: 
						this.throwError('TypeError', 'No Type Matched: ' + type );

				}

				return false;
		 	},///validate

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

		 	updateObj: function(base, newFea){//a is base obj, newFea's attr will rewrite a's accoding attr
				/*for(var key in base){
		 			if(base.hasOwnProperty(key)){
		 				if(newFea.hasOwnProperty(key)){
							base[key] = newFea[key];
		 				}
		 			}
		 		}*/
		 		for(var key in newFea){
		 			if(newFea.hasOwnProperty(key)){
							base[key] = newFea[key];
		 			}
		 		}		 		
		 		return base;
		 	},

		 	delAttr: function(_obj, delAttr){
		 		stone.typeCheck(_obj, 'object');

	            if(typeof delAttr =='string'){
	                delete _obj[delAttr];
	            }else if(stone.classOf(delAttr) == 'Array'){
	                var len = delAttr.length;
	                for(var i=0 ; i<len; i++){
	                    delete _obj[delAttr[i]];
	                }
	            }else {
	            	throw TypeError('Stone.delAttr() Expected String or Array, But got '+stone.classOf(delAttr));
	            }	

	            return _obj;
		 	},

		 	hasAttr: function(obj, attr){
		 		//not finished
		 		var attr = [].concat(attr);
		 		var len = attr.length;
		 		var notHas = [];
		 		for(var i=0; i<len; i++){
		 			if(!obj.hasOwnProperty(attr[i])){
		 				return false;
		 			}
		 		}	

		 		return true;	 		
		 	},

		 	getNotHasAttr: function(obj, attr){

		 		var attr = [].concat(attr);
		 		var len = attr.length;
		 		var notHas = [];
		 		for(var i=0; i<len; i++){
		 			if(obj.hasOwnProperty(attr[i])){

		 			}else {
		 				notHas.push(attr[i]);
		 			}
		 		}

		 		return notHas;
		 	},

		 	getFullName : function(ori,ext,type){
		 	 	if(ori == '') {
		 	 		this.throwError('Error','The original FileName can\'t be empty!');
		 	 	}

		 	 	this.typeCheck([[ori,'string'],[ext,'string']]);
		 	 	var rs = ori;

		 	 	var pt = new RegExp('$'+ext,'g');

		 	 	
		 	 	(!type) && (ori.indexOf(ext) == -1) && (!pt.test(ori)) && (rs+=('.'+ext)) ;//------------------------------------------------没有全部完成

		 	 	return rs;
		 	 	
		 	},

		 	getShortName: function(ori, ext, type){

		 	 	this.typeCheck([[ori,'string'],[ext,'string']]);

		 	 	var pt = new RegExp('\.'+ext+'$','g');

		 	 	var rs = ori.replace(pt,'');//----删除缩略名

		 	 	return rs;


		 	},

			addLinkCSS: function(href,callback){
				var link = document.createElement('link');
				link.type = 'text/css';
				link.rel = 'stylesheet';
				this.bind(link, 'load', function(event){
						callback ? callback() : void(0);
					});
				link.href = href;
				document.getElementsByTagName('head')[0].appendChild(link);
				return this;
			},
			addStyleCSS: function(str){
				var style = document.createElement('style');
				style.textContent = str;
				document.getElementsByTagName('head')[0].appendChild(style);
				return this;
			},
			addScript: function (src) {
				if(typeof src != 'string'){
				    throw new TypeError('script src expected to be string');	
			    }
				var script = document.createElement('script');
				script.src = src;
				document.body.appendChild(script);
				return this;
			},
			appendDiv: function(divObj){
				var div = document.createElement('div');
				var id = divObj.id || this.getGUID();
				div.id = id;
				if (typeof divObj.html == 'string') { div.innerHTML = divObj.html; }
				if (typeof divObj.style == 'string') { div.setAttribute('style', divObj.style); }
				
				document.body.appendChild(div);

			},
			delay: function(fn, time){
				var task = setTimeout(fn, time);
				return task;
			},
			repeatTimer: function(callback,time){
				var _hash = this.hash = stone.noop;
				setTimeout(function(){
				    if(typeof callback == 'function') { callback();}
				    _hash = arguments.callee;
					setTimeout(arguments.callee,time);	
				},time);
			},
			removeTimer: function(){
				this.removeTimer.hash = null;
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

		    ie6: function(){
		    	return isIE6 = !-[1,] && !window.XMLHttpRequest;
		    }(),

			addURLParam : function(url,name,value){//将请求参数追加到url

				url += (url.indexOf('?') == -1 ? '?' : '&');
				url += encodeURIComponent(name) + '=' + encodeURIComponent(value);

				return url;
			},

			addParam: function(url,name,value){
				url += (url.indexOf('?') == -1 ? '?' : '&');
				url += name + '=' + value;
				return url;				
			},

			getUpper: function(str, pos){
				var pos = pos || 0;
				console.log(str[pos]);
				var rsStr = str[pos].toUpperCase()+str.slice(pos+1);

				return rsStr;
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
			    }///else

			})(),

		    inArray: function(t,a,isRemove){
				if(this.classOf(a) == 'Array'){
					if(!a.length) { return false; }
					var len = a.length;
					for(var i=0; i<len; i++){
						if(t == a[i]){
							return true;
						}
					}

					return false;
				}else {
					this.throwError('TypeError', 'Argumegs[1] Expected Array in Stone.inArray()');
				}
		    },
		    fnRun: function(fnCtn){
		    	var argType = this.getType(fnCtn);
		    	if(argType == 'array'){
		    		var len = fnCtn.length;
		    		for(var i=0; i<len; i++){
		    			fnCtn[i]();
		    		}
		    	}else if(argType == 'object'){
					for(var key in fnCtn) {
						if(fnCtn.hasOwnProperty(key)){
							key();
						}
					}
		    	}else {
		    		throw new TypeError('fnRun Expected Param Array Or Object,But got ' + argType);
		    	}
		    },
		    getAutoIncrement: function(forId, baseNum){
		    	//throw new TypeError('debug');
		    	stone.typeCheck(forId, 'string');
		    	//console.log(forId);		    	
		    	if(typeof _autoIncrement[forId] == 'number'){
		    		return ++_autoIncrement[forId];
		    	}else if(_autoIncrement[forId] == undefined){
		    		_autoIncrement[forId] = baseNum || 0;
		    		return _autoIncrement[forId];
		    	}else {
		    		stone.throwError('UncaughtError', 'Sorry,I don\' know. ');
		    	}

		    },
		    readAutoIncrement: function(forId){
		    	stone.typeCheck(forId, 'string');
		    	//console.log(forId+' >> '+_autoIncrement[forId]);
		    	return _autoIncrement[forId];
		    },
			getGUID: function(forWhat){//产生GUID
				var curGUID = 'xxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
											    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
												return v.toString(16);	
											}).toUpperCase();

				if(typeof forWhat == 'string') {
					_guidBase[forWhat] = curGUID;
				}	
									 
			    return curGUID;
			},
			readGUID: function(forWhat){
				if(typeof forWhat == 'string'){
					return _guidBase[forWhat];
				}else {
					return _guidBase;
				}
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
			    }///switch
		    },
			divLog: function(mes, style){
				var mesCounter = 0;
				return function(){
			  		var guid = this.getGUID();
			  		var info = mes || 'No-Detail-Info';
			  		this.appendDiv({
			  			id: guid,
			  			html: '<span style="margin:0; padding:0; font-weight:bold;">'+ (++mesCounter) + '-</span> '+  new Date() + ':  '+ info, 
			  			style: style || 'display:block; background-color: #A8BE00 /*red*/; font-weight: bold;'
			  		});

		  		};///return function(){...}

		  	}()

		};///var exports
		
		//_exports.constructor = arguments.callee; // Point to function Stone(){...}

		return _exports;

	}();
/* /DEFINE STONE OBJECT ---------------------------------------------------------*/

/* DEFINE REQUIRE FUNCTION ------------------------------------------------------*/
	window.require = function(){
		
		var _srcLogs = [];
		var basePath = './lib/';

		var _require = function(moduleName, fn){
			var loadedScripts = document.getElementsByTagName('script');
			var sLen = loadedScripts.length;
			for(var sI=0; sI<sLen; sI++ ){
				_srcLogs.push(loadedScripts[sI].getAttribute('src'));
			}
			//console.log(_srcLogs);
			
			if(stone.inArray(stone.classOf(moduleName), ['String', 'Array'])) {
				var modName = [].concat(moduleName);

			}else {
				stone.throwError('TyperError', 'moduleName Expected be String or Array, but got '+stone.classOf(moduleName));
			}

			_require.domScriptLoad(modName, fn);

		};///var _require
	 	// COMMON FUNCTION 
	 	_require.require = _require;

	 	_require.domScriptLoad = function(modName, fn){
			var curModName = modName.shift();//获取第一个

			shortName = stone.getShortName(curModName, 'js');
			fullName = stone.getFullName(curModName, 'js');

			var _srcPath = basePath + fullName;		
			//防止重复载入,如果已经再如果一遍了，那么跳过后直接进行下一次载入
			if(stone.inArray(_srcPath, _srcLogs) ) {
				typeof fn == 'function' ? fn() : '';
				if(modName.length > 0){
					arguments.callee(modName);
				}
				else {
					return true;
				}
			}
			//开始载入
			stone.getScript(_srcPath, function(){
				//存入档案
				_srcLogs.push(_srcPath);
				//如果没有全部载入完毕，那么继续递归依次载入(不可用arguments.callee！！！)
				if(modName.length > 0) { _require.domScriptLoad(modName, fn) }
				//如果全部载入完毕，检查是否可以启动stack
				else {
					typeof fn == 'function' ? fn() : '';
				}
			});///END: Stone.getScript	

	 	};

	 	_require.setPath = function(path){
	 		stone.typeCheck(path, 'string');
	 		basePath = path;
	 		return this;
	 	};

		// config require
	 	var _ifOrder = true;

		_require.order = function(){
			if(arguments.length){
				return _ifOrder = true, this.apply(this, arguments);//利用this.apply传递arguments参数
			} else {
				return _ifOrder = true, this;
			}
		};
		_require.go = function(){
			if(arguments.length){
				return _ifOrder = false, this.apply(this, arguments);
			} else {
				return _ifOrder = false, this;
			}
		};
		//设定载入路径
		_require.path = function(path){
			stone.typeCheck(path, 'string');
			this.setPath(path);
			return this;
		};

		//?????? NOT FINISHED 
		_require.async = function(){
			//load by ajax in async
		};
		_require.sync = function(){
			//load by ajax in sync
		};

	 	return _require;

	}();///window.require
/* /DEFINE REQUIRE FUNCTION -----------------------------------------------------*/

/* SET AUTO-LOAD SEED FILE ----------------------------------------------------- */ 
	var _script_rs = document.getElementsByTagName('script');
	var _rs_len = _script_rs.length;
	if(_rs_len) {
		for(var i=0; i<_rs_len; i++){
			var _seed = _script_rs[i].getAttribute('stone-seed');
			if(_seed){
				var _basePath = _script_rs[i].getAttribute('base-path') ;
				if(_basePath) { require.setPath(_basePath);}//如果设定了basePath，否则默认/lib/下
				require(_seed);
				_script_rs = null;
				_rs_len = null;
				break;//when find one seed file ,then break and stop
			}
		}
	}
/* /SET AUTO-LOAD SEED FILE ---------------------------------------------------- */ 

})(window.stone == undefined);////
