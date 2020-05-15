import React, { useState, useEffect } from 'react'
import EZUIKit from "./ezuikit"
let decoder = null
const View = (props) => {
    const handleInit = () => {
        function handleError(e){
            console.log('捕获到错误',e)
            // log(JSON.stringify(e),'error');
            //alert(e)
        }
        function handleSuccess(){
            console.log("播放成功回调函数，此处可执行播放成功后续动作");
        }
        var url = "ezopen://open.ys7.com/203751922/1.live";
        var accessToken = "at.8o2k6dbpcvtr13reaa96hbnya6fee2wf-9gu6zcjmh2-1j4yrsb-imvlc5poc";
        decoder = new EZUIKit.EZUIPlayer({
            id: 'playWind',
            autoplay: true,
            url: url,
            accessToken: accessToken,
            decoderPath: '',
            width: 600,
            height: 400,
            handleError: handleError,
            handleSuccess: handleSuccess,
        });
    }
    const handleStart = () => {
        function handleError(e){
            console.log('handleError',e)
        }
        function handleSuccess(){
            console.log('handleSuccess')
        }
        decoder.play({
            handleError: handleError,
        });
    }
    const handleEnd = () => {
        /*停止播放方法1*/
        // decoder.stop();
        /*停止播放方法2 - promise模式*/
        var stopPromise = decoder.stop();
        stopPromise.then(function(){
            console.log("关闭成功，用户执行关闭成功后的操作");
        })
    }
    const getOSDTime =() => {
        var getOSDTimePromise = decoder.getOSDTime();
        console.log(getOSDTimePromise)
        getOSDTimePromise.then(function(data){
            console.log("getOSDTime success",data)
        }).catch(err=>{
            console.log(err)
        })
    }
    const handleOpenSound =  () => {
        decoder.openSound();
    }
    const handleCloseSound =  () => {
        decoder.openSound();
    }
    const capturePicture = () => {
        var capturePicturePromise = decoder.capturePicture(0,'default');
        capturePicturePromise.then(function(data){
            console.log("截图成功，用户执行关闭成功后的操作",data);
        }).catch(err=>{
            console.log(err)
        })
    }
    const startSave = () => {
        var startSavePromise = decoder.startSave(0, (new Date().getTime() + 'video'));
        startSavePromise.then(function(data){
            console.log("start save success",startSavePromise)
        })
            .catch(function(error){
                console.log("start Save error",error)
            })
    }
    const stopSave = () => {
        /*结束录制方法1*/
        // decoder.stopSave(0);
        /*结束录制方法2*/
        var stopSavePromise = decoder.stopSave(0);
        stopSavePromise.then(function(data){
            console.log("stop save success",stopSavePromise)
        })
            .catch(function(error){
                console.log("stop Save error",error)
            })
    }
    const enableZoom =() => {
        decoder.enableZoom();
    }
    const closeZoom =() => {
        decoder.closeZoom();
    }
    return (
        <div>
            {/*<div dangerouslySetInnerHTML={{__html:data}}></div>*/}
          {/*  <iframe
                title="resg"
                srcDoc={data}
                style={{ width: '100%', border: '0px', height: '1100px' }}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                scrolling="auto"
            />*/}
            <div className="btn-container">
                <button id="init" onClick={handleInit}>初始化播放</button>
                <button id="stop" onClick={handleEnd}>结束</button>
                <button id="getOSDTime" onClick={getOSDTime}>获取OSD时间</button>
                <button id="openSound" onClick={handleOpenSound}>打开声音（默认已经开启）</button>
                <button id="closeSound" onClick={handleCloseSound}>关闭声音</button>
                <button id="capturePicture" onClick={capturePicture}>视频截图</button>
                <button id="startSave" onClick={startSave}>开始录像</button>
                <button id="stopSave" onClick={stopSave}>停止录像</button>
                <button id="enableZoom" onClick={enableZoom}>开启电子放大</button>
                <button id="closeZoom" onClick={closeZoom}>关闭电子放大</button>
                <span>录制功能不支持加密视频，且录制的文件需要<a href="https://service.ys7.com/downloadInfoSite/admin"
                                             target="_blank">下载海康播放器播放</a></span>

            </div>
            <div id="playWind">
            </div>
        </div>
    );
}
export default React.memo(View)
