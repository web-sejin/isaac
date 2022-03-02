import axios from 'axios';

const API = axios.create({
    baseURL: "http://cnj2019.cafe24.com/api/index.php",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default API;