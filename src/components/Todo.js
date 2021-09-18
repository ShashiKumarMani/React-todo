
const Todo = ({id, name, completed, removeTask}) => {
  
    return (
      <li>
        <div>
          <input id="todo-0" type="checkbox" defaultChecked={completed}/>
          <label htmlFor="todo-0">
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