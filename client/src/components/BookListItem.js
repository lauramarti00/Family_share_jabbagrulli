import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { withRouter } from "react-router-dom";
import withLanguage from "./LanguageContext";
import Log from "./Log";
import Avatar from "./Avatar";


const getBooks = (groupId) => {
  return axios
    .get(`/api/book/list/${groupId}/`)
    .then((response) => {
      return response.data.map((book) => book.book_id);
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
};


class BookListItem extends React.Component {
  constructor(props) {
    super(props);
    const { activity, } = this.props;
    this.state = {activity,};
  }

  async componentDidMount() {
    const { activity } = this.state;
    //const userId = JSON.parse(localStorage.getItem("books")).id;
    const { groupId } = this.props;
    //const activityId = activity.activity_id;
    await getBooks(groupId);
    this.setState({ activity });
  }

  //mi reinderizza alla pagina informazioni del libro
  handleActivityClick = (event) => {
    const { history } = this.props;
    // const { pathname } = history.location;
    history.push(`/infoBook/${event.currentTarget.id}`); // new vicky, porta alla scheda informazioni libro
  };

  render() {
    const { activity } = this.state;
    return (
      <React.Fragment>
        <div
          role="button"
          tabIndex="0"
          onKeyPress={this.handleActivityClick}
          className="row no-gutters"
          style={{ minHheight: "7rem", cursor: "pointer" }}
          id={activity._id}
          onClick={this.handleActivityClick}
        >
          {activity.subscribed && (
            <div className="activityListItemIcon">
              <i className="fas fa-user-check" />
            </div>
          )}
          {/*TODO MODIFICARE PARTE CSS DA ROTONDO A QUADRATO*/}
          <div className="col-2-10">
          <Avatar
            thumbnail={activity.thumbnail_path}
            className="center"
          />
        </div>
          <div
            className="col-6-10"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
          >
            <div className="verticalCenter">
              {/*mi da il titolo del libro*/}
              <div className="row no-gutters">
                <h1>{activity.title}</h1>
              </div>
              {/*mi da l'autore del libro*/}
              <div className="row no-gutters">
                <h1>{activity.author}</h1>
              </div>
            </div>
          </div>
          
          <div
            className="col-2-10"
            style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}
          >
            <i
              style={{ fontSize: "2rem" }}
              className="fas fa-chevron-right center"
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(withLanguage(BookListItem));

BookListItem.propTypes = {
  activity: PropTypes.object,
  groupId: PropTypes.string,
  history: PropTypes.object,
  language: PropTypes.string,
};