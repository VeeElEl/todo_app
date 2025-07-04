import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.post(
        "/auth/login",
        new URLSearchParams({
          username: data.email,
          password: data.password,
        })
      );
      login(res.data.access_token, data.email);
      navigate("/tasks");
    } catch {
      alert("Неверный e-mail или пароль");
    }
  };

  return (
    <Box maxWidth={360} mx="auto" mt={8}>
      <Typography variant="h5" mb={2}>
        Вход
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
            fullWidth
            label="Email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
        />

        <TextField
          fullWidth
          type="password"
          label="Пароль"
          sx={{ mt: 2 }}
          {...register("password")}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
        />
        
        <Button fullWidth variant="contained" sx={{ mt: 3 }} type="submit" disabled={!isValid}>
          Войти
        </Button>

        <Button
            fullWidth
            sx={{ mt: 1 }}
            variant="text"
            onClick={() => navigate("/register")}   // ← переход на страницу регистрации
        >
            Регистрация
        </Button>
      </form>
    </Box>
  );
}
