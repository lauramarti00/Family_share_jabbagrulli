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
import Log from "./Log";
import LoadingSpinner from "./LoadingSpinner";


//MUI CHE PERMETTE UNA GRAFICA MIGLIORE
const styles = (theme) => ({
  root: {
    width: "100%",
  },
  continueButton: {
    backgroundColor: "#ff6f00",
    position: "fixed",
    bottom: "5%",
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "3.2rem",
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    "&:hover": {
      backgroundColor: "#ff6f00",
    },
  },
  stepLabel: {
    root: {
      color: "#ffffff",
      "&$active": {
        color: "white",
        fontWeight: 500,
      },
      "&$completed": {
        color: theme.palette.text.primary,
        fontWeight: 500,
      },
      "&$alternativeLabel": {
        textAlign: "center",
        marginTop: 16,
        fontSize: "5rem",
      },
      "&$error": {
        color: theme.palette.error.main,
      },
    },
  },
});

//oggetto creato per gestire le richieste al db
class CreateBookStepper extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      information: {
        title: "",
        description: "",
        author: "",
        image:{},
        file:{},
      },
      creating: false,
    };
  }

  //funzione createBook che permette di interfacciarsi al backend inviando al database le varie informazioni
  createBook = () => {
    const { match,} = this.props;
    const { groupId } = match.params;
    const { information,} = this.state;
    const userId = JSON.parse(localStorage.getItem("user")).id;// TODO quando metto il propietario, da vedere
    //console.log('DEBUG FINALE DATABASE')
    //console.log(information.image)
    //console.log(information.file)
    const bodyFormData = new FormData();
    if (information.file !== undefined) {
      bodyFormData.append("photo", information.file);
    } else {
      bodyFormData.append("image", information.image);
    }
    bodyFormData.append("userId", userId);
    bodyFormData.append("title", information.title);
    bodyFormData.append("author", information.author);
    bodyFormData.append("description", information.description);
    bodyFormData.append("groupId", groupId);
    this.setState({ creating: true });
    /* test
    console.log("contenuto bodyformat")
    for (var value of bodyFormData.values()) {
      console.log(value);
    }
    */
    axios
      .post(`/api/book/add`, bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    .catch((error) => {
      Log.error(error);
      return [];
    });
  };

  //funzione collegato al bottone finale, permette la createBook e torna alla pagina di biblioteca
  handleContinue = () => {
      this.createBook();
      const groupId = this.props.match.params.groupId;
      window.location = `/groups/${groupId}/Biblioteca`; //new vicky, torna indietro alla biblioteca
  };

  //funziona che aggiorna le informazioni ad ogni scrittura in CreateBookInformation
  handleInformationSubmit = (information) => {
    this.setState({ information });
    console.log("INFORMAZIONI")
    console.log(information)
  };

  //funzione che aggiorna le props per le immagini su CreateBookInformation
  handleImageSubmit = (information) => {
    this.setState({ information});
  };

  //integra CreateBookInformation 
  getStepContent = () => {
    const { information, } = this.state;
    return (
      //funzione preso da handleSubmit di CreatBookInformation passato come props
      <CreateBookInformation {...information}
        handleSubmit={this.handleInformationSubmit}
        handleImageSubmit={this.handleImageSubmit}
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
    const { classes } = this.props;
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
            {/*mi genera la parte di scelte date da CreateBookInformation, vedi funzione getStepContent*/}
            {this.getStepContent()}
              <div className={classes.continueButton}> {/*stile bottone vedi supra la funzione*/}
                <div>
                  <Button                      
                    variant="contained"
                    color="primary"
                    onClick={this.handleContinue}//funzione che invia dati al db
                    >
                    {/*TODO editare*/}
                    SALVA                          
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
  enqueueSnackbar: PropTypes.func,
};
export default withSnackbar(
  withRouter(withLanguage(withStyles(styles)(CreateBookStepper)))
);
