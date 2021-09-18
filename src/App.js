import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Todo from './components/Todo';
import Form from './components/Form';

let taskData = [];

let taskList = taskData.map(task => <Todo id={task.id} name={task.name} completed={task.completed}/>);

function App(props) {

  const [ tasks, setTasks ] = useState(taskData);

  taskList = tasks.map(task => <Todo id={task.id} name={task.name} completed={task.completed} removeTask={removeTask} />);    

  function addTask(name) {
    const newTask = {id : 'todo' + nanoid(),  name : name, 'completed': false};
    setTasks([...tasks, newTask]);
  }

  function removeTask(taskId) {
    let otherTasks = tasks.filter(task => task.id !== taskId);
    setTasks(otherTasks);
  }

  const taskNumText = tasks.length !== 1 ? 'tasks' : 'task';
  const headingText = `${tasks.length} ${taskNumText} remaining`; 

  return (
    <div>
      <h1>TodoList</h1>
      <Form addTask={addTask}/>
      <ul>
        {taskList}
      </ul>
      { tasks.length !== 0 ? <h2>
        {headingText}
      </h2> : null }
    </div>
  );
}

export default App;
