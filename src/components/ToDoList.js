import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  
import axios from "axios";
import "./ToDoList.css";

const ToDoList = () => {
  const navigate = useNavigate();  
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskAge, setTaskAge] = useState("");
  const [taskWork, setTaskWork] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [editTaskAge, setEditTaskAge] = useState("");
  const [editTaskWork, setEditTaskWork] = useState("");
  const [editTaskPriority, setEditTaskPriority] = useState("medium");
  const [editTaskDueDate, setEditTaskDueDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3001/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    try {
      const response = await axios.post("http://localhost:3001/tasks", {
        name: taskName,
        age: taskAge,
        work: taskWork,
        priority: taskPriority,
        due_date: taskDueDate,
        userId: 1,
      });
      fetchTasks();
      setTaskName("");
      setTaskAge("");
      setTaskWork("");
      setTaskPriority("medium");
      setTaskDueDate("");
    } catch (error) {
      console.error("Error adding task:", error.message, error);
    }
  };

  const updateTask = async (id) => {
    try {
      await axios.put(`http://localhost:3001/tasks/${id}`, {
        name: editTaskName,
        age: editTaskAge,
        work: editTaskWork,
        priority: editTaskPriority,
        due_date: editTaskDueDate,
      });
      setEditTaskId(null);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const logout = () => {
    localStorage.removeItem('user'); 
    navigate("/login"); 
    window.location.reload(); 
  };
  
  
  
  return (
    <div className="todo-list-container">
      <h1 className="todo-list-title">ToDo List</h1>

      <div className="logout-container">
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="search-container">
        <input
          className="form-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Task Name"
        />
      </div>

      <div className="form-container">
        <h3 className="form-title">Add Task</h3>
        <input
          className="form-input"
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task Name"
        />
        <input
          className="form-input"
          type="number"
          value={taskAge}
          onChange={(e) => setTaskAge(e.target.value)}
          placeholder="Age"
        />
        <input
          className="form-input"
          type="text"
          value={taskWork}
          onChange={(e) => setTaskWork(e.target.value)}
          placeholder="Work"
        />
        <select
          className="form-select"
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          className="form-input"
          type="date"
          value={taskDueDate}
          onChange={(e) => setTaskDueDate(e.target.value)}
        />
        <button className="form-button" onClick={addTask}>
          Add Task
        </button>
      </div>

      {editTaskId && (
        <div className="form-container">
          <h3 className="form-title">Edit Task</h3>
          <input
            className="form-input"
            type="text"
            value={editTaskName}
            onChange={(e) => setEditTaskName(e.target.value)}
            placeholder="Task Name"
          />
          <input
            className="form-input"
            type="number"
            value={editTaskAge}
            onChange={(e) => setEditTaskAge(e.target.value)}
            placeholder="Age"
          />
          <input
            className="form-input"
            type="text"
            value={editTaskWork}
            onChange={(e) => setEditTaskWork(e.target.value)}
            placeholder="Work"
          />
          <select
            className="form-select"
            value={editTaskPriority}
            onChange={(e) => setEditTaskPriority(e.target.value)}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input
            className="form-input"
            type="date"
            value={editTaskDueDate}
            onChange={(e) => setEditTaskDueDate(e.target.value)}
          />
          <button
            className="form-button"
            onClick={() => updateTask(editTaskId)}
          >
            Update Task
          </button>
        </div>
      )}

      <ul>
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className={`task-item 
              ${task.priority === "high" ? "priority-high" : ""} 
              ${task.priority === "medium" ? "priority-medium" : ""} 
              ${task.priority === "low" ? "priority-low" : ""}`}
          >
            {task.name} - {task.work} - {task.priority} - {task.due_date}
            <button
              onClick={() => {
                setEditTaskId(task.id);
                setEditTaskName(task.name);
                setEditTaskAge(task.age);
                setEditTaskWork(task.work);
                setEditTaskPriority(task.priority);
                setEditTaskDueDate(task.due_date);
              }}
            >
              Edit
            </button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
