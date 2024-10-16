import { useForm } from "react-hook-form";
import { Button, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCafeById, createOrUpdateCafe } from "../services/cafeService";

export default function AddEditCafe() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    trigger
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      location: "",
    },
  });

  const { data: cafe, isLoading } = useQuery({
    queryKey: ["cafe", id],
    queryFn: () => getCafeById(id!),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: createOrUpdateCafe,
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
      trigger();
    }
  }, [cafe, setValue, trigger]);

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

  if (isLoading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Name"
        {...register("name", {
          required: "Name is required",
          minLength: { value: 3, message: "Min 3 characters" },
          maxLength: { value: 50, message: "Max 50 characters" },
          pattern: {
            value: /^[a-zA-Z\s]*$/,
            message: "Invalid name",
          },
          onChange: (e) => {
            const value = e.target.value;
            const isValid = /^[a-zA-Z\s]*$/.test(value);

            if (isValid) {
              setValue("name", value, { shouldValidate: true });
            }
            trigger("name");
          }
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
