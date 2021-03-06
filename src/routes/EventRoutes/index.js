import Events from "../../pages/Events"
import EventAdd from "../../pages/EventAdd"
import EventList from "../../pages/EventList"

const EventRoutes = [
    {
        name: 'EventsGuard',
        component: Events,
        backgroundDarkColor: 'Dashboard',
        headerTitle: 'Ronda'
    },
    {
        name: 'EventAdd',
        component: EventAdd,
        backgroundDarkColor: 'MyQRCode',
        headerTitle: 'Adicionar'
    },
    {
        name: 'EventList',
        component: EventList,
        backgroundDarkColor: 'MyQRCode',
        headerTitle: 'Listar'
    },
]

export default EventRoutes