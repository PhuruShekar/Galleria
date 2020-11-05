import React from 'react';
import axios from 'axios';

import aws from '../apis/aws';
import "./css/styles.css";

class Upload extends React.Component {

  //states:
  //selectedFile: file chosen before it is uploaded
  //file: actual file uploaded event
  state = { selectedFile: null, file: null }; 

    //change state when file is changed
    onFileChange = (event) => { 
      this.setState({ selectedFile: event.target.files[0] }); 
      this.setState({file: event});
    }; 

    // when file is ready to be uploaded, upload it
    onFileUpload = () => { 
      this.updateImageStatus();
      try{
      this.uploadImage(this.state.selectedFile);
      }
      catch(error) {
        console.log("No image selected",error);

      }
    }; 


    //function with multiple axios requests to get Presigned URL
    //and then Upload the image to the S3 bucket
    uploadImage = (imageData) => {

      //get presignedURL for image name
      aws.get("/createPresignedURL", {
        params: {
          fileName: imageData.name
        }
      })
      
      //set up object to send to AWS S3 bucket
      .then(url => {
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
          //console.log("image upload:", result);

          //when the image is a success, try to fetch thumbnail
          if(result.status === 200){
            setTimeout(this.tryFetchThumb(), 2000);
          } 
        })
        .catch(error =>{
          console.log("Error image upload:",error);
        })
        
      })
      .catch(error => console.log("Error getting Presigned URL:", error));

      
    };

    //trying to fetch uploaded image thumbnail
    //send back new image name to get thumbnail of from resized bucket
   tryFetchThumb = () => {
      this.props.onUpload(`resized-${this.state.selectedFile.name}`);
      this.setState({selectedFile: null});
      let fileEvent = this.state.file;
      fileEvent.target.value = null;
      this.setState({file: null});
   };
   
   //update image status on Modal as image is being uploaded
   updateImageStatus = () => {
     //console.log("callback Upload image");
     this.props.whenFileUpload('Uploading Image to Server');
   }
   
  render() {
    //accept only these image types
    const acceptTypes = ".jpg, .png, .jpeg, .gif, .bmp";
    //console.log("upload props: ",this.props);
    return (
      <div className="right floated column"> 
        <input className="ui inverted orange" type="file" accept={acceptTypes} onChange={this.onFileChange} /> 
          <button className= "ui inverted button orange" onClick={this.onFileUpload}> 
            Upload 
          </button> 
        </div> 
    );
  }
}

export default Upload;