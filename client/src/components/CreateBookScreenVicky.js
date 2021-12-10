import React, { Component } from 'react';
import axios from 'axios';
import Log from "./Log";

export default class CreateBook extends React.Component {
  constructor(props) {
    super(props);

    //campi
    this.onChangeAuthor = this.onChangeAuthor.bind(this);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    //stato
    this.state = {
      author: '',
      title: '',
      description: ''
    }
  }

  //metodi per cambiare lo stato
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

  //bottone
  onSubmit(e) {
    e.preventDefault();

    //creea un oggetto
    const book = {
      author: this.state.author,
      title: this.state.title,
      description: this.state.description
    }

    console.log(book);

    //usa la route del server per salvare l'oggetto
    return axios
    .post
    ("/api/book/add", 
      book
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });

  }

  render() {
    return (
      <div>
        <h3>Create New Book</h3>
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
            <input type="submit" value="Create Book" className="btn btn-primary" />
          </div>
        </form>
      </div>
    )
  }
}