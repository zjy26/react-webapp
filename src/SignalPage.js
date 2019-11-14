import React, { Component, PureComponent } from 'react';
import ReactModal from 'react-modal'
const customStyles = {
    content: {
      width: '300px',
      height: '300px',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -55%)'
    },
    btn: {
      marginTop: 30,
      background: 'transparent',  
      padding: '10px 15px'
    }
};

  ReactModal.setAppElement('#root')

  export default class ReactModalComp extends Component{
    constructor(arg){
        super(arg)

        this.state = {
            modalOpenState: false,
        }

        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    openModal(){
        this.setState({
            modalOpenState: true,
        })
    }

    closeModal(){
        this.setState({
            modalOpenState: false,
        })
    }

    comfirm(){
        console.log('确认')
    }

    render(){
        const { modalOpenState } = this.state;
        return(
            <div className="reactModal">
                <button onClick={this.openModal} style={customStyles.btn}>打开</button>
                <ReactModal
                    isOpen = {modalOpenState}
                    style={customStyles}
                    contentLabel="Example Modal"
                    onAfterOpen={this.afterOpenModalEv}
                >
                    <form>
                        <input />
                        <p>tab navigation</p>
                        <p>stays</p>
                        <p>inside</p>
                        <p>the modal</p>
                    </form>
                    <button onClick={this.comfirm}>确认</button>
                    <button onClick={this.closeModal}>取消</button>
                </ReactModal>
            </div>
        )
    }
} 