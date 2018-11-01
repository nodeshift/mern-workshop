import React from 'react';
import style from "./TodoForm.css";

class TodoForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            sortOrderAsc: this.props.isSortAsc
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange = (event) => {
        this.setState({inputValue: event.target.value }) ;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const data = this.state.inputValue.trim();
        if ( data !== '') {
            this.props.addTodo(this.state.inputValue);
            this.setState({inputValue: ''});
        }
    }

    render = () => {
           return (
               <form className = {style.TodoForm} onSubmit = {this.handleSubmit} >
                   <input name = 'task' type="text"
                       onChange = {this.handleChange}
                       value = {this.state.inputValue}
                       placeholder = "Task description"
                   />

                   <input type = 'submit' value = "Add new ToDo" />
               </form>
           );
       }
   }


export default TodoForm;
