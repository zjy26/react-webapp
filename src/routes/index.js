import View from '../pages/home/view'
import Setting from '../pages/home/setting'
import Application from '../pages/application/index'
import ObjectModule from '../pages/object/index'
import PatrolPlan from '../pages/patrol/patrolPlan/index'
import PatrolPlanNew from '../pages/patrol/patrolPlan/new'
import PatrolPlanDetail from '../pages/patrol/patrolPlan/detail'
import PatrolSheet from '../pages/patrol/patrolSheet/index'
import PatrolConfig from '../pages/patrol/patrolConfig/index'
import DataStatistics from '../pages/patrol/dataStatistics/index'
import ObjectModuleDetail from '../pages/object/detail'
import ObjectEnvaluation from '../pages/objectEvaluation'

import Form from '../pages/form/index'
import FormEdit from '../pages/form/edit'

const menuRoutes = [
  {path: "/home", exact: true, component: View},
  {path: "/setting", exact: true, component: Setting},
  {path:"/applications", exact: true, component: Application},

  {path:"/patrol/patrol-object", exact: true, component: ObjectModule},
  {path:"/patrol/patrol-object-detail/:id", exact: true, component: ObjectModuleDetail},
  {path:"/patrol/patrol-plan", exact: true, component: PatrolPlan},
  {path:"/patrol/patrol-plan-new", exact: true, component: PatrolPlanNew},
  {path:"/patrol/patrol-plan-detail/:id", exact: true, component: PatrolPlanDetail},
  {path:"/patrol/patrol-sheet", exact: true, component: PatrolSheet},
  {path:"/patrol/patrol-config", exact: true, component: PatrolConfig},
  {path:"/patrol/patrol-statistics", exact: true, component: DataStatistics},
  
  {path:"/object-evaluation", exact: true, component: ObjectEnvaluation},

  {path:"/form", exact: true, component: Form},
  {path:"/form-edit", exact: true, component: FormEdit}
]

export default menuRoutes;