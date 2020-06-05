import React, { useState, useRef, useReducer, useContext } from 'react';
import './App.css';
import { stringToColour } from './colorUtil';

const Todo = ({ todo }) => {
  const dispatch = useContext(TodosDispatch);
  const handleTodoClick = () => {
    dispatch({ type: 'CHECK_UNCHECK', todo });
  };
  return (
    <div className="todo-item">
      <input type="checkbox" checked={todo.done} onChange={handleTodoClick} />
      <span 
        className="todo-task" 
        onClick={handleTodoClick} 
        style={{ textDecoration: todo.done ? "line-through" : "" }}
      >
        {todo.id}
      </span>
      <span 
        className="todo-category"
        onClick={handleTodoClick} 
        style={{
          backgroundColor: stringToColour(todo.category),
          textDecoration: todo.done ? "line-through" : ""
        }}
      >
        {todo.category}
      </span>
    </div>
  );
};

const filterTodos = (allTodoItems, selectedCategory) => {
  const filtered = {};
  Object.keys(allTodoItems).forEach(id => {
    if (!selectedCategory || allTodoItems[id].category === selectedCategory) {
      filtered[id] = { ...allTodoItems[id] };
    }
  });
  return filtered;
};

const TodoList = ({ todos, selectedCategory }) => {
  const filteredList = filterTodos(todos, selectedCategory);
  return (
    <div className="todo-list">
      <span className="todo-title">TODO</span>
      {Object.keys(filteredList).map((id, idx) => {
        return <Todo key={idx} todo={{ id, ...todos[id] }}/>
      })}
    </div>
  );
}

const TodoForm = () => {
  const taskInputRef = useRef(null);
  const dispatch = useContext(TodosDispatch);
  const [todo, setTodo] = useState({ id: '', category: '' });

  const handleSubmit = event => {
    event.preventDefault();
    if (!todo.id || !todo.category) return;
    dispatch({ type: 'ADD', todo });
    setTodo({ id: '', category: '' });
    taskInputRef.current.focus();
  };

  const updateFormField = event => {
    setTodo({
      ...todo,
      [event.target.name]: event.target.value
    });
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <button type="submit">+</button>
      <input type="text" value={todo.id} name="id" onChange={updateFormField} ref={taskInputRef} />
      <input type="text" value={todo.category} name="category" onChange={updateFormField} />
    </form>
  );
};

const TodoFilter = ({ todos, category, handleCategoryChange }) => {
  const categories = Array.from(new Set([...Object.keys(todos).map(key => todos[key].category)]));
  return (
    <>
      <div>Categories</div>
      <select onChange={handleCategoryChange} value={category}>
        <option value="">All</option>
        {categories.map((category, idx) => 
          <option key={idx} value={category}>{category}</option>
        )}
      </select>
    </>
  );
}

const TodosDispatch = React.createContext(null);

const todosReducer = (state, action) => {
  const { id, category, done } = action.todo;
  switch (action.type) {
    case 'ADD':
      return { ...state, [id]: { category, done: false } };
    case 'CHECK_UNCHECK':
      return { ...state, [id]: { category, done: !done } };
    default:
      throw new Error();
  }
}

const initialState = {
  'laundry': { category: 'home', done: false },
  'write report': { category: 'work', done: true },
  'vacuum': { category: 'home', done: false }
};

function App() {
  const [todos, dispatch] = useReducer(todosReducer, initialState);
  const [category, setCategory] = useState('');

  const handleCategoryChange = event => {
    console.log(event.target.value);
    setCategory(event.target.value);
  };

  return (
    <div className="container">
      <div className="todo-container">
        <TodosDispatch.Provider value={dispatch}>
          <TodoList todos={todos} selectedCategory={category} />
          <TodoForm />
        </TodosDispatch.Provider>
      </div>
      <div className="combo-container">
          <TodoFilter todos={todos} category={category} handleCategoryChange={handleCategoryChange} />
      </div>
    </div>
  );
}

export default App;

