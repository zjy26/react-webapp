import axios from "axios";

// axios的实例及拦截器配置
let axiosInstance;

axiosInstance = axios.create({
  baseURL: "http://localhost:4000/"
});
axiosInstance.interceptors.response.use(
  res => res.data,
  err => {
    console.log(err, "网络错误");
  }
);

export { axiosInstance };