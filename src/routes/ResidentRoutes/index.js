import Residents from '../../pages/Residents'
import ResidentAdd from '../../pages/ResidentAdd'
import ResidentSearch from '../../pages/ResidentSearch'

const ResidentRoutes = [
    {
        name: 'Residents',
        component: Residents,
        backgroundDarkColor: 'Dashboard',
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
        component: ResidentSearch,
        backgroundDarkColor: 'Residents',
        headerTitle: 'Listar'
    },
]

export default ResidentRoutes