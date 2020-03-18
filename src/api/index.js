import { axiosInstance } from "./config"

//线路站点
export const locationTree = () => {
  return axiosInstance.get("/locationTree")
}
//智能巡检类型用实体
export const ROBOT_OBJECT_TYPE = () => {
  return axiosInstance.get("/ROBOT_OBJECT_TYPE")
}
//设备状态
export const ROBOT_OBJECT_STATUS = () => {
  return axiosInstance.get("/ROBOT_OBJECT_STATUS")
}
//视频传输类
export const VIDEO_STREAM = () => {
  return axiosInstance.get("/VIDEO_STREAM")
}
//品牌
export const brands = () => {
  return axiosInstance.get("/brands")
}


//巡检配置
export const robotConfig = {}
robotConfig["robotConfigList"] = () => {
  return axiosInstance.get("/robotConfig")
}
robotConfig["robotConfigDetail"] = (id) => {
  return axiosInstance.get("/robotConfig/" +id)
}
robotConfig["robotConfigDelete"] = (id) => {
  return axiosInstance.delete("/robotConfig/" +id)
}
robotConfig["robotConfigAdd"] = (parms) => {
  return axiosInstance.post("/robotConfig", parms)
}
robotConfig["robotConfigEdit"] = (id, parms) => {
  return axiosInstance.put("/robotConfig/"+ id, parms)
}

//维护记录
export const robotMaintain = {}
robotMaintain["robotMaintainList"] = (isComplete, robotObject) => {
  return axiosInstance.get("robotpatrol/robot-object-maintain-list.gson", {
    params: {
      robotObject: robotObject,
      filter: JSON.stringify([{"property":"isComplete","value":isComplete}])
    }
  })
}
robotMaintain["robotMaintainNew"] = () => {
  return axiosInstance.get("/robotpatrol/robot-object/new.gson")
}
robotMaintain["robotMaintainAdd"] = (parms) => {
  return axiosInstance.post("/robotpatrol/robot-object-maintain.gson", parms)
}
robotMaintain["robotMaintainEdit"] = (id, params) => {
  return axiosInstance.put("/robotpatrol/robot-object-maintain/" +id+ ".gson", params)
}
robotMaintain["robotMaintainDetail"] = (id) => {
  return axiosInstance.get("/robotpatrol/robot-object-maintain/" +id+ "/edit.gson")
}
robotMaintain["robotMaintainComplete"] = (parms) => {
  return axiosInstance.post("robotpatrol/maintain-is-complete.gson", parms)
}
robotMaintain["robotObjectMaintainComplete"] = (parms) => {
  return axiosInstance.post("robotpatrol/object-maintain-is-complete.gson", parms)
}
robotMaintain["robotObjectMaintainAdd"] = (parms) => {
  return axiosInstance.post("robotpatrol/object-add-maintain.gson", parms)
}

//设备管理
export const robotObject = {}
robotObject["robotObjectList"] = () => {
  return axiosInstance.get("/robotObject")
}
robotObject["robotObjectDetail"] = (id) => {
  return axiosInstance.get("/robotObject/" +id)
}
robotObject["robotObjectDelete"] = (id) => {
  return axiosInstance.delete("/robotObject/" + id)
}
robotObject["robotObjectAdd"] = (parms) => {
  return axiosInstance.post("/robotObject", parms);
}
robotObject["robotObjectEdit"] = (id, parms) => {
  return axiosInstance.put("/robotObject"+ id, parms)
}
