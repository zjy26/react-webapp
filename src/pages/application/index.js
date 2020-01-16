import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Modal, Form, Input, Upload, Icon, Typography, Button, Spin } from 'antd';
import style from './Application.module.scss';
import Axios from 'axios';
import Error from '../error';

const { confirm } = Modal;
const { Text } = Typography;
const formItemLayout = {
  labelCol: {
    xs: { span: 12 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const Application = props => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [obj, setObj] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusCode, setStatusCode] = useState(200);
  const img = {icon: "/images/Setting.png", iconFile: [{"uid": "-1", "name": "test", "thumbUrl": "/images/Setting.png"}]};  //设置默认图标

  useEffect(() => {
    Axios.get('/api/applications').then(res =>{
      if(res.status === 200){
        setData(res.data)
        setLoading(false)
      }
   }).catch((err) =>{
      setStatusCode(err.response.status)
      setLoading(true)
   })
  }, [loading]);

  //应用弹窗
  //弹窗确认
  const comfirm = () => {
    const {
      form: { validateFields, isFieldsTouched},
    } = props;

    validateFields((errors, values) => {
      if(errors) {
        return;
      }

      if(values.id) {//修改
        if(isFieldsTouched() === true) {  //判断是否有修改
          confirm({
            title: '确认提示',
            content: '是否确认修改？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: ()=> {
              const fieldsValues = {...values};
              Axios.put('/api/applications/'+values.id,
              {
                name: fieldsValues.name,
                href: fieldsValues.href,
                iconFile: img.iconFile,
                icon: img.icon
              }
              ).then((res)=>{
                setObj({})
                setShowModal(false)
                setLoading(true)
              })
            },
            onCancel() {
            },
          });
        } else {
          setShowModal(false)
        }
      } else {//添加
        const newFieldsValues = {...values};
        Axios.post('/api/applications',
        {
          name: newFieldsValues.name,
          href: newFieldsValues.href,
          iconFile: img.iconFile,
          icon: img.icon
        }
        ).then((res)=>{
          setShowModal(false)
          setLoading(true)
        });
      }

    });


  };

  //弹窗取消
  const cancel = () => {
    const {
      form: { resetFields },
    } = props;
    setShowModal(false);
    resetFields();
  };

  //添加应用
  const addApplication = ()=>{
    const {
      form: { resetFields },
    } = props;
    resetFields();
    setShowModal(true);
    setObj({});
    setModalTitle("添加应用");
  }

  //编辑
  const edit = (id)=>{
    Axios.get('/api/applications/'+id)
    .then((res) =>{
      if(res.status === 200){
        setShowModal(true);
        setObj(res.data);
        setModalTitle("编辑应用");
      }
    })
  }

  //删除
  const handleDelete = (id)=> {
    confirm({
      title: '删除提示',
      content: '是否确认删除，如果删除，将不能恢复',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: ()=> {
        Axios.delete('/api/applications/'+id)
        .then((res) =>{
          setLoading(true);
        })

      },
      onCancel() {

      },
    });
  }

  const normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };


  const { getFieldDecorator } = props.form;
  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

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

  if(loading === true) {
    if(statusCode === 500 || statusCode === 404){
      return(
        <Error status={statusCode}/>
      )
    }else{
      return (
      //加载中状态
      <div className={style.loading}>
        <Spin />
      </div>
      )
    }
  } else {
    return (
      <div className={style.cardPanel}>
        <Row>
          {
            data.map((item, index)=>{
              return(
                <Col md={12} lg={8} xl={6} xxl={6} key={index}>
                  <Card title={item.name}
                    actions={[
                    <Button type="primary" shape="circle" icon="link" href={item.href} target="_blank" />,
                    <Button type="primary" shape="circle" icon="edit" onClick={()=>{edit(item.id)}} />,
                    <Button type="primary" shape="circle" icon="delete" onClick={()=>{handleDelete(item.id)}} />,
                  ]}>
                    <Col span={10}><img src={item.icon} alt="" style={{width:60,height:60}} /></Col>
                    <Col span={14}><Text strong>ID：{item.id}</Text></Col>
                  </Card>
                </Col>
              )
            })
          }
          <Col md={12} lg={8} xl={6} xxl={6}>
            <Card className={style.addApplication}>
              <Button type="primary" shape="circle" style={{width:'66px',height:'66px'}} onClick={addApplication}>
                <Icon type="plus" style={{width:'35px',height:'35px',fontSize:'35px'}} />
              </Button>
              <div>添加应用</div>
            </Card>
          </Col>
        </Row>

        <Modal
          title={modalTitle}
          visible={showModal}
          onOk={comfirm}
          onCancel={cancel}
          okText="确认"
          cancelText="取消"
          width="630px"
        >
          <Form {...formItemLayout} className={style.applicationForm}>
            <Row gutter={24}>
            <Col span={24}><Form.Item label="ID" style={{display: 'none'}}>
                {getFieldDecorator('id', {
                  initialValue: obj.id
                })(
                  <Input  disabled/>,
                )}
              </Form.Item></Col>
              <Col span={24}>
                <Form.Item label="标题">
                {getFieldDecorator('name', {
                  initialValue: obj.name,
                  rules: [{required: true, whitespace: true, message: "必填项不能为空"}],
                })(
                  <Input />,
                )}
                </Form.Item></Col>
              <Col span={24}><Form.Item label="链接">
                {getFieldDecorator('href', {
                  initialValue: obj.href,
                  rules: [{ required: true , whitespace: true, message: "必填项不能为空" }],
                })(
                  <Input />,
                )}
              </Form.Item></Col>
              <Col span={24}><Form.Item label="上传图片">
                {getFieldDecorator('iconFile', {
                  initialValue: obj.iconFile,
                  valuePropName: 'file',
                  getValueFromEvent: normFile,
                  rules: [{ required: true , message: "必填项不能为空" }],
                })(
                  <Upload {...uploadProps}>
                    {obj.icon ? <img src={obj.icon} alt="avatar" /> : uploadButton }
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