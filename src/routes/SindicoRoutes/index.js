import Sindico from "../../pages/Sindico"
import SindicoList from "../../pages/SindicoList"
import SindicoAdd from "../../pages/SindicoAdd"

const SindicoRoutes = [
    {
        name: 'Sindico',
        component: Sindico,
        backgroundDarkColor: 'Visitors',
        headerTitle: 'Administradores'
    },
    {
        name: 'SindicoList',
        component: SindicoList,
        backgroundDarkColor: 'Visitors',
        headerTitle: 'Listar'
    },
    {
        name: 'SindicoAdd',
        component: SindicoAdd,
        backgroundDarkColor: 'Visitors',
        headerTitle: 'Adicionar'
    },
]

export default SindicoRoutes