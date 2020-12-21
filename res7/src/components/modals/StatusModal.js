import React, {useState, useEffect} from 'react';
import { Button, Header, Modal, Icon } from 'semantic-ui-react';
import Loader from 'react-loader-spinner';
import "../css/styles.css";

//Modal component to display image status while its uploaded
const StatusModal = (props) => {
  //set if modal open or closed
  const [open, setOpen] = useState(false);

  //close modal
  const handleClose = () => {
    setOpen(false);
  }

  //open modal
  const handleOpen = () => {
    setOpen(true);
  }

  const stat_done = x => x.status==='Done';

  //UseEffect automatically opens/closes modal if it has a message so user doesn't have to close it if they dont want to
  useEffect(() => {
    //console.log("prop stat (modal)", props.currStatus);
    if(!Array.isArray(props.currStatus) || !props.currStatus.length || props.currStatus.length === 0 || null){
      handleClose();
    } else {

      if(props.currStatus.every(stat_done)){
        handleClose();
      }

      else {
        handleOpen();
      } 

      
    }
    return () => {
      setOpen(false);
    }
  },[props.currStatus]);


  return (
    <Modal
    basic
    onClose={() => handleClose()}
    onOpen={() => handleOpen()}
    open={open}
    size='mini'
  >
    <Header icon>
      <Icon name='image outline' className="tan-c" />
      Image Upload Status
    </Header>
    <Modal.Content className="ui container center aligned">
      {props.currStatus.map(status => (
        <Modal.Header className="ui centered message-color" key={status.item}>
          {`${status.item}: ${status.status}`}
        </Modal.Header>
      ))}
      

      <Loader 
            type="Grid"
            color="#ff851b"
            height={80}
            width={80}
            className= "ui load-align"
          />

    </Modal.Content>
    <Modal.Actions>
      <Button basic color='orange' inverted onClick={handleClose}>
        Close
      </Button>
    </Modal.Actions>
  </Modal>
  )
};

export default StatusModal;
