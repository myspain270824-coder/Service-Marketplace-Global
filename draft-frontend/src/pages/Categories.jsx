import { useEffect, useState } from "react";
import { fetchAPI } from "../api";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      const data = await fetchAPI("/api/categories");
      if (data) setCategories(data);
    }
    loadCategories();
  }, []);

  return (
    <div>
      <h1>Категории услуг</h1>
      {categories.length === 0 ? (
        <p>Загрузка...</p>
      ) : (
        <ul>
          {categories
            .filter(
              (item, index, self) =>
                index === self.findIndex((t) => t.name === item.name)
            )
            .map((cat) => (
              <li key={cat.id}>
                <b>{cat.name}</b> — {cat.description}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
