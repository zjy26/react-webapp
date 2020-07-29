import React, { useEffect, useState, useContext } from 'react'
import { Button, Row, Col, Form, Input, InputNumber, Select, Radio, Tag, Modal, message, Upload } from 'antd'
import { configLocation } from '../../../../../api/config/lineInfo'
import { upload, overheadLine, anchorSections, stationTracks } from '../../../../../api'
import { connect } from 'react-redux'
import { PlusOutlined } from '@ant-design/icons'
import { EditUpload, showFile } from '../../../../common/upload'

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

const Basic = props => {
  const [intervals, setIntervals] = useState([])
  const locationTree = props.location
  const [inputValue, setInputValue] = useState('')
  const [inputVisible, setInputVisible] = useState(false)
  const { MyContext, setLine, setEditStatus, base } = props
  const [edit, setEdit] = useState(false)
  const [dirty, setDirty] = useState(0)
  const [tagHidden, setTagHidden] = useState(true)
  const [tags, setTags] = useState([])
  const [stationTrackList, setStationTrackList] = useState([])
  const [anchorSectionList, setAnchorSectionList] = useState([])
  const [siteOption, setSiteOption] = useState([])  //站点选择
  const { id, line, vehicleRouteOption, catenaryTypeOption, ConfigLocationOption, catenaryLocationTypeOption } = useContext(MyContext)
  const [form] = Form.useForm()
  const [obj, setObj] = useState({})

  const [fileList, setFileList] = useState([])
  const [preview, setPreview] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: ''
  })

  setEditStatus(edit)

  useEffect(() => {
    if (line) {
      anchorSections({ line: line })
        .then(res => {
          if (res) {
            setAnchorSectionList(res.models)
          }
        })
      configLocation.configIntervalList({ line: line })
        .then(res => {
          if (res.models) {
            setIntervals(res.models)
          }
        })
    }

  }, [line])

  useEffect(() => {
    if (locationTree.toJS().lineSite && edit === false) {
      overheadLine.overHeadLineDetail(id)
        .then(res => {
          if (res) {
            locationTree.toJS().lineSite.forEach(item => {
              if (item.value === res.line) {
                setSiteOption(item.children)
              }
            })
            setLine(res.line)
            const lineDesc = locationTree.toJS().lineSite.find(obj => obj.value === res.line)
            const site1 = locationTree.toJS().site.find(obj => obj.value === res.site1)
            const site2 = locationTree.toJS().site.find(obj => obj.value === res.site2)
            setObj({
              ...res,
              lineDesc: lineDesc ? lineDesc.label : undefined,
              site1Desc: site1 ? site1.label : undefined,
              site2Desc: site2 ? site2.label : undefined,
            })
            form.resetFields()
            if (res.etag) {
              setTags(res.etag.split(','))
            }
          }
        })
        .then(() => {
          showFile(id, "d9OverheadLine-img", setFileList)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationTree, dirty, base])

  //取消编辑
  const cancel = () => {
    setEdit(false)
    form.resetFields()
  }

  const handleInputChange = e => {
    setInputValue(e.target.value)
  }

  const changeInterval = (value, Option) => {
    configLocation.configIntervalDetail(Option.id)
      .then(res => {
        if (res) {
          form.setFieldsValue({ site1: res.site1, site2: res.site2, catenaryType: res.catenaryType, vehicleRoute: res.vehicleRoute })
          const item = ConfigLocationOption.find(obj => obj.code === res.site1)
          const item2 = ConfigLocationOption.find(obj => obj.code === res.site2)
          if (item.siteFunction === '03' && item2.siteFunction === '03') {
            stationTracks()
              .then(res => {
                if (res) {
                  setStationTrackList(res.models)
                }
              })
              .catch(() => {
                console.log("列表数据加载失败")
              })
          } else {
            setStationTrackList([])
          }
        }
      })
      .catch(() => {
        console.log("列表数据加载失败")
      })
  }

  const handleInputConfirm = () => {
    if (inputValue) {
      if (tags.indexOf(inputValue) === -1) {
        tags.push(inputValue)
        setInputValue('')
        setInputVisible(false)
      } else {
        message.success("标签已存在")
      }
    } else {
      message.success("标签不能为空")
    }
  }

  const showInput = () => {
    if (tags.length < 5) {
      setInputVisible(true)
    } else {
      message.success("标签数量应该小于5")
    }
  }

  //基本信息编辑保存
  const save = () => {
    form.validateFields()
      .then(values => {
        if (id) {//编辑
          form.isFieldsTouched() ?
            Modal.confirm({
              title: '确认提示',
              content: '是否确认修改？',
              okText: '确认',
              okType: 'danger',
              cancelText: '取消',
              onOk: () => {
                let { siteLine, ...data } = values
                var arr = { tags }.tags
                let params = {
                  ...data,
                  etag: arr.join(','),
                  _method: 'PUT',
                  org: '11'
                }
                overheadLine.overHeadLineUpdate(id, params)
                  .then(res => {
                    if (res) {
                      message.success("保存成功")
                      setEdit(false)
                      setDirty((dirty) => dirty + 1)
                    }
                  })
              },
              onCancel() {
              },
            }) : setEdit(false)
        }
      })
      .then(() => {
        if (id) {
          const ids = []
          fileList.forEach(item => {
            if (item.status === "done") {
              ids.push(item.uid)
            }
          })
          upload({
            ids: ids.toString(),
            record: id
          })
        }
      })
  }

  const closeTage = (item) => {
    const tagList = tags.filter(tag => tag !== item);
    setTags(tagList)
  }

  //图片预览
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreview({
      ...preview,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    })
  }
  const previewCancel = () => setPreview({ ...preview, previewVisible: false })

  return (
    <React.Fragment>
      <Row>
        <Col span={20}><h3>基础信息</h3></Col>
        {
          edit ?
            <Col span={4} align="right">
              <Button type="link" onClick={save}>保存</Button>
              <Button type="link" onClick={cancel}>取消</Button>
            </Col> :
            <Col span={4} align="right">
              <Button type="link" onClick={() => { setEdit(true) }}>编辑</Button>
            </Col>
        }
      </Row>

      <Row>
        <Form {...formItemLayout} form={form} initialValues={obj} style={{ margin: 20 }}>
          {
            edit === false ?
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="定位点编码">
                    {obj.code}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="定位点描述">
                    {obj.descr}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="状态">
                    {obj.enable ? '启用' : '停用'}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="线路">
                    {obj.lineDesc}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="区间信息">
                    {
                      obj.interval && intervals && intervals.length > 0 ?
                        intervals.find(val => val.code === obj.interval) ? intervals.find(val => val.code === obj.interval).descr : ""
                        :
                        ''
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="站点1" >
                    {obj.site1Desc}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="站点2" >
                    {obj.site2Desc}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="行车路线">
                    {
                     vehicleRouteOption.find(data => data.code === obj.vehicleRoute) &&
                     vehicleRouteOption.find(data => data.code === obj.vehicleRoute).name
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="触网类型">
                    {
                     catenaryTypeOption.find(data => data.code === obj.catenaryType) &&
                     catenaryTypeOption.find(data => data.code === obj.catenaryType).name
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="锚段号" >
                    {
                     anchorSectionList.find(data => data.code === obj.anchorSection) &&
                     anchorSectionList.find(data => data.code === obj.anchorSection).name
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="股道号">
                  {
                     stationTrackList.find(data => data.code === obj.stationTrack) &&
                     stationTrackList.find(data => data.code === obj.stationTrack).name
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="定位点号" >
                    {obj.anchorPoint}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="百米标" >
                    {obj.logo}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="电子标签" >
                    {tags.map((item, index) =>
                      index < 2 ?
                        <Tag key={index} value={item}>{item}</Tag> :
                        <Tag key={index} value={item} hidden={tagHidden}>{item}</Tag>
                    )
                    }
                    <Tag onClick={() => {
                      tagHidden ?
                        setTagHidden(false) : setTagHidden(true)
                    }}>···</Tag>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="悬挂形式" >
                    {obj.hangingForm}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="链式悬挂" >
                    {obj.chainSuspension}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="布置位置">
                    {
                     catenaryLocationTypeOption.find(data => data.code === obj.locationType) &&
                     catenaryLocationTypeOption.find(data => data.code === obj.locationType).name
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="公里标">
                    {obj.kmTable}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="顺序">
                    {obj.sn}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="曲面半径">
                    {obj.surfaceRadius ? obj.surfaceRadius + 'm' : null}
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="定位点图片" {...{ labelCol: { span: 4 } }}>
                    <Upload
                      fileList={fileList}
                      listType="picture-card"
                      onPreview={handlePreview}
                      disabled
                    />
                    <Modal
                      visible={preview.previewVisible}
                      title={preview.previewTitle}
                      footer={null}
                      onCancel={previewCancel}
                    >
                      <img alt="定位点图片" style={{ width: '100%' }} src={preview.previewImage} />
                    </Modal>
                  </Form.Item>
                </Col>
                <Col span={19} style={{ paddingRight: 20 }}><h3>调整信息</h3></Col>
                <Col span={12}>
                  <Form.Item label="导高">
                    {obj.guideHeight ? obj.guideHeight + 'mm' : ''}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="拉出值">
                    {obj.pullValue}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="接触线磨耗">
                    {obj.contractLineAbrasion ? obj.contractLineAbrasion : '--'}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="接触面高">
                    {obj.contactSurfaceHeight ? obj.contactSurfaceHeight + 'm' : ''}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="下锚状态A值" >
                    {obj.anchorStateAValue}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="下锚状态B值" >
                    {obj.anchorStateBValue}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="分段导滑板磨耗">
                    {obj.sectSkateAbrasion ? obj.sectSkateAbrasion : '--'}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="中心锚接数据" >
                    {obj.centralAnchorData}
                  </Form.Item>
                </Col>
              </Row>
              :
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label="定位点编码" name="code">
                    <Input placeholder="请输入定位点编码" disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="定位点描述" name="descr">
                    <Input placeholder="请输入定位点描述" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="状态" name="enable">
                    <Radio.Group>
                      <Radio value={true}>启用</Radio>
                      <Radio value={false}>停用</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="线路" name="line">
                    <Select placeholder="请选择线路"
                      onChange={
                        (value) => {
                          locationTree.toJS().lineSite && locationTree.toJS().lineSite.forEach(item => {
                            if (item.value === value) {
                              setSiteOption(item.children)
                              setLine(value)
                              form.setFieldsValue({ interval: null, site1: null, site2: null, catenaryType: null, vehicleRoute: null, anchorSection: null, stationTrack: null })
                            }
                          })
                        }
                      }
                    >
                      {locationTree.toJS().line && locationTree.toJS().line.map(item => (
                        <Select.Option key={item.value} value={item.value}>
                          {item.label}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="区间信息" name="interval" rules={[{ required: true, message: '请选择区间信息' }]}>
                    <Select placeholder="请选择区间信息" onChange={changeInterval}>
                      {
                        intervals && intervals.map(item => (
                          <Select.Option key={item.code} id={item.id} value={item.code}>
                            {item.descr}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="站点1" name="site1">
                    <Select placeholder="请选择站点" disabled>
                      {
                        siteOption && siteOption.length > 0 && siteOption.map(item => (
                          <Select.Option key={item.value} value={item.value}>
                            {item.label}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="站点2" name="site2">
                    <Select placeholder="请选择站点" disabled>
                      {
                        siteOption && siteOption.length > 0 && siteOption.map(item => (
                          <Select.Option key={item.value} value={item.value}>
                            {item.label}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="行车路线" name="vehicleRoute">
                    <Select placeholder="请选择行车路线" disabled>
                      {
                        vehicleRouteOption && vehicleRouteOption.length > 0 && vehicleRouteOption.map(item => (
                          <Select.Option key={item.code} value={item.code}>
                            {item.name}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="触网类型" name="catenaryType">
                    <Select placeholder="请选择触网类型" onChange={() => {
                      form.setFieldsValue({ chainSuspension: null })
                    }} disabled>
                      {
                        catenaryTypeOption && catenaryTypeOption.length > 0 && catenaryTypeOption.map(item => (
                          <Select.Option key={item.code} value={item.code}>
                            {item.name}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="锚段号" name="anchorSection">
                    <Select placeholder="请选择锚段号">
                      {
                        anchorSectionList && anchorSectionList.map(item => (
                          <Select.Option key={item.code} value={item.code}>
                            {item.descr}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="股道号" name="stationTrack">
                    <Select placeholder="请选择接触网位置类型">
                      {
                        stationTrackList && stationTrackList.length > 0 && stationTrackList.map(item => (
                          <Select.Option key={item.code} value={item.code}>
                            {item.descr}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="定位点号" name="anchorPoint"
                    rules={[{ required: true, message: '请输入定位点号' },
                    { whitespace: true, message: '内容不能为空' }
                    ]}>
                    <Input placeholder="请输入定位点号" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="百米标" name="logo">
                    <Input placeholder="请输入百米标" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="电子标签">
                    {inputVisible && (
                      <Input
                        type="text"
                        size="small"
                        value={inputValue}
                        style={{ width: 80 }}
                        onChange={handleInputChange}
                        onBlur={handleInputConfirm}
                        onPressEnter={handleInputConfirm}
                      />
                    )}
                    {!inputVisible && (
                      <Tag onClick={showInput}>
                        <PlusOutlined /> 新标签
                      </Tag>
                    )}
                    {tags.map((item, index) =>
                      <Tag key={item} closable={true} onClose={() => closeTage(item)}>{item}</Tag>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="悬挂形式" name="hangingForm">
                    <Input placeholder="请输入悬挂形式" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="链式悬挂" name="chainSuspension">
                    {form.getFieldValue("catenaryType") === "0101" ? <Select placeholder="请选择链式悬挂">
                      <Select.Option value="正">正</Select.Option>
                      <Select.Option value="反">反</Select.Option>
                      <Select.Option value="无">无</Select.Option>
                    </Select> : <Select placeholder="请选择链式悬挂" disabled>
                        <Select.Option value="正">正</Select.Option>
                        <Select.Option value="反">反</Select.Option>
                        <Select.Option value="无">无</Select.Option>
                      </Select>}

                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="布置位置" name="locationType">
                    <Select placeholder="请选择接触网位置类型">
                      {
                        catenaryLocationTypeOption.length > 0 && catenaryLocationTypeOption.map(item => (
                          <Select.Option key={item.code} value={item.code}>
                            {item.name}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="公里标" name="kmTable">
                    <InputNumber placeholder="请输入公里标" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="顺序" name="sn">
                    <InputNumber placeholder="请输入顺序" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="曲面半径(m)" name="surfaceRadius">
                    <InputNumber placeholder="请输入曲面半径(m)" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="定位点图片" {...{ labelCol: { span: 4 } }}>
                    <EditUpload
                      accept="image/*"
                      listType="picture-card"
                      model='d9OverheadLine-img'
                      fileList={fileList}
                      setFileList={setFileList}
                      type={2}
                    />
                  </Form.Item>
                </Col>
                <Col span={19} style={{ paddingRight: 20 }}><h3>调整信息</h3></Col>
                <Col span={12}>
                  <Form.Item label="导高">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="拉出值">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="接触线磨耗">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="接触面高">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="下锚状态A值" >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="下锚状态B值" >
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="分段导滑板磨耗">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="中心锚接数据" >
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
          }
        </Form>
      </Row>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    location: state.getIn(['common', 'location'])
  }
}


export default connect(mapStateToProps, null)(React.memo(Basic))
