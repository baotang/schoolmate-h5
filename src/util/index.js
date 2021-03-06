import $api from 'api';
import store from '../store';
import { MessageBox } from 'mint-ui';
import router from '../router'
import {chooseImage, uploadImage} from './wechat-api';
import {server} from '../config'
export default {
    isEmail (str) {
        const reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        return reg.test(str);
    },
    css (el, attr) {
       let style;
       if (!attr) return;
       if (el.currentStyle) {
           style = el.currentStyle;
           return style.getAttribute(attr);
       } else {
           style = window.getComputedStyle(el, null);
           return style.getPropertyValue(attr);
       }
    },
    addClass (el, className) {
        let classStr = el.getAttribute('class');
        if (classStr.indexOf(className) < 0) {
            classStr += ' ' + className;
        }
        el.setAttribute('class', classStr);
    },
    removeClass (el, className) {
        const regular = new RegExp(className, 'ig');
        let classStr = el.getAttribute('class');
        classStr = classStr.replace(regular, '').trim();
        el.setAttribute('class', classStr);
    },
    dateFormat (timestamp, mask) {
        var d;
        if(!timestamp) return timestamp;
        if( timestamp instanceof Date){
          d = timestamp;
        }else{
          if(String(timestamp).length < 13){
            timestamp = parseInt(timestamp) * 1000;
          }else{
            timestamp = parseInt(timestamp);
          }
          d = new Date(timestamp);
        }
        var zeroize = function(value, length) {
          if (!length) length = 2;
          value = String(value);
          for (var i = 0, zeros = ''; i < (length - value.length); i++) {
            zeros += '0';
          }
          return zeros + value;
        };
        return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function($0) {
          switch ($0) {
            case 'd':
              return d.getDate();
            case 'dd':
              return zeroize(d.getDate());
            case 'ddd':
              return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
            case 'dddd':
              return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
            case 'M':
              return d.getMonth() + 1;
            case 'MM':
              return zeroize(d.getMonth() + 1);
            case 'MMM':
              return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
            case 'MMMM':
              return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
            case 'yy':
              return String(d.getFullYear()).substr(2);
            case 'yyyy':
              return d.getFullYear();
            case 'h':
              return d.getHours() % 12 || 12;
            case 'hh':
              return zeroize(d.getHours() % 12 || 12);
            case 'H':
              return d.getHours();
            case 'HH':
              return zeroize(d.getHours());
            case 'm':
              return d.getMinutes();
            case 'mm':
              return zeroize(d.getMinutes());
            case 's':
              return d.getSeconds();
            case 'ss':
              return zeroize(d.getSeconds());
            case 'l':
              return zeroize(d.getMilliseconds(), 3);
            case 'L':
              var m = d.getMilliseconds();
              if (m > 99) m = Math.round(m / 10);
              return zeroize(m);
            case 'tt':
              return d.getHours() < 12 ? 'am' : 'pm';
            case 'TT':
              return d.getHours() < 12 ? 'AM' : 'PM';
            case 'Z':
              return d.toUTCString().match(/[A-Z]+$/);
            // Return quoted strings with the surrounding quotes removed
            default:
              return $0.substr(1, $0.length - 2);
          }
        });
    },
    parseJSON(str){
      function parse(dataObj) {
        try{
          JSON.parse(dataObj)
        }catch(e){
          return dataObj
        }
        if(Array.isArray(dataObj)){
          dataObj.map(item =>{
            return parse(item);
          });
        }else{
          var keyArr = Object.keys(dataObj);
          keyArr.forEach(item=>{
            dataObj[item] = parse(dataObj[item]);
          })
        }
        return dataObj;
      }
      if(typeof str != 'string'){
        return str;
      }
      try{
        var obj = JSON.parse(str);
        return parse(obj);
      }catch(e){
        return str;
      }
      
    },
    isIOS(){
      let ua = navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(ua);
    },
    isAuthored(msg) {
      return new Promise(( resolve, reject ) => {
        if(!store.state.user.profile.first_logined){
          $api.get('/Profile/getProfile')
            .then( data => {
              if(data.profile.first_logined == '0'){
                resolve()
              }else {
                  msg = msg || '此操作需要完善个人信息';
                  MessageBox.confirm(msg).then(data=>{
                      router.push('/entrance');
                  },data=>{

                  });
                  reject();
              }
            }, data => {
                MessageBox.alert('服务器异常');
                reject();
            });
        }else{
            if(store.state.user.profile.first_logined == '0'){
                resolve()
            }else{
                MessageBox.confirm('请到菜单【我的】里注册后操作').then(data=>{
                    router.push('/entrance');
                },data=>{

                });
                reject()
            }
        }
      });
    },
    refresh() {

      return new Promise((resolve,reject)=>{
        let iframe = document.createElement('iframe');
        iframe.src= require('../assets/images/favicon.ico');
        iframe.style.display = 'none';
        document.getElementsByTagName('body')[0].appendChild(iframe);
        let refreshFn = function () {
          setTimeout(function() {
            iframe.removeEventListener('load',refreshFn,false);
            iframe.parentNode.removeChild(iframe);
            resolve();
          }, 0);
        };
        iframe.addEventListener('load',refreshFn, false);
      });
    },
    transformTextToHtml(str){
        str = str || '';
        str = str.replace(/(\<)|(\>)|(\n)/ig,function($0){
            if($0 == '<'){
                return '&lt;';
            }else if($0 == '>'){
                return '&gt;';
            }else{
                return '<br/>';
            }
        });
        return str;
    },
    getPathByIds(ids){
      return $api.get('/Picture/getPathByID',{ids:ids.join(',')})
    },
    wxUpload({count,onSelectEnd}){
      let localIds = [];
      let serverIdArr = [];
      return new Promise((resolve,reject)=>{
        let upload = ()=>{
          let localId = localIds.pop();
          uploadImage(localId)
            .then(serverId=>{
              serverIdArr.push(serverId);
              if(localIds.length > 0){
                 upload();
              }else{
                 resolve(serverIdArr);
              }
            },err=>{
              reject(err);
            })
        };
        chooseImage({count})
          .then(idArr=>{
            localIds = idArr;
            onSelectEnd && onSelectEnd();
            upload();
          },err=>{
            reject(err);
          });
      });
  },
    postUrl(url){
        if(url && url.indexOf('http') != 0){
            url = `${server}/${url}`;
        }
        return url;
    }
}