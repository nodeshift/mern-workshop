import React from 'react';
import style from "./Todo.css";

class Todo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task: this.props.todo.task,
        }
    }

    render = () => {
        return(
            <li className = {style.Todo}>
              {this.state.task}
              <span className = {style.delete}
                  onClick = {this.props.delete}
              >
                  <span>
                    X
                  </span>
              </span>
            </li>
        );
    }
}

export default Todo;
