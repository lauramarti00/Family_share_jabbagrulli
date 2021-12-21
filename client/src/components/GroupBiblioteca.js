import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Fab from "@material-ui/core/Fab";
import { withStyles } from "@material-ui/core/styles";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import ActivityOptionsModal from "./OptionsModal";
import BookListItem from "./BookListItem";
import ConfirmDialog from "./ConfirmDialog";
import Log from "./Log";


/*questo indica solamente come sono fatti i bottoni*/
const styles = {
  /*bottone +*/
  add: {
    position: "absolute",
    right: 0,
    bottom: 0,
    height: "5rem",
    width: "5rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem",
  },
  /*i miei libri e/o libreria*/
  myBooks: {
    right: "0.5rem",
    height: "4rem",
    width: "4rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem",
  },
  /*Aggiungi libro*/
  addBook: {
    right: "0.5rem",
    height: "4rem",
    width: "4rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem",
  },
};


const fetchBook = (groupId) => {
  return axios
    //.get(`/api/groups/${groupId}/activities`) //api/book
    .get(`/api/book/list/${groupId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
};



class GroupBiblioteca extends React.Component {
  constructor(props) {
    super(props);
    const { group } = this.props;
    this.state = {
      group,
      showAddOptions: false,
      fetchedData: false,
      optionsModalIsOpen: false,
    };
  }

  async componentDidMount() {
    const { group } = this.state;
    const { group_id: groupId } = group;
    const book = await fetchBook(groupId);
    //const plans = await fetchPlans(groupId);
    this.setState({
      confirmDialogIsOpen: false,
      fetchedData: true,
      activities: book,
    });
  }
/* TODO: rimuovere if da path path a fine applicazione*/
  /*serve per aggiungere accedere alla pagina di aggiungi libro vedi CreateBookStepper e Information*/
  add = (type) => {
    const { history } = this.props;
    const {
      group: { group_id: groupId },
    } = this.state;
    const path = type === "aggiungilibro" ? `/groups/${groupId}/${type}/create`:`/groups/${groupId}/${type}`;//qui aggiunge create sul'url(chiamato sui bottoni)
    history.push(path);
  };

  toggleAdd = () => {
    const { showAddOptions } = this.state;
    this.setState({ showAddOptions: !showAddOptions });
  };

  /*visualizza le attività nella biblioteca, chiama la funzione BookListItem*/
  renderActivities = () => {
    const { activities } = this.state;
    //const { group_id: groupId } = group;
    return (
      <ul>
        {activities.map((activity, index) => (
          <li key={index}>
            <BookListItem activity={activity} />
          </li>
        ))}
      </ul>
    );
  };

  /*
  renderPlans = () => {
    const { group, plans } = this.state;
    const { group_id: groupId } = group;
    return (
      <ul>
        {plans.map((plan, index) => (
          <li key={index}>
            <PlanListItem plan={plan} groupId={groupId} />
          </li>
        ))}
      </ul>
    );
  };
  */

  handleModalOpen = () => {
    this.setState({ optionsModalIsOpen: true });
  };

  handleModalClose = () => {
    this.setState({ optionsModalIsOpen: false });
  };

  /*il bottone per esportare in agenda tutto, roba inutile che */
  
  
  handleExport = () => {
    const { group } = this.state;
    const { group_id: groupId } = group;
    this.setState({ optionsModalIsOpen: false });
    axios
      .post(`/api/groups/${groupId}/agenda/export`)
      .then((response) => {
        Log.info(response);
      })
      .catch((error) => {
        Log.error(error);
      });
  };


  handlePendingRequests = () => {
    const { history } = this.props;
    const { group } = this.state;
    const { group_id: groupId } = group;
    history.push(`/groups/${groupId}/activities/pending`);
  };

  handleConfirmDialogOpen = () => {
    this.setState({ confirmDialogIsOpen: true, optionsModalIsOpen: false });
  };

  handleConfirmDialogClose = (choice) => {
    if (choice === "agree") {
      this.handleExport();
    }
    this.setState({ confirmDialogIsOpen: false });
  };

  render() {
    const { classes, language, history, userIsAdmin } = this.props;
    const {
      optionsModalIsOpen,
      confirmDialogIsOpen,
      group,
      pendingActivities,
      showAddOptions,
      fetchedData,
    } = this.state;
    const { name } = group;
    const texts = Texts[language].groupActivities;
    /*non so a cosa serva ma in teoria carica il testo in base alla lingua quindi se presente in uno solo  non va*/
    const options = [
      {
        label: texts.export,
        style: "optionsModalButton",
        handle: this.handleConfirmDialogOpen,
      },
    ];
    return (
      <div style={{ paddingBottom: "6rem" }}>
        {/*TODO vedere cosa fa sta roba*/}
        <ActivityOptionsModal
          isOpen={optionsModalIsOpen}
          options={options}
          handleClose={this.handleModalClose}
        />
        <ConfirmDialog
          title={texts.exportConfirm}
          isOpen={confirmDialogIsOpen}
          handleClose={this.handleConfirmDialogClose}
        />
        <div className="row no-gutters" id="groupMembersHeaderContainer">
          <div className="col-2-10">
            <button
              type="button"
              className="transparentButton center"
              onClick={() => history.goBack()}
            >
              <i className="fas fa-arrow-left" />
            </button>
          </div>
          <div className="col-6-10 ">
            <h1 className="verticalCenter">{name}</h1>
          </div>
          <div className="col-1-10 ">
            {userIsAdmin && (
              <button
                type="button"
                className="transparentButton center"
                onClick={this.handlePendingRequests}
              >
                <i className="fas fa-certificate">
                  {pendingActivities > 0 && (
                    <span className="activities-badge">
                      {pendingActivities}
                    </span>
                  )}
                </i>
              </button>
            )}
          </div>
          <div className="col-1-10 ">
            <button
              type="button"
              className="transparentButton center"
              onClick={this.handleModalOpen}
            >
              <i className="fas fa-ellipsis-v" />
            </button>
          </div>
        </div>
        <div
          className="row no-gutters"
          style={{
            bottom: "8rem",
            right: "7%",
            zIndex: 100,
            position: "fixed",
          }}
        >
          <Fab
            color="primary"
            aria-label="Add"
            className={classes.add}
            onClick={() => this.toggleAdd() 
            }
          >
            <i className={showAddOptions ? "fas fa-times" : "fas fa-plus"} />
          </Fab>
        </div>
        {showAddOptions && (
          <React.Fragment>
            <div
              className="row no-gutters"
              style={{
                bottom: "14rem",
                right: "7%",
                zIndex: 100,
                position: "fixed",
                alignItems: "center",
              }}
            >
            {/*aggiungo un libro con this.add("aggiungilibro") -> vedi App.js
               mi porta alla pagina CreateBookStepper(?)*/}
              <div className=" activitiesFabLabel">{"Aggiungi libro"}</div>
              <Fab
                color="primary"
                aria-label="addBook"
                className={classes.addBook}
                //bottone che mi porta ad aggiungilibro /vedi stepper information etc/
                onClick={() => this.add("aggiungilibro")}
              >
                <i className="fas fa-book" />
              </Fab>
            </div>
            <div
              className="row no-gutters"
              style={{
                bottom: "20rem",
                zIndex: 100,
                position: "fixed",
                right: "7%",
                alignItems: "center",
              }}
            >
              <div className=" activitiesFabLabel">{"I miei libri"}</div>
              <Fab
                color="primary"
                aria-label="myBooks"
                className={classes.myBooks}
                //TODO io lo farei minuscolo es: mybooks
                onClick={() => this.add("myBooks")}//attacca all'url il testo tra apici
              >
                <i className="fas fa-calendar" />
              </Fab>
            </div>
          </React.Fragment>
        )}
        <div style={{ paddingBottom: "6rem" }}>
          {fetchedData && (
            <div id="groupActivitiesContainer" className="horizontalCenter">
              <h1 className="">{"Biblioteca"}</h1>
              {this.renderActivities()}
            </div>
          )}
          {/*
          {fetchedData && plans.length > 0 && (
            <div id="groupActivitiesContainer" className="horizontalCenter">
              <h1 className="">{texts.plansHeader}</h1>
              {this.renderPlans()}
            </div>
          )}*/}
        </div>
      </div>
    );
  }
}

GroupBiblioteca.propTypes = {
  group: PropTypes.object,
  userIsAdmin: PropTypes.bool,
  classes: PropTypes.object,
  language: PropTypes.string,
  history: PropTypes.object,
};

export default withStyles(styles)(withLanguage(GroupBiblioteca));
