import React, { useState, useEffect } from "react";
import axios, { AxiosError, HttpStatusCode } from "axios";
import { reactAppBackendUrl } from "../../env/envoriment";
import "./Task.css"; // Certifique-se de adicionar o CSS necessário
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [priority, setPriority] = useState("low");
  const [projectId, setProjectId] = useState(0);
  const [status, setStatus] = useState("pending");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "low",
    status: "pending",
    projectId: 0,
  });
  const [userRole, setUserRole] = useState("");

  // Decodificando o token para obter o userRole
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role); // Exemplo: "MANAGER", "USER"
    }
  }, []);

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
        throw new AxiosError(error.message);
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
      setNewTask({
        title: "",
        description: "",
        priority: "low",
        status: "pending",
        projectId: 0,
      });
    } catch (error) {
      console.error("Erro ao adicionar tarefa", error);
      throw new AxiosError(error.message);
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
      throw new AxiosError(error.message);
    }
  };

  const editTask = async (id) => {
    try {
      await axios.patch(`${reactAppBackendUrl}/tasks/${id}`, editingTask, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, ...editingTask } : task,
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
      await axios.delete(`${reactAppBackendUrl}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(tasks.filter((task) => task.id !== taskId));
      alert("Tarefa excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir tarefa", error);
      throw new AxiosError(error.message);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
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
      <div className="row">
        {tasks.map((task) => (
          <div key={task.id} className="task-col">
            <div className="card">
              <div className="card-body">
                {editingTask && editingTask.id === task.id ? (
                  <div>
                    <input
                      type="text"
                      name="title"
                      value={editingTask.title}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                    <textarea
                      type="text"
                      name="description"
                      value={editingTask.description}
                      onChange={handleInputChange}
                      className="form-control mt-2"
                    ></textarea>
                    <select
                      name="priority"
                      value={editingTask.priority}
                      onChange={handleInputChange}
                      className="form-select mt-2"
                    >
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                    </select>
                    <button
                      onClick={() => editTask(task.id)}
                      className="btn btn-success mt-2"
                    >
                      <FontAwesomeIcon icon={faCheck} /> Salvar
                    </button>
                    <button
                      onClick={() => setEditingTask(null)}
                      className="btn btn-secondary mt-2 ml-2"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div>
                    <h5 className="card-title">{task.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      Prioridade: {task.priority}
                    </h6>
                    <p className="card-text">{task.description}</p>
                    <p className="card-text">
                      Status:{" "}
                      <span
                        className={
                          task.status === "completed" ? "text-success" : ""
                        }
                      >
                        {task.status}
                      </span>
                    </p>
                    <p className="card-text">Projeto: {task.projectId}</p>

                    <button
                      onClick={() => markTaskAsCompleted(task.id)}
                      className="btn btn-primary"
                    >
                      <FontAwesomeIcon icon={faCheck} /> Completar
                    </button>

                    {userRole === "MANAGER" && (
                      <>
                        <button
                          onClick={() => handleEditClick(task)}
                          className="btn btn-warning ml-2"
                        >
                          <FontAwesomeIcon icon={faEdit} /> Editar
                        </button>
                        <button
                          className="btn btn-danger ml-2"
                          onClick={() => deleteTask(task.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Deletar
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={addTask} className="mt-4">
        <input
          type="text"
          placeholder="Título"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="form-control"
        />
        <textarea
          placeholder="Descrição"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          className="form-control mt-2"
        ></textarea>
        <input
          type="number"
          name="projectId"
          placeholder="ID do Projeto"
          value={newTask.projectId}
          onChange={(e) =>
            setNewTask({ ...newTask, projectId: e.target.value })
          }
          className="form-control mt-2"
        />
        <select
          name="priority"
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          className="form-select mt-2"
        >
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>
        <select
          name="status"
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          className="form-select mt-2"
        >
          <option value="pending">Pendente</option>
          <option value="in_progress">Em Andamento</option>
          <option value="completed">Concluída</option>
        </select>
        <button type="submit" className="btn btn-success mt-3">
          Adicionar Tarefa
        </button>
      </form>
    </div>
  );
};

export default TaskManager;
