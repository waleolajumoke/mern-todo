import { useState, useEffect } from 'react';
import axios from 'axios';

import './app.css';
import Item from './components/Item';

const API_BASE_URL = 'http://localhost:5000';

function App() {
  const [text, setText] = useState('');
  const [todo, setTodo] = useState([]);
  const [isUpdating, setUpdating] = useState('');

  useEffect(() => {
    // Fetch initial todo list on component mount
    axios.get(`${API_BASE_URL}/get-todo`)
      .then((res) => setTodo(res.data))
      .catch((err) => console.error(err));
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const addOrUpdateTodo = () => {
    const apiUrl = isUpdating ? `${API_BASE_URL}/update-todo` : `${API_BASE_URL}/save-todo`;

    axios.post(apiUrl, { _id: isUpdating, text })
      .then((res) => {
        console.log(res.data);
        setText('');
        setUpdating('');
        // Refresh the todo list after adding/updating
        axios.get(`${API_BASE_URL}/get-todo`)
          .then((res) => setTodo(res.data))
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  const deleteTodo = (_id) => {
    axios.post(`${API_BASE_URL}/delete-todo`, { _id })
      .then((res) => {
        console.log(res.data);
        // Refresh the todo list after deleting
        axios.get(`${API_BASE_URL}/get-todo`)
          .then((res) => setTodo(res.data))
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  };

  const updateTodo = (_id, text) => {
    setUpdating(_id);
    setText(text);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>ToDo App</h1>
        <div className="top">
          <input
            type="text"
            placeholder="Write Something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="add" onClick={addOrUpdateTodo}>
            {isUpdating ? 'Update' : 'Add'}
          </div>
        </div>

        <div className="list">
          {todo.map((item) => (
            <Item
              key={item._id}
              text={item.text}
              remove={() => deleteTodo(item._id)}
              update={() => updateTodo(item._id, item.text)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

