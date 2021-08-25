import axios from 'axios'
import * as Constants from './constants'

const api = axios.create({
    baseURL: `http://${Constants.apiurl}`
    //baseURL: apiurl
})

export default api;