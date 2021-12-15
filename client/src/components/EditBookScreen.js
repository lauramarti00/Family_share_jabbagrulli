import React, { Component } from 'react';
import axios from 'axios';

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
    return (
    <div>
      <BackNavigation
          title={this.state.title}
          onClick={this.backNavClick}
        />       
      <h3>Edit Book Log</h3>
      <form onSubmit={this.onSubmit}>
      <div className="form-group"> 
          <label>Author: </label>
          <input  type="text"
              required
              className="form-control"
              value={this.state.author}
              onChange={this.onChangeAuthor}
              />
        </div>
        <div className="form-group"> 
          <label>Title: </label>
          <input  type="text"
              required
              className="form-control"
              value={this.state.title}
              onChange={this.onChangeTitle}
              />
        </div>
        <div className="form-group"> 
          <label>Description: </label>
          <input  type="text"
              required
              className="form-control"
              value={this.state.description}
              onChange={this.onChangeDescription}
              />
        </div>

        <div className="form-group">
          <input type="submit" value="Edit Exercise Log" className="btn btn-primary" />
        </div>
      </form>
    </div>
    )
  }
}