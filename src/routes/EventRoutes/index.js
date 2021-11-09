import Events from "../../pages/Events"
import EventAdd from "../../pages/EventAdd"
import EventList from "../../pages/EventList"

const EventRoutes = [
    {
        name: 'EventsGuard',
        component: Events,
        backgroundDarkColor: 'Events',
        headerTitle: 'Ronda'
    },
    {
        name: 'EventAdd',
        component: EventAdd,
        backgroundDarkColor: 'Events',
        headerTitle: 'Adicionar'
    },
    {
        name: 'EventList',
        component: EventList,
        backgroundDarkColor: 'Events',
        headerTitle: 'Listar'
    },
]

export default EventRoutes