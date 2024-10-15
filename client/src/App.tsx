import { Routes, Route } from "react-router-dom";
import Cafes from "./pages/Cafes";
import Employees from "./pages/Employees";
import AddEditEmployee from "./pages/AddEditEmployee";
import AddEditCafe from "./pages/AddEditCafe";
import { Link } from "react-router-dom";
import { Button, Box } from "@mui/material";

function Home() {
  return (
    <Box textAlign="center" mt={5}>
      <h1>Welcome to the Café Employee Manager</h1>
      <Box mt={3}>
        <Button
          component={Link}
          to="/employees"
          variant="contained"
          color="primary"
          style={{ marginRight: 10 }}
        >
          Go to Employees
        </Button>
        <Button
          component={Link}
          to="/cafes"
          variant="contained"
          color="secondary"
        >
          Go to Cafes
        </Button>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cafes" element={<Cafes />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/employee/new" element={<AddEditEmployee />} />{" "}
      <Route path="/employee/:id/edit" element={<AddEditEmployee />} />{" "}
      <Route path="/cafe/new" element={<AddEditCafe />} />
      <Route path="/cafe/:id/edit" element={<AddEditCafe />} />
    </Routes>
  );
}
