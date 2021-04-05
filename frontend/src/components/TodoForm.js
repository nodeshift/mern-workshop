import React, { useState } from 'react';
import style from "./TodoForm.css";

const TodoForm = ({ addTodo }) => {
  // input state using react-hooks
  const [inputValue, setInputValue] = useState('');
  
  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = inputValue.trim();
    if (data !== '') {
      addTodo(inputValue);
      setInputValue('');
    }
  };

  return (
    <form className={style.TodoForm} onSubmit={handleSubmit} >
      <input name="task" type="text"
        onChange={handleChange}
        value={inputValue}
        placeholder="Task description"
      />
      <input type="submit" value="Add new ToDo" />
    </form>
  );
};

export default TodoForm;
