
const Todo = ({id, name, completed, removeTask, toggleTask}) => {
  

    return (
      <li>
        <div className="todo-content">
          <input id="todo-0" type="checkbox" defaultChecked={completed} onChange={() => toggleTask(id)} />
          <label style={{textDecoration : completed ? 'line-through' : 'none'}} >
            {name}
          </label>
        </div>
        <div>
          <button className="btn-delete" onClick={() => removeTask(id)} type="button">
            X 
          </button>
        </div>
      </li>
    );
  }

export default Todo; 