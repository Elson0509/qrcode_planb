import axios from 'axios'
import * as Constants from './constants'

const api = axios.create({
    baseURL: `${Constants.apiurlPrefix}${Constants.apiurl}`,
    timeout: 8000,
    timeoutErrorMessage: 'timeout'
})

export default api;