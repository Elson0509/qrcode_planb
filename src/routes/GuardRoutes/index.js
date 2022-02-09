import Guards from "../../pages/Guards"
import GuardAdd from "../../pages/GuardAdd"
import GuardList from "../../pages/GuardList"

const GuardRoutes = [
    {
        name: 'Guards',
        component: Guards,
        backgroundDarkColor: 'Dashboard',
        headerTitle: 'Colaboradores'
    },
    {
        name: 'GuardAdd',
        component: GuardAdd,
        backgroundDarkColor: 'Guards',
        headerTitle: 'Adicionar'
    },
    {
        name: 'GuardList',
        component: GuardList,
        backgroundDarkColor: 'Guards',
        headerTitle: 'Listar'
    },
]

export default GuardRoutes