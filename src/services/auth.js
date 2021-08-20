import axios from './api'

const profiles = [
    {
        email:'a@a.com',
        password:'12345',
        user_kind:0,
        "id":"066da296-7438-47c0-99a9-760bca2cd29d",
        name:"Carlos Silas Ferreira",
        "nascimento":"1987-04-23",
        "condominio":"Flor do Sul",
        "condominio_id":"3f4c8d9e-7a8b-4ff6-bac2-884d1c95f8bd",
        "endereco":"Rua das marquises, 45, Taquara, Rio de Janeiro",
        "bloco":"B",
        "apt":"308",
        "veiculo_montador":"Toyota",
        "veiculo_modelo":"Corolla",
        "veiculo_cor":"Vermelho",
        "veiculo_placa":"XXX-5643",
        "data_cadastro":"2019-03-30",
        "is_autorizado":true
    },
    {
        email:'b@a.com',
        password:'12345',
        user_kind:1,
        "id":"89f3024b-0673-4787-9747-a53f5fd16415",
        name:"Salim Assab de Castro",
        "nascimento":"2000-10-10",
        "condominio":"Flor do Sul",
        "condominio_id":"3f4c8d9e-7a8b-4ff6-bac2-884d1c95f8bd",
        "endereco":"Rua das marquises, 45, Taquara, Rio de Janeiro",
        "bloco":"A",
        "apt":"101",
        "veiculo_montador":"Hyundai",
        "veiculo_modelo":"HB20",
        "veiculo_cor":"Cinza",
        "veiculo_placa":"ABC-1234",
        "data_cadastro":"2021-02-10",
        "is_autorizado":false
    },
    {
        email:'c@a.com',
        password:'12345',
        user_kind:2,
        "id":"ae36be16-d46e-4d2b-b7f0-b5d65667a543",
        name:"Carla da Silva Beram",
        "nascimento":"2004-05-12",
        "condominio":"Flor do Sul",
        "condominio_id":"3f4c8d9e-7a8b-4ff6-bac2-884d1c95f8bd",
        "endereco":"Rua das marquises, 45, Taquara, Rio de Janeiro",
        "bloco":"G",
        "apt":"768",
        "veiculo_montador":"Ford",
        "veiculo_modelo":"Escape",
        "veiculo_cor":"Amarelo",
        "veiculo_placa":"TIL-0954",
        "data_cadastro":"2021-02-10",
        "is_autorizado":true
    },
    {
        email:'d@a.com',
        password:'12345',
        user_kind:0,
        "id":"fd68a93d-dee0-48b3-9bda-bd1e86170d17",
        name:"Fernando Matias de Castro",
        "nascimento":"1979-08-24",
        "condominio":"Lago de cisnes",
        "condominio_id":"cb823cfc-78f0-432a-a696-dc202d5de486",
        "endereco":"Rua Firmino Fragoso, 209, Madureira, Rio de Janeiro",
        "bloco":"a",
        "apt":"102",
        "veiculo_montador":"Peugeot",
        "veiculo_modelo":"508",
        "veiculo_cor":"Azul",
        "veiculo_placa":"AKC-5601",
        "data_cadastro":"2014-08-09",
        "is_autorizado":true
    },
    {
        email:'e@a.com',
        password:'12345',
        user_kind:0,
        "id":"88c5b4da-fec5-46b9-8a63-d3e4dde0abb8",
        name:"Marcelo Nobre",
        "nascimento":"1974-12-25",
        "condominio":"Flor do Sul",
        "condominio_id":"3f4c8d9e-7a8b-4ff6-bac2-884d1c95f8bd",
        "endereco":"Rua das marquises, 45, Taquara, Rio de Janeiro",
        "bloco":"F",
        "apt":"418",
        "veiculo_montador":"Peugeot",
        "veiculo_modelo":"3008",
        "veiculo_cor":"Cinza",
        "veiculo_placa":"EPR-2302",
        "data_cadastro":"2021-02-22",
        "is_autorizado":true
    },
    {
        email:'f@a.com',
        password:'12345',
        user_kind:0,
        "id":"ddbf0952-5423-4184-a58d-6c49ae424fbd",
        name:"Sabrina Nobre",
        "nascimento":"1995-12-18",
        "condominio":"Flor do Sul",
        "condominio_id":"3f4c8d9e-7a8b-4ff6-bac2-884d1c95f8bd",
        "endereco":"Rua das marquises, 45, Taquara, Rio de Janeiro",
        "bloco":"F",
        "apt":"418",
        "veiculo_montador":"Peugeot",
        "veiculo_modelo":"3008",
        "veiculo_cor":"Cinza",
        "veiculo_placa":"EPR-2302",
        "data_cadastro":"2021-02-22",
        "is_autorizado":true
    }
]


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
            //console.log('data', data.data)
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