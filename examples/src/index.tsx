import { useState } from "react";
import { createRoot } from "react-dom/client";
import Filter from "../../src";
import type { Condition, Field } from "../../src";
import ThemeToggle from "./ThemeToggle";

import "./demo.css";

const fields: Field[] = [
  { id: "lastname", type: "text", label: "Lastname" },
  { id: "firstname", type: "text", label: "Firstname" },
  { id: "active", type: "boolean", label: "Is active" },
  { id: "age", type: "number", label: "Age" },
  { id: "bday", type: "date", label: "Birthday" },
  {
    id: "category",
    type: "list",
    label: "Category",
    list: [
      { id: "1", text: "Family" },
      { id: "2", text: "Friends" },
      { id: "3", text: "Business" },
      { id: "4", text: "Acquaintances" },
      { id: "5", text: "Other" },
    ],
  },
];

const App = () => {
  const [conditions, setConditions] = useState<Condition[]>([]);

  return (
    <div>
      <Filter fields={fields} onChange={setConditions} />
      <pre className="filter-json">{JSON.stringify(conditions, null, 2)}</pre>
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}

const themeToggleContainer = document.getElementById("theme-toggle");
if (themeToggleContainer) {
  createRoot(themeToggleContainer).render(<ThemeToggle />);
}
