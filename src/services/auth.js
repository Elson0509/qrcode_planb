export function signIn(){
    return new Promise(resolve => {
        setTimeout(()=> {
            resolve({
                token: 'pfijhbn09cfrh0vn934fvn3gjn3-9ith3ngi90jm-g09i4jgi5i90',
                user: {
                    name: 'Elson',
                    email: 'elson@test.com'
                }
            })
        }, 2000)
    })
}