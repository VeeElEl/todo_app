import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export default function Register() {
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    await api.post("/auth/register", data);
    navigate("/login");
  };

  return (
    <Box maxWidth={360} mx="auto" mt={8}>
      <Typography variant="h5" mb={2}>Регистрация</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField fullWidth label="Email" {...register("email")} />
        <TextField
          fullWidth type="password" label="Пароль" sx={{ mt: 2 }}
          {...register("password")}
        />
        {formState.errors.password && (
          <Typography color="error">Минимум 8 символов</Typography>
        )}
        <Button fullWidth variant="contained" sx={{ mt: 3 }} type="submit">
          Зарегистрироваться
        </Button>
      </form>
    </Box>
  );
}
