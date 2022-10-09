import Services from "../../pages/Services"
import Mail from "../../pages/Mail"
import MailAdd from "../../pages/MailAdd"
import MailList from "../../pages/MailList"

const ServiceRoutes = [
  {
    name: 'Services',
    component: Services,
    backgroundDarkColor: 'Dashboard',
    headerTitle: 'Serviços'
  },
  {
    name: 'Mail',
    component: Mail,
    backgroundDarkColor: 'Dashboard',
    headerTitle: 'Correspondências'
  },
  {
    name: 'MailAdd',
    component: MailAdd,
    backgroundDarkColor: 'Residents',
    headerTitle: 'Receber'
  },
  {
    name: 'MailList',
    component: MailList,
    backgroundDarkColor: 'Residents',
    headerTitle: 'Listar'
  },
]

export default ServiceRoutes