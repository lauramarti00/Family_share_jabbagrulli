import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import {
  withStyles,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios from "axios";
import withLanguage from "./LanguageContext";
import CreateBookInformation from "./CreateBookInformation";
import Texts from "../Constants/Texts";
import Log from "./Log";
import LoadingSpinner from "./LoadingSpinner";


//CSS
const styles = (theme) => ({
  root: {
    width: "100%",
  },
  continueButton: {
    backgroundColor: "#00838F",
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    "&:hover": {
      backgroundColor: "#00838F",
    },
    boxShadow: "0 6px 6px 0 rgba(0,0,0,0.24)",
    height: "4.2rem",
    width: "12rem",
  },
});

//oggetto creato per gestire le richieste al db
class CreateBookStepper extends React.Component {
  constructor(props) {
    super(props);
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffeb3b",
      "#ffc107",
      "#ff9800",
      "#ff5722",
      "#795548",
      "#607d8b",
    ];
    this.state = {
      information: {
        title: "",
        //color: colors[Math.floor(Math.random() * colors.length)],
        description: "",
        author: "",
      },
      creating: false,
    };
  }

  //create book
  createBook = () => {
    const { match, history, enqueueSnackbar, language } = this.props;
    const texts = Texts[language].createActivityStepper;
    const { groupId } = match.params;
    const { information,} = this.state;
    const userId = JSON.parse(localStorage.getItem("user")).id;// TODO quando metto il propietario, da vedere
    const book = this.formatDataToBook(
      information      
    );
    console.log("book")
    console.log(book)
    this.setState({ creating: true });
    //aggiunta libro al database
    axios
    .post
    ("/api/book/add", 
      book
    )
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
  };

  // TODO sostituire con book, group id e user id da fare dopo TODO
  formatDataToBook = (information, /*groupId, userId*/) => {
    return {
      author: information.author,
      title: information.title,
      description: information.description,
    };
  };

  handleContinue = () => {
      this.createBook();
      window.location = '/catalogo'; //TODO modificare
  };

  //funziona che aggiorna le informazioni ad ogni scrittura in CreateBookInformation
  handleInformationSubmit = (information) => {
    this.setState({ information });
  };

  //integra CreateBookInformation 
  getStepContent = () => {
    const { information, } = this.state;
    return (
      <CreateBookInformation
        {...information}
        handleSubmit={this.handleInformationSubmit}
      />
    );  
  };

  // ritorna le icone
  getStepLabel = () => {
    const iconStyle = { fontSize: "2rem" };
    let icon = "fas fa-info-circle";    
    iconStyle.color = "#00838F";
    return (
      <div id="stepLabelIconContainer">
        <i className={icon} style={iconStyle} />
      </div>
    );
  };

  render() {
    const { language, classes } = this.props;
    const texts = Texts[language].createActivityStepper;
    const {creating } = this.state;
    return (
      <div className={classes.root}>
        {creating && <LoadingSpinner />}
          <div
            icon={this.getStepLabel()} 
            className={classes.stepLabel}
          >
          </div>
          <div>
            {this.getStepContent()}
              <div className={classes.actionsContainer}>
                <div>
                  <Button                      
                    variant="contained"
                    color="primary"
                    onClick={this.handleContinue}//funzione che invia dati al db
                    >                          
                  </Button>                        
                </div>
              </div>
          </div>
      </div>
    );
  }
}

CreateBookStepper.propTypes = {
  classes: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  language: PropTypes.string,
  enqueueSnackbar: PropTypes.func,
};
export default withSnackbar(
  withRouter(withLanguage(withStyles(styles)(CreateBookStepper)))
);
