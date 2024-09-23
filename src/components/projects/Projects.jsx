import React, { useEffect, useState } from "react";
import { reactAppBackendUrl } from "../../env/envoriment";
import axios, { AxiosError } from "axios";
import "./Projects.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [initialDate, setInitialDate] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const [editProjectId, setEditProjectId] = useState(null);
  const [userRole, setUserRole] = useState("MANAGER");
  const navigate = useNavigate();

  const backToDashboard = () => {
    navigate("/dashboard");
  };

  const startEditingProject = (project) => {
    setEditProjectId(project.id);
    setName(project.name);
    setDescription(project.description);
    setInitialDate(new Date(project.initialDate).toISOString().split("T")[0]); // Exibir apenas a data
    setFinalDate(new Date(project.finalDate).toISOString().split("T")[0]);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodeToken = jwtDecode(token);
      setUserRole(decodeToken.role);
    }
  }, []);

  const addProject = async (e) => {
    e.preventDefault();
    await axios
      .post(
        `${reactAppBackendUrl}/projects`,
        {
          name,
          description,
          initialDate: initialDate ? new Date(initialDate).toISOString() : null,
          finalDate: finalDate ? new Date(finalDate).toISOString() : null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .then((response) => {
        setProjects([...projects, response.data]);
        setName("");
        setDescription("");
        setInitialDate("");
        setFinalDate("");
        alert("Projeto adicionado com sucesso");
      })
      .catch((error) => {
        console.log("Erro ao adicionar projeto", error);
        throw new AxiosError({
          message: error.message,
        });
      });
  };

  const getAllProjects = async () => {
    await axios
      .get(`${reactAppBackendUrl}/projects`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setProjects(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log("Erro ao buscar projetos", error);
        throw new AxiosError({
          message: error.message,
        });
      });
  };

  const editProject = async (e) => {
    e.preventDefault();
    const updatedProject = {
      name: name,
      description: description,
      initialDate: initialDate ? new Date(initialDate).toISOString() : null,
      finalDate: finalDate ? new Date(finalDate).toISOString() : null,
    };
    await axios
      .patch(
        `${reactAppBackendUrl}/projects/${editProjectId}`,
        {
          updatedProject,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )
      .then((response) => {
        alert("Projeto editado com sucesso");
        setProjects(
          projects.map((project) =>
            project.id === editProjectId ? response.data : project,
          ),
        );
        setEditProjectId(null);
        setName("");
        setDescription("");
        setInitialDate("");
        setFinalDate("");
      })
      .catch((error) => {
        console.log("Erro ao editar projeto", error);
        throw new AxiosError({
          message: error.message,
        });
      });
  };

  const deleteProject = async (id) => {
    await axios
      .delete(`${reactAppBackendUrl}/projects/${+id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setProjects(projects.filter((project) => project.id !== id));
        alert("Projeto excluído com sucesso");
        return response.data;
      })
      .catch((error) => {
        throw new AxiosError({
          message: error.message,
        });
      });
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <div className="projects-container">
      {userRole === "ADMIN" ||
        (userRole === "MANAGER" && (
          <form
            onSubmit={
              editProjectId
                ? () => () => editProject(editProjectId)
                : addProject
            }
            className="projects-form"
          >
            <div className="back-to-dashboard" onClick={backToDashboard}>
              <FontAwesomeIcon icon={faArrowLeft} size="lg" />
              <span>Voltar</span>
            </div>

            <h1 className="projects-title">Projetos</h1>
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
            <button type="submit" className="projects-button-create">
              {editProjectId ? "Editar Projeto" : "Adicionar Projeto"}
            </button>
          </form>
        ))}

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
                {editProjectId === project.id ? (
                  // Exibir o botão de salvar quando estiver editando
                  <button
                    className="projects-button-edit"
                    onClick={editProject}
                  >
                    Salvar
                  </button>
                ) : (
                  // Exibir o botão de editar se não estiver editando
                  <button
                    className="projects-button-edit"
                    onClick={() => startEditingProject(project)}
                  >
                    Editar
                  </button>
                )}
              </td>
              <td>
                <button
                  className="projects-button-delete"
                  onClick={() => deleteProject(project.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
