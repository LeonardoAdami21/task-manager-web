// src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // opcional, para estilização da página

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
      <footer className="home-footer">
        <p>&copy; 2023 Gerenciador de Tarefas. Todos os direitos reservados.</p>
        <p>Desenvolvido por: Leonardo Adami</p>
      </footer>
    </div>
  );
}

export default Home;
