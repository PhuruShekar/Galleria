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
        this.fetchImageURL(item.textContent);
    });
 
  };
  
  //get image from presigned URL
  fetchImage = (presignedURL) => {
    console.log("u",presignedURL)
    
    axios.get(`${presignedURL}`)
    .then( (obj) => {
      this.loadImage(obj);
    })
    .catch(err => {
      setTimeout(this.fetchImage(presignedURL), 1000);
      console.log("error fetching image:", err);
    })
  };


  //get presigned URL
  fetchImageURL = (imageName) => {
    console.log("fetch image: ", imageName)
    //add image names to state to get later
    this.setState({itemNames: [...this.state.itemNames,imageName]});
   
    aws.get("/fetch", {
      params: {
        img: imageName
      }
    })
    .then( prsURL => {
      this.fetchImage(prsURL.data);
    })
    .catch(error => {
      console.log("Error making Presigned URL to fetch: ",error);
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
   
  };


  getImageList = () => {
    aws.get("/getImages")
    .then(res => {
     axios.get(`${res.data}`)
     .then( obj => {
        this.getImagesFromXML(obj.data);
      //console.log(obj.data);
      })
    })
  };

  onUpload = (e) => {
    console.log(e);
    try{
    this.fetchImageURL(e)
    } catch(error) {
      console.log("fetchImage Upload err:", error);
    }
  }

  componentDidMount() {
    this.getImageList();
  };
  

  render() {
    return(
      <div className="ui container" style={{marginTop:'10px'}}>
        <Navbar onUpload={this.onUpload} />
        <ImageList images={this.state.images}/>
      </div>
    )
  }
}

export default App;