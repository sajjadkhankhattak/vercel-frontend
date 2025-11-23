import { Link } from "react-router-dom";

function Menu() {
  return (
    <>
      <Link to="/" className="me-3">Landing Page</Link>
      <Link to="/workers" className="me-3">Workers</Link>
      <Link to="/admin" className="me-3">Admin</Link>
      <Link to="/create-quiz" className="me-3">Create Quiz</Link>
      <Link to="/login" className="me-3">Login</Link>
      <Link to="/signup" className="me-3">Signup</Link>
      <Link to="/contact" className="me-3">Contact</Link>
    </>
  );
}

export default Menu;