import axios from './api'

export function signIn(login, password){
    axios.post('/api/user/login', {
        email: login.toLowerCase(),
        password: password
    })
        .then((data)=> {
            console.log(1)
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
            console.log(2)
            console.log('error dpokn',err)
            throw new Error(err.response.data.message)
            
        })
    // return new Promise((resolve, reject) => {
    //     setTimeout(()=> {
    //         profiles.forEach(el=>{
    //             if(el.email===login.toLowerCase() && el.password===password.toLowerCase()){
    //                 resolve({
    //                     token: 'pfijhbn09cfrh0vn934fvn3gjn3-9ith3ngi90jm-g09i4jgi5i90',
    //                     user: el
    //                 })
    //             }
    //         })
    //         reject({
    //             message: 'Email ou senha não encontrados.'
    //         })
    //     }, 2000)
    // })
}