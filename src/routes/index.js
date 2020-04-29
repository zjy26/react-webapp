import View from '../pages/home/view'
import Setting from '../pages/home/setting'
import Application from '../pages/application/index'
import ObjectModule from '../pages/object/index'
import PatrolPlan from '../pages/patrolPlan/index'
import PatrolPlanNew from '../pages/patrolPlan/new'
import PatrolPlanDetail from '../pages/patrolPlan/detail'
import PatrolSheet from '../pages/patrolSheet/index'
import PatrolConfig from '../pages/patrolConfig/index'
import DataStatistics from '../pages/dataStatistics/index'
import ObjectModuleDetail from '../pages/object/detail'
import ObjectEnvaluation from '../pages/objectEvaluation';

const menuRoutes = [
  {path: "/home", exact: true, component: View},
  {path: "/setting", exact: true, component: Setting},
  {path:"/applications", exact: true, component: Application},

  {path:"/patrol-object", exact: true, component: ObjectModule},
  {path:"/patrol-object-detail/:id", exact: true, component: ObjectModuleDetail},
  {path:"/patrol-plan", exact: true, component: PatrolPlan},
  {path:"/patrol-plan-new", exact: true, component: PatrolPlanNew},
  {path:"/patrol-plan-detail/:id", exact: true, component: PatrolPlanDetail},
  {path:"/patrol-sheet", exact: true, component: PatrolSheet},
  {path:"/patrol-config", exact: true, component: PatrolConfig},
  {path:"/patrol-statistics", exact: true, component: DataStatistics},
  
  {path:"/object-evaluation", exact: true, component: ObjectEnvaluation}
]

export default menuRoutes;