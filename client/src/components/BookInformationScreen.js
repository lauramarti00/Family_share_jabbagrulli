import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';

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

const Loan = props => (
  <tr>
    <td>{props.loan.userName}</td>
    <td>{props.loan.userSurname}</td>
    <td>{props.loan.userEmail}</td>
    <td>
      <Link to={"/editLoan/"+props.loan._id}>conferma</Link> | <a href="#" onClick={() => { props.deleteLoan(props.loan._id,props.loan.book) }}>delete</a>
    </td>
  </tr>
)

const user_loan = (id) => {
  axios.get('/api/users/'+id+'/profile')
        .then(response => {
          const user = {
            name: response.data.given_name,
            surname: response.data.family_name,
            email: response.data.email,              
          }  
       
      })
      .catch(function (error) {
        console.log(error);
      })
}


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
      name:'',
      surname:'',
      email:'',
      loans: []
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
        axios.get('/api/users/'+response.data.userId+'/profile')
        .then(response => {
          this.setState({
            name: response.data.given_name,
            surname: response.data.family_name,
            email: response.data.email,              
          })  
        })
      })
      .catch(function (error) {
        console.log(error);
      })

      axios.get('/api/loan/loanlist/'+this.props.match.params.id)
      .then(response => {
          this.setState({
            loans: response.data,              
          })       
         
      })
      .catch(function (error) {
        console.log(error);        
      })        
  }

  deleteLoan(id,bookid) {
    
    console.log(bookid);
    axios.delete('/api/loan/'+id)
      .then(response => { console.log(response.data);
        
        window.location = `/infoBook/${bookid}`;
      })
      .catch(function (error) {
        console.log(error);        
      })     
  }

  loanList() {
    return this.state.loans.map(currentloan => {
      
      return <Loan loan={currentloan} deleteLoan={this.deleteLoan} key={currentloan._id}/>;
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

  // aggiungi prestiti
  loanClick = async (event) => {
    const user = localStorage.getItem("user"); // l'utente logato al momento
    const loan = {
      book: this.props.match.params.id, // id dall'URL
      ownerId: this.state.userId,
      userId: JSON.parse(user).id,
      userName: "",
      userSurname: "",
      userEmail: "",
      reqDate: new Date(), 
    }

    await axios.get('/api/users/'+loan.userId+'/profile')
        .then(response => {
          
          loan.userName = response.data.given_name
          loan.userSurname =  response.data.family_name
          loan.userEmail = response.data.email           
          
       
      }).catch(function (error) {
        console.log(error);        
      })

    console.log(loan)
    await axios.post('/api/loan/add',loan)
    .then(response => { console.log(response.data)})
    .catch(function (error) {
      console.log(error);        
    })

    window.location = `/infoBook/${this.props.match.params.id}`;
  
  };

  current_user = ()=>{
    const user = localStorage.getItem("user");
    return JSON.parse(user).id == this.state.userId;
  }

  
  render() {   
    const rowStyle = { minHeight: "5rem" };
    const buttonStyle = { minHeight: "10rem" };
    console.log(this.state.loans)
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

            <div className="row no-gutters" style={rowStyle}>
            <div className="col-1-10"></div>
            </div>
             
            {this.state.name && this.state.surname && this.state.email &&(
              <div className="row no-gutters" style={rowStyle}>
                <div className="col-1-10">                  
                </div>
                <div className="col-9-10">
                  <div className="activityInfoDescription">
                    <p className="activityInfoDescription">Proprietario: {this.state.name}  {this.state.surname}</p>
                    <p className="activityInfoDescription">Email: {this.state.email}</p>
                  </div>
                </div>
              </div>
            )}    

            {this.current_user() ?(
            <div className="row no-gutters" style={buttonStyle}  >
            <div className="col-1-10"></div>            
            <button onClick={this.editClick} className="btn btn-primary col-1-10" >EDIT</button>
            <div className="col-1-10"></div>
            <button onClick={this.deleteClick} className="btn btn-danger col-1-10" >DELETE</button>
            </div>
            ):(
            <div className="row no-gutters" style={buttonStyle}  >
            <div className="col-1-10"></div>
            <button onClick={this.loanClick} className="btn btn-success col-1-10" >PRENOTA</button>
            </div>
            )}
            
            </div>
        <div id = "end" style={rowStyle}>   

        <div id = "end" style={rowStyle}>       
        <h3>Logged Loans</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>name</th>
              <th>surname</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
            { this.loanList() }
          </tbody>
        </table>
        </div>
              
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