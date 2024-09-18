// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // opcional, para estilização da página
import Footer from "../components/footer/Footer";

/**
 * A React functional component that renders the home page of the task manager application.
 *
 * It includes a header with a welcome message and navigation links to login and register pages.
 * A section that highlights the main features of the application.
 * A footer with copyright information and the developer's name.
 *
 * @return {JSX.Element} The JSX element representing the home page.
 */

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Bem-vindo ao Gerenciador de Tarefas</h1>
        <p>Organize suas tarefas diárias de forma simples e eficiente.</p>
        <div className="home-buttons">
          <Link to="/login" className="home-button">
            Login
          </Link>
          <Link to="/register" className="home-button">
            Cadastre-se
          </Link>
        </div>
      </header>
      <section className="home-features">
        <h2>Principais Funcionalidades</h2>
        <ul>
          <li>Crie, edite e exclua tarefas facilmente.</li>
          <li>Marque tarefas como concluídas.</li>
          <li>Acesse sua lista de tarefas de qualquer dispositivo.</li>
          <li>Interface intuitiva e responsiva.</li>
        </ul>
      </section>
      <Footer />
    </div>
  );
}

export default Home;
