import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { reactAppBackendUrl } from "../../env/envoriment";
import "./Task.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [priority, setPriorities] = useState("low" || "medium" || "high");
  const [status, setStatuses] = useState(
    "pending" || "in_progress" || "completed",
  );
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: priority,
    status: status,
  });

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
        throw error;
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
      setNewTask({ title: "", description: "", priority: "", status: "" });
    } catch (error) {
      console.error("Erro ao adicionar tarefa", error);
    }
  };

  const markTaskAsCompleted = async (id) => {
    const status = "completed";
    try {
      await axios.patch(
        `${reactAppBackendUrl}/tasks/finish/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setTasks(
        tasks.map((task) => (task.id === id ? { ...task, status } : task)),
      );
      alert("Tarefa completada com sucesso!");
    } catch (error) {
      console.error("Erro ao marcar tarefa como concluída", error);
    }
  };

  const editTask = async (id) => {
    try {
      await axios.patch(`${reactAppBackendUrl}/tasks/${+id}`, editingTask, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(
        tasks.map((task) =>
          task.id === +id ? { ...task, ...editingTask } : task,
        ),
      );
      setEditingTask(null);
      alert("Tarefa editada com sucesso!");
    } catch (error) {
      console.error("Erro ao editar tarefa", error);
      throw new AxiosError(error.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${reactAppBackendUrl}/tasks/${+taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(tasks.filter((task) => task.id !== +taskId));
      alert("Tarefa excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir tarefa", error);
    }
  };

  const handleEditClick = (tasks) => {
    setEditingTask(tasks);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  return (
    <div className="task-manager">
      <h1>Gerenciamento de Tarefas</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {editingTask && editingTask.id === task.id ? (
              <div>
                <input
                  type="text"
                  name="title"
                  value={editingTask.title}
                  onChange={handleInputChange}
                />
                <textarea
                  type="text"
                  name="description"
                  value={editingTask.description}
                  onChange={handleInputChange}
                ></textarea>
                <select
                  id="priority"
                  aria-label="Selecione Prioridade"
                  name="priority"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alt</option>
                </select>
                <button onClick={() => editTask(task.id)}>
                  <FontAwesomeIcon icon={faCheck} /> Editar
                </button>
                <button onClick={() => setEditingTask(null)}> Cancelar</button>
              </div>
            ) : (
              <div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>{task.priority}</p>
                <p>{task.status}</p>
                <button onClick={() => markTaskAsCompleted(task.id)}>
                  <FontAwesomeIcon icon={faCheck} />
                </button>
                <button onClick={() => handleEditClick(task)}>
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="delete" onClick={() => deleteTask(task.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            )}
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

        <select name="priority" id="priority" aria-label="Selecione Prioridade">
          <option value="low">Baixa</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
        <select name="status" id="status" aria-label="Selecione Status">
          <option value="pending">Pendente</option>
          <option value="in_progress">Em Andamento</option>
          <option value="completed">Concluída</option>
        </select>
        {tasks.length === 0 && (
          <div
            className="add-task-card"
            onClick={() =>
              setEditingTask({
                title: "",
                description: "",
                priority: "",
                status: "",
              })
            }
          >
            Adicione uma nova tarefa
          </div>
        )}
        <button type="submit">Adicionar Tarefa</button>
      </form>
    </div>
  );
};

export default TaskManager;
