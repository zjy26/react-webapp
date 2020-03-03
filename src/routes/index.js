import View from '../pages/home/view';
import Setting from '../pages/home/setting';
import Application from '../pages/application/index';
import ObjectModule from '../pages/object/index';
import PatrolPlan from '../pages/patrolPlan/index';
import PatrolSheet from '../pages/patrolSheet/index';
import PatrolConfig from '../pages/patrolConfig/index';
import DataStatistics from '../pages/dataStatistics/index';

const menuRoutes = [
  {path: "/home", exact: true, component: View},
  {path: "/setting", exact: true, component: Setting},
  {path:"/applications", exact: false, component: Application},
  {path:"/objects", exact: true, component: ObjectModule},
  {path:"/patrolPlan", exact: false, component: PatrolPlan},
  {path:"/patrolSheet", exact: false, component: PatrolSheet},
  {path:"/PatrolConfig", exact: false, component: PatrolConfig},
  {path:"/dataStatistics", exact: false, component: DataStatistics}
]

export default menuRoutes;