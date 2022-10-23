import axios from "axios";
import jwtDecode from "jwt-decode"
import { BASE_URL } from "../env";

let instance

export default function getAxiosInstance() {
    if(!instance) {
        let token = localStorage.getItem('pms_user')
        if(!token) token = sessionStorage.getItem('pms_user')
        
        if(!token) return axios
        const { exp } = jwtDecode(token);
        const currentTime = Math.round(Date.now() / 1000)
        if(currentTime > exp){
            localStorage.removeItem('pms_user')
            window.location.href = "/sign-in";
            return axios
        }

        instance = axios.create({
            baseURL: BASE_URL,
            timeout: 30000,
            headers: {
                'Authorization': `${token}`
            }
        });
    }
    return instance
}