import React from 'react';
import Todo from "./Todo";
import "./TodoList.css";

const TodoList = ({ list, removeTodo }) => {
  return (
    <ul className="TodoList">
      {list.map((item) => {
        return (
          <Todo 
            todo={item}
            remove={() => {removeTodo(item._id)}}
            key={item._id}
          />
        )
      })}
    </ul>
  );
}

export default TodoList;
