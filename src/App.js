import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Todo from './components/Todo';
import Form from './components/Form';
import Filter from './components/Filter';
import './App.css';
import TodoList from './artifacts/contracts/TodoList.sol/TodoList.json';

const contractAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';

let taskData = [];
let taskList = [];

let active = false;
let completed = false;
let taskCount = 0;

function App(props) {

  const [ tasks, setTasks ] = useState([]);

  useEffect(() => {
    
    async function connect() {
      if(window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, TodoList.abi, provider);
        
        try {
          taskCount = parseInt((await contract.taskCount()).toString());
          
          if(taskCount > 0) {
            let list = [];
            for(let i = 1;i <= taskCount; i += 1) {
              let task = await contract.readTask(i);
              list.push({'id' : task.id, 'name' : task.content, 'completed' : task.completed});
            }
            taskData = list;
            setTasks(list);
          }
          console.log('useEffect');
        
        } catch(error) {
          console.error(error);
        }
      }
    }
    connect(); 
  }, [])  
 
  async function addTask(name) {
    taskCount += 1;
    const newTask = {'id' : taskCount,  'name' : name, 'completed': false};
    taskData.push(newTask);
    setTasks([...tasks]);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, TodoList.abi, signer)
    const transaction = await contract.createTask(name);
    await transaction.wait();

    if(active) filterActive();
    if(completed) filterCompleted();
  }

  async function removeTask(taskId) {
    let otherTasks = tasks.filter(task => task.id !== taskId);
    taskData = taskData.filter(task => task.id !== taskId);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, TodoList.abi, signer)
    const tx = await contract.deleteTask(taskId);
    await tx.wait();

    setTasks(otherTasks);
  }

  async function toggleTask(taskId) {
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

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, TodoList.abi, signer)
    const transaction = await contract.toggleTask(taskId);
    await transaction.wait();

    setTasks(modTasks);

    if(active) filterActive();
    if(completed) filterCompleted();
  }

  function filterAll() {
    active = false;
    completed = false;
    console.log(taskData);
    setTasks(taskData);
  }

  function filterActive() {
    active = true;
    let activeTasks = taskData.filter(task => task.completed === false);
    setTasks(activeTasks);
  }

  function filterCompleted() {
    completed = true;
    let completedTasks = taskData.filter(task => task.completed === true);
    setTasks(completedTasks);
  }

  taskList = tasks.map(task => <Todo key={task.id} id={task.id} name={task.name} completed={task.completed} removeTask={removeTask} toggleTask={toggleTask}/>);    
  const taskNumText = tasks.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskData.length} ${taskNumText} remaining`; 

  return (
    <div className="container">
      <h1>TodoList</h1>
      <Form addTask={addTask}/>
      <ul>
        {taskList}
      </ul>
      { taskData.length !== 0 ? <h2>
        {headingText}
      </h2> : null }
      <div className="filter">
        <Filter name="All" filter={filterAll}/>
        <Filter name="Active" filter={filterActive}/>
        <Filter name="Completed" filter={filterCompleted}/>
      </div>
    </div>
  );
}

export default App;
  