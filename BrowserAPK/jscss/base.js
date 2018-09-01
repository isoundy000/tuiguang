/** 项目公共js **/
/**
 * 服务器返回状态
 */
var ServerResponseState={
		success:1,		//执行成功标志
		fail:0,			//执行失败，原因见retMsg
		notLogin:2,	//未登录
		noPermission:3	//没有权限
}
String.prototype.startWith = function(compareStr){
	return this.indexOf(compareStr) == 0;
}
var saveIndex;
/**
 * 公用js类
 */
var Common={
		shade:[0.3, '#393D49'],
		/**
		 * ajax的Get请求
		 * @param url 请求地址
		 * @param callback_success 执行成功回调函数 function(data)
		 * @param callback_fail 失败执行回调函数 function(errMsg,errCode)
		 */
		AjaxGet:function(url,callback_before,callback_success,callback_fail){
			$.ajax({
				type:"GET",
				url:url,
				dataType:"json",
				beforeSend:function(){
					if(callback_before!=undefined){
						callback_before();
					}
				},
				success:function(result){
					Common.SuccessHandler(result,callback_success,callback_fail);
				},
				error:function(){
					Common.ErrorHandler(undefined,undefined,callback_fail);
				}
			});
		},
		/**
		 * 同步的Get请求
		 * @param url 请求地址
		 * @param callback_success 执行成功回调函数 function(data)
		 * @param callback_fail 失败执行回调函数 function(errMsg,errCode)
		 */
		SynsGet:function(url,callback_before,callback_success,callback_fail){
			$.ajax({
				type:"GET",
				url:url,
				dataType:"json",
				async:false,
				beforeSend:function(){
					if(callback_before!=undefined){
						callback_before();
					}
				},
				success:function(result){
					Common.SuccessHandler(result,callback_success,callback_fail);
				},
				error:function(){
					Common.ErrorHandler(undefined,undefined,callback_fail);
				}
			});
		},
		/**
		 * Ajax的post提交
		 * @param url 提交url
		 * @param postData 提交数据
		 * @param callback_before 提交前执行函数
		 * @param callback_success	执行成功回调函数 function(data)
		 * @param callback_fail 执行失败回调函数 function(errMsg,errCode)
		 */
		AjaxPost:function(url,postData,callback_before,callback_success,callback_fail){			
			$.ajax({
				type:"POST",
				url:url,
				data:postData,
				async:false,
				dataType:"json",
				beforeSend:function(){
					if(callback_before!=undefined){
						callback_before();
					}
				},
				success:function(result){
					Common.SuccessHandler(result,callback_success,callback_fail);
				},
				error:function(){
					Common.ErrorHandler(undefined,undefined,callback_fail);
				}
			});
		},
		/**
		 * Ajax的post提交
		 * @param url 提交url
		 * @param postData 提交数据
		 * @param callback_before 提交前执行函数
		 * @param callback_success	执行成功回调函数 function(data)
		 * @param callback_fail 执行失败回调函数 function(errMsg,errCode)
		 */
		SyncPost:function(url,postData,callback_before,callback_success,callback_fail){			
			$.ajax({
				type:"POST",
				url:url,
				data:postData,
				dataType:"json",
				beforeSend:function(){
					if(callback_before!=undefined){
						callback_before();
					}
				},
				success:function(result){
					Common.SuccessHandler(result,callback_success,callback_fail);
				},
				error:function(){
					Common.ErrorHandler(undefined,undefined,callback_fail);
				}
			});
		},
		/**
		 * 表单ajax提交绑定
		 * @param formId 表单id，#为非必须
		 * @param callback_before 提交前执行函数，如执行后不提交，返回false
		 * @param callback_success 提交成功回调函数 function(data)
		 * @param callback_fail 提交失败回调函数 function(errMsg,errCode)
		 */
		AjaxSubmitBind:function(formId,callback_before,callback_success,callback_fail,tiptype){
			if(tiptype==1){
				tiptype=function(msg,o,cssctl){
					var objtip=$("#errorTip");
					cssctl(objtip,o.type);
					objtip.text(msg);
				};
			}
			callback_before=(callback_before===undefined?function(){}:callback_before);
			tiptype=(tiptype===undefined?2:tiptype);
			var validateForm=$(Common.GetId(formId)).Validform();
			validateForm.config({
				tiptype:tiptype,
				ajaxPost:true,
				postonce:true,
				beforeSubmit:function(){
					saveIndex=Common.Loading();
					if(callback_before!=undefined){
						callback_before();
					}
				},
				showAllError:true,
				ajaxpost:{
					success:function(result){
						validateForm.resetStatus();
						Common.SuccessHandler(result,callback_success,callback_fail);
					},
					error:function(){
						Common.ErrorHandler(undefined,undefined,callback_fail);
					}
				}
			});
			return validateForm;
		},
		/**
		 * 表单ajax提交绑定
		 * @param formId 表单id，#为非必须
		 * @param callback_before 提交前执行函数，如执行后不提交，返回false
		 */
		SubmitBind:function(formId,callback_before,tiptype){
			if(tiptype==1){
				tiptype=function(msg,o,cssctl){
					var objtip=$("#errorTip");
					cssctl(objtip,o.type);
					objtip.text(msg);
				};
			}
			callback_before=(callback_before===undefined?function(){}:callback_before);
			tiptype=(tiptype===undefined?2:tiptype);
			var validateForm=$(Common.GetId(formId)).Validform();
			validateForm.config({
				tiptype:tiptype,
				postonce:true,
				beforeSubmit:callback_before,
				showAllError:true
			});
			return validateForm;
		},
		/**
		 * 重置表单
		 * @param formId
		 */
		ResetForm:function(formId){
			$(Common.GetId(formId)).Validform().resetForm();
		},
		/**
		 * 清空表单
		 * @param formId
		 */
		ClearForm:function(formId){
			$(Common.GetId(formId)).Validform().clearForm();
		},
		/**
		 * 获取dom的ID
		 * @param id 标签名，如：saveForm或#saveForm
		 * @returns
		 */
		GetId:function(id){
			if(id.indexOf("#")==0){
				return id;
			}else{
				return "#"+id;
			}
		},
		/**
		 * 成功处理函数
		 * @param result 
		 * @param callback_success
		 * @param callback_fail
		 */
		SuccessHandler:function(result,callback_success,callback_fail){
			if(saveIndex){
				Common.Close(saveIndex);
				parent.Common.Close(saveIndex);
			}
			
			if(result.retCode==ServerResponseState.success){
				if(callback_success!=undefined){
					callback_success(result);
				}else{
					Common.TipSuccess("操作成功");
				}
			}else if(result.retCode==ServerResponseState.notLogin){
				Common.Open("请登录",baseUrl+"/login?type=short");
			}else{
				Common.ErrorHandler(result.retMsg,result.retCode,callback_fail);
			}
		},
		/**
		 * 失败处理函数
		 * @param errMsg 错误信息
		 * @param callback_fail 处理函数
		 */
		ErrorHandler:function(errMsg,errCode,callback_fail){
			if(saveIndex){
				Common.Close(saveIndex);
				parent.Common.Close(saveIndex);
			}
			errMsg=(errMsg===undefined?"操作失败":errMsg);
			if(errCode==ServerResponseState.noPermission){
				Common.AlertFail("您没有该操作权限");
				return;
			}
			if(callback_fail!=undefined){
				callback_fail(errMsg,errCode);
			}else{
				if(errCode==ServerResponseState.noPermission){
					Common.AlertFail("您没有该操作权限");
				}else{
					Common.AlertFail(errMsg);
				}
			}
		},
		/**
		 * 跳转页面
		 * @param url
		 */
		Redirect:function(url){
			window.location.href=url;
		},
		/**
		 * 普通信息框
		 * @param message 消息内容
		 * @param callback 回调函数,function(index) 样式
		 */
		Alert:function(message,callback){
			if(parent){
				parent.layer.alert(message,function(index){
					parent.Common.Close(index);
					if(callback!=undefined){
						callback(index);
					}
					
				});
			}else{
				layer.alert(message,function(index){
					Common.Close(index);
					if(callback!=undefined){
						callback(index);
					}
					
				});
			}
			
		},	
		/**
		 * 普通信息框
		 * @param message 消息内容
		 * @param callback 回调函数,function(index) 样式
		 */
		AlertSuccess:function(message,callback){
			if(parent){
				parent.layer.alert(message,{icon: 6},function(index){
					parent.Common.Close(index);
					if(callback!=undefined){
						callback(index);
					}
					
				});
			}else{
				layer.alert(message,{icon: 6},function(index){
					Common.Close(index);
					if(callback!=undefined){
						callback(index);
					}
					
				});
			}
		},	
		/**
		 * 普通信息框
		 * @param message 消息内容
		 * @param callback 回调函数,function(index) 样式
		 */
		AlertFail:function(message,callback){
			if(parent){
				parent.layer.alert(message,{icon: 5},function(index){
					parent.Common.Close(index);
					if(callback!=undefined){
						callback(index);
					}
					
				});
			}else{
				layer.alert(message,{icon: 5},function(index){
					Common.Close(index);
					if(callback!=undefined){
						callback(index);
					}
					
				});
			}
			
		},	
		/**
		 * 提示
		 * @param message
		 */
		Tip:function(message,callback){
			if(parent){
				parent.layer.msg(message,callback);
			}else{
				layer.msg(message,callback);
			}
			
		},
		/**
		 * 提示
		 * @param message
		 */
		TipId:function(message,tipId){
			layer.tips(message,Common.GetId(tipId),{tips:[4,"#78BA32"]});
		},
		/**
		 * 提示成功
		 * @param message
		 */
		TipSuccess:function(message,callback){
			if(parent){
				parent.layer.msg(message, {icon: 1,time:2000},callback);
			}else{
				layer.msg(message, {icon: 1,time:2000},callback);
			}
			
		},
		/**
		 * 提示失败
		 * @param message
		 */
		TipFail:function(message,callback,width){
			if(parent){
				parent.layer.msg(message, {icon: 5,time:2000},callback);
			}else{
				layer.msg(message, {icon: 5,time:2000},callback);
			}
			
		},
		/**
		 * 询问框
		 * @param message
		 * @param title 标题，默认“请确认”
		 * @param callback 回调函数，function(index){ }
		 */
		Confirm:function(title,message,callback){
			title=(title===undefined?"请确认":title);
			if(parent){
				parent.layer.confirm(message, {icon: 3, title:title},function(index){
					Common.Close(index);
					if(callback!=undefined){
						callback(index);
					}
				    
				});     
			}else{
				layer.confirm(message, {icon: 3, title:title},function(index){
					Common.Close(index);
					if(callback!=undefined){
						callback(index);
					}
				    
				});     
			}
			  
		},
		/**
		 * 加载层
		 * @param msg 加载提示消息
		 * @param func 加载执行函数 function(index)
		 * @param maxTime
		 */
		Loading:function(msg,func,maxTime){
			var index;
			if(parent){
				if(msg!=undefined){
					index=parent.layer.msg(msg, {icon: 16,time: 0,shade:Common.shade,shadeClose:false});
				}else{
					if(maxTime!=undefined){
						index=parent.layer.load(1,{time:maxTime,shade:Common.shade,shadeClose:false});
					}else{
						index=parent.layer.load(1,{shade:Common.shade,shadeClose:false});
					}
				}
				if(func!=undefined){
					func(index);
				}
				return index;
			}else{
				if(msg!=undefined){
					index=layer.msg(msg, {icon: 16,time: 0,shade:Common.shade,shadeClose:false});
				}else{
					if(maxTime!=undefined){
						index=layer.load(1,{time:maxTime,shade:Common.shade,shadeClose:false});
					}else{
						index=layer.load(1,{shade:Common.shade,shadeClose:false});
					}
				}
				if(func!=undefined){
					func(index);
				}
				return index;
			}
			
		},
		/**
		 * 回退
		 */
		GoBack:function(){
			history.back();
		},
		/**
		 * 刷新页面
		 */
		Reload:function(){
			location.reload();
		},
		/**
		 * 刷新iframe
		 * @param id
		 */
		ReloadIframe:function(id){
			if(parent){
				parent.document.getElementById(id).contentWindow.location.reload(true);
			}else{
				document.getElementById(id).contentWindow.location.reload(true);
			}
			
		},
		/**
		 * 打开窗口
		 * @param title
		 * @param url
		 * @param w
		 * @param h
		 * @param isOpenMax 是否打开即最大化
		 */
		Open:function(title,url,w,h,isOpenMax,maxmin){
			if (w == undefined || w == '') {
				w='500px';
			}else{
				w=w+'px';
			}
			if (h == undefined || h == '') {
				h='400px';
			}else{
				h=h+'px';
			}
			if (maxmin==undefined){
				maxmin=true;
			}
			if (title == undefined || title == '') {
				title=false;
			};
			if (url == undefined || url == '') {
				url=baseUrl+"/404.html";
			};
			if(isOpenMax===undefined){
				isOpenMax=false;
			}
			if(parent){
				openIndex=parent.layer.open({
			    	type: 2,
			    	content:url,
			    	shadeClose: false,
			    	title: title,
					maxmin:maxmin,
			    	closeBtn: 1,
			    	shade: Common.shade,
			    	area: [w, h],
			    	scrollbar: false
				});
				parent.openIndex=openIndex;
				if(isOpenMax){
					parent.layer.full(openIndex);
				}
			}else{
				openIndex=layer.open({
			    	type: 2,
			    	content:url,
			    	shadeClose: false,
			    	title: title,
					maxmin:maxmin,
			    	closeBtn: 1,
			    	shade: Common.shade,
			    	area: [w, h],
			    	scrollbar: false
				});
				if(isOpenMax){
					layer.full(openIndex);
				}
			}
			
		},
		/**
		 * 打开页内元素
		 * @param id
		 */
		OpenId:function(title,id,w,h,isOpenMax){
			if (w == null || w == '') {
				w='500px';
			}else{
				w=w+'px';
			}
			if (h == null || h == '') {
				h='400px';
			}else{
				h=h+'px';
			}
			
			if (title == null || title == '') {
				title=false;
			};
			if(isOpenMax===undefined){
				isOpenMax=false;
			}
			openIndex=layer.open({
				type:1,
				title: title,
				maxmin:true,
		    	closeBtn: 1,
		    	area: [w, h],
				content:$(Common.GetId(id))
			})
			if(isOpenMax){
				layer.full(openIndex);
			}
		},
		/**
		 * 暂停时间，以秒为单位
		 * @param time 秒
		 * @param callback 回调函数
		 */
		Pause:function(time,callback){
			time=(time===undefined?2000:time*1000);
			if(callback!=undefined){
				setTimeout(callback,time);
			}else{
				var njf1 = njen(this,arguments,"millis");
				nj:while(1) {
					try{
						switch(njf1.cp) { 
						case 0:njf1._notifier=NjsRuntime.createNotifier();
							setTimeout(njf1._notifier,njf1._millis);
							njf1.cp = 1;
							njf1._notifier.wait(njf1);
							return;
						case 1:break nj;
						}
					} 
					catch(ex) { 
						if(!njf1.except(ex,1)) 
						return; 
					}
				} 
				njf1.pf();
			}
		},
		/**
		 * 关闭窗口，如不填index，关闭所有窗口
		 * @param index
		 */
		Close:function(index){
			if(index!=undefined){
				layer.close(index);
			}else{
				layer.closeAll();
			}
		},
		/**
		 * 关闭本窗口
		 */
		CloseSelf:function(){
			parent.layer.close(parent.openIndex);
		},
		/**
		 * 关闭所有
		 * @param type
		 */
		CloseAll:function(type){
			layer.closeAll(type);
		},
		/**
		 * 通用删除函数
		 * @param url
		 */
		Delete:function(url,width){
			width=(width===undefined?'400':width);
			Common.Confirm("请确认","删除不可恢复，请确认是否删除？",function(index){
				Common.AjaxGet(url,function(){
					Common.Close(index);
					saveIndex=Common.Loading("正在删除中……");
				},function(data){
					Common.TipSuccess("删除成功");
					Common.Pause(1,function(){
						Common.Reload();
					});
				});
			},width);
		},
		/**
		 * 批量删除
		 * @param checkboxName
		 * @param url
		 * @param postName
		 */
		DeleteMult:function(checkboxName,url,postName,width){
			width=(width===undefined?'400':width);
			postName=(postName===undefined?"ids":postName);
			var idsStr="";
			var isFirst=true;
			$("input[name="+checkboxName+"]:checked").each(function(){
				if(isFirst){
					idsStr+=$(this).val();
					isFirst=false;
				}else{
					idsStr+=","+$(this).val();
				}
			});
			if(idsStr.length==0){
				Common.Alert("请选择要删除的数据");
				return;
			}
			if(url.indexOf("?")>-1){
				url=url+"&"+postName+"="+idsStr;
			}else{
				url=url+"?"+postName+"="+idsStr;
			}
			Common.Delete(url,width);
		},
		/**
		 * 通用操作函数，by Zhoudc
		 * @param url
		 * @param handleName 操作名称
		 * @param callback 回调函数
		 * @param width 宽度
		 */
		Handle:function(url,handleName,callback,width){
			width=(width===undefined?"400":width);
			handleName=(handleName===undefined?"操作":handleName);
			Common.Confirm("请确认","请确认是否"+handleName+"？",function(index){
				Common.AjaxGet(url,function(){
					Common.Close(index);
					saveIndex=Common.Loading("正在"+handleName+"中……");
				},function(data){
					Common.TipSuccess(handleName+"成功",width);
					Common.Pause(1,function(){
						if(callback!=undefined){
							callback();
						}
					});
				});
			},width);
		},
		HandlePost: function (url,postData, handleName, callback, width) {
		    width = (width === undefined ? "400" : width);
		    handleName = (handleName === undefined ? "操作" : handleName);
		    Common.Confirm("请确认", "请确认是否" + handleName + "？", function (index) {
		        Common.AjaxPost(url,postData, function () {
		            Common.Close(index);
		            saveIndex = Common.Loading("正在" + handleName + "中……");
		        }, function (data) {
		            Common.TipSuccess(handleName + "成功", width);
		            Common.Pause(1, function () {
		                if (callback != undefined) {
		                    callback();
		                }
		            });
		        });
		    }, width);
		},
		/**
		 * 批量操作
		 * @param checkboxName
		 * @param url
		 * @param postName
		 * @param callback 回调函数
		 */
		HandleMult:function(checkboxName,url,postName,handleName,callback,width){
			width=(width===undefined?"400":width);
			postName=(postName===undefined?"ids":postName);
			var idsStr=Common.GetSelectIds(checkboxName);
			if(idsStr.length==0){
				Common.Alert("请选择要"+handleName+"的数据");
				return;
			}
			if(url.indexOf("?")>-1){
				url=url+"&"+postName+"="+idsStr;
			}else{
				url=url+"?"+postName+"="+idsStr;
			}
			Common.Handle(url,handleName,callback,width);
		},
		/**
		 * 获取选中的项
		 * @param checkboxName
		 * @returns {String}
		 */
		GetSelectIds:function(checkboxName){
			var idsStr="";
			var isFirst=true;
			$("input[name="+checkboxName+"]:checked").each(function(){
				if(isFirst){
					if($(this).val()!=""){
						idsStr+=$(this).val();
						isFirst=false;
					}
					
				}else{
					idsStr+=","+$(this).val();
				}
			});
			return idsStr;
		},
		/**
		 * 通用方法:当前页面提交,结果返回当前页面
		 * @author liuzw
		 * @param operateTip
		 * @param fromId
		 */
		AjaxPostSubmitBind:function(fromId,operateTip,tiptype){			
			fromId=(fromId===undefined?"saveForm":fromId);
			Common.AjaxSubmitBind(fromId,function(){
				saveIndex=Common.Loading("正在"+operateTip+"中……");
			},function(data){				
				Common.TipSuccess(operateTip+"成功");
				Common.Pause(1,function(){
			    	Common.Reload();
				});
			},function(errMsg,errCode){
				Common.Alert(errMsg);
			},tiptype);
		},
		/**
		 * 搜集表单数据，返回map
		 * @author liuzw
		 * @param id form的id
		 */
		CollectForm:function(id){
			map={};
			$(Common.GetId(id)).find("input[name!=''],select[name!=''],textarea[name!=''],input:radio:checked").each(function(){
				if($(this).attr("name") && $(this).val()!=""){
					map[$(this).attr("name")]=$(this).val();
				}
			});
			return map;
		},
		/**
		 * 当前页面跳转
		 */
		GoUrl:function(url){
		    window.location.href=url;
		},
		/**
		 * 打开新页面
		 */
		OpenWindow:function(url){
			window.open(url);
		},
		/**
		 * 全选
		 * @param checkName
		 * @param checkState
		 */
		CheckAll:function(obj,checkName){
			var checkState=$(obj).find("i").hasClass("fa-check-square-o");
			if(checkState){
				$(obj).find("i").removeClass("fa-check-square-o");
				$(obj).find("i").addClass("fa-square-o");
			}else{
				$(obj).find("i").addClass("fa-check-square-o");
				$(obj).find("i").removeClass("fa-square-o");
			}
			$("input[name="+checkName+"]").prop("checked",!checkState);
		},
		/**
		 * 获取绝对url
		 * @param url
		 * @returns
		 */
		GetUrl:function(url){
			if(!url){
				return "";
			}
			if(!(url.indexOf("http://")==0 || url.indexOf("https://"))){
				url=baseUrl+url;
			}
			return url;
		},
		/**
		 * 获取图片url地址
		 * @param url
		 * @param width
		 * @param height
		 * @returns
		 */
		GetImageUrl:function(url,width,height){
			url=Common.GetUrl(url);
			url+="?imageView2/1";
			if(width!=undefined){
				url+="/w/"+width;
			}
			if(height!=undefined){
				url+="/h/"+height;
			}
			return url;
		}
}
//消息提醒
var newMessageRemind = function () { 
    var i = 0, 
        title = document.title, 
        loop; 
  
    return { 
        show: function (tip) { 
            loop = setInterval(function () { 
                i++; 
                if ( i == 1 ) document.title = '【'+tip+'】' + title; 
                if ( i == 2 ) document.title = '【　　　】' + title; 
                if ( i == 3 ) i = 0; 
            }, 800); 
        }, 
        stop: function () { 
            clearInterval(loop); 
            document.title = title; 
        } 
    }; 
}();
$(function () {
    window.onload = function () {
        Loading(false);
    }
})
Loading = function (bool, text) {
    var ajaxbg = top.$("#loading_background,#loading_manage");
    if (bool) {
        ajaxbg.show();
    } else {
        if (top.$("#loading_manage").attr('istableloading') == undefined) {
            ajaxbg.hide();
            top.$(".ajax-loader").remove();
        }
    }
    if (!!text) {
        top.$("#loading_manage").html(text);
    } else {
        top.$("#loading_manage").html("正在拼了命为您加载…");
    }
    top.$("#loading_manage").css("left", (top.$('body').width() - top.$("#loading_manage").width()) / 2 - 54);
    top.$("#loading_manage").css("top", (top.$('body').height() - top.$("#loading_manage").height()) / 2);
}
$.fn.jqGridEx = function (options) {
    var $jqGrid = $(this);
    var _selectedRowIndex;
    if (!$jqGrid.attr('id')) {
        return false;
    }
    var defaults = {
        url: "",
        datatype: "json",
        height: $(window).height() - 139.5,
        autowidth: true,
        colModel: [],
        viewrecords: true,
        rowNum: 30,
        rowList: [30, 50, 100],
        pager: "#gridPager",
        sortname: 'CreateDate desc',
        rownumbers: true,
        shrinkToFit: false,
        gridview: true,
        onSelectRow: function () {
            _selectedRowIndex = $("#" + this.id).getGridParam('selrow');
        },
        gridComplete: function () {
            $("#" + this.id).setSelection(_selectedRowIndex, false);
        }
    };
    var options = $.extend(defaults, options);
    $jqGrid.jqGrid(options);
}
$.fn.jqGridRowValue = function (code) {
    var $jgrid = $(this);
    var json = [];
    var selectedRowIds = $jgrid.jqGrid("getGridParam", "selarrrow");
    if (selectedRowIds != undefined && selectedRowIds != "") {
        var len = selectedRowIds.length;
        for (var i = 0; i < len ; i++) {
            var rowData = $jgrid.jqGrid('getRowData', selectedRowIds[i]);
            json.push(rowData[code]);
        }
    } else {
        var rowData = $jgrid.jqGrid('getRowData', $jgrid.jqGrid('getGridParam', 'selrow'));
        json.push(rowData[code]);
    }
    return String(json);
}
$.fn.jqGridRow = function () {
    var $jgrid = $(this);
    var json = [];
    var selectedRowIds = $jgrid.jqGrid("getGridParam", "selarrrow");
    if (selectedRowIds != "") {
        var len = selectedRowIds.length;
        for (var i = 0; i < len ; i++) {
            var rowData = $jgrid.jqGrid('getRowData', selectedRowIds[i]);
            json.push(rowData);
        }
    } else {
        var rowData = $jgrid.jqGrid('getRowData', $jgrid.jqGrid('getGridParam', 'selrow'));
        json.push(rowData);
    }
    return json;
}
$.currentIframe = function (tabiframeId) {
    if ($.isbrowsername() == "Chrome" || $.isbrowsername() == "FF") {
        return top.frames[tabiframeId];
    }
    else {
        return top.frames[tabiframeId];
    }
}

$.isbrowsername = function () {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    }; //判断是否Opera浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    } //判断是否Firefox浏览器
    if (userAgent.indexOf("Chrome") > -1) {
        if (window.navigator.webkitPersistentStorage.toString().indexOf('DeprecatedStorageQuota') > -1) {
            return "Chrome";
        } else {
            return "360";
        }
    }//判断是否Chrome浏览器//360浏览器
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    } //判断是否Safari浏览器
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    }; //判断是否IE浏览器
}
$.download = function (url, data, method) {
    if (url && data) {
        data = typeof data == 'string' ? data : jQuery.param(data);
        var inputs = '';
        $.each(data.split('&'), function () {
            var pair = this.split('=');
            inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
        });
        $('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>').appendTo('body').submit().remove();
    };
};
$.standTabchange = function (object, forid) {
    $(".standtabactived").removeClass("standtabactived");
    $(object).addClass("standtabactived");
    $('.standtab-pane').css('display', 'none');
    $('#' + forid).css('display', 'block');
}
$.isNullOrEmpty = function (obj) {
    if ((typeof (obj) == "string" && obj == "") || obj == null || obj == undefined) {
        return true;
    }
    else {
        return false;
    }
}
$.arrayClone = function (data) {
    return $.map(data, function (obj) {
        return $.extend(true, {}, obj);
    });
}
$.windowWidth = function () {
    return $(window).width();
}
$.windowHeight = function () {
    return $(window).height();
}

 
IsNumber = function (obj) {
    $("#" + obj).bind("contextmenu", function () {
        return false;
    });
    $("#" + obj).css('ime-mode', 'disabled');
    $("#" + obj).keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });
}
IsMoney = function (obj) {
    $("#" + obj).bind("contextmenu", function () {
        return false;
    });
    $("#" + obj).css('ime-mode', 'disabled');
    $("#" + obj).bind("keydown", function (e) {
        var key = window.event ? e.keyCode : e.which;
        if (isFullStop(key)) {
            return $(this).val().indexOf('.') < 0;
        }
        return (isSpecialKey(key)) || ((isNumber(key) && !e.shiftKey));
    });
    function isNumber(key) {
        return key >= 48 && key <= 57
    }
    function isSpecialKey(key) {
        return key == 8 || key == 46 || (key >= 37 && key <= 40) || key == 35 || key == 36 || key == 9 || key == 13
    }
    function isFullStop(key) {
        return key == 190 || key == 110;
    }
}
checkedArray = function (id) {
    var isOK = true;
    if (id == undefined || id == "" || id == 'null' || id == 'undefined') {
        isOK = false;
        dialogMsg('您没有选中任何项,请您选中后再操作。', 0);
    }
    return isOK;
}
checkedRow = function (id) {
    var isOK = true;
    if (id == undefined || id == "" || id == 'null' || id == 'undefined') {
        isOK = false;
        dialogMsg('您没有选中任何数据项,请选中后再操作！', 0);
    } else if (id.split(",").length > 1) {
        isOK = false;
        dialogMsg('很抱歉,一次只能选择一条记录！', 0);
    }
    return isOK;
}
reload = function () {
    location.reload();
    return false;
}
formatDate = function (v, format) {
    if (!v) return "";
    var d = v;
    if (typeof v === 'string') {
        if (v.indexOf("/Date(") > -1)
            d = new Date(parseInt(v.replace("/Date(", "").replace(")/", ""), 10));
        else
            d = new Date(Date.parse(v.replace(/-/g, "/").replace("T", " ").split(".")[0]));//.split(".")[0] 用来处理出现毫秒的情况，截取掉.xxx，否则会出错
    }
    var o = {
        "M+": d.getMonth() + 1,  //month
        "d+": d.getDate(),       //day
        "h+": d.getHours(),      //hour
        "m+": d.getMinutes(),    //minute
        "s+": d.getSeconds(),    //second
        "q+": Math.floor((d.getMonth() + 3) / 3),  //quarter
        "S": d.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};


dialogTop = function (content, type) {
    $(".tip_container").remove();
    var bid = parseInt(Math.random() * 100000);
    $("body").prepend('<div id="tip_container' + bid + '" class="container tip_container"><div id="tip' + bid + '" class="mtip"><i class="micon"></i><span id="tsc' + bid + '"></span><i id="mclose' + bid + '" class="mclose"></i></div></div>');
    var $this = $(this);
    var $tip_container = $("#tip_container" + bid);
    var $tip = $("#tip" + bid);
    var $tipSpan = $("#tsc" + bid);
    //先清楚定时器
    clearTimeout(window.timer);
    //主体元素绑定事件
    $tip.attr("class", type).addClass("mtip");
    $tipSpan.html(content);
    $tip_container.slideDown(300);
    //提示层隐藏定时器
    window.timer = setTimeout(function () {
        $tip_container.slideUp(300);
        $(".tip_container").remove();
    }, 4000);
    $("#tip_container" + bid).css("left", ($(window).width() - $("#tip_container" + bid).width()) / 2);
}
dialogOpen = function (options) {
    Loading(true);
    var defaults = {
        id: null,
        title: '系统窗口',
        width: "100px",
        height: "100px",
        url: '',
        shade: 0.3,
        btn: ['确认', '关闭'],
        callBack: null
    };
    var options = $.extend(defaults, options);
    var _url = options.url;
    var _width = top.$.windowWidth() > parseInt(options.width.replace('px', '')) ? options.width : top.$.windowWidth() + 'px';
    var _height = top.$.windowHeight() > parseInt(options.height.replace('px', '')) ? options.height : top.$.windowHeight() + 'px';
    top.layer.open({
        id: options.id,
        type: 2,
        shade: options.shade,
        title: options.title,
        fix: false,
        area: [_width, _height],
        content: top.contentPath + _url,
        btn: options.btn,
        yes: function () {
            options.callBack(options.id)
        }, cancel: function () {
            return true;
        }
    });
}
dialogContent = function (options) {
    var defaults = {
        id: null,
        title: '系统窗口',
        width: "100px",
        height: "100px",
        content: '',
        btn: ['确认', '关闭'],
        callBack: null
    };
    var options = $.extend(defaults, options);
    top.layer.open({
        id: options.id,
        type: 1,
        title: options.title,
        fix: false,
        area: [options.width, options.height],
        content: options.content,
        btn: options.btn,
        yes: function () {
            options.callBack(options.id)
        }
    });
}
dialogAlert = function (content, type) {
    if (type == -1) {
        type = 2;
    }
    top.layer.alert(content, {
        icon: type,
        title: "力软提示"
    });
}
dialogConfirm = function (content, callBack) {
    top.layer.confirm(content, {
        icon: 7,
        title: "力软提示",
        btn: ['确认', '取消'],
    }, function () {
        callBack(true);
    }, function () {
        callBack(false)
    });
}
dialogMsg = function (content, type) {
    if (type == -1) {
        type = 2;
    }
    top.layer.msg(content, { icon: type, time: 4000, shift: 5 });
}
dialogClose = function () {
    try {
        var index = top.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        var $IsdialogClose = top.$("#layui-layer" + index).find('.layui-layer-btn').find("#IsdialogClose");
        var IsClose = $IsdialogClose.is(":checked");
        if ($IsdialogClose.length == 0) {
            IsClose = true;
        }
        if (IsClose) {
            top.layer.close(index);
        } else {
            location.reload();
        }
    } catch (e) {
        alert(e)
    }
}