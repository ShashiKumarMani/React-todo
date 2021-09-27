const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("TodoList", function () {
  

  let TodoList ;
  let todo;

  it('Initial Task Count', async function () {
    TodoList = await ethers.getContractFactory('TodoList');
    todo = await TodoList.deploy();
    await todo.deployed();

    expect(await todo.taskCount()).to.equal(0);
  });

  it('Create Task', async function () {
    const tx = await todo.createTask('xyz');
    await tx.wait();
    const taskCount = await todo.taskCount();
    expect(taskCount).to.equal(1);

    expect(Array(await todo.readTask(taskCount))[0][1]).to.equal('xyz');
  });

  it('Toggle task', async function () {
    const tx = await todo.createTask('xyz');
    await tx.wait();
    const taskCount = await todo.taskCount();
    expect(Array(await todo.readTask(taskCount))[0][2]).to.equal(false);

    await todo.toggleTask(taskCount);
    expect(Array(await todo.readTask(taskCount))[0][2]).to.equal(true);
  });

  it('Delete Task', async function() {
    let taskCount = await todo.taskCount();

    await todo.deleteTask(taskCount);
    taskCount = await todo.taskCount();
    expect(await todo.taskCount()).to.equal(1);
  });
});