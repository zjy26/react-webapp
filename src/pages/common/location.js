import Axios from 'axios';

let location = {};

Axios.get('/api/lineSite').then(res =>{
  if(res.status === 200){
    let siteArr = [];
    let lineArr = [];
    for(let i in res.data){
      let lineObj = {};
      lineObj["label"] = res.data[i].label;
      lineObj["value"] = res.data[i].value;
      lineArr.push(lineObj);
      siteArr.push(...res.data[i].children);
    }
    location["lineSite"] = res.data
    location["line"] = lineArr
    location["site"] = siteArr
  }
}).catch((err) =>{
    console.log("线路站点数据加载失败")
});

export default location;
