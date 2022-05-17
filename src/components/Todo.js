import React, { useState } from "react";

const Todo = (props) => {
    const { todo, getTodoEditingId, todoEditingId, onEditTodo, index, markCompleted, removeTodo } = props;
    const [text, setText] = useState(todo.text);
    const isEditing = todoEditingId === todo.id;

    const editTodo = () => {
        onEditTodo({
            ...todo,
            text
        }, index)
    }

    return (
        <li className={`${isEditing ? 'editing' : ''} ${todo.done ? 'completed' : ''}`}>
            {!isEditing ? 
            <div className="view">
                <input 
                    className="toggle" 
                    type="checkbox" 
                    checked={todo.done} 
                    onChange={() => markCompleted(todo.id)}
                ></input>
                <label onDoubleClick={() => getTodoEditingId(todo.id)}>{todo.text}</label>
                <button className="destroy" onClick={() => removeTodo(todo.id)}></button>
            </div> : 
            <input
                className="edit"
                type={"text"}
                value={text}
                onChange={e => setText(e.target.value)}
                onBlur={editTodo}
                onKeyPress={e => {
                    if (e.key === 'Enter') {
                        editTodo();
                    }
                }}
            >
            </input>
            }
        </li>
    )
}

export default Todo;