import EditResident from "../../pages/EditResident"
import EditVisitor from "../../pages/EditVisitor"
import EditThird from "../../pages/EditThird"

const UserRoutes = [
    {
        name: 'EditResident',
        component: EditResident,
        backgroundDarkColor: 'Residents',
        headerTitle: 'Editar'
    },
    {
        name: 'EditVisitor',
        component: EditVisitor,
        backgroundDarkColor: 'Visitors',
        headerTitle: 'Editar'
    },
    {
        name: 'EditThird',
        component: EditThird,
        backgroundDarkColor: 'Thirds',
        headerTitle: 'Editar'
    },
]

export default UserRoutes