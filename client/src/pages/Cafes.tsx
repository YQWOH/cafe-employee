// export default function Cafes() {
//   return <h1>Cafes Page</h1>;
// }
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCafes, deleteCafe } from "../services/cafeService";
import { AgGridReact } from "ag-grid-react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Cafes() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch cafes data using the correct object format for useQuery
  const { data: cafes, isLoading } = useQuery({
    queryKey: ["cafes"],
    queryFn: getCafes,
  });

  // Mutation for deleting a cafe
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCafe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes"] }); // Corrected
    },
  });

  const columns = [
    {
      headerName: "Logo",
      field: "logo",
      cellRenderer: "imageRenderer",
      flex: 1,
    }, // You can customize this later
    { headerName: "Name", field: "name", flex: 1 },
    { headerName: "Description", field: "description", flex: 1 },
    { headerName: "Employees", field: "employees", flex: 1 },
    { headerName: "Location", field: "location", flex: 1 },
    {
      headerName: "Actions",
      cellRenderer: (params: any) => (
        <div>
          <Button onClick={() => navigate(`/cafe/${params.data.id}/edit`)}>
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
    if (window.confirm("Are you sure you want to delete this café?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container">
      <Button onClick={() => navigate("/cafe/new")}>Add New Café</Button>
      <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
        <AgGridReact rowData={cafes} columnDefs={columns} />
      </div>
    </div>
  );
}
