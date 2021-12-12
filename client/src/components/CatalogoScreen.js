import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

//html che verrà chiamato ogni volta in base agli elementi della lista
const Book = props => (
  <tr>
    <td>{props.book.author}</td>
    <td>{props.book.title}</td>
    <td>{props.book.description}</td>
    <td>
      <Link to={"/editBook/"+props.book._id}>edit</Link> | <a href="#" onClick={() => { props.deleteBook(props.book._id) }}>delete</a>
    </td>
  </tr>
)

export default class Catalogo extends React.Component {
  constructor(props) {
    super(props);

    this.deleteBook = this.deleteBook.bind(this)

    this.state = {books: []};
  }

  //ritorna una lista di elementi >:C
  componentDidMount() {
    axios.get('/api/book/')
      .then(response => {
        this.setState({ books: response.data })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  deleteBook(id) {
    axios.delete('/api/book/'+id)
      .then(response => { console.log(response.data)});

    this.setState({
      book: this.state.books.filter(el => el._id !== id)
    })
    window.location = '/';
  }

  //metodo per creare la lista in html
  bookList() {
    return this.state.books.map(currentbook => {
      return <Book book={currentbook} deleteBook={this.deleteBook} key={currentbook._id}/>;
    })
  }

  render() {
    return (
      <div>
        <h3>Logged Books</h3>
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th>Author</th>
              <th>Title</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            { this.bookList() }
          </tbody>
        </table>
      </div>
    )
  }
}