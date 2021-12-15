import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from "prop-types";

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
    window.location = `/groups/${this.state.groupId}/Biblioteca`; //schermata biblioteca
  };

  //editare il libro
  editClick = (event) => {
    window.location = `/editBook/${this.props.match.params.id}`; // schermata editBook
  };

  //eliminare libro
  deleteClick = (event) => {
    const groupId = this.state.groupId
    axios.delete('/api/book/'+this.props.match.params.id)
    .then(response => { console.log(response.data)});
  
    window.location = `/groups/${groupId}/Biblioteca`; //schermata biblioteca
  };

  
  render() {    
    return (
    <div>
        <BackNavigation
          title={this.state.title}
          onClick={this.backNavClick}
        />       
      
      <div className="form-group"> 
          <label>Author: </label>
          <label>{this.state.author}</label>  
        </div>
        <div className="form-group"> 
          <label>Title: </label>
          <label>{this.state.title}</label>
        </div>
        <div className="form-group"> 
          <label>Description: </label>
          <label>{this.state.description}</label>
        </div>

        <div className="form-group">
          <button onClick={this.editClick} className="btn btn-primary" >EDIT</button>
          <button onClick={this.deleteClick} className="btn btn-danger" >DELETE</button>
        </div>
     
    </div>
    )
  }
}

Book.propTypes = {
    history: PropTypes.object,
  };
  
export default Book;