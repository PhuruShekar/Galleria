import React from 'react';
import axios from 'axios';
import aws from '../apis/aws';
import ImageList from './ImageList';
import Navbar from './Navbar';

class App extends React.Component{
  state = { images: [], itemNames: []};

/*
for(let i=0;i<arrItems.length;i++){
      this.setState({ images: [...this.state.images,{
        key: arrItems[i].children[0].textContent,
        date: arrItems[i].children[1].textContent,
        size: arrItems[i].children[3].textContent,
        url: `https://res7ps-resized.s3.us-east-1.amazonaws.com/${arrItems[i].children[0].textContent}`,
      }]});
    }
     */
  //take XML data of image list and get images
  getImagesFromXML = (xmlData) => {

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");
    
    [...xmlDoc.getElementsByTagName("Key")].forEach(item =>{
        this.fetchImage(item.textContent);
    });
 
  };

  //add image to state after making fetch request
  fetchImage = (imageName) => {
   
    //add image names to state to get later
    this.setState({itemNames: [...this.state.itemNames,imageName]});
   
    aws.get("/fetch", {
      params: {
        img: imageName
      }
    })
    .then( prsURL => {
      axios.get(`${prsURL.data}`)
      .then( (obj) => {
        this.loadImage(obj);
      })
    })
  }

  loadImage = (picData) => {
    
    var findKey = "";

    for(let item of this.state.itemNames){
        if(picData.config.url.includes(item)){
          findKey = item;
        }
    }


    this.setState({images: [...this.state.images,{
      key: findKey,
      url: picData.config.url,
      date: picData.headers["last-modified"],
      size: picData.headers["content-length"]
    }]});
   
  }



  componentDidMount() {
    aws.get("/getImages")
    .then(res => {
     axios.get(`${res.data}`)
     .then( obj => {
      this.getImagesFromXML(obj.data);
      //console.log(obj.data);
    })
    })
    
  }



  render() {
    return(
      <div className="ui container" style={{marginTop:'10px'}}>
        <Navbar />
        <ImageList images={this.state.images}/>
      </div>
    )
  }
}

export default App;