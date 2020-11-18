import React from 'react';
import axios from 'axios';
import aws from '../apis/aws';
import ImageList from './ImageList';
import Navbar from './Navbar';
import StatusModal from './StatusModal';

class App extends React.Component{

  //State items used throughout the app
  //images: stores list of images and their metadata
  //itemNames: has list of image names to retrieve
  //currStatus: string with status of image as it is being uploaded
  state = { images: [], itemNames: [], currStatus:''};

  //take XML data of image list and get image data
  getImagesFromXML = (xmlData) => {

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, "text/xml");
    
    [...xmlDoc.getElementsByTagName("Key")].forEach(item =>{
      //get image URL from XML image data
        this.fetchImageURL(item.textContent);
    });
 
  };
  
  //get image from presigned URL
  fetchImage = (presignedURL) => {
    //console.log("u",presignedURL)
    
    axios.get(`${presignedURL}`)
    .then( (obj) => {
      //load image onto page by updating state
      this.loadImage(obj);
    })
    .catch(err => {
      //if image hasn't been uploaded and created into a thumbnail yet
      //keep trying every second
      setTimeout(this.fetchImage(presignedURL), 1000);
      console.log("error fetching image:", err);
    })
  };


  //get presigned URL for selected image
  fetchImageURL = (imageName) => {
    console.log("fetch image: ", imageName)

    //add image names to state to get later
    this.setState({itemNames: [...this.state.itemNames,imageName]});
   
    //get image Presigned URL
    aws.get("/fetch", {
      params: {
        img: imageName
      }
    })
    .then( prsURL => {
      //get actual image from presignedURL
      this.fetchImage(prsURL.data);
    })
    .catch(error => {
      console.log("Error making Presigned URL to fetch: ",error);
    })
  }

  //load image onto page without refreshing it by updating list 
  loadImage = (picData) => {
    
    var findKey = "";

    //get image key/name with entire picture data
    for(let item of this.state.itemNames){
        if(picData.config.url.includes(item)){
          findKey = item;
        }
    }
    //set state with image key/name
    this.setState({images: [...this.state.images,{
      key: findKey,
      url: picData.config.url,
      date: picData.headers["last-modified"],
      size: picData.headers["content-length"]
    }]});
   
    //reset current status to null as thumbnail is now displayed
    this.setState({currStatus: ''});

  };


  //get list of images XML data from databaase
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

  //callback function, lets us get image thumbnail of what we just uploaded
  onUpload = (e) => {
    console.log(e);
    try{
      //sets modal message to creating thumbnail
      this.updateImageStatus('Creating Thumbnail from Image')

      this.fetchImageURL(e);
    } catch(error) {
      console.log("fetchImage Upload err:", error);
    }
  }

  //get list of already uploaded images when app loads
  componentDidMount() {
    this.getImageList();
  };
  
  //update image status
  updateImageStatus = (newStatus) => {
    this.setState({currStatus: newStatus });
  }

  render() {
    return(
      <div className="ui inverted">
        <Navbar onUpload={this.onUpload} whenFileUpload={this.updateImageStatus}/>
        <div className="ui container">
        <ImageList images={this.state.images}/>
        <StatusModal currStatus={this.state.currStatus}/>
        </div>
      </div>
    )
  }
}

export default App;