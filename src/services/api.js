import axios from 'axios'
import * as Constants from './constants'

const api = axios.create({
    baseURL: `${Constants.apiurlPrefix}${Constants.apiurl}`
    //baseURL: apiurl
})

export default api;