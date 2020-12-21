import React from "react";

class ImageCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = { spans: 0 };

    this.imageRef = React.createRef();
  }

  componentDidMount() {
    this.imageRef.current.addEventListener("load", this.setSpans);
  }

  setSpans = () => {
    const height = this.imageRef.current.clientHeight;

    const spans = Math.ceil(height / 10 + 1);

    this.setState({ spans: spans });
  };

  //sends back selected image state so it can be displayed on a modal
  selectedImage = () => {
    console.log("selected:", this.props.image);
    this.props.updateImage(this.props.image);
  };

  render() {
    const { key, url } = this.props.image;
    return (
      <div style={{ gridRowEnd: `span ${this.state.spans}` }}>
        <img onClick={this.selectedImage} ref={this.imageRef} alt={key} key={key} src={url} />
      </div>
    );
  }
}

export default ImageCard;
