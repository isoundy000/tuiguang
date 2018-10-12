


var dom="",enforced="1",sword="",ref_url = document.referrer;
var topdomain=getRealDomain(window.location.host),reftopdomain=getRealDomain(ref_url),engine='';
var sn = window.location.host;

if(ref_url!="" || ref_url!=undefined) {
    var u = decodeURIComponent(ref_url);
    if (u.indexOf('m.baidu') != -1) {
        if (u.indexOf('w=0_10_') != -1) {
            var w_pos = u.indexOf('w=0_10_');
            u = u.slice(w_pos+ 'w=0_10_'.length);
            var w_pos2 = u.indexOf('/t=');
            sword = encodeURIComponent(u.slice(0, w_pos2));
        }

    } else if(u.indexOf('wap.sogou') != -1) {
        if (u.indexOf('keyword') != -1) {
            var w_pos = u.indexOf('keyword=');
            u = u.slice(w_pos+ 'keyword='.length);
            var w_pos2 = u.indexOf('&');
            sword = encodeURIComponent(u.slice(0, w_pos2));
        }
i
    } else if(u.indexOf('m.sogou') != -1) {
        if (u.indexOf('keyword') != -1) {
            var w_pos = u.indexOf('keyword=');
            u = u.slice(w_pos+ 'keyword='.length);
            var w_pos2 = u.indexOf('&');
            sword = encodeURIComponent(u.slice(0, w_pos2));
        }

    } else if(u.indexOf('01baidujssjkj') != -1) {
        if (u.indexOf('q') != -1) {
            var w_pos = u.indexOf('q=');
            u = u.slice(w_pos+ 'q='.length);
            var w_pos2 = u.indexOf('&');
            sword = encodeURIComponent(u.slice(0, w_pos2));
        }

    } else if(u.indexOf('01baidujssjkj') != -1) {
        if (u.indexOf('q') != -1) {
            var w_pos = u.indexOf('q=');
            u = u.slice(w_pos+ 'q='.length);
            var w_pos2 = u.indexOf('&');
            sword = encodeURIComponent(u.slice(0, w_pos2));
        }

    }
}
    a = location.hash;
    if(enforced=='0') {
        if(ref_url){
            if (a.indexOf('r')<0) {
                history.pushState({page:1}, 'r', location.href+'#r');
            }
        }
    } else {
        if(427==258 && u.indexOf('m.baidu')){
            if (a.indexOf('nobaidu')<0) {
                history.pushState({page:1}, 'r', location.href+'#nobaidu');
            }
        } else {
            if (a.indexOf('r')<0) {
                history.pushState({page:1}, 'r', location.href+'#r');
            }
        }
    }
window.onpopstate = function(event) {
    a = location.hash;
    if (event.state==null || event.state.lr==null) {
        if (a.indexOf('r')<0) {
            location.href = r;
        }
    } else {
        if (a.indexOf('r')<0) {
            location.href = r;
        }
    }
};

function getRealDomain(domains){
    var redomain='';
    var domainArray=new Array('com','net','org','gov','edu','com.cn','cn','biz','info','pro','name','museum','coop','aero','xxx','idv','mobi','cc','me');
    var domains_array=domains.split('.');
    var domain_count=domains_array.length-1;
    var flag=false;
    if(domains_array[domain_count]=='cn'){
        for(i=0;i<domainArray.length;i++){
            if(domains_array[domain_count-1]==domainArray[i]){
                flag=true;break
            }
        }
        if(flag==true){
            redomain=domains_array[domain_count-2]+"."+domains_array[domain_count-1]+"."+domains_array[domain_count]
        }else{
            redomain=domains_array[domain_count-1]+"."+domains_array[domain_count]
        }
    }else{
        redomain=domains_array[domain_count-1]+"."+domains_array[domain_count]
    }
    return redomain
};