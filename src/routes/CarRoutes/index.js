import Car from "../../pages/Car"
import CarList from "../../pages/CarList"
import CarSearch from "../../pages/CarSearch"

const CarRoutes = [
    {
        name: 'Car',
        component: Car,
        backgroundDarkColor: 'Dashboard',
        headerTitle: 'Pernoite'
    },
    {
        name: 'CarList',
        component: CarList,
        backgroundDarkColor: 'Cars',
        headerTitle: 'Listar'
    },
    {
        name: 'CarSearch',
        component: CarSearch,
        backgroundDarkColor: 'Cars',
        headerTitle: 'Pesquisar'
    },
]

export default CarRoutes