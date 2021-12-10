import React from "react";
import PropTypes from "prop-types";
import autosize from "autosize";
import { CirclePicker } from "react-color";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import * as path from "lodash.get";


class CreateBookInformation extends React.Component {
  constructor(props) {
    super(props);
    const {
      handleSubmit,
      name,
      location,
      description,
      cost,
      color,
      image,
    } = this.props;
    this.state = { color, cost, description, location, name, image, };
    handleSubmit(this.state, this.validate(this.state));
    autosize(document.querySelectorAll("textarea"));
  }

  validate = (state) => {
    if (state.color && state.name) {
      return true;
    }
    return false;
  };

  handleChange = (event) => {
    const state = Object.assign({}, this.state);
    const { name, value } = event.target;
    const { handleSubmit } = this.props;
    state[name] = value;
    handleSubmit(state, this.validate(state));
    this.setState(state);
  };

  handleColorChange = (color) => {
    const { handleSubmit } = this.props;
    const state = Object.assign({}, this.state);
    state.color = color.hex;
    handleSubmit(state, this.validate(state));
    this.setState(state);
  };

  /*Funzioni presi da EditGroupScreen che servono ad inserire immagini*/
  handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setState({ image: { path: e.target.result }, file });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  handleNativeImageChange = () => {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ action: "fileUpload" })
    );
  };

  //----------------------------------------------------------

  render() {
    const { language } = this.props;
    const { name, color, description, location, image, } = this.state;
    const texts = Texts[language].createBookInformation;
    const rowStyle = { minHeight: "7rem" };
    return (
      <div id="createActivityInformationContainer">
        <div className="row no-gutters" style={rowStyle}>
          <div className="col-2-10">
            <i className="fas fa-clipboard-check center" />
          </div>
          <div className="col-8-10">
            <input
              type="text"
              name="name"
              placeholder={texts.name}
              value={name}
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
              name="location"
              placeholder={texts.location}
              value={location}
              className="center"
              onChange={this.handleChange}
            />
          </div>
        </div>
        {/*}
        <div className="row no-gutters" style={rowStyle}>
          <div className="col-2-10">
            <i className="fas fa-link center" />
          </div>
          <div className="col-8-10">
            <input
              type="text"
              name="link"
              placeholder={texts.link}
              value={link}
              className="center"
              onChange={this.handleChange}
            />
          </div>
        </div>
            */}
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
                {texts.link}
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
              <div className="line-7-10">
                <img
                  src={path(image, ["path"])}
                  alt="child profile logo"
                  className="horizontal square right"
                />
                </div>
            </div>
            </div>
        </div>
        <div className="row no-gutters" style={rowStyle}>
          <div className="col-2-10">
            <i
              className="fas fa-palette center"
              style={{ color }}
              alt="palette icon"
            />
          </div>
          <div className="col-8-10">
            <h1 className="verticalCenter" style={{ color }}>
              {texts.color}
            </h1>
          </div>
        </div>
        <div className="row no-gutters" style={{ marginBottom: "2rem" }}>
          <div className="col-2-10" />
          <div className="col-8-10">
            <CirclePicker
              width="100%"
              color={color}
              onChange={this.handleColorChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

CreateBookInformation.propTypes = {
  name: PropTypes.string,
  //da modificare location
  location: PropTypes.string,
  description: PropTypes.string,
  cost: PropTypes.number,
  color: PropTypes.string,
  handleSubmit: PropTypes.func,
  language: PropTypes.string,
  //link: PropTypes.string,
};

export default withLanguage(CreateBookInformation);
