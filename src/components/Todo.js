
const Todo = ({id, name, completed, removeTask, toggleTask}) => {
  

    return (
      <li>
        <div>
          <input id="todo-0" type="checkbox" defaultChecked={completed} onChange={() => toggleTask(id)} />
          <label style={{textDecoration : completed ? 'line-through' : 'none'}} htmlFor="todo-0">
            {name}
          </label>
        </div>
        <div>{completed ? 'completed' : 'not completed'}</div>
        <div>
          <button onClick={() => removeTask(id)} type="button">
            Delete 
          </button>
        </div>
      </li>
    );
  }

export default Todo; 