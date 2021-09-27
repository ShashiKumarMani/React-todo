pragma solidity ^0.8.0;

contract TodoList {
  uint public taskCount = 0;

  struct Task {
    uint id;
    string content;
    bool completed;
  }

  event TaskCreated(
    uint id,
    string content,
    bool completed
  );

  event TaskToggled(
    uint id,
    string content,
    bool completed
  );

  event TaskDeleted(
    uint id,
    string content, 
    bool completed
  );
  
  mapping(uint => Task) public tasks;

  function createTask(string memory _content) public {
    taskCount ++;
    tasks[taskCount] = Task(taskCount, _content, false);
    emit TaskCreated(taskCount, _content, false);
  }

  function readTask(uint taskId) public view returns (Task memory task){
    require(taskId <= taskCount, 'ID value greater than total task count');
    require(tasks[taskId].id != 0, 'Task doesnt exist');
    return tasks[taskId];
  }

  function toggleTask(uint taskId) public {
    require(taskId <= taskCount, 'ID value greater than total task count');
    require(tasks[taskId].id != 0, 'Task doesnt exist');
    Task storage _task = tasks[taskId];
    _task.completed = !_task.completed;
    emit TaskToggled(taskId, _task.content, _task.completed);
  }

  function deleteTask(uint taskId) public {
    require(taskId <= taskCount, 'ID value greater than total task count');
    require(tasks[taskId].id != 0, 'Task doesnt exist');
    delete tasks[taskId];
    emit TaskDeleted(taskId, tasks[taskId].content, tasks[taskId].completed);
  }
}
