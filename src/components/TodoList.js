import React from "react";
import Todo from "./Todo";

const TodoList = (props) => {
    const { todosList, isCheckedAll, checkAllTodos } = props;
    return (
        <section className="main">
            <input 
                className="toggle-all"
                type={"checkbox"}
                checked={isCheckedAll}
                onChange={() => {
                    console.log('mark done');
                    checkAllTodos();
                }}
            ></input>
            <label htmlFor="toggle-all" onClick={checkAllTodos}></label>
            <ul className="todo-list">
                {
                    todosList.map((todo, index) => 
                    <Todo key={todo.id} {...{ todo }} {...props} index={index}/>)
                }
            </ul>
        </section>
    )
}

export default TodoList;