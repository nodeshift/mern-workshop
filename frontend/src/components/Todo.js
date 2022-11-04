import React from 'react';
import "./Todo.css";

const Todo = ({ todo, remove }) => {
  return (
    <li className="Todo">
      {todo.task}
      <span className="delete" onClick={remove}>
        <span>X</span>
      </span>
    </li>
  );
};

export default Todo;
