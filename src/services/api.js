import axios from 'axios'

import Constants from 'expo-constants';
//console.log(Constants)
const { manifest } = Constants

const apiurl = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
  ? manifest.debuggerHost.split(`:`).shift().concat(`:3333`)
  : `api.example.com`;

//console.log(apiurl)

const api = axios.create({
    baseURL: `http://${apiurl}`
    //baseURL: apiurl
})

export default api;