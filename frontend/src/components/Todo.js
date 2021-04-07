import React from 'react';
import style from "./Todo.css";

const Todo = ({ todo, remove }) => {
  return (
    <li className={style.Todo}>
      {todo.task}
      <span className={style.delete} onClick={remove}>
        <span>X</span>
      </span>
    </li>
  );
};

export default Todo;
