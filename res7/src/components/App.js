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
  state = { images: [], itemNames: [], currStatus:[]};

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
    this.updateImageStatus({"item":findKey,"status":'Done'});

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
    //console.log(e);
    try{
      //sets modal message to creating thumbnail
      this.updateImageStatus({"item":e, "status":"Creating Thumbail"});

      this.fetchImageURL(e);
    } catch(error) {
      console.log("fetchImage Upload err:", error);
    }
  }

  //get list of already uploaded images when app loads
  componentDidMount() {
    this.getImageList();
  };
  

  stat_done = x => x.status==='Done';

  //update image status
  //now it checks for previous image "ie: dice vs resized-dice" and updates that object so modal now can support multiple uploads
  updateImageStatus = (newStatus) => {
    //console.log("new stat:", newStatus);


    if(newStatus){

      //first check if all statuses are "done". if so: clear currstatus state.
      if(this.state.currStatus.every(this.stat_done)){
        this.setState({currStatus: []});
      }


      let tempStat = {"item":newStatus.item, "status":newStatus.status};
      if(newStatus.item.startsWith("resized-")){
       tempStat =  {"item":newStatus.item.slice(8), "status":newStatus.status};
      }
      console.log("Resize?: ", tempStat.item);
      var index = this.state.currStatus.findIndex(x => { return (x.item === tempStat.item)});
      //console.log("index:",index);
      if(index !== -1){
        this.setState({currStatus: [
          ...this.state.currStatus.slice(0,index),
          Object.assign({}, this.state.currStatus[index], tempStat),
          ...this.state.currStatus.slice(index+1)
        ]
      })
      } else {
        this.setState({currStatus: [...this.state.currStatus,tempStat] });
        }
 
    } 

    //console.log("curr stat: ", this.state.currStatus);
    
  };

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