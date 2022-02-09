import Units from '../../pages/Units'
import UnitAdd from '../../pages/UnitAdd'
import UnitList from '../../pages/UnitList'

const UnitRoutes = [
    {
        name: 'Units',
        component: Units,
        backgroundDarkColor: 'Dashboard',
        headerTitle: 'Unidades'
    },
    {
        name: 'UnitAdd',
        component: UnitAdd,
        backgroundDarkColor: 'Units',
        headerTitle: 'Adicionar'
    },
    {
        name: 'UnitList',
        component: UnitList,
        backgroundDarkColor: 'Units',
        headerTitle: 'Listar'
    },
]

export default UnitRoutes