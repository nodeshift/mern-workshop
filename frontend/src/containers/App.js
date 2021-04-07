import React, { useState, useEffect } from 'react';
import Title from '../components/Title';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import style from "./App.css";

const API_URL = 'http://localhost:30555/api/todos';

const App = () => {
  const [data, setData] = useState([]);

  const getTodos = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((todos) => setData(todos));
  };

  // Run effect on componentDidMount
  useEffect(() => { getTodos(); }, []);

  const addTodo = (description) => {
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
    .then(() => getTodos())
    .catch((err) => {
      console.log(err);
    });
  };

  const removeTodo = (id) => {
    fetch(API_URL + '/' + id, {
        method: 'DELETE'
      })
      .then((response) => response.json())
      .then(() => {
        const remainder = data.filter(todo => todo._id !== id);
        setData(remainder);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={style.TodoApp}>
      <Title title="todos" count={data.length} />
      <TodoForm addTodo={addTodo} />
      <TodoList list={data} removeTodo={removeTodo} />
    </div>
  );
};

export default App;
