import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import Todo from './components/Todo';
import Form from './components/Form';
import Filter from './components/Filter';

let taskData = [];
let taskList = [];

function App(props) {

  console.log('Component : App');

  const [ tasks, setTasks ] = useState(taskData);

  // console.log(tasks);

  function addTask(name) {
    const newTask = {'id' : 'todo' + nanoid(),  'name' : name, 'completed': false};
    setTasks([...tasks, newTask]);
  }

  function removeTask(taskId) {
    let otherTasks = tasks.filter(task => task.id !== taskId);
    setTasks(otherTasks);
  }

  function toggleTask(taskId) {
    let otherTasks  = tasks.map(task => {
      if(task.id == taskId) {
        if(task.completed === true){
          return {...task, 'completed' : false};
        } else {
          return {...task, 'completed' : true};
        }
      } else {
        return task;
      }
    });
    // console.log('toggle');
    // console.log(otherTasks);
    setTasks(otherTasks);
  }

  taskList = tasks.map(task => <Todo key={task.id} id={task.id} name={task.name} completed={task.completed} removeTask={removeTask} toggleTask={toggleTask}/>);    

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
      <div>
        <Filter name="All"/>
        <Filter name="Active"/>
        <Filter name="Completed"/>
      </div>
    </div>
  );
}

export default App;
