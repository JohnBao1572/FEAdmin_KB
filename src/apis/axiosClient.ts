import axios from "axios";
import { error } from "console";
import { config } from "process";
import queryString from "query-string";
import { localDataName } from "../constants/appInfos";

const baseURL = 'http://localhost:5000';

const getAccesstoken = () => {
    const res = localStorage.getItem(localDataName.authData);

    if (res) {
        const auth = JSON.parse(res);
        return auth && auth.token ? auth.token : '';
    } else {
        return '';
    }
}

const axiosClient = axios.create({
    baseURL,
    paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config: any) => {
    const accesstoken = getAccesstoken(); 

    config.headers = {
        Authorization: accesstoken ? 'Bearer ${accesstoken}' : '',
        Accept: 'application/json',
        ...config.headers,
    }

    
    return {...config, data:config.data ?? null};
});

axiosClient.interceptors.response.use(
    (res) => {
        if (res.data && res.status >= 200 && res.status < 300) {
            return res.data;
        } else {
            return Promise.reject(res.data)
        }
    },
    (error) => {
        const { response } = error;
        return Promise.reject(response.data);
    }
)

export default axiosClient;