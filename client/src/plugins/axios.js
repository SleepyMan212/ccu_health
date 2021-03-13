import Vue from 'vue';
import axios from 'axios'
import VueAxios from 'vue-axios'

axios.defaults.baseURL = "http://your.domain.name/"; // 域名
// Error Handle
const errorHandle = (status, msg) => {
    console.info(msg);
    switch (status) {
        case 400:
            console.log("400")
            Vue.toasted.show('服務請求錯誤', { type: 'error', duration: 3000 });
            break;
        case 401:
            console.log("401")
            Vue.toasted.show('權限不足', { type: 'error', duration: 3000 });
            break;
        default:
            break;
    }
}
// doing something with the request
axios.interceptors.request.use(
    (request) => {
        const jwtToken = localStorage.getItem("jwtToken");
        request.headers.Authorization = jwtToken ? `Bearer ${jwtToken}` : ''
        // do something with request meta data, configuration, etc
        // dont forget to return request object, otherwise your app will get no answer
        return request;
    }
);
// doing something with the response
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;
        if (response) {
            // 成功發出請求且收到 response, 但有 error
            errorHandle(response.status, response.data.error);
            return Promise.reject(error);
        } else {
            // 成功發出請求但沒收到 response
            if (!window.navigator.onLine) {
                //如果是網路斷線
                Vue.toasted.show('網路出了問題, 請重新連線', { type:'error', duration:3000 });
            } else {
                // 其它問題        
                Vue.toasted.show('主機伺服器發生問題, 請連絡資訊單位', { type: 'error', duration: 3000 });
                return Promise.reject(error);
            }
        }
    }
);

Vue.use(VueAxios, axios)
