import Visitors from "../../pages/Visitors"
import VisitorAdd from '../../pages/VisitorAdd'
import VisitorList from '../../pages/VisitorList'
import VisitorEdit from '../../pages/VisitorEdit'

const VisitorRoutes = [
    {
        name: 'Visitors',
        component: Visitors,
        backgroundDarkColor: 'Dashboard',
        headerTitle: 'Visitantes'
    },
    {
        name: 'VisitorAdd',
        component: VisitorAdd,
        backgroundDarkColor: 'Visitors',
        headerTitle: 'Adicionar'
    },
    {
        name: 'VisitorList',
        component: VisitorList,
        backgroundDarkColor: 'Visitors',
        headerTitle: 'Listar'
    },
    {
        name: 'VisitorEdit',
        component: VisitorEdit,
        backgroundDarkColor: 'Visitors',
        headerTitle: 'Editar'
    },
]

export default VisitorRoutes