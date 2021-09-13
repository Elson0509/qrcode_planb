import axios from './api'

export function signIn(login, password){
    axios.post('/api/user/login', {
        email: login.toLowerCase(),
        password: password
    })
        .then((data)=> {
            const token = data.data.token
            const user = {
                name: data.data.name,
                id: data.data.userId,
                user_kind: data.data.user_kind,
                email: data.data.username
            }
            return {token, user}
        })
        .catch((err)=> {
            throw new Error(err.response.data.message)
        })
}