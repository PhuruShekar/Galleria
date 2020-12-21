import React from 'react';
import axios from 'axios';

import aws from '../apis/aws';
import "./css/styles.css";

class Upload extends React.Component {

  //states:
  //selectedFile: file chosen before it is uploaded
  //file: actual file uploaded event
  state = { selectedFile: null, file: null }; 

    //handler for errors, callback error 
    foundError = (oops) => {
      this.props.errorStatus(oops);
    }

    //change state when file is changed
    onFileChange = (event) => { 
      //console.log(event);
      this.setState({ selectedFile: [event.target.files] }); 
      this.setState({file: event});
    }; 

    // when file is ready to be uploaded, upload it
    onFileUpload = () => { 

      let i=0;
      try{
        for(i = 0;i< this.state.selectedFile[0].length; i++){
          //console.log("ye", this.state.selectedFile[0][i]);
          this.uploadImage(this.state.selectedFile[0][i],i);
        }
      }
      catch(error) {
        this.foundError(`No Images Selected`);
        console.log("No image selected",error);
      }
    }; 


    //function with multiple axios requests to get Presigned URL
    //and then Upload the image to the S3 bucket
    uploadImage = (imageData, numFile) => {
      console.log("UPLOADING: ", imageData)
      //get presignedURL for image name
      aws.get("/createPresignedURL", {
        params: {
          fileName: imageData.name
        }
      })
      
      //set up object to send to AWS S3 bucket
      .then(url => {
        this.updateImageStatus(imageData.name);
        var config = {  
          method: 'put',
          url: url.data,
          headers: {
            'Content-Type': imageData.type
          },
          data: imageData
        };

        //make axios call to put image to bucket
        axios(config)
        .then(result => {
          console.log("image upload:", result);

          //when the image is a success, try to fetch thumbnail
          if(result.status === 200){
            setTimeout(this.tryFetchThumb(numFile), 2000);
          } 
        })
        .catch(error =>{
          this.foundError(`Error Uploading Image`);
          console.log("Error image upload:",error);
        })
        
      })
      .catch(error => {
        this.foundError(`Error getting Presigned URL.`);
        console.log("Error getting Presigned URL:", error)
      });

      
    };

    //trying to fetch uploaded image thumbnail
    //send back new image name to get thumbnail of from resized bucket
   tryFetchThumb = (numFile) => {
      this.props.onUpload(`resized-${this.state.selectedFile[0][numFile].name}`);
      /*this.setState({selectedFile: null});
      let fileEvent = this.state.file;
      fileEvent.target.value = null;
      this.setState({file: null});*/
   };
   
   //update image status on Modal as image is being uploaded
   updateImageStatus = (fileName) => {
     //console.log("callback Upload image");
     this.props.whenFileUpload({"item":fileName, "status":"Uploading to Server"});
   }
   
  render() {
    //accept only these image types
    const acceptTypes = ".jpg, .png, .jpeg, .gif, .bmp";
    //console.log("upload props: ",this.props);
    return (
      <div className="right floated column"> 
        <input className="ui inverted tan-c" type="file"  multiple accept={acceptTypes} onChange={this.onFileChange} /> 
          <button className= "ui inverted button orange" onClick={this.onFileUpload}> 
            Upload 
          </button> 
        </div> 
    );
  }
}

export default Upload;