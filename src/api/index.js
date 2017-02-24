import Vue from 'vue'
import VueResource from 'vue-resource'
import * as config from '../config'
Vue.use(VueResource);
var configHttpOptions = () => {
    Vue.http.options.credentials = true;
    // Vue.http.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
    Vue.http.options.timeout = 15000;
    Vue.http.options.emulateJSON = true;
};
var baseConfig = {
    credentials: true,
    timeout: 15000
    // headers: {
    //     'Content-Type': 'application/json'
    // }
};
configHttpOptions();
export default {
get: (url, dataObj, opt = {}) => {
        return new Promise((resolve, reject) => {
            var absoluteUrl = config.serverUrl + url;
            var options = Object.assign({}, baseConfig, opt);
            options.params = {para:JSON.stringify(dataObj)};
            Vue.http.get(absoluteUrl, options).then(res => {
                if (res.body.code == 200) {
	                res.body.data ? resolve(res.body.data) : resolve(res.body);
                } else {
                    reject(res.body.data)
                }
            }, res => {
                reject(res.body)
            })
        })
    },
    post: (url, dataObj, opt = {}) => {
        return new Promise((resolve, reject) => {
            var absoluteUrl = config.serverUrl + url;
            var options = Object.assign({}, baseConfig, opt);
            console.log()
            Vue.http.post(absoluteUrl, {para:JSON.stringify(dataObj)}, options).then(res => {
                resolve(res.body)
            }, res => {
                reject(res.body)
            })
        })
    }
}