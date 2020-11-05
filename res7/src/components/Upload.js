import React from 'react';
import axios from 'axios';

import aws from '../apis/aws';

class Upload extends React.Component {

  state = { selectedFile: null }; 

    //change state when file is changed
    onFileChange = (event) => { 
      this.setState({ selectedFile: event.target.files[0] }); 
    }; 

    // when file is ready to be uploaded, upload it
    onFileUpload = () => { 
      this.uploadImage(this.state.selectedFile);
    }; 


    //function with multiple axios requests to get Presigned URL
    //and then Upload the image to the S3 bucket
    uploadImage = (imageData) => {
      
      aws.get("/createPresignedURL", {
        params: {
          fileName: imageData.name
        }
      })
      .then(url => {
        var config = {
          method: 'put',
          url: url.data,
          headers: {
            'Content-Type': imageData.type
          },
          data: imageData
        };

        axios(config)
        .then(result => {
          console.log("image upload:", result);

          if(result.status === 200){
            setTimeout(this.tryFetchThumb(), 2000);
          } 

        })
        .catch(error =>{
          console.log("Error image upload:",error);
        })
        
      })
      .catch(error => console.log("Error get Presigned URL:", error));

      
    };

   tryFetchThumb = () => {
      this.props.onUpload(`resized-${this.state.selectedFile.name}`);
   };

  render() {
    //accept only these image types
    const acceptTypes = ".jpg, .png, .jpeg, .gif, .bmp";
    //console.log("upload props: ",this.props);
    return (
      <div> 
        <input type="file" accept={acceptTypes} onChange={this.onFileChange} /> 
          <button onClick={this.onFileUpload}> 
            Upload! 
          </button> 
        </div> 
    );
  }
}

export default Upload;