import Residents from '../../pages/Residents'
import ResidentAdd from '../../pages/ResidentAdd'
import ResidentList from '../../pages/ResidentList'
import ResidentSearch from '../../pages/ResidentSearch'

const ResidentRoutes = [
    {
        name: 'Residents',
        component: Residents,
        backgroundDarkColor: 'Residents',
        headerTitle: 'Moradores'
    },
    {
        name: 'ResidentAdd',
        component: ResidentAdd,
        backgroundDarkColor: 'Residents',
        headerTitle: 'Adicionar'
    },
    {
        name: 'ResidentEdit',
        component: ResidentAdd,
        backgroundDarkColor: 'Residents',
        headerTitle: 'Editar'
    },
    {
        name: 'ResidentList',
        component: ResidentList,
        backgroundDarkColor: 'Residents',
        headerTitle: 'Listar'
    },
    {
        name: 'ResidentSearch',
        component: ResidentSearch,
        backgroundDarkColor: 'Residents',
        headerTitle: 'Pesquisar'
    },
]

export default ResidentRoutes