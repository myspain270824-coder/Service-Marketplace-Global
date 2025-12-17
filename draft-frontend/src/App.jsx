import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import About from "./pages/About";

function App() {
  return (
    <>
      <Header />
      <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
