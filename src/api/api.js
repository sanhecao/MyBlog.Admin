import axios from 'axios';
import router from "../router";
import store from "../store";
import Vue from 'vue';

let base ='http://localhost:2223';
axios.defaults.timeout=20000;

var  storeTemp=store;
axios.interceptors.request.use(
    config=>{
        var curTime=new Date();
        var expiretime= new Date(Date.parse(storeTemp.state.tokenExpire));
        if(storeTemp.state.token && (curTime<expiretime && storeTemp.state.tokenExpire)){
            config.headers.Authorization="Bearer " + storeTemp.state.token;
        }
        saveRefreshtime();
        return config;
    },err=>{
        return Promise.reject(err);
    }
);
axios.interceptors.response.use(
    response=>{
        return response;
    },error => {
        var originalRequest = error.config;
        if(error.code === 'ECONNABORTED'
            && error.message.indexOf('timeout')!==-1 && !originalRequest._retry){
            Vue.prototype.$message({
                message:'请求超时!',
                type:'error'
            });
            originalRequest._retry=true;
            return null;
        }
        if(error.response){
            if(error.response.status===401){
                var curTime=new Date();
                var refreshtime=new  Date(Date.parse(window.localStorage.refreshtime));
                if(window.localStorage.refreshtime && (curTime <= refreshtime)){
                    return  refreshToken({token: window.localStorage.Token}).then((res)=>{
                        if(res.success){
                            Vue.prototype.$message({
                                message:'refreshToken 成功,加载数据',
                                type:'success'
                            });
                            store.commit("saveToken",res.token);

                            var curTime=new Date();
                            var expiredate=new Date(curTime.setSeconds(curTime.getSeconds() +res.expires_in));
                            store.commit("saveTokenExpire",expiredate);

                            error.config.__isRetryRequest=true;
                            error.config.headers.Authorization="Bearer " +res.token;
                            return axios(error.config);
                        }else{
                            ToLogin()
                        }
                    });
                }else
                {
                    ToLogin();
                }
            }
            if(error.response.status===403){
                Vue.prototype.$message({
                    message:"失败!该操作无权限",
                    type:'error'
                });
                return null;
            }
        }
        return "";
    }
);

export const BaseApiUrl =base;
// 登录
export const requestLogin = params => {
    console.log(params);
    return axios.get(`${base}/api/Login/JWTToken3.0`, {params: params}).then(res => res.data);
};
export const saveRefreshtime=params=>{
    let nowtime=new  Date();
    let lastRefreshtime=window.localStorage.refreshtime?
        new Date(window.localStorage.refreshtime):new Date(-1);
    let expretime= new Date(Date.parse(window.localStorage.TokenExpire));
    let refreshCount=1;//滑动系数
    if(lastRefreshtime >= nowtime){
        lastRefreshtime=nowtime>expretime?nowtime:expretime;
        lastRefreshtime.setMinutes(lastRefreshtime.getMinutes() + refreshCount);
        window.localStorage.refreshtime=lastRefreshtime;
    }else{
        window.localStorage.refreshtime=new Date(-1);
    }
};
//根据token获取用户信息
export const getUserByToken=params=>{
    return axios.get(`${base}/api/Users/GetUserInfoByToken`,
        {params:params}).then(res=>{
           return  res.data
    })
};
//菜单模块接口
export  const getNavigationBar=params=>{
return axios.get(`${base}/api/Permission/GetNavigationBar`,
    {params:params}).then(res=>res.data)
};
