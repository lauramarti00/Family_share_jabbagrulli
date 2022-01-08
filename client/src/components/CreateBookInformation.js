import React from "react";
import PropTypes from "prop-types";
import autosize from "autosize";
import withLanguage from "./LanguageContext";
import * as path from "lodash.get";


class CreateBookInformation extends React.Component {
  constructor(props) {
    super(props);
    const {
      handleSubmit,
      handleImageSubmit,
      title,
      author,
      description,
      image,
      file
    } = this.props;
    this.state = {  description, author, title, image, file };
    //funzione che riporta a CreateBookStepper
    handleSubmit(this.state, this.validate(this.state));
    //funzione che riporta a CreateBookStepper
    handleImageSubmit(this.state);
    autosize(document.querySelectorAll("textarea"));
  }

  validate = (state) => {
    if (state.author && state.title) {
      return true;
    }
    return false;
  };

  handleChange = (event) => {
    //funzione Object.assign vedi documentazione
    const state = Object.assign({}, this.state);
    //prendo il name name e value da event cioè dalle funzioni di input del render
    const { name, value } = event.target;
    const { handleSubmit } = this.props;
    //SE MODIFICO NAME CON TITLE NON MI DA L'ANTEPRIMA DI SCRITTURA, VEDI FUNZIONE SOTTO
    //funzione props da mandare a Stepper
    state[name] = value;
    handleSubmit(state, this.validate(state));
    console.log(state)
    this.setState(state);
  };



  // Funzioni presi da EditGroupScreen che servono ad inserire immagini
  handleImageChange = (event) => {
    //a state gli passo la funzione Objectassign, vedi documentazione
    const state = Object.assign({}, this.state);
    //prendo il name da input button per le foto, e gli passo il name da event.targer.name
    //ATTENZIONE, PASSO INUTILE: BASTA FARE SOTTO "state["image"], anziche prendere name che gli passerà "image"."
    const { name} = event.target; //meh
    const { handleImageSubmit } = this.props; //funzione props per aggiornare lo stato, e fa la funzione assign
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      //funzione FileReader che apre il file caricato
      const reader = new FileReader();
      reader.onload = (e) => {
        //aggiorno il props aggiornando "image" e file
        state[name] = {path:e.target.result} //potevo fare state["image"] ma ho perso 3 ore quindi lo tengo cosi
        state["file"] = file //modifica del props file
        handleImageSubmit(state) //mi fa la funzione
        //setto lo state image e file
        this.setState({ image: {path: e.target.result }, file })
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  //non lo zo
  handleNativeImageChange = () => {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ action: "fileUpload" })
    );
  };
  //----------------------------------------------------------

  render() {
    const { title, description, author, image,} = this.state;
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
            <i className="fas fa-align-left center" />
          </div>
          <div className="col-8-10">
            <textarea
              rows="1"
              name="description"
              className="center"
              placeholder="Descrizione (Facoltativo)"
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
              <i className="fas fa-camera center" />
            </div>
            <div className="col-7-10">
            <div id="uploadGroupLogoContainer">
              <label
                htmlFor="uploadLogoInput"
                className="horizontal"
              >
                {"Carica foto"}
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
                <input //vedi html/react input attributes
                  id="uploadLogoInput"
                  type="file"
                  name="image" /*da questo image, porta event in handleImageChange, anche se è opzionale*/
                  accept="image/*"
                  onChange={this.handleImageChange}
                />
              )}
              {/*da sistemare, non so come posizionarlo*/}
              <div className="img">
                <img
                  src={path(image, ["path"])}
                  alt="Book image"
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
  handleImageSubmit: PropTypes.func,
  image: PropTypes.object,
  file: PropTypes.object
};

export default withLanguage(CreateBookInformation);