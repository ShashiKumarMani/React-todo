import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Todo from './components/Todo';
import Form from './components/Form';
import Filter from './components/Filter';

import TodoList from './artifacts/contracts/TodoList.sol/TodoList.json';
// import { parseUnits } from '@ethersproject/units';

const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';


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
        console.log(await window.ethereum.request({ method: 'eth_requestAccounts' }));
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, TodoList.abi, provider);
        
        try {
          taskCount = parseInt((await contract.taskCount()).toString());
          
          let list = [];
          for(let i = 1;i <= taskCount; i += 1) {
            let task = await contract.readTask(i);
            list.push({'id' : task.id, 'name' : task.content, 'completed' : task.completed});
          }
          taskData = list;
          setTasks(list);

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
    setTasks([...tasks, newTask]);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    console.log('ChainID : ',provider);
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
  