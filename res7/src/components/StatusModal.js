import React, {useState, useEffect} from 'react';
import { Button, Header, Modal, Icon } from 'semantic-ui-react';
import Loader from 'react-loader-spinner';
import "../components/css/styles.css";

//Modal component to display image status while its uploaded
const StatusModal = (props) => {
  //set if modal open or closed
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  }

  //UseEffect automatically opens/closes modal if it has a message so user doesn't have to close it if they dont want to
  useEffect(() => {
    if(props.currStatus === ''){
      setOpen(false);
    } else {
      setOpen(true);
    }
    return () => {
      setOpen(false);
    }
  },[props.currStatus]);


  return (
    <Modal
    basic
    onClose={() => setOpen(false)}
    onOpen={() => setOpen(true)}
    open={open}
    size='mini'
  >
    <Header icon>
      <Icon name='image outline' color="tan" />
      Image Upload Status
    </Header>
    <Modal.Content className="ui container center aligned">
      <Modal.Header className="ui centered message-color">{props.currStatus}</Modal.Header>

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
