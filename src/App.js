import React, { useState, useEffect, createContext, useContext, useCallback } from 'react'; 
import {BrowserRouter as Router,  Route, Link} from 'react-router-dom';

const CountContext = createContext();
function Count() {
  let count = useContext(CountContext)
  return (
    <h2>{count}</h2>
  )
}

function Index() {
  useEffect(()=>{
    console.log(`进入Index页面`)
    return ()=>{
      console.log(`离开Index页面`)
    }
  }, [])
  return (<h1>这是首页</h1>)
}
function List() {
  return (<h1>这是列表</h1>)
}

function App() {
  const size = useWinSize()

  const [count, setCount] = useState(0);
  useEffect(()=>{
    console.log(`useEffect=>You clicked ${count} times`)
  })
  return(
    <div>
      <p>点击了{count}次</p>
      <button onClick={()=>{setCount(count+1)}}>点击</button>

      <CountContext.Provider value={count}>
        <Count />
      </CountContext.Provider>

      <Router>
        <ul>
          <li><Link to="/">首页</Link></li>
          <li><Link to="/list/">列表</Link></li>
        </ul>
        <Route path="/" exact component={Index}></Route>
        <Route path="/list/" component={List}></Route>
      </Router>

      页面Size: {size.width}*{size.height}
    </div>
  )

}

function useWinSize() {
  const [size, setSize] = useState ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  })

  const onResize = useCallback(()=>{
    setSize({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    })
  }, [])

  useEffect(()=>{
    window.addEventListener('resize', onResize)
    return ()=>{
      window.removeEventListener('resize', onResize)
    }
  })

  return size
}

export default App;
