import React from 'react';
import style from "./TodoList.css";
import Todo from "./Todo";

const TodoList = (props) => {
    return (
        <ul className = {style.TodoList}>
            {
                props.list.map((item) => {
                    return (
                      <
                      Todo todo = {item}
                       delete = { () => { props.removeTodo(item._id) } }
                       key = { item._id }
                      />
                    )
                })
            }
        </ul>
    );
}

export default TodoList;
