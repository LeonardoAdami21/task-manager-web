import React, { useState, useEffect } from "react";
import axios from "axios";
import { reactAppBackendUrl } from "../../env/envoriment";
import "./Task.css";
const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${reactAppBackendUrl}/tasks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Erro ao buscar tarefas", error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${reactAppBackendUrl}/tasks`,
        newTask,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setTasks([...tasks, response.data]);
      setNewTask({ title: "", description: "" });
    } catch (error) {
      console.error("Erro ao adicionar tarefa", error);
    }
  };

  const markTaskAsCompleted = async (id) => {
    const isFinished = true;
    try {
      await axios.patch(
        `${reactAppBackendUrl}/tasks/finish/${id}`,
        { isFinished },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setTasks(
        tasks.map((task) => (task.id === id ? { ...task, isFinished } : task)),
      );
      alert("Tarefa concluída com sucesso!");
    } catch (error) {
      console.error("Erro ao marcar tarefa como concluída", error);
    }
  };

  const editTask = async (taskId) => {
    const updatedTask = prompt(
      "Atualize a tarefa",
      tasks.find((task) => task.id === taskId).title,
    );
    if (updatedTask) {
      try {
        await axios.put(`${reactAppBackendUrl}/tasks/${taskId}`, {
          title: updatedTask,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, title: updatedTask } : task,
          ),
        );
        alert("Tarefa editada com sucesso!");
      } catch (error) {
        console.error("Erro ao editar tarefa", error);
      }
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${reactAppBackendUrl}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(tasks.filter((task) => task.id !== taskId));
      alert("Tarefa excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir tarefa", error);
    }
  };

  return (
    <div className="task-manager">
      <h1>Gerenciamento de Tarefas</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>{task.isFinished ? true : false}</p>
            <button onClick={() => markTaskAsCompleted(task.id)}>
              Concluir
            </button>
            <button onClick={() => editTask(task.id)}>Editar</button>
            <button className="delete" onClick={() => deleteTask(task.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Título"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          placeholder="Descrição"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        ></textarea>
        <button type="submit">Adicionar Tarefa</button>
      </form>
    </div>
  );
};

export default TaskManager;
