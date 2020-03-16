import Axios from 'axios';

let location = {};

Axios.get('/api/lineSite').then(res =>{
  if(res.status === 200){
    let siteArr = [];
    let lineArr = [];
    for(var item of res.data){
      let lineObj = {};
      lineObj["label"] = item.label;
      lineObj["value"] = item.value;
      lineArr.push(lineObj);
      siteArr.push(...item.children);
    }
    location["lineSite"] = res.data
    location["line"] = lineArr
    location["site"] = siteArr
  }
}).catch((err) =>{
    console.log("线路站点数据加载失败")
});

export default location;
