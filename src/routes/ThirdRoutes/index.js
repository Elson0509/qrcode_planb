import Thirds from '../../pages/Thirds'
import ThirdAdd from '../../pages/ThirdAdd'
import ThirdList from '../../pages/ThirdList'
import ThirdEdit from '../../pages/ThirdEdit'

const ThirdRoutes = [
    {
        name: 'Thirds',
        component: Thirds,
        backgroundDarkColor: 'Thirds',
        headerTitle: 'Terceirizados'
    },
    {
        name: 'ThirdAdd',
        component: ThirdAdd,
        backgroundDarkColor: 'Thirds',
        headerTitle: 'Adicionar'
    },
    {
        name: 'ThirdList',
        component: ThirdList,
        backgroundDarkColor: 'Thirds',
        headerTitle: 'Listar'
    },
    {
        name: 'ThirdEdit',
        component: ThirdEdit,
        backgroundDarkColor: 'Thirds',
        headerTitle: 'Editar'
    },
]

export default ThirdRoutes