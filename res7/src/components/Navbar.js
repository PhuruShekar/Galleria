import React from 'react';
import {Header} from 'semantic-ui-react';

import Upload from './Upload';
import "./css/styles.css";

//Navbar Component, has app title and upload functionality
class Navbar extends React.Component {

  render() {

    //console.log("navbar props",this.props);
    //Upload component has most functionality, so callback props are passed into it
    return (
    <div className = "ui menu grid inverted">
      <div className="three column row header item">
        <Header as='h3' className="tan-c floated right column">
          Galleria
        </Header>

        <Upload errorStatus={this.props.errorStatus} onUpload={this.props.onUpload} whenFileUpload ={this.props.whenFileUpload} />
      </div>
    </div> 
    );
  }
};

export default Navbar;