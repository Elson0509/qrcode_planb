import Sindico from "../../pages/Sindico"
import SindicoList from "../../pages/SindicoList"
import SindicoAdd from "../../pages/SindicoAdd"

const SindicoRoutes = [
    {
        name: 'Sindico',
        component: Sindico,
        backgroundDarkColor: 'Dashboard',
        headerTitle: 'Administradores'
    },
    {
        name: 'SindicoList',
        component: SindicoList,
        backgroundDarkColor: 'Dashboard',
        headerTitle: 'Listar'
    },
    {
        name: 'SindicoAdd',
        component: SindicoAdd,
        backgroundDarkColor: 'Dashboard',
        headerTitle: 'Adicionar'
    },
]

export default SindicoRoutes