import axios from 'axios';
import aws from './aws';

export const getImages = () => {
  aws.get("/getImages")
  .then(res => {
   axios.get(`${res.data}`)
   .then( obj => {
    this.getImagesFromXML(obj.data);
})
  })
};

