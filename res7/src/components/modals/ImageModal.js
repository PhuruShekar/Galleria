import React, {useState, useEffect} from 'react';
import { Modal, Image, Header, Button } from 'semantic-ui-react';
import DownloadLink from 'react-download-link';
import "../css/styles.css";

const ImageModal = (props) => {

  //set if modal open or closed
  const [open, setOpen] = useState(false);
  const [imageURL, setimageURL] = useState('about:blank');
  const [imageData, setImageData] = useState({});

  //close modal, clean up
  const handleClose = () => {
    props.updateImage(null);
    setImageData({});
    setimageURL('about:blank');
    setOpen(false);
  }

  //open modal, update states
  const handleOpen = () => {
    setimageURL(`${props.currImage.url}`);
    setImageData(props.currImage);
    setOpen(true);
  }

  useEffect(() => {
    //console.log("img props:",props)
    
  if(props.currImage != null){
    handleOpen();
  }

  },[props.currImage]);

  return (
    <Modal
      onClose={() => handleClose()}
      onOpen={() => handleOpen()}
      open={open}
      size='small'
    >
     
     <Modal.Header className="image-header tan-c">Image Data</Modal.Header>
      <Modal.Content image>
        <Image  src={imageURL} wrapped />
        <Modal.Description>
          <Header className="orange">{imageData.key}</Header>
          <div className="data">
          <p><b>Size:</b> {`${imageData.size/1000} kB`}</p>
          <p><b>Last Updated:</b> {`${imageData.date}`}</p>
          </div>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions className="image-footer">
      
        <Button inverted basic color='green'>
        <DownloadLink className="noClasses" label="Download" filename={`resized-${imageData.key}`} exportFile={()=>imageURL} />
        </Button>
        
        <Button inverted  color='orange' className="dark-text" onClick={handleClose}>
          Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ImageModal;