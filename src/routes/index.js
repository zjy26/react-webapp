import View from '../pages/home/view';
import Setting from '../pages/home/setting';
import Application from '../pages/application/index';
import ObjectModule from '../pages/object/index';
import PatrolPlan from '../pages/patrolPlan/index';
import PatrolPlanNew from '../pages/patrolPlan/new'
import PatrolPlanDetail from '../pages/patrolPlan/detail'
import PatrolSheet from '../pages/patrolSheet/index';
import PatrolConfig from '../pages/patrolConfig/index';
import DataStatistics from '../pages/dataStatistics/index';
import ObjectModuleDetail from '../pages/object/detail';

const menuRoutes = [
  {path: "/home", exact: true, component: View},
  {path: "/setting", exact: false, component: Setting},
  {path:"/applications", exact: false, component: Application},
  {path:"/patrol-object", exact: true, component: ObjectModule},
  {path:"/patrol-object-detail/:id", exact: false, component: ObjectModuleDetail},
  {path:"/patrol-plan", exact: false, component: PatrolPlan},
  {path:"/patrol-plan-new", exact: false, component: PatrolPlanNew},
  {path:"/patrol-plan-detail/:id", exact: false, component: PatrolPlanDetail},
  {path:"/patrol-sheet", exact: false, component: PatrolSheet},
  {path:"/patrol-config", exact: false, component: PatrolConfig},
  {path:"/data-statistics", exact: false, component: DataStatistics}
]

export default menuRoutes;