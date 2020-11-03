import React from 'react';
import axios from 'axios';
import aws from '../apis/aws';
import ImageList from './ImageList';

class App extends React.Component{
  state = { images: []};


  //take XML data and make them into objects containing the item Name + date created
  //json obj has: key: img name, url: bucketURL+key, date: lastmodified, size: size of img
  parseXMLtoJSON = (xmlData) => {

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");
    
    var arrItems = [...xmlDoc.getElementsByTagName("Contents")];
    console.log(arrItems);

    for(let i=0;i<arrItems.length;i++){
      this.setState({ images: [...this.state.images,{
        key: arrItems[i].children[0].textContent,
        date: arrItems[i].children[1].textContent,
        size: arrItems[i].children[3].textContent,
        url: `https://res7ps-resized.s3.us-east-1.amazonaws.com/${arrItems[i].children[0].textContent}`,
      }]});
    }

  
    console.log(this.state.images);
  };


  componentDidMount() {
    aws.get("/getImages")
    .then(res => {
     axios.get(`${res.data}`)
     .then( obj => {
      this.parseXMLtoJSON(obj.data);
      //console.log(obj.data);
    })
    })
    
  }



  render() {
    return(
      <div className="ui container" style={{marginTop:'10px'}}>
        <ImageList images={this.state.images}/>
      </div>
    )
  }
}

export default App;