import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux'
import { Row, Col, Spin } from 'antd'
import Axios from 'axios'
import Error from '../error'

const View = (props) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusCode, setStatusCode] = useState(200)
  const showModal = ()=>{
    props.showModal()
  }

  useEffect(() => {
    Axios.get('/applications').then(res =>{
      if(res.status === 200){
        setData(res.data)
        setLoading(false)
      }
    }).catch((err) =>{
      setStatusCode(err.response.status)
    })
  }, [])

  if(loading === true) {
    if(statusCode === 500 || statusCode === 404){
      return(
        <Error status={statusCode}/>
      )
    } else {
      return (
      //加载中状态
      <Spin />
      )
    }
  } else {
    return (
      <div>
        <Row style={{textAlign: 'center'}}>
          {
            data.map((item, index)=>{
              if(item.name === "Password") {
                return (
                  <Col xs={12} sm={8} md={6} lg={4} key={index}>
                    <span>
                      <img src={item.icon} alt={item.name} onClick={showModal}  />
                    </span>
                  </Col>
                )
              } else {
                return (
                  <Col xs={12} sm={8} md={6} lg={4} key={index}>
                    <a href={item.href}>
                      <img src={item.icon} alt={item.name}/>
                    </a>
                  </Col>
                )
              }
            })
          }
        </Row>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
      showModal() {
        let action = {
          type:'showPsdModal'
        }
        dispatch(action)
      }
  }
}

export default connect(null, mapDispatchToProps)(React.memo(View))