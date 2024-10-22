/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { BASE_URL, REQUEST_TIMEOUT } from "../utils/constants";

interface Options {
    url: string;
    customHeaders?: any;
    params?: any;
    payload?: Object;
}

const getHeaders = (customHeaders: any) => {
    return {
        ...customHeaders,
        Accept: "application/json",
        "Content-Type": "application/json",
    }
};

axios.defaults.baseURL = BASE_URL;

const requestInterceptor = (req: InternalAxiosRequestConfig<any>): InternalAxiosRequestConfig<any> | Promise<InternalAxiosRequestConfig<any>> => {
    console.log("request wroks");
    return req;
};

const successInterceptor = (res: AxiosResponse): AxiosResponse => {
    console.log("success wroks");
    return res;
};

const errorInterceptor = (err: AxiosError) => {
    return Promise.reject(err);
};

axios.interceptors.request.use(requestInterceptor);
axios.interceptors.response.use((res) => successInterceptor(res), (err) => errorInterceptor(err));

export const apiGet = <T>({ url, customHeaders, params }: Options): Promise<T> => {
    return new Promise((resolve, reject) => {
        axios
            .get<T>(url, { headers: getHeaders(customHeaders), params: params })
            .then((response: AxiosResponse) => {
                console.log("resolving data");
                resolve(response.data);
            })
            .catch((error: AxiosError) => {
                reject(error);
            });
    });
};

export const apiPost = <T>({ url, payload, customHeaders, params }: Options): Promise<T> => {
    return new Promise((resolve, reject) => {
        axios
            .post<T>(url, payload, { headers: getHeaders(customHeaders), params: params })
            .then((response: AxiosResponse) => {
                console.log("resolving data");
                resolve(response.data);
            })
            .catch((error: AxiosError) => {
                reject(error);
            });
    });
};

export const apiPut = <T>({ url, payload, customHeaders, params }: Options): Promise<T> => {
    return new Promise((resolve, reject) => {
        axios
            .put<T>(url, payload, { headers: getHeaders(customHeaders), params: params })
            .then((response: AxiosResponse) => {
                console.log("resolving data");
                resolve(response.data);
            })
            .catch((error: AxiosError) => {
                reject(error);
            });
    });
};

export const apiDelete = <T>({ url, customHeaders, params }: Options): Promise<T> => {
    return new Promise((resolve, reject) => {
        axios
            .delete<T>(url, { headers: getHeaders(customHeaders), params: params })
            .then((response: AxiosResponse) => {
                console.log("resolving data");
                resolve(response.data);
            })
            .catch((error: AxiosError) => {
                reject(error);
            });
    });
};