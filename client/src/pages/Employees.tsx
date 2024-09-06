// export default function Employees() {
//   return <h1>Employees Page</h1>;
// }
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEmployees, deleteEmployee } from "../services/employeeService";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ColDef } from "ag-grid-community";

// interface Employee {
//   id: string;
//   name: string;
//   email_address: string;
//   phone_number: string;
//   days_worked: number;
//   cafe: string;
// }

export default function Employees() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch employees data
  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: getEmployees,
  });

  // Mutation for deleting an employee
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });

  const columns: ColDef[] = [
    { headerName: "Employee ID", field: "id", flex: 0.8 },
    { headerName: "Name", field: "name", flex: 1 },
    { headerName: "Email", field: "email_address", flex: 1 },
    { headerName: "Phone Number", field: "phone_number", flex: 0.5 },
    { headerName: "Days Worked", field: "days_worked", flex: 0.5 },
    { headerName: "Café Name", field: "cafe", flex: 1 },
    {
      headerName: "Actions",
      cellRenderer: (params: any) => (
        <div>
          <Button onClick={() => navigate(`/employee/${params.data.id}/edit`)}>
            Edit
          </Button>
          <Button color="error" onClick={() => handleDelete(params.data.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container">
      <Button onClick={() => navigate("/employee/new")}>
        Add New Employee
      </Button>
      <div className="ag-theme-alpine" style={{ height: 400 }}>
        <AgGridReact rowData={employees} columnDefs={columns} />
      </div>
    </div>
  );
}
