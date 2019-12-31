import React, { Component } from 'react';
import { Select } from 'antd';
import OA from '../../images/OA.png';
import GitLab from '../../images/GitLab.png';
import GitLabHelper from '../../images/GitLabHelper.png';
import Wiki from '../../images/Wiki.png';
import Setting from '../../images/Setting.png';
import Password from '../../images/Password.png';
import '../../styles/view.css';

class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {name: 'OA', mediaUrl: OA, href: 'https://github.com/'},
        {name: 'GitLab', mediaUrl: GitLab, href: 'https://github.com'},
        {name: 'GitLabHelper', mediaUrl: GitLabHelper, href: 'https://github.com'},
        {name: 'Wiki', mediaUrl:Wiki, href: 'https://github.com'},
        {name: 'Setting', mediaUrl: Setting, href: 'https://github.com'},
        {name: 'Password', mediaUrl: Password, href: 'https://github.com'},
      ],
      selectedItems: ['Apples', 'Nails', 'Bananas', 'Helicopters'],
    };
  }

  handleSelect = value=> {
    if(value === "Apples") {
      this.setState({ 
        selectedItems: ['Apples1', 'Nails1', 'Bananas1', 'Helicopters1'],
      });
    }
    if(value === "Apples1") {
      this.setState({ 
        selectedItems: ['Apples11', 'Nails11', 'Bananas11', 'Helicopters11'],
      });
    }
  }
  handleDeselect = value => {
    if(value === "Apples") {
      this.setState({ 
        selectedItems: ['Apples', 'Nails', 'Bananas', 'Helicopters'],
      });
    }
    if(value === "Apples1") {
      this.setState({ 
        selectedItems: ['Apples', 'Nails', 'Bananas', 'Helicopters'],
      });
    }
    if(value === "Apples11") {
      this.setState({ 
        selectedItems: ['Apples1', 'Nails1', 'Bananas1', 'Helicopters1'],
      });
    }
  }
  render() {
    const { Option } = Select;
    const { selectedItems } = this.state;

    function handleChange(value) {
      console.log(`selected ${value}`);
    }
    return (
      <div>
    <Select  mode="multiple" style={{ width: 500 }} placeholder="Please select" optionFilterProp="children" 
      onChange={handleChange} 
      onSelect={this.handleSelect}
      onDeselect = {this.handleDeselect}
    >
      {selectedItems.map(item => (
        <Option key={item} value={item}>
          {item}
        </Option>
      ))}
    </Select>
        <span hidden>
          {
            this.state.data.map((item, index)=>{
              return (<a key={index} href={item.href}><img src={item.mediaUrl} alt="" className="img"/></a>)
            })
          }
        </span>
      </div>
    );
  }
}
 
export default View;