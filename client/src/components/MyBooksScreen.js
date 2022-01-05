import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
/* import Texts from "../Constants/Texts"; */
//import BackNavigation from "./BackNavigation";
//import MyBooks from "./MyBooks";
import axios from 'axios';


/*const MyBooksScreen = ({ language, history }) => {
 
  return (
    <div id="createActivityContainer">
      <BackNavigation
        title={"I miei Libri"}
        onClick={() => history.goBack()}
      />
      <MyBooks />
    </div>
  );
};*/


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
    <td>{props.book.author}</td>
    <td>{props.book.title}</td>
    <td>{props.book.accepted}</td>
  </tr>
)

const LoanAccepted = props => (
  <tr>
    <td>{props.loan.bookName}</td>
    <td>ACCETTATO</td>
    <td>{new Date(props.loan.start).toLocaleDateString()} - {new Date(props.loan.end).toLocaleDateString()}</td>
  </tr>
)
const LoanNotAccepted = props => (
  <tr>
    <td>{props.loan.bookName}</td>
    <td>NON ACCETTATO</td>
    <td> 
    <button type="button" id = "delete" className="btn btn-danger" onClick={() => { props.deleteLoan(props.loan._id) }}>
    ANNULLA PRENOTAZIONE</button>
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
        // TODO: per ogni libro dire se è stato prenotato
        this.setState({ mybooks: response.data })
      })
      .catch((error) => {
        console.log(error);
      })

      //TODO SISTEMARE
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
  }


  //metodo per creare la lista in html
  bookList() {
    const loans = this.state.loanbooks
    
    return this.state.mybooks.map(currentbook => {
      
      loans.forEach(loan => {
        if(loan.book == currentbook._id)
            currentbook.accepted = "PRENOTATO";
        else
            currentbook.accepted = "NON PRENOTATO";
      })
      
      return <Book book={currentbook} key={currentbook._id}/>;
    })
  }

  loanList() {
    const loans = (this.state.loanbooks)
    const user = localStorage.getItem("user");
    return loans.filter(currentloan => {
      return currentloan.userId === JSON.parse(user).id
    }).map(currentloan => {
      if(currentloan.accepted == true)
        return <LoanAccepted loan={currentloan} key={currentloan._id}/>;
      else
        return <LoanNotAccepted loan={currentloan} deleteLoan={this.deleteLoan} key={currentloan._id}/>;
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
              <th scope="col">AUTORE</th>
              <th scope="col">TITOLO</th>
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