import React, { Component } from 'react';
import axios from 'axios';

/*const style = {
  minHeight: 10,
  width: 200,
};*/

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
export default class EditBook extends Component {
  constructor(props) {
    super(props);

    this.onChangeAuthor = this.onChangeAuthor.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      author: '',
      title: '',
      description: ''
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
          description: response.data.description           
        })   
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  onChangeAuthor(e) {
    this.setState({
      author: e.target.value

    })
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value

    })
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value

    })
  }

  onSubmit(e) {
    e.preventDefault();

    const book = {
        author: this.state.author,
        title: this.state.title,
        description: this.state.description
    }

    console.log(book);

    axios.post('/api/book/update/' + this.props.match.params.id, book)
      .then(res => console.log(res.data));

  }

 //tornare indietro
 backNavClick = (event) => {
  window.location = `/infoBook/${this.props.match.params.id}`; 
};

  render() {
    const rowStyle = { minHeight: "5rem" };
    const buttonStyle = { minHeight: "6rem" };
    return (
    
    <div>
      <BackNavigation
          title={this.state.title}
          onClick={this.backNavClick}
        />  

      <form onSubmit={this.onSubmit}>
      <div id="activityMainContainer">
    <div className="row no-gutters" style={rowStyle}>
      <div className="activityInfoHeader">EDIT BOOK</div>
    </div>
    
      <div className="row no-gutters" style={rowStyle}>
        <div className="col-1-10">
        Author : 
        </div>
        <div className="col-9-10 form-group">          
        <input  type="text"
              required
              className="form-control"
              value={this.state.author}
              onChange={this.onChangeAuthor}
              />         
        </div>
      
            
      
        <div className="col-1-10">
        Title : 
        </div>
        <div className="col-9-10 form-group" >       
        <input  type="text"
              required
              className="form-control"
              value={this.state.title}
              onChange={this.onChangeTitle}
              />       
        </div>
      </div>

      <div className="row no-gutters" style={rowStyle}>
        <div className="col-1-10">
          Description : 
        </div>
        <div className="col-9-10">
        <input  type="text"
              required
              className="form-control"
              value={this.state.description}
              onChange={this.onChangeDescription}
              //style = {style}
              />
        </div>
        <div className="form-group col-9-10" style={buttonStyle}></div>
        <div className="form-group col-9-10" style={buttonStyle}>
          <input type="submit" value="EDIT" className="btn btn-primary" />
        </div>
      </div>
            
        </div>
        <div id = "end" style={rowStyle}></div>
        </form>
    </div>
    )
  }
}