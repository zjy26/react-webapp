import React, { useContext } from 'react'
import ObjectModal from './object'
import UnitModal from './unit'

const Basic = props => {
  const { setTemplateCode, MyContext, setActiveKey, setObjectClass, setVersionCode, setCheckStatus } = props
  const { newType } = useContext(MyContext)

  return (
    newType === "unit"
    ? <UnitModal {...{ MyContext, setTemplateCode, setVersionCode, setActiveKey, setCheckStatus }} />
    : <ObjectModal {...{ MyContext, setTemplateCode, setVersionCode, setObjectClass, setActiveKey, setCheckStatus }} />
  )
}

export default React.memo(Basic)
