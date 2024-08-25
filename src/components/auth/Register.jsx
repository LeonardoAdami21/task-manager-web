import axios, { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";
import { reactAppBackendUrl } from "../../env/envoriment";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${reactAppBackendUrl}/register`, {
        name,
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      alert(error);
      throw new HttpStatusCode(400, "Bad request");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>
        Name:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
