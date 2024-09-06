import { useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCafeById, createOrUpdateCafe } from "../services/cafeService"; // Assume these exist

export default function AddEditCafe() {
  const navigate = useNavigate();
  const { id } = useParams(); // Check if we're in edit mode
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      location: "",
    },
  });

  const { data: cafe } = useQuery({
    queryKey: ["cafe", id],
    queryFn: () => getCafeById(id!),
    enabled: !!id, // Only fetch when editing
  });

  const mutation = useMutation({
    mutationFn: createOrUpdateCafe, // Correctly use the mutation function
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cafes"] });
      navigate("/cafes");
    },
  });

  useEffect(() => {
    if (cafe) {
      setValue("name", cafe.name);
      setValue("description", cafe.description);
      setValue("location", cafe.location);
    }
  }, [cafe, setValue]);

  const onSubmit = (data: any) => {
    mutation.mutate({ ...data, id });
  };

  const handleCancel = () => {
    if (
      isDirty &&
      window.confirm("You have unsaved changes. Do you really want to leave?")
    ) {
      navigate("/cafes");
    } else if (!isDirty) {
      navigate("/cafes");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Name"
        {...register("name", {
          required: "Name is required",
          minLength: { value: 3, message: "Min 3 characters" },
          maxLength: { value: 50, message: "Max 50 characters" },
        })}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Description"
        {...register("description", {
          required: "Description is required",
          maxLength: { value: 256, message: "Max 256 characters" },
        })}
        error={!!errors.description}
        helperText={errors.description?.message}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />

      <TextField
        label="Location"
        {...register("location", { required: "Location is required" })}
        error={!!errors.location}
        helperText={errors.location?.message}
        fullWidth
        margin="normal"
      />

      <Button type="submit" variant="contained" color="primary">
        {id ? "Update Café" : "Add Café"}
      </Button>
      <Button
        onClick={handleCancel}
        variant="outlined"
        color="secondary"
        style={{ marginLeft: "10px" }}
      >
        Cancel
      </Button>
    </form>
  );
}
