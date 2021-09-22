import { useState } from 'react';
import { nanoid } from 'nanoid';
import Todo from './components/Todo';
import Form from './components/Form';
import Filter from './components/Filter';

let taskData = [];
let taskList = [];

let active = false;
let completed = false;

function App(props) {

  // console.log('<----------------------------');
  // console.log('Component : App');

  const [ tasks, setTasks ] = useState([]);

  function addTask(name) {
    // console.log('add task');
    const newTask = {'id' : 'todo' + nanoid(),  'name' : name, 'completed': false};
    taskData.push(newTask);
    setTasks([...tasks, newTask]);
    tasks.map(task => console.log(task.id));
    // console.log('tasks number [Add]: ',tasks.length);

    if(active) filterActive();
    if(completed) filterCompleted();
  }

  function removeTask(taskId) {
    // console.log('remove task')
    let otherTasks = tasks.filter(task => task.id !== taskId);
    taskData = taskData.filter(task => task.id !== taskId);
    setTasks(otherTasks);
  }

  function toggleTask(taskId) {
    // console.log('toggle');
    taskData  = taskData.map(task => {
      if(task.id === taskId) {
        return {...task, 'completed': !task.completed};
      } else {
        return task;
      }
    });
    let modTasks  = tasks.map(task => {
      if(task.id === taskId) {
        return {...task, 'completed': !task.completed};
      } else {
        return task;
      }
    });

    setTasks(modTasks);

    if(active) filterActive();
    if(completed) filterCompleted();
  }

  function filterAll() {
    // console.log('filter all');
    active = false;
    completed = false;
    setTasks(taskData);
  }

  function filterActive() {
    // console.log('filter active')
    active = true;
    let activeTasks = taskData.filter(task => task.completed === false);
    setTasks(activeTasks);
  }

  function filterCompleted() {
    // console.log('filter completed');
    completed = true;
    let completedTasks = taskData.filter(task => task.completed === true);
    setTasks(completedTasks);
  }

  // console.log('tasks number : ',tasks.length);

  taskList = tasks.map(task => <Todo key={task.id} id={task.id} name={task.name} completed={task.completed} removeTask={removeTask} toggleTask={toggleTask}/>);    

  // console.log('tasks map()');
  // console.log('---------------------------->');
  const taskNumText = tasks.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskData.length} ${taskNumText} remaining`; 

  return (
    <div>
      <h1>TodoList</h1>
      <Form addTask={addTask}/>
      <ul>
        {taskList}
      </ul>
      { taskData.length !== 0 ? <h2>
        {headingText}
      </h2> : null }
      <div>
        <Filter name="All" filter={filterAll}/>
        <Filter name="Active" filter={filterActive}/>
        <Filter name="Completed" filter={filterCompleted}/>
      </div>
    </div>
  );
}

export default App;
  