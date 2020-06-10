import React, { useEffect } from 'react'
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Select, Form } from 'antd'
import { assetClass, getFunByCode } from '../../../api'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}
const ClassModal = (props) => {
  const [form] = Form.useForm()
  useEffect(() => {
    if(props.currentId.edit) {
      form.setFieldsValue({...props.currentId.model})
    }else{
      form.resetFields()
    }
  }, [props.currentId,form,props.parItem,props.user,props.title])

  const handleSubmit = () => {
    form.validateFields()
    .then(value => {
      const {levelOption, ...classObj} = value
      getFunByCode()
      .then(res =>{
        if(props.currentId.edit) {
          Modal.confirm({
            title: '确认提示',
            content: '是否确认修改？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: ()=> {
              assetClass.updateClass(props.currentId.id, {...classObj, _method:"PUT", function: res.id, id:props.currentId.id})
              .then(res =>{
                props.handleCancel()
                props.setDirty(dirty=>dirty+1)
              })
            },
            onCancel() {
              props.handleCancel()
            },
          })
        } else {//添加
          classObj["org"] = parseInt(res.mos)? props.org : "*"
          classObj["function"] = res.id
          if(props.currentId.readOnly && props.currentId.canCreate){ //都true
            if(props.parItem && props.parItem.level){
              switch (props.parItem.level){
                case 2:
                  classObj["major"] = props.currentId.model.code
                  break;
                default:
                  classObj["major"] = props.parItem.item.model.code
                  classObj["type"] = props.currentId.model.code
                  break;
              }
            }
          }else if(!props.currentId.readOnly){ //readOnlyfalse
            classObj["major"] = props.currentId.model.major
            classObj["type"] = props.currentId.model.type
            if(levelOption===0){//同级
              if(!props.parItem.item.readOnly){
                classObj["parentCls"] = props.parItem.item.model.code
                classObj["parentClsOrg"] = props.parItem.item.model.org
              }
            }else if(levelOption===1){
              classObj["parentCls"] = props.currentId.model.code
              classObj["parentClsOrg"] = props.currentId.model.org
            }
          }
          assetClass.addObjectClass(classObj)
          .then(res =>{
            props.handleCancel()
            props.setDirty(dirty => dirty+1)
          })
        }
      })
    })
  }

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title={props.title}
      okText="确定"
      okType="danger"
      cancelText="取消"
      visible={props.visible}
      onCancel={props.handleCancel}
      onOk={handleSubmit}
      currentId={props.currentId}
    >
      <Form form={form} {...formItemLayout}>
        <Form.Item label="层级名称"
          name="desc"
          rules={[
            {
              required: true,
              message: '请输入层级名称'
            },
            {
              pattern: /^[^\s]*$/,
              message: '禁止输入空格',
            }
          ]}
        >
          <Input maxLength={20}/>
        </Form.Item>
        <Form.Item label="分类代码"
          name="code"
          rules={[
              {
                required: true,
                message: '请输入分类代码'
              },
              {
                pattern: /^[^\s]*$/,
                message: '禁止输入空格',
              }
            ]}
          >
            <Input maxLength={20}/>
          </Form.Item>
        {
          props.currentId.edit ? null :

          <Form.Item label="级别选择" name="levelOption" rules={[{required: true, message: '请选择分类级别'}]}>
            <Select>
              {
                props.currentId.canCreate && !props.currentId.readOnly ?
                  <Select.Option value={0}>添加同级</Select.Option> :
                  null
              }
              <Select.Option value={1}>添加下级</Select.Option>
            </Select>
          </Form.Item>
        }
        <Form.Item label="备注" name="remarks">
          <Input.TextArea placeholder="请输入备注信息"/>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default React.memo(ClassModal)
