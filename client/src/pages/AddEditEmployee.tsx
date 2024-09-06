import { useForm } from "react-hook-form";
import {
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getEmployeeById,
  createOrUpdateEmployee,
  getCafes,
} from "../services/employeeService";

export default function AddEditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams(); // To check if it's edit mode
  const queryClient = useQueryClient();

  const { data: cafes } = useQuery({
    queryKey: ["cafes"],
    queryFn: getCafes,
  }); // Get list of cafés for dropdown

  const { data: employee } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => getEmployeeById(id!),
    enabled: !!id, // Prefill in edit mode only when `id` is defined
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      email_address: "",
      phone_number: "",
      gender: "",
      cafe: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createOrUpdateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] }); // Correct invalidateQueries format
      navigate("/employees");
    },
  });

  useEffect(() => {
    if (employee) {
      // Prefill the form if we're in edit mode
      setValue("name", employee.name);
      setValue("email_address", employee.email_address);
      setValue("phone_number", employee.phone_number);
      setValue("gender", employee.gender);
      setValue("cafe", employee.cafe);
    }
  }, [employee, setValue]);

  const onSubmit = (data: any) => {
    mutation.mutate({ ...data, id });
  };

  const handleCancel = () => {
    if (
      isDirty &&
      window.confirm("You have unsaved changes. Do you really want to leave?")
    ) {
      navigate("/employees");
    } else if (!isDirty) {
      navigate("/employees");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Name"
        {...register("name", {
          required: "Name is required",
          minLength: { value: 6, message: "Min 6 characters" },
          maxLength: { value: 10, message: "Max 10 characters" },
        })}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Email"
        {...register("email_address", {
          required: "Email is required",
          pattern: {
            value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
            message: "Invalid email",
          },
        })}
        error={!!errors.email_address}
        helperText={errors.email_address?.message}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Phone Number"
        {...register("phone_number", {
          required: "Phone number is required",
          pattern: { value: /^[89]\d{7}$/, message: "Invalid SG phone number" },
        })}
        error={!!errors.phone_number}
        helperText={errors.phone_number?.message}
        fullWidth
        margin="normal"
      />

      <FormControl component="fieldset" margin="normal">
        <RadioGroup
          row
          {...register("gender", { required: "Gender is required" })}
        >
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="female" control={<Radio />} label="Female" />
        </RadioGroup>
        {errors.gender && (
          <p style={{ color: "red" }}>{errors.gender.message}</p>
        )}
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="cafe-label">Assigned Café (Optional)</InputLabel>
        <Select labelId="cafe-label" {...register("cafe")}>
          <MenuItem value="">None</MenuItem>
          {cafes?.map((cafe: any) => (
            <MenuItem key={cafe.id} value={cafe.id}>
              {cafe.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" color="primary">
        {id ? "Update Employee" : "Add Employee"}
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
