import React, { useEffect } from 'react'
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Select, Form, message } from 'antd'
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
  const { handleCancel, currentId, setDirty, level, parItem, visible, title, org } = props
  useEffect(() => {
    if(currentId.edit) {
      form.setFieldsValue({...currentId.model})
    }else{
      form.resetFields()
      form.setFieldsValue({levelOption: currentId.level>3 ? 0 : 1})
    }
  }, [currentId,form,title,level])

  const handleSubmit = () => {
    form.validateFields()
    .then(value => {
      const {levelOption, ...classObj} = value
      getFunByCode('asset.object')
      .then(res =>{
        if(currentId.edit) {
          Modal.confirm({
            title: '确认提示',
            content: '是否确认修改？',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: ()=> {
              assetClass.updateClass(currentId.id, {...classObj, _method:"PUT", function: res.id, id:currentId.id})
              .then(res =>{
                handleCancel()
                message.success('修改成功')
                setDirty(dirty=>dirty+1)
              })
              .catch(error => {
                message.error('修改失败')
              })
            },
            onCancel() {
              handleCancel()
            },
          })
        } else {//添加
          classObj["org"] = parseInt(res.mos)? org : "*"
          classObj["function"] = res.id
          classObj["_method"] = 'POST'
          if(levelOption===0){//同级
            if(parItem.model){
              classObj["parentCls"] = parItem.model.code
              classObj["parentClsOrg"] = parItem.model.org
            }else{
              classObj["parentCls"] = ''
              classObj["parentClsOrg"] = '*'
            }
          }else if(levelOption===1 ){
            if(currentId.model){
              classObj["parentCls"] = currentId.model.code
              classObj["parentClsOrg"] = currentId.model.org
            } else{
              classObj["parentCls"] = ''
              classObj["parentClsOrg"] = '*'
            }

          }
          assetClass.addObjectClass(classObj)
          .then(res =>{
            handleCancel()
            if(res.success){
              setDirty(dirty => dirty+1)
              message.success('新增分类成功')
            }
            if(res.actionErrors && res.actionErrors.length){
              message.error(res.actionErrors[0])
            }
          })
          .catch(error => {
            message.error('新增分类失败')
            handleCancel()
          })
        }
      })
    })
  }

  return (
    <Modal
      maskClosable={false}
      getContainer={false}
      title={title}
      okText="确定"
      okType="danger"
      cancelText="取消"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      currentId={currentId}
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
            <Input maxLength={20} placeholder="请输入层级名称"/>
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
            <Input maxLength={20} placeholder="请输入分类代码"/>
          </Form.Item>
        {
          currentId.edit ? null :

          <Form.Item label="级别选择" name="levelOption" rules={[{required: true, message: '请选择分类级别'}]}>
            {currentId.level === 1?
            <Select placeholder="请选择分类级别" disabled>
              <Select.Option value={1}>添加下级</Select.Option>
            </Select>:
            currentId.level < 4?
            <Select placeholder="请选择分类级别">
              <Select.Option value={0}>添加同级</Select.Option>
              <Select.Option value={1}>添加下级</Select.Option>
            </Select>:
            <Select placeholder="请选择分类级别" disabled>
              <Select.Option value={0}>添加同级</Select.Option>
            </Select>
            }
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
