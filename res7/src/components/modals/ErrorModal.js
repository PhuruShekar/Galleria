import React, {useState, useEffect} from 'react';
import { Button, Header, Modal} from 'semantic-ui-react';
//import Loader from 'react-loader-spinner';
import "../css/styles.css";

const ErrorModal = (props) => {
//console.log("error modal: ",props);
//set if modal open or closed
const [open, setOpen] = useState(false);
//close modal
const handleClose = () => {
  props.resetError();
  setOpen(false);
}
//open modal
const handleOpen = () => {
  setOpen(true);
}

  useEffect(() => {
    if(props.currError === '' || props.currError == null){
      setOpen(false);
    }
     else {
       handleOpen();
     }
  },[props.currError])


  return (
    <Modal
    basic
    onClose={() => handleClose()}
    onOpen={() => handleOpen()}
    open={open}
    size='mini'
    >
      <Header >
        Error:
      </Header>
      <Modal.Content>
          {props.currError}
      </Modal.Content>
      <Modal.Actions>
      <Button basic color='orange' inverted onClick={handleClose}>
        Close
      </Button>
    </Modal.Actions>
    </Modal>
  );
};

export default ErrorModal;