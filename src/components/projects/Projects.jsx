import React, { useEffect, useState } from "react";
import { reactAppBackendUrl } from "../../env/envoriment";
import axios, { AxiosError } from "axios";
import "./Projects.css";
import { useNavigate } from "react-router-dom";

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [initialDate, setInitialDate] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const navigate = useNavigate();
  const newProject = async () => {
    await axios
      .post(`${reactAppBackendUrl}/projects`, {
        name,
        description,
        initialDate,
        finalDate,
      })
      .then((response) => {
        setName("");
        setDescription("");
        setInitialDate("");
        setFinalDate("");
        setProjects([...projects, response.data]);
      })
      .catch((error) => {
        throw new AxiosError({
          message: error.message,
        });
      });
  };

  const getAllProjects = async () => {
    await axios
      .get(`${reactAppBackendUrl}/projects`)
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        throw new Error({
          message: error.message,
        });
      });
  };

  const editProject = async (id) => {
    await axios
      .patch(`${reactAppBackendUrl}/projects/${id}`, {
        name,
        description,
        initialDate,
        finalDate,
      })
      .then((response) => {
        console.log(response.data);
        alert("Projeto editado com sucesso");
      })
      .catch((error) => {
        throw new Error({
          message: error.message,
        });
      });
  };

  const deleteProject = async (id) => {
    await axios
      .delete(`${reactAppBackendUrl}/projects/${id}`)
      .then((response) => {
        setProjects(projects.filter((project) => project.id !== id));
        console.log(response.data);
        alert("Projeto excluído com sucesso");
      })
      .catch((error) => {
        throw new AxiosError({
          message: error.message,
        });
      });
  };

  const logout = () => {
    localStorage.getItem("token");
    navigate("/tasks");
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <div className="projects-container">
      <button className="projects-button" onClick={logout}>
        Sair
      </button>
      <h1>Projetos</h1>
      <form onSubmit={newProject}>
        <input
          type="text"
          placeholder="Nome do Projeto"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descricão"
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="date"
          placeholder="Data Inicial"
          onChange={(e) => setInitialDate(e.target.value)}
        />
        <input
          type="date"
          placeholder="Data Final"
          onChange={(e) => setFinalDate(e.target.value)}
        />
        <button type="submit" className="projects-button">
          Adicionar Projeto
        </button>
        <button type="submit" className="projects-button" onClick={editProject}>
          Editar Projeto
        </button>
        <button
          type="submit"
          className="projects-button"
          onClick={deleteProject}
        >
          Excluir Projeto
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Nome do Projeto</th>
            <th>Descricão</th>
            <th>Data Inicial</th>
            <th>Data Final</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>{project.description}</td>
              <td>
                {project.initialDate
                  ? new Date(project.initialDate).toLocaleDateString()
                  : ""}
              </td>
              <td>
                {project.finalDate
                  ? new Date(project.finalDate).toLocaleDateString()
                  : ""}
              </td>
              <td>
                <button className="projects-button">Editar</button>
              </td>
              <td>
                <button className="projects-delete">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
