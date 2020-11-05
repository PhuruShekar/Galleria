import React from 'react';
import Upload from './Upload';

class Navbar extends React.Component {

  render() {

    console.log("navbar props",this.props);
    return (
    <div>
      <Upload onUpload={this.props.onUpload} />
    </div> 
    );
  }
};

export default Navbar;