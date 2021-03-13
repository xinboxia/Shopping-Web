import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:5001/challenge-9dae6/us-central1/api' // the api url
});

export default instance;