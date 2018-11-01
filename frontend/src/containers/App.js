import React from 'react';
import uuid from "uuid";
import style from "./App.css";
import Title from '../components/Title';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';

const API_URL = 'http://localhost:30555/api/todos';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this.getTodos()
  }

  addTodo = (description) => {
    fetch(
        API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            task: description,
            author: "NodeConfEU"
          })
        }
      )
      .then((response) => response.json())
      .then(() => this.getTodos())
      .catch((error) => {
        console.log(error);
      });
  }


  removeTodo = (id) => {
    fetch(API_URL + '/' + id, {
        method: 'DELETE'
      })
      .then((response) => response.json())
      .then((response) => {
        const remainder = this.state.data.filter(todo => todo._id !== id);
        this.setState({
          data: remainder,
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getTodos = () => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => this.setState({
        data
      }));
  }

  render = () => {
    return ( <
      div className = {
        style.TodoApp
      } >
      <
      Title title = 'todos'
      count = {
        this.state.data.length
      }
      />  <TodoForm addTodo = {this.addTodo} /
      >
      <
      TodoList list = {
        this.state.data
      }
      removeTodo = {
        this.removeTodo
      }
      /> < /
      div >
    )
  }

}

export default App;
