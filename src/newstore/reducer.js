const defaultState = {
    visible: false
}

export default (state=defaultState, action)=>{
    if(action.type === 'showModal') {
        return {...state,visible:true}
    }
    if(action.type === 'closeModal') {
        return {...state,visible:false}
    }
    return state
}