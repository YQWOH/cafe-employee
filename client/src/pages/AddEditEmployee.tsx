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
import dayjs from "dayjs";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

export default function AddEditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: cafes, isLoading } = useQuery({
    queryKey: ["cafes"],
    queryFn: getCafes,
  });

  const { data: employee } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => getEmployeeById(id!),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    trigger,
    watch
  } = useForm({
    defaultValues: {
      name: "",
      email_address: "",
      phone_number: "",
      gender: "",
      cafe_id: "",
      start_date: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createOrUpdateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      navigate("/employees");
    },
  });

  useEffect(() => {
    if (employee) {
      setValue("name", employee.name);
      setValue("email_address", employee.email_address);
      setValue("phone_number", employee.phone_number);
      setValue("gender", employee.gender.toLowerCase());
      setValue("cafe_id", String(employee.cafe_id));
      setValue("start_date", employee.start_date ? dayjs(employee.start_date).format("YYYY-MM-DD") : "");
      trigger();
    }
  }, [employee, setValue, trigger]);

  const onSubmit = (data: any) => {
    console.log('data: ', data);
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

  if (isLoading) return <p>Loading...</p>;

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
          value={watch("gender")}
          onChange={(e) => setValue("gender", e.target.value)}
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
        <Select
          labelId="cafe-label"
          value={watch("cafe_id")}
          {...register("cafe_id")}
          fullWidth
        >
          <MenuItem value="">None</MenuItem>
          {cafes?.map((cafe: any) => (
            <MenuItem key={cafe.id} value={String(cafe.id)}>
              {cafe.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={watch("start_date") ? dayjs(watch("start_date")) : null}
            onChange={(newValue) => {
              if (newValue) {
                setValue("start_date", newValue.format("YYYY-MM-DD"));
              }
            }}
          />
        </LocalizationProvider>
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
