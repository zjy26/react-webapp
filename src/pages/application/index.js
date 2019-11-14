import React, { Component } from 'react';
import { Card, Col, Row, Icon} from 'antd';
import '../../styles/application.css';
import Add from '../../images/add.png';

class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {title:'211隔离开关柜报警1', line:'17号线', fault:'1111111', major:'17号线变电专业', create:'供电调度', status:'新建', update:'供电调度', site:'东方绿洲', createTime:'2019-10-11 10:22:00', updateTime:'2019-11-13 09:12:00'},
        {title:'211隔离开关柜报警2', line:'17号线', fault:'1111111', major:'17号线变电专业', create:'供电调度', status:'新建', update:'供电调度', site:'东方绿洲', createTime:'2019-10-11 10:22:00', updateTime:'2019-11-13 09:12:00'},
        {title:'211隔离开关柜报警3', line:'17号线', fault:'1111111', major:'17号线变电专业', create:'供电调度', status:'新建', update:'供电调度', site:'东方绿洲', createTime:'2019-10-11 10:22:00', updateTime:'2019-11-13 09:12:00'},
        {title:'211隔离开关柜报警4', line:'17号线', fault:'1111111', major:'17号线变电专业', create:'供电调度', status:'新建', update:'供电调度', site:'东方绿洲', createTime:'2019-10-11 10:22:00', updateTime:'2019-11-13 09:12:00'},
        {title:'211隔离开关柜报警5', line:'17号线', fault:'1111111', major:'17号线变电专业', create:'供电调度', status:'新建', update:'供电调度', site:'东方绿洲', createTime:'2019-10-11 10:22:00', updateTime:'2019-11-13 09:12:00'},
      ]
    }
  }
  render() { 
    return (
      <div className="cardPanel">
        <Row gutter={16}>
          {
            this.state.data.map((item, index)=>{
              return(
                <Col span={8} key={index}>
                  <Card title={item.title} extra={[<Icon type="form" key="edit" />,<Icon type="close" key="close"/>]}>
                    <Col span={12}>线路：{item.line}</Col>
                    <Col span={12}>故障令号：{item.fault}</Col>
                    <Col span={12}>专业：{item.major}</Col>
                    <Col span={12}>创建人：{item.create}</Col>
                    <Col span={12}>状态：{item.status}</Col>
                    <Col span={12}>更新人：{item.update}</Col>
                    <Col span={24}>站点：{item.site}</Col>
                    <Col span={24}>创建时间：{item.createTime}</Col>
                    <Col span={24}>更新时间：{item.updateTime}</Col>
                  </Card>
                </Col>
              )
            })
          }
          <Col span={8}>
            <Card className="addApplication">
              <img src={Add} alt=""/>
              <div>添加应用</div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Application;