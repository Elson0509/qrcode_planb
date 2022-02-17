import Condo from '../../pages/Condo'
import CondoList from '../../pages/CondoList'
import CondoAdd from '../../pages/CondoAdd'
import CondoEdit from '../../pages/CondoEdit'

const CondoRoutes = [
    {
        name: 'Condo',
        component: Condo,
        backgroundDarkColor: 'Dashboard',
        headerTitle: 'Condomínios'
    },
    {
        name: 'CondoList',
        component: CondoList,
        backgroundDarkColor: 'Residents',
        headerTitle: 'Listar'
    },
    {
        name: 'CondoAdd',
        component: CondoAdd,
        backgroundDarkColor: 'Residents',
        headerTitle: 'Adicionar'
    },
    {
        name: 'CondoEdit',
        component: CondoEdit,
        backgroundDarkColor: 'Residents',
        headerTitle: 'Editar'
    },
]

export default CondoRoutes