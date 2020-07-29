import React, { useEffect, useState } from 'react'
import { Form, Modal, Input, DatePicker, TimePicker, Select, Row, Col, message } from 'antd'
import moment from 'moment'
import { configLocation } from '../../../api/config/lineInfo'
import { requestApi } from '../../../api/request'
import { upload } from '../../../api/index'
import { EditUpload } from '../../common/upload'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const NewModal = props => {
  const { catenaryTypeOption, lineLeaderOption } = props
  const [form] = Form.useForm()
  const [initValues, setInitValues] = useState({})
  const [prefix, setPrefix] = useState()
  const [fileList, setFileList] = useState({
    lineInfoHt: [],
    lineInfo: []
  })
  const [okLoading, setOkLoading] = useState(false)

  useEffect(() => {
    if (props.visible === true) {
      setOkLoading(false)

      setFileList({
        lineInfoHt: [],
        lineInfo: []
      })

      requestApi(
        configLocation.configLocationNew({ level: 2 }),
        (res) => {
          setPrefix(res.code)
          const { code, ...data } = res
          setInitValues({
            ...data, code: null,
            lineLeader: res.lineLeader ? res.lineLeader : undefined,
            catenaryType: res.catenaryType ? res.catenaryType : undefined,
            runTime: [res.runStartTime, res.runEndTime]
          })
          form.resetFields()
        }
      )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  //确定
  const handleSubmit = () => {
    form.validateFields()
    .then(values => {
      const { runTime, ...data } = values
      const runTimeArr = values.runTime.map(item => item ? moment(item).format('HH:mm') : "")

      const params = {
        ...data,
        level: 2,
        org: props.user.org,
        code: `${prefix}${values.code}`,
        commissionDate: values.commissionDate ? moment(values.commissionDate, 'YYYY-MM-DD HH:mm:ss').valueOf() : null,
        runStartTime: runTimeArr[0],
        runEndTime: runTimeArr[1],
        catenaryType: values.catenaryType ? values.catenaryType.toString() : null
      }

        setOkLoading(true)
        configLocation.configLocationAdd(params)
          .then(res => {
            if (res && res.success) {
              message.success("新建成功")
              props.handleCancel()
              props.setDirty((dirty) => dirty + 1)
              return res
            } else {
              setOkLoading(false)
              message.error("新建失败，站点代码可能重复")
            }
          })
          .then(data => {
            if (data && data.id) {
              const ids = []
              for (var i in fileList) {
                fileList[i].forEach(item => {
                  if(item.status === "done") {
                    ids.push(item.uid)
                  }
                })
              }
              upload({
                ids: ids.toString(),
                record: data.id
              })

            }
          })
      })
  }

  return (
    <Modal
      maskClosable={false}
      title="新建线路"
      okText="确认"
      cancelText="取消"
      width="800px"
      onOk={handleSubmit}
      visible={props.visible}
      onCancel={props.handleCancel}
      okButtonProps={{ loading: okLoading }}
    >
      <Form name="newLineForm" {...formItemLayout} form={form} initialValues={initValues}>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="线路代码"
              name="code"
              rules={[
                { whitespace: true, message: '内容不能为空' },
                { required: true, message: '请输入线路代码' }
              ]}
            >
              <Input addonBefore={prefix} maxLength={2} placeholder="请输入线路代码" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="线路描述"
              name="desc"
              rules={[
                { whitespace: true, message: '内容不能为空' },
                { required: true, message: '请输入线路描述' }
              ]}
            >
              <Input placeholder="请输入线路描述" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="开始运营日期" name="commissionDate">
              <DatePicker placeholder="请选择开始运营日期" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="日运营时间" name="runTime">
              <TimePicker.RangePicker format={"HH:mm"} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="触网类型" name="catenaryType">
              <Select placeholder="请选择触网类型" allowClear mode="multiple">
                {
                  catenaryTypeOption.map(item => (
                    <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12} hidden>
            <Form.Item label="线长" name="lineLeader">
              <Select
                placeholder="请选择线长"
                allowClear
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {
                  lineLeaderOption.map(item => (
                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                  ))
                }
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="备注" name="comment">
              <Input.TextArea placeholder="请输入备注" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="图形">
              <EditUpload
                model = 'lineInfo-ht'
                fileList = {fileList.lineInfoHt}
                setFileList = {setFileList}
                option = "lineInfoHt"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="附件">
              <EditUpload
                model = 'lineInfo'
                fileList = {fileList.lineInfo}
                setFileList = {setFileList}
                option = "lineInfo"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default React.memo(NewModal)
