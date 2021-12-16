import React from "react";
import PropTypes from "prop-types";
import autosize from "autosize";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import * as path from "lodash.get";



class CreateBookInformation extends React.Component {
  constructor(props) {
    super(props);
    const {
      handleSubmit,
      title,
      author,
      description,
      image,
      file
    } = this.props;
    this.state = {  description, author, title, image, file };
    handleSubmit(this.state, this.validate(this.state));
    autosize(document.querySelectorAll("textarea"));
  }

  validate = (state) => {
    if (state.color && state.title) {
      return true;
    }
    return false;
  };

  handleChange = (event) => {
    const state = Object.assign({}, this.state);
    //SE MODIFICO NAME CON TITLE
    const { name, value } = event.target;
    const { handleSubmit } = this.props;
    //SE MODIFICO NAME CON TITLE NON MI DA L'ANTEPRIMA DI SCRITTURA
    state[name] = value;
    handleSubmit(state, this.validate(state));
    this.setState(state);
  };


  // Funzioni presi da EditGroupScreen che servono ad inserire immagini
  handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      //funzione FileReader che apre il file caricato
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ image: {path: e.target.result }, file })
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  handleNativeImageChange = () => {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ action: "fileUpload" })
    );
    console.log("bruh")
  };

  //----------------------------------------------------------

  render() {
    const { language } = this.props;
    const { title, description, author, image, file } = this.state;
    const texts = Texts[language].createBookInformation;
    const rowStyle = { minHeight: "7rem" };
    return (
      <div id="createBookInformationContainer">
        <div className="row no-gutters" style={rowStyle}>
          <div className="col-2-10">
            <i className="fas fa-clipboard-check center" />
          </div>
          <div className="col-8-10">
            <input
              type="text"
              name="title"
              placeholder="Titolo"
              value={title}
              className="center"
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="row no-gutters" style={rowStyle}>
          <div className="col-2-10">
            <i className="fas fa-align-left center" />
          </div>
          <div className="col-8-10">
            <textarea
              rows="1"
              name="description"
              className="center"
              placeholder={texts.description}
              value={description}
              onChange={(event) => {
                this.handleChange(event);
                autosize(document.querySelectorAll("textarea"));
              }}
            />
          </div>
        </div>
        <div className="row no-gutters" style={rowStyle}>
          <div className="col-2-10">
            <i className="fas fa-user-alt center" />
          </div>
          <div className="col-8-10">
            <input
              type="text"
              name="author"
              placeholder="Autore" 
              value={author}
              className="center"
              onChange={this.handleChange}
            />
          </div>
        </div>
        <div className="row no-gutters" style={rowStyle}>
            <div className="col-2-10">
              <i className="fas fa-camera center" />
            </div>

            <div className="col-7-10">
            <div id="uploadGroupLogoContainer">
              <label
                htmlFor="uploadLogoInput"
                className="horizontal"
              >
                {"Upload"}
              </label>
              {window.isNative ? (
                <input
                  id="uploadLogoInput"
                  type="button"
                  name="photo"
                  accept="image/*"
                  onClick={this.handleNativeImageChange}
                />
              ) : (
                <input
                  id="uploadLogoInput"
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={this.handleImageChange}
                />
              )}
              {/*da sistemare, non so come posizionarlo*/}
              <div className="img">
                <img
                  src={path(image, ["path"])}
                  alt="user profile logo"
                  className="horizontal square right"
                />
                </div>
            </div>
            </div>
        </div>
      </div>
    );
  }
}

CreateBookInformation.propTypes = {
  title: PropTypes.string,
  author: PropTypes.string,
  description: PropTypes.string,
  handleSubmit: PropTypes.func,
  language: PropTypes.string,
  image: PropTypes.object,
};

export default withLanguage(CreateBookInformation);
