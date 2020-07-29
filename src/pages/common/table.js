import React from 'react'
import { Table, Input, Space, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'

//渲染列表数据
export const setTable = (url, setData, setLoading, pager, setPager, filter, extraParams, id)=> {
    setLoading(true)
    url({page:pager.page, start:pager.start, limit:pager.limit, filter:JSON.stringify(filter), ...extraParams}, id)
        .then(res => {
            if(res){
                setData(res.models)
                setLoading(false)
                setPager({
                    ...pager,
                    total: res.total
                })
            }
        })
        .catch(err => {
            setLoading(true)
            console.log("列表数据加载失败")
        })
}

export const commonTable = (columns, data, rowkey, loading, setDirty, pager, setPager, scroll) => {
    return (
        <>
            <Table
                loading={loading}
                rowKey={rowkey}
                columns={columns}
                dataSource={data}
                style={{marginTop:30}}
                scroll={scroll}
                pagination={{
                    showTotal: () => `共 ${pager.total} 条`,
                    current: pager.current,
                    total: pager.total,
                    pageSize: pager.limit,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    onShowSizeChange: (current, pageSize) => {
                        setPager({
                            ...pager,
                            current: 1,
                            page: 1,
                            start: 0,
                            limit: pageSize
                        })
                        setDirty(dirty=>dirty+1)
                    },
                    onChange: ((page, pageSize) => {
                        setPager({
                            ...pager,
                            current: page,
                            page: page,
                            start: page>1 ? pageSize*(page-1) : 0,
                            limit: pageSize
                        })
                        setDirty(dirty=>dirty+1)
                    })
                }}
            />
        </>
    )
}

export const MainTable = (props) => {
    const { columns, data, rowkey, loading, setDirty, pager, setPager, scroll, setFilter } = props
    return (
        <Table
            loading={loading}
            rowKey={rowkey}
            columns={columns}
            dataSource={data}
            scroll={scroll}
            onChange={
                (_, selectedRows) => {
                    const filterArr = []
                    const objArr= Object.keys(selectedRows)
                    if(objArr.length !== 0) {
                        objArr.forEach(key => {
                            if(selectedRows[key]) {
                                let filterObj = {}
                                filterObj["property"] = key
                                filterObj["value"] = selectedRows[key].toString()
                                filterArr.push(filterObj)
                            }
                        })
                        setFilter(filterArr)
                    }
                }
            }
            pagination={{
                showTotal: () => `共 ${pager.total} 条`,
                current: pager.current,
                total: pager.total,
                pageSize: pager.limit,
                showSizeChanger: true,
                showQuickJumper: true,
                onShowSizeChange: (current, pageSize) => {
                    setPager({
                        ...pager,
                        current: 1,
                        page: 1,
                        start: 0,
                        limit: pageSize
                    })
                    setDirty(dirty=>dirty+1)
                },
                onChange: ((page, pageSize) => {
                    setPager({
                        ...pager,
                        current: page,
                        page: page,
                        start: page>1 ? pageSize*(page-1) : 0,
                        limit: pageSize
                    })
                    setDirty(dirty=>dirty+1)
                })
            }}
        />
    )
}

//自定义筛选菜单
const handleSearch = (selectedKeys, confirm, dataIndex, setSearchProps) => {
    confirm()
    setSearchProps({
        column: dataIndex,
        text: selectedKeys[0]
    })
}
const handleReset = (clearFilters, setSearchProps) => {
    clearFilters()
    setSearchProps({
        text: ""
    })
}
export const getColumnSearchProps = (dataIndex, dataName, searchProps, setSearchProps) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
            <Input
                placeholder={`筛选${dataName}`}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value && e.target.value.trim() ? [e.target.value.trim()] : [])}
                onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex, setSearchProps)}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Space>
                <Button
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex, setSearchProps)}
                    size="small"
                    style={{ width: 90 }}
                >
                    筛选
                </Button>
                <Button onClick={() => handleReset(clearFilters, setSearchProps)} size="small" style={{ width: 90 }}>
                    重置
                </Button>
            </Space>
        </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    render: text =>
        searchProps.column === dataIndex ? (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchProps.text]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ) : (
            text
        ),
})
