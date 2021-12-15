import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Images from "../Constants/Images";

const BackNavigation = ({ onClick, title }) => {
    return (
      <div
        className="row no-gutters"
        id="backNavContainer"
      >
        <button className="transparentButton " onClick={onClick} type="button">
          <i className="fas fa-arrow-left" />
        </button>
        <h1>{title}</h1>
      </div>
    );
};
//TODO: da sistemare
class Book extends Component {
  constructor(props) {
    super(props);


    this.state = {
      author: '',
      title: '',
      description: '',      
      userId:'',
      groupId: '',
    }
  }

  //metodo chiamato all'inizio
  componentDidMount() {
    //libro per parametro
    axios.get('/api/book/'+this.props.match.params.id)
      .then(response => {
        this.setState({
          author: response.data.author,
          title: response.data.title,
          description: response.data.description,
          userId: response.data.userId,
          groupId: response.data.groupId,            
        })   
      })
      .catch(function (error) {
        console.log(error);
      })
  }


  //tornare indietro
  backNavClick = (event) => {
    //TODO: mettere history
    window.location = '/groups/'+this.state.groupId+'/Biblioteca'; //schermata biblioteca
  };

  //editare il libro
  editClick = (event) => {
      //TODO: mettere history
    window.location = `/editBook/${this.props.match.params.id}`; // schermata editBook
  };

  //eliminare libro
  deleteClick = (event) => {
    const groupId = this.state.groupId
    axios.delete('/api/book/'+this.props.match.params.id)
    .then(response => { console.log(response.data)});
  //TODO: mettere history
    window.location = `/groups/${groupId}/Biblioteca`; //schermata biblioteca
  };

  
  render() {   
    const rowStyle = { minHeight: "5rem" };
    const buttonStyle = { minHeight: "10rem" };
    return (
    <React.Fragment>
   <div>
        <div className="row no-gutters" style={rowStyle}>
        <BackNavigation
          title={this.state.title}
          onClick={this.backNavClick}
         
        />   
   </div>  
           
        <div id="activityMainContainer">
            <div className="row no-gutters" style={rowStyle}>
              <div className="activityInfoHeader">Title: {(this.state.title).toUpperCase()}</div>
            </div>
            {this.state.author && (
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-1-10">
                <i className="fas fa-user-friends groupNavbarIcon"/>
                </div>
                <div className="col-9-10">
                  <div className="activityInfoDescription">
                    {this.state.author}
                  </div>
                </div>
              </div>
            )}
            {this.state.description && (
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-1-10">
                  <i className="far fa-file-alt activityInfoIcon" />
                </div>
                <div className="col-9-10">
                  <div className="activityInfoDescription">
                    {this.state.description}
                  </div>
                </div>
              </div>
            )}

            <div className="row no-gutters" style={buttonStyle}  >
            <div className="col-1-10"></div>
          <button onClick={this.editClick} className="btn btn-primary col-1-10" >EDIT</button>
          <div className="col-1-10"></div>
          <button onClick={this.deleteClick} className="btn btn-danger col-1-10" >DELETE</button>
            </div>
            
            </div>
        <div id = "end" style={rowStyle}>          
            </div>
          
    </div>
    </React.Fragment>
    )
  }
}

Book.propTypes = {
    history: PropTypes.object,
  };
  
export default Book;