import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { withSnackbar } from "notistack";
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import moment from "moment";
import axios from "axios";
import withLanguage from "./LanguageContext";
import CreateBookInformation from "./CreateBookInformation";
import Texts from "../Constants/Texts";
import Log from "./Log";
import LoadingSpinner from "./LoadingSpinner";

// non ci server lo stepper
const muiTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiStepper: {
      root: {
        padding: 18,
      },
    },
    MuiStepLabel: {
      label: {
        fontFamily: "Roboto",
        fontSize: "1.56rem",
      },
    },
    MuiButton: {
      root: {
        fontSize: "1.2rem",
        fontFamily: "Roboto",
        float: "left",
      },
    },
  },
});
//

const styles = (theme) => ({
  root: {
    width: "100%",
  },

  // da togliere
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
  //

  createButton: {
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
  // da togliere
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
  //
  //non ci serve ???
  cancelButton: {
    backgroundColor: "#ffffff",
    marginTop: theme.spacing.unit,
    color: "grey",
    marginRight: theme.spacing.unit,
    "&:hover": {
      backgroundColor: "#ffffff",
    },
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
});

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
      //non ci serve
      activeStep: 0,
      information: {
        title: "",
        color: colors[Math.floor(Math.random() * colors.length)],
        description: "",
        author: "",
      },
      //non ci serve
      dates: {
        selectedDays: [],
        repetition: false,
        repetitionType: "",
        lastSelect: new Date(),
      },
      //non ci serve
      timeslots: {
        activityTimeslots: [],
        differentTimeslots: false,
      },
      //non ci serve
      stepWasValidated: false,
      //?? da vedere a cosa serve
      creating: false,
    };
  }

  //non ci serve
  componentDidMount() {
    document.addEventListener("message", this.handleMessage, false);
  }
  //non ci serve
  componentWillUnmount() {
    document.removeEventListener("message", this.handleMessage, false);
  }

  //non ci serve
  handleMessage = (event) => {
    const data = JSON.parse(event.data);
    const { history } = this.props;
    const { activeStep } = this.state;
    if (data.action === "stepperGoBack") {
      if (activeStep - 1 >= 0) {
        this.setState({ activeStep: activeStep - 1 });
      } else {
        history.goBack();
      }
    }
  };

  //create book
  createActivity = () => {
    const { match, history, enqueueSnackbar, language } = this.props;
    console.log("props")
    console.log(this.props);//stampa roba che non si capisce
    const texts = Texts[language].createActivityStepper;
    const { groupId } = match.params;
    console.log("params")
    console.log(match.params);
    const { information, dates, timeslots } = this.state;
    console.log("state")
    console.log(this.state)
    //const userId = JSON.parse(localStorage.getItem("user")).id;// da fare quando metto il propietario, da vedere

    const book = this.formatDataToActivity(
      information      
    );
    console.log("book")
    console.log(book)
    /*
    const events = this.formatDataToEvents(
      information,
      dates,
      timeslots,
      groupId
    );
    */
    this.setState({ creating: true });
    axios
    .post
    ("/api/book/add", 
      book
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
  };

  // da sostituire con book, group id e user id da fare dopo TODO
  formatDataToActivity = (information, /*groupId, userId*/) => {
    return {
      author: information.author,
      title: information.title,
      description: information.description,
    };
  };

  //rimuovibile tranguillamente khiem puzza
  formatDataToEvents = (information, dates, timeslots, groupId) => {
    const events = [];
    dates.selectedDays.forEach((date, index) => {
      timeslots.activityTimeslots[index].forEach((timeslot) => {
        const dstart = new Date(date);
        const dend = new Date(date);
        const { startTime, endTime } = timeslot;
        dstart.setHours(startTime.substr(0, startTime.indexOf(":")));
        dstart.setMinutes(
          startTime.substr(startTime.indexOf(":") + 1, startTime.length - 1)
        );
        dend.setHours(endTime.substr(0, endTime.indexOf(":")));
        dend.setMinutes(
          endTime.substr(endTime.indexOf(":") + 1, endTime.length - 1)
        );
        if (
          startTime.substr(0, startTime.indexOf(":")) >
          endTime.substr(0, endTime.indexOf(":"))
        ) {
          dend.setDate(dend.getDate() + 1);
        }
        const event = {
          description: timeslot.description,
          location: timeslot.location,
          summary: timeslot.name,
          start: {
            dateTime: dstart,
            date: null,
          },
          end: {
            dateTime: dend,
            date: null,
          },
          extendedProperties: {
            shared: {
              requiredParents: timeslot.requiredParents,
              requiredChildren: timeslot.requiredChildren,
              cost: timeslot.cost,
              parents: JSON.stringify([]),
              children: JSON.stringify([]),
              externals: JSON.stringify([]),
              status: "ongoing",
              link: timeslot.link,
              activityColor: information.color,
              category: timeslot.category,
              groupId,
              repetition: dates.repetition ? dates.repetitionType : "none",
              start: startTime.substr(0, startTime.indexOf(":")),
              end: endTime.substr(0, startTime.indexOf(":")),
            },
          },
        };
        events.push(event);
      });
    });
    return events;
  };

  // non ci serve
  handleContinue = () => {
      this.createActivity();// da mettere su create button
  };

  //deleta
  handleCancel = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1,
    });
  };

  //bottone ok
  handleInformationSubmit = (information) => {
    this.setState({ information });
  };

  //non neccessario
  handleDatesSubmit = (dates, wasValidated) => {
    this.setState({ dates, stepWasValidated: wasValidated });
  };

  // non neccessario
  handleTimeslotsSubmit = (timeslots, wasValidated) => {
    this.setState({ timeslots, stepWasValidated: wasValidated });
  };

  // da modificare
  getStepContent = () => {
    const { information, } = this.state;
    return (
      <CreateBookInformation
        {...information}
        handleSubmit={this.handleInformationSubmit}
      />
    );  
  };

  // tenere per le icone
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
    //testo
    const texts = Texts[language].createActivityStepper;
    //testo degli step
    const steps = texts.stepLabels;

    const { activeStep, stepWasValidated, creating } = this.state;
    /*
    return (
      <div className={classes.root}>
        {creating && <LoadingSpinner />}
        <MuiThemeProvider theme={muiTheme}> da  togliere
          <Stepper activeStep={activeStep} orientation="vertical"> da  togliere
            {steps.map((label, index) => { da  togliere
              return (
                <Step key={label}>
                  <StepLabel
                    icon={this.getStepLabel(label, index)} da  tenere ????
                    className={classes.stepLabel}
                  >
                    {activeStep > index && index === 1 ? (
                      <div>{this.getDatesCompletedLabel(label)}</div>  da  togliere
                    ) : (
                      label
                    )}
                  </StepLabel>
                  <StepContent>
                    {this.getStepContent()} nostro pezzo
                    <div className={classes.actionsContainer}>
                      <div>
                        <Button
                          disabled={!stepWasValidated} //togliere
                          variant="contained"
                          color="primary"
                          onClick={this.handleContinue}//cambiare con invio database
                          className={
                            activeStep === steps.length - 1//togliere
                              ? classes.createButton
                              : classes.continueButton
                          }
                        >
                          {activeStep === steps.length - 1
                            ? texts.finish//togliere
                            : texts.continue}
                        </Button>
                        <Button
                          disabled={activeStep === 0}//togliere tutto
                          onClick={this.handleCancel}
                          className={classes.cancelButton}
                        >
                          {texts.cancel}
                        </Button>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              );
            })}
          </Stepper>
        </MuiThemeProvider>
      </div>
    ); */
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
                    onClick={this.handleContinue}//cambiare con invio database
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
