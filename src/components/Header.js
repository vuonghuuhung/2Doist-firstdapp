import React from "react";
import { useState } from "react";

const Header = (props) => {
    const [text, setText] = useState("");
    const { addTodo } = props

    const onAddToDo = (e = {}) => {
        if (e.key === 'Enter' && text) {
            addTodo({
                id: new Date().valueOf(),
                text,
                done: false
            });
            setText("");
        }
    }

    return (
        <header className="header">
            <h1>2Doist</h1>
            <input 
                className="new-todo" 
                placeholder="What needs to be done?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={(e) => onAddToDo(e)}
            ></input>
        </header>
    );
}

export default Header;