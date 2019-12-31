import React, { Component } from 'react';
import { Card, Col, Row, Button, Modal, Form, Input, DatePicker, Select, Upload, Icon} from 'antd';
import '../../styles/application.css';
import Add from '../../images/add.png';
import moment from 'moment'; 
import OA from '../../images/OA.png';
import GitLab from '../../images/GitLab.png';
import Wiki from '../../images/Wiki.png';
import Setting from '../../images/Setting.png';
import Password from '../../images/Password.png';

const { confirm } = Modal;

class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {id:1, iconFile: {uid: '1', name: 'OA', thumbUrl:OA}, icon:OA,
          title:'211隔离开关柜报警1', line:'17号线', fault:'1111111', major:'17号线变电专业', create:'供电调度', status:'新建', update:'供电调度', site:'东方绿洲', createTime:'2019-10-11 10:22:00', updateTime:'2019-11-13 09:12:00'},
        {id:2, iconFile: {uid: '2', name: 'GitLab', thumbUrl:GitLab},icon:GitLab,
          title:'211隔离开关柜报警2', line:'17号线', fault:'1111111', major:'17号线变电专业', create:'供电调度', status:'新建', update:'供电调度', site:'东方绿洲', createTime:'2019-10-11 10:22:00', updateTime:'2019-11-13 09:12:00'},
        {id:3, iconFile: {uid: '3', name: 'Wiki', thumbUrl:Wiki},icon:Wiki,
          title:'211隔离开关柜报警3', line:'17号线', fault:'1111111', major:'17号线变电专业', create:'供电调度', status:'新建', update:'供电调度', site:'东方绿洲', createTime:'2019-10-11 10:22:00', updateTime:'2019-11-13 09:12:00'},
        {id:4, iconFile: {uid: '2', name: 'Setting', thumbUrl:Setting},icon:Setting,
          title:'211隔离开关柜报警4', line:'17号线', fault:'1111111', major:'17号线变电专业', create:'供电调度', status:'新建', update:'供电调度', site:'东方绿洲', createTime:'2019-10-11 10:22:00', updateTime:'2019-11-13 09:12:00'},
        {id:5, iconFile: {uid: '2', name: 'Password', thumbUrl:Password},icon:Password,
          title:'211隔离开关柜报警5', line:'17号线', fault:'1111111', major:'17号线变电专业', create:'供电调度', status:'新建', update:'供电调度', site:'东方绿洲', createTime:'2019-10-11 10:22:00', updateTime:'2019-11-13 09:12:00'}
      ],
      showModal: false,
      modalTitle: '',
      obj:{},
      node: '',
      iconFile:[{"uid": "-1", "name": "test", "thumbUrl": "../../images/Setting.png"}],  //设置默认图标
      icon: Setting
    }
  }

  comfirm = ()=> {

    const {
      form: { validateFields, resetFields },
    } = this.props;
    const {data} = this.state;

    validateFields((errors, values) => {
      if(errors) {
        return;
      }
      if(values.id) {//编辑应用
        const fieldsValues = {
          ...values,
          "createTime": values.createTime? values.createTime.format('YYYY-MM-DD HH:mm:ss'): null,  //时间校验
          "updateTime": values.updateTime? values.updateTime.format('YYYY-MM-DD HH:mm:ss'): null
        };
        data.splice(this.state.node, 1, fieldsValues)
      } else {  //增加应用
        const newFieldsValues = {
          ...values,
          id: data[data.length-1].id + 1,
          "createTime": values.createTime? values.createTime.format('YYYY-MM-DD HH:mm:ss'): null,  //时间校验
          "updateTime": values.updateTime? values.updateTime.format('YYYY-MM-DD HH:mm:ss'): null,
          "iconFile": this.state.iconFile,
          "icon": this.state.icon
        };
        data.push(newFieldsValues);
      }

      this.setState({
        data,
        showModal: false,
        obj: {}
      });
      resetFields();
    });

  };

  cancel = e => {
    this.setState({
      showModal: false,
      obj: {}
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
    const fieldsValues = {
      ...this.state.data[index],
      "createTime": moment(this.state.data[index].createTime),
      "updateTime": moment(this.state.data[index].updateTime)
    };

    this.setState({
      obj: fieldsValues,
      showModal: true,
      modalTitle: '编辑应用',
      node: index
    });

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

  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { Option } = Select;

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const uploadProps = {
      name: "avatar",
      listType: "picture-card",
      action: "https://ant.design/upload.do",
      showUploadList: false,
      accept: "image/*",
      onChange: ({ file }) => {
        console.log(file)
      }
    }

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
                    <Col span={24}><img src={item.icon} alt="" style={{width:60,height:60}}/></Col>
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
          <Form layout="horizontal"
          {...formItemLayout}
           >

            <Row gutter={16}>
              <Col span={12}><Form.Item label="序号">
                {getFieldDecorator('id', {
                  initialValue: this.state.obj.id,
                  rules: [],
                })(
                  <Input  disabled/>,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="标题">
                {getFieldDecorator('title', {
                  initialValue: this.state.obj.title,
                  rules: [{ required: true }],
                })(
                  <Input />,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="线路">
                {getFieldDecorator('line', {
                  initialValue: this.state.obj.line,
                  rules: [{ required: true }],
                })(
                  <Input />,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="故障令号">
                {getFieldDecorator('fault', {
                  initialValue: this.state.obj.fault,
                  rules: [{ required: true }],
                })(
                  <Input />,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="专业">
                {getFieldDecorator('major', {
                  initialValue: this.state.obj.major,
                  rules: [],
                })(
                  <Input />,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="创建人">
                {getFieldDecorator('create', {
                  initialValue: this.state.obj.create,
                  rules: [],
                })(
                  <Input />,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="状态">
                {getFieldDecorator('status', {
                  initialValue: this.state.obj.status,
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
                  initialValue: this.state.obj.update,
                  rules: [],
                })(
                  <Input />,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="站点">
                {getFieldDecorator('site', {
                  initialValue: this.state.obj.site,
                  rules: [],
                })(
                  <Input />,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="创建时间">
                {getFieldDecorator('createTime', {
                  rules: [],
                  initialValue: this.state.obj.createTime
                })(
                  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="更新时间">
                {getFieldDecorator('updateTime', {
                  rules: [],
                  initialValue: this.state.obj.updateTime
                })(
                  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                )}
              </Form.Item></Col>
              <Col span={12}><Form.Item label="上传图片">
                {getFieldDecorator('iconFile', {
                  valuePropName: 'file',
                  getValueFromEvent: this.normFile,
                  initialValue: this.state.obj.iconFile
                })(
                  <Upload {...uploadProps}>
                    {this.state.obj.icon ? <img src={this.state.obj.icon} alt="avatar" /> : uploadButton }
                  </Upload>
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
