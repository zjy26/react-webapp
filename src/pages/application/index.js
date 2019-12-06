import React, { Component } from 'react';
import { Card, Col, Row, Button, Modal, Form, Input, DatePicker, Select} from 'antd';
import '../../styles/application.css';
import Add from '../../images/add.png';
import moment from 'moment'; 

const { confirm } = Modal;

class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {id:1, title:'211隔离开关柜报警1', line:'17号线', fault:'1111111', major:'17号线变电专业', create:'供电调度', status:'新建', update:'供电调度', site:'东方绿洲', createTime:'2019-10-11 10:22:00', updateTime:'2019-11-13 09:12:00'},
        {id:2, title:'211隔离开关柜报警2', line:'17号线', fault:'1111111', major:'17号线变电专业', create:'供电调度', status:'新建', update:'供电调度', site:'东方绿洲', createTime:'2019-10-11 10:22:00', updateTime:'2019-11-13 09:12:00'},
        {id:3, title:'211隔离开关柜报警3', line:'17号线', fault:'1111111', major:'17号线变电专业', create:'供电调度', status:'新建', update:'供电调度', site:'东方绿洲', createTime:'2019-10-11 10:22:00', updateTime:'2019-11-13 09:12:00'},
        {id:4, title:'211隔离开关柜报警4', line:'17号线', fault:'1111111', major:'17号线变电专业', create:'供电调度', status:'新建', update:'供电调度', site:'东方绿洲', createTime:'2019-10-11 10:22:00', updateTime:'2019-11-13 09:12:00'},
        {id:5, title:'211隔离开关柜报警5', line:'17号线', fault:'1111111', major:'17号线变电专业', create:'供电调度', status:'新建', update:'供电调度', site:'东方绿洲', createTime:'2019-10-11 10:22:00', updateTime:'2019-11-13 09:12:00'}
      ],
      showModal: false,
      modalTitle: ''
    }
  }

  comfirm = e => {
    this.setState({
      showModal: false,
    });
    const {
      form: { getFieldValue, validateFields, resetFields},
    } = this.props;
   
    validateFields((errors, values) => {

      const {data} = this.state;

      var flag=false, node;
      for(let i=0; i<data.length; i++) {
        if(data[i].id === getFieldValue('id')) {
          flag =true;
          node = i;
        }
      }

      if(flag === false) {
        const fieldsValues = {
          ...values,
          id: data[data.length-1].id + 1,
          "createTime": values.createTime? values.createTime.format('YYYY-MM-DD HH:mm:ss'):"",  //时间校验
          "updateTime": values.updateTime? values.updateTime.format('YYYY-MM-DD HH:mm:ss'): ""
        };
        data.push(fieldsValues);
      } else {
        const newFieldsValues = {
          ...values,
          "createTime": values.createTime? values.createTime.format('YYYY-MM-DD HH:mm:ss'):"",  //时间校验
          "updateTime": values.updateTime? values.updateTime.format('YYYY-MM-DD HH:mm:ss'): ""
        };
        data.splice(node, 1, newFieldsValues)
      }
      this.setState({data});
    });
    resetFields();
  };

  cancel = e => {
    this.setState({
      showModal: false,
    });
  };

  addApplication = ()=>{
    const {
      form: { resetFields},
    } = this.props;
    resetFields();
    this.setState({
      showModal: true,
      modalTitle: '添加应用'
    });
  }

  edit = (index)=>{
    const {
      form: { setFieldsValue },
    } = this.props;
    const fieldsValues = {
      ...this.state.data[index],
      "createTime": moment(this.state.data[index].createTime),
      "updateTime": moment(this.state.data[index].updateTime)
    };
    this.setState({
      showModal: true,
      modalTitle: '编辑应用'
    });
    setFieldsValue(
      fieldsValues
    );
  }

  delete = (index)=> {
    confirm({          //删除提示框
      title: '删除提示',
      content: '是否确认删除，如果删除，将不能恢复',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: ()=> {
        const {data} = this.state;
        data.splice(index,1);
        this.setState({data});
      },
      onCancel() {

      },
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const { Option } = Select;
    return (
      <div className="cardPanel">
        <Row style={{padding:20}}>
          {
            this.state.data.map((item, index)=>{
              return(
                <Col md={12} lg={12} xl={8} xxl={6} key={index}>
                  <Card className="boxShadow" title={item.title} extra={[<Button className="boxButton" key="edit" onClick={this.edit.bind(this, index)}>编辑</Button>,<Button className="boxButton" key="delete" onClick={this.delete.bind(this, index)}>删除</Button>]}>
                    <Col span={12}>序号：{item.id}</Col>
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
          <Col md={12} lg={12} xl={8} xxl={6}>
            <Card className="addApplication">
              <div onClick={this.addApplication}>
                <img src={Add} alt=""/>
                <div>添加应用</div>
              </div>
            </Card>
          </Col>
        </Row>
        <Modal
          title={this.state.modalTitle}
          visible={this.state.showModal}
          onOk={this.comfirm}
          onCancel={this.cancel}
          okText="确认"
          cancelText="取消"
          width="630px"
        >
          <Form layout="inline">
            <Row gutter={16}>
              <Col span={12} style={{display: 'none'}}><Form.Item label="序号">
                {getFieldDecorator('id', {
                  rules: [],
                })(
                  <Input  disabled/>,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="标题">
                {getFieldDecorator('title', {
                  rules: [{ required: true }],
                })(
                  <Input />,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="线路">
                {getFieldDecorator('line', {
                  rules: [{ required: true }],
                })(
                  <Input />,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="故障令号">
                {getFieldDecorator('fault', {
                  rules: [{ required: true }],
                })(
                  <Input />,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="专业">
                {getFieldDecorator('major', {
                  rules: [],
                })(
                  <Input />,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="创建人">
                {getFieldDecorator('create', {
                  rules: [],
                })(
                  <Input />,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="状态">
                {getFieldDecorator('status', {
                  rules: [],
                })(
                  <Select style={{width: '180px'}}>
                    <Option value="新建">新建</Option>
                    <Option value="完成">完成</Option>
                  </Select>,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="更新人">
                {getFieldDecorator('update', {
                  rules: [],
                })(
                  <Input />,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="站点">
                {getFieldDecorator('site', {
                  rules: [],
                })(
                  <Input />,
                )}
              </Form.Item></Col>
              <Col span={24}><Form.Item label="创建时间">
                {getFieldDecorator('createTime', {
                  rules: [],
                  initialValue: null
                })(
                  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                )}
              </Form.Item></Col>
              <Col span={24}><Form.Item label="更新时间">
                {getFieldDecorator('updateTime', {
                  rules: [],
                  initialValue: null
                })(
                  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                )}
              </Form.Item></Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(Application);
