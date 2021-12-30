import React, { Component } from 'react';
import './DatePick.css';
import axios from 'axios';
import PropTypes from "prop-types";
import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';


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

//vista del prestito corrente  se il libro è in prestito
const Loan3 = props => (
  <tr>
    <td>{props.loan.userName}</td>
    <td>{props.loan.userSurname}</td>
    <td><a href={`mailto:${props.loan.userEmail}?body=ciao, ho confermato il tuo prestito, dobbiamo accordarci sui termini di scambio...`}>{props.loan.userEmail}</a></td>
    <td>
        <a href="#" onClick={() => { props.deleteLoan(props.loan._id,props.loan.book) }}>CONFERMA RESTITUZIONE</a>
    </td>
  </tr>
)

//vista normale del prestito non corrente
const Loan2 = props => (
  <tr>
    <td>{props.loan.userName}</td>
    <td>{props.loan.userSurname}</td>
    <td><a href={`mailto:${props.loan.userEmail}?body=ciao, ho confermato il tuo prestito, dobbiamo accordarci sui termini di scambio...`}>{props.loan.userEmail}</a></td>
    <td>
      <a href="#" onClick={() => { props.deleteLoan(props.loan._id,props.loan.book) }}>ELIMINA</a>
    </td>
  </tr>
)

// constatnti per il tempo di prestito
const startValue = new Date(new Date().getFullYear(), new Date().getMonth());
const endValue = new Date(new Date().getFullYear(), new Date().getMonth() + 7);
const minDate = new Date(new Date().getFullYear(), new Date().getMonth());

// vista del prestito primo della coda
const Loan1 = props => (
  <tr>
    <td>{props.loan.userName}</td>
    <td>{props.loan.userSurname}</td>
    <td><a href={`mailto:${props.loan.userEmail}?body=ciao, ho confermato il tuo prestito, dobbiamo accordarci sui termini di scambio...`}>{props.loan.userEmail}</a></td>
    <td>
    <div>
        <DateRangePickerComponent placeholder="Enter Date Range"
        startDate={startValue}
        endDate={endValue}
        min={minDate}
        minDays={7}
        maxDays={120}
        format="dd-MMM-yy"
        onChange = {(date) =>{
          const loan = props.loan;
          loan.start = date.value[0];
          loan.end = date.value[1];
          loan.accepted = true;

          axios.post('/api/loan/update/'+props.loan._id,loan)
          .then(res => console.log(res.data));

          window.location.reload();

        }
        }
        ></DateRangePickerComponent>
        | <a href="#" onClick={() => { props.deleteLoan(props.loan._id,props.loan.book) }}>ELIMINA</a>
      </div>
    </td>
  </tr>
)


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

      // lista prestiti per il libro
      axios.get('/api/loan/loanlist/'+this.props.match.params.id)
      .then(response => {
          this.setState({
            loans: (response.data).sort(function(a,b){
              return new Date(b.date) - new Date(a.date);
            }),              
          })       
         
      })
      .catch(function (error) {
        console.log(error);        
      })        
  }


  // eliminazione di un prestito
  deleteLoan(id,bookid) {
    
    console.log(bookid);
    axios.delete('/api/loan/'+id)
      .then(response => { console.log(response.data);
        
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);        
      })     
  }

  // vista solo del proprietario
  loanList() {
    return this.state.loans.map(currentloan => {

      if (this.state.loans.indexOf(currentloan) == 0)    {
        if(currentloan.accepted == false)
          return <Loan1 loan={currentloan} deleteLoan={this.deleteLoan} key={currentloan._id}/>;
        else
        return <Loan3 loan={currentloan} deleteLoan={this.deleteLoan} key={currentloan._id}/>;
      }  
        
      else
        return <Loan2 loan={currentloan} deleteLoan={this.deleteLoan} key={currentloan._id}/>;
    })
  }

  //editare il libro
  editClick = (event) => {
    const { history } = this.props;
    history.push(`/editBook/${this.props.match.params.id}`); // schermata editBook
  };

  //eliminare libro
  deleteClick = (event) => {
    const groupId = this.state.groupId
    const { history } = this.props;
    axios.delete('/api/book/'+this.props.match.params.id)
    .then(response => { console.log(response.data)});
    history.goBack();//schermata biblioteca
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

    window.location.reload();
  
  };

  // funzione booleana che mi dice se l'utente corrente è il proprietario o meno
  current_user = ()=>{
    const user = localStorage.getItem("user");
    return JSON.parse(user).id == this.state.userId;
  } 

  render() {  
    const { history, language } = this.props; 
    const rowStyle = { minHeight: "5rem" };
    const buttonStyle = { minHeight: "10rem" };
    console.log(this.state.loans)   

    return (
    <React.Fragment>
  <div>
    <div className="row no-gutters" style={rowStyle}>
      <BackNavigation
        title={`LIBRO  " ${(this.state.title).toUpperCase()} "`}
        onClick={() => history.goBack()}
        
      />   
   </div>    
        <div id="activityMainContainer">
            <div className="row no-gutters" style={rowStyle}>
              <div className="activityInfoHeader">TITOLO DEL LIBRO: {(this.state.title).toUpperCase()}</div>
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
                    <p className="activityInfoDescription">Email: <a href={`mailto:${this.state.email}`}>{this.state.email}</a></p>
                  </div>
                </div>
              </div>
            )}    

            {this.current_user() ?(
            <div className="row no-gutters" style={buttonStyle}  >
            <div className="col-1-10"></div>            
            <button onClick={this.editClick} className="btn btn-primary col-1-10" >MODIFICA</button>
            <div className="col-1-10"></div>
            <button onClick={this.deleteClick} className="btn btn-danger col-1-10" >CANCELLA</button>
            </div>
            ):(
            <div className="row no-gutters" style={buttonStyle}  >
            <div className="col-1-10"></div>
            <button onClick={this.loanClick} className="btn btn-success col-1-10" >PRENOTA</button>
            </div>
            )}
            
            </div>
        <div id = "end" style={rowStyle}>   

        {this.current_user() ?(
        <div id = "end" style={rowStyle}>       
        
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>NOME</th>
              <th>COGNOME</th>
              <th>EMAIL</th>
            </tr>
          </thead>
          <tbody>
            { this.loanList() }
          </tbody>
        </table>
        </div>):(<div></div>)}             
        
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