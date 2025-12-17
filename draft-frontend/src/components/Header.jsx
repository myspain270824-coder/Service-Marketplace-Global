import { Link } from "react-router-dom";

export default function Header() {
  const linkStyle = {
    marginRight: "15px",
    textDecoration: "none",
    color: "#61dafb",
    fontWeight: "bold",
  };

  return (
    <header
      style={{
        background: "#20232a",
        padding: "15px 20px",
        marginBottom: "20px",
      }}
    >
      <nav>
        <Link to="/" style={linkStyle}>
          Главная
        </Link>
        <Link to="/categories" style={linkStyle}>
          Категории
        </Link>
        <Link to="/about" style={linkStyle}>
          О нас
        </Link>
      </nav>
    </header>
  );
}
