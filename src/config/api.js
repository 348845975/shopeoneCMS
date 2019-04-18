import axios from 'axios'
import { baseUrl } from './env'
const qs = require('qs')

const api = {
  async get (url, data) {
    url = baseUrl + url;
    try {

      let res = await axios.get(url, {params: data})
      res = res.data
      return new Promise((resolve) => {
        if (res.code === 0) {
          resolve(res)
        } else {
          resolve(res)
        }
        resolve(res)
      })
    } catch (err) {
      alert('服务器出错')
      console.log(err)
    }
  },
  async post (url, data) {
    url = baseUrl + url;
    try {
      let res = await axios.post(url, qs.stringify(data))
      res = res.data
      return new Promise((resolve, reject) => {
        if (res.code === 0) {
          resolve(res)
        } else {
          resolve(res)
        }
        resolve(res)
      })
    } catch (err) {
      // return (e.message)
      alert('服务器出错')
      console.log(err)
    }
  }

}
export { api}