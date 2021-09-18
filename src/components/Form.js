import React, { useState } from "react";

const Form = (props) => {

    const [ name, setName ] = useState('kumar!')
    
    function handleSubmit(e) {
        e.preventDefault();
        props.addTask(name);
        setName('');
        document.getElementById('new-todo').value = ''; 
    }
        
    function handleChange(e) {
        setName(e.target.value);
    }

    return (
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            id="new-todo"
            name="text"
            autoComplete="off"
            onChange={handleChange}
            placeholder="What needs to be done?"
        />
        <button type="submit">
            Add
        </button>
        </form>
    );
}

export default Form;