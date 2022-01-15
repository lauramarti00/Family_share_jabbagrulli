import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
/* import Texts from "../Constants/Texts"; */
//import BackNavigation from "./BackNavigation";
//import MyBooks from "./MyBooks";
import axios from 'axios';


//barra di navigazione 
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

//html che verrà chiamato ogni volta in base agli elementi della lista
const Book = props => (
  <tr>
    
    <td><button type="button" className="btn btn-light btn-lg" id = "book1" onClick={() => { props.handleBookClick(props.book._id) }} >{props.book.title}</button></td>
    <td>{props.book.author}</td>
    <td>{props.book.accepted}</td>
    
  </tr>
)

const LoanAccepted = props => (
  <tr>
    <td><button type="button" className="btn btn-light btn-lg" id = "book1" onClick={() => { props.handleBookClick(props.loan.book) }} >{props.loan.bookName}</button></td>
    <td>ACCETTATO</td>
    <td>{new Date(props.loan.start).toLocaleDateString()} - {new Date(props.loan.end).toLocaleDateString()}</td>
  </tr>
)
const LoanNotAccepted = props => (
  <tr>
    <td><button type="button" className="btn btn-light btn-lg" id = "book1" onClick={() => { props.handleBookClick(props.loan.book) }} >{props.loan.bookName}</button></td>
    <td>NON ACCETTATO</td>
    <td> 
    <button type="button" id = "delete" className="btn btn-danger" onClick={() => { props.deleteLoan(props.loan._id) }}>
    ANNULLA PRENOTAZIONE</button>
    </td>
  </tr>
)

const LoanAnnuled = props => (
  <tr>
    <td><button type="button" className="btn btn-light btn-lg" id = "book1" onClick={() => { props.handleBookClick(props.loan.book) }} >{props.loan.bookName}</button></td>
    <td>PRESTITO ANNULLATO</td>
    <td> 
    <button type="button" id = "delete" className="btn btn-warning" onClick={() => { props.deleteLoan(props.loan._id) }}>
    OK</button>
    </td>
  </tr>
)



class MyBooksScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mybooks: [],
      loanbooks: [],
    };
    
  }

  //ritorna una lista di elementi >:C
  async componentDidMount() {
    const user = localStorage.getItem("user");
    await axios.get('/api/book/listperowner/'+this.props.match.params.groupId+"/"+JSON.parse(user).id)
      .then(response => {
        //per ogni libro dire se è stato prenotato
        this.setState({ mybooks: response.data })
      })
      .catch((error) => {
        console.log(error);
      })

     await axios.get('/api/loan/loanlistgroupId/'+this.props.match.params.groupId)
      .then(response => {
        this.setState({ loanbooks: response.data})
      })
      .catch((error) => {
        console.log(error);
      })

  }

   // eliminazione di un prestito
   deleteLoan(id) {
    axios.delete('/api/loan/'+id)
      .then(response => { console.log(response.data);
        
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);        
      })     
      alert("Hai eliminato la richiesta");
  }

  //mi reinderizza alla pagina informazioni del libro
  handleBookClick = (BookId) => {
    const { history } = this.props;
    // const { pathname } = history.location;
    history.push(`/infoBook/${BookId}`); // new vicky, porta alla scheda informazioni libro
  };

  //metodo per creare la lista in html
  bookList() {
    
      
    
    const loans = this.state.loanbooks
    let books = this.state.mybooks

    // setto tutti i libri a non prenotato
    books.map(currentbook => {
      loans.forEach(loan => {
            currentbook.accepted = "NON PRENOTATO";        
      })
    })

    // se non sono accettati ma sono nella cosa metto non confermato
    books.map(currentbook => {
      loans.forEach(loan => {
        if(loan.book == currentbook._id){   
          if(loan.accepted ==false && loan.current == true)          
              currentbook.accepted = "PRENOTATO MA NON CONFERMATO";                 
        }      
      })
    })

    // libro confermato il prestito
    return books.map(currentbook => {
      loans.forEach(loan => {
        if(loan.book == currentbook._id){   
          if(loan.accepted ==true)         
            currentbook.accepted = "PRENOTATO dal "+new Date(loan.start).toLocaleDateString()+" al "+new Date(loan.end).toLocaleDateString();              
        }      
      })
      
      return <Book book={currentbook}  handleBookClick={this.handleBookClick}  key={currentbook._id}/>;
    })
  }

  loanList() {
    const loans = (this.state.loanbooks)
    const user = localStorage.getItem("user");
    return loans.filter(currentloan => {
      return currentloan.userId === JSON.parse(user).id
    }).map(currentloan => {
      if(currentloan.accepted == true)
        return <LoanAccepted loan={currentloan} handleBookClick={this.handleBookClick} key={currentloan._id}/>;
      else{
        if(currentloan.current == true)
          return <LoanNotAccepted loan={currentloan} handleBookClick={this.handleBookClick} deleteLoan={this.deleteLoan} key={currentloan._id}/>;
        else
        return <LoanAnnuled loan={currentloan} handleBookClick={this.handleBookClick} deleteLoan={this.deleteLoan} key={currentloan._id}/>;
      }

        
    })
  }

  render() {
    const { history, language } = this.props; 
    const rowStyle = { minHeight: "5rem" };
    const buttonStyle = { minHeight: "10rem" };
    //console.log(this.state.mybooks)   
    console.log(this.state.loanbooks);
    return (
      <React.Fragment>
      <div>
      <div className="row no-gutters" style={rowStyle}>
      <BackNavigation
        title={`I MIEI LIBRI`}
        onClick={() => history.goBack()}
        
      />   
      </div> 
      <div className="row no-gutters" style={rowStyle}  >
          </div> 
      <div className="container-sm position-relative" style={rowStyle}>
      <h3>I MIEI LIBRI</h3>
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              
              <th scope="col">TITOLO</th>
              <th scope="col">AUTORE</th>
              <th scope="col">PRENOTATO</th>
            </tr>
          </thead>
          <tbody>
            { this.bookList() }
          </tbody>
        </table>
      </div>
      <div className="row no-gutters" style={rowStyle}  >
          </div> 
      <div className="container-sm position-relative" style={rowStyle}>
      <h3>LE MIE PRENOTAZIONI</h3>
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">TITOLO</th>
              <th scope="col">PRENOTATO</th>
              <th scope="col">PERIODO PRENOTAZIONE</th>
            </tr>
          </thead>
          <tbody>
            { this.loanList() }
          </tbody>
        </table>
      </div>
        
      </div>
      </React.Fragment>
    )
  }
}

MyBooksScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object,
};

export default withLanguage(MyBooksScreen);