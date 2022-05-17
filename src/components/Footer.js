import React from "react";

const Footer = (props) => {
    const { status, setStatusFilter, numOfTodos, numOfTodosLeft, clearCompleted } = props;
    const filterBtns = [{
        title: 'All',
        isActive: status === 'ALL',
        onClick: () => setStatusFilter('ALL'),
        link: ''
    }, {
        title: 'Active',
        isActive: status === 'ACTIVE',
        onClick: () => setStatusFilter('ACTIVE'),
        link: 'active'
    }, {
        title: 'Completed',
        isActive: status === 'COMPLETED',
        onClick: () => setStatusFilter('COMPLETED'),
        link: 'completed'
    }];
    return (
        <footer className="footer">
            <span className="todo-count">
                <strong>{numOfTodosLeft}</strong>
                <span> </span>
                <span>{numOfTodosLeft <= 1 ? 'item' : 'items'}</span>
                <span> left</span>
            </span>
            <ul className="filters">
                {
                    filterBtns.map((btn, index) => (
                        <FilterBtn 
                            key={index} 
                            {...btn}
                        />
                    ))
                }
            </ul>
            {numOfTodos > numOfTodosLeft && <button className="clear-completed" onClick={clearCompleted}>Clear completed</button>}
        </footer>
    )
}

const FilterBtn = (props) => {
    const { title, onClick, link, isActive } = props;
    return (
        <>
            <li>
                <a
                    href={`#${link}`}
                    className={`${isActive ? 'selected' : ''}`}
                    onClick={onClick}
                >
                    {title}
                </a>
            </li>
            <span></span>
        </>
    )
}

export default Footer;