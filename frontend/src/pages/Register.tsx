import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { AxiosError } from "axios";
import { useState } from "react";

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

  /* ----- локальный стейт для SnackBar ----- */
  type Snack = { text: string; ok: boolean };
  const [msg, setMsg] = useState<Snack | null>(null);
  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/auth/register", data);
      setMsg({ text: "Регистрация успешна!", ok: true });

      // дайте пользователю увидеть уведомление 1 сек → затем редирект
      setTimeout(() => navigate("/login"), 1000);
    } catch (err: unknown) {
    const error = err as AxiosError<{ detail?: string }>;
    setMsg({
      text:
        error?.response?.data?.detail === "Email already registered"
          ? "Такой e-mail уже есть"
          : "Ошибка регистрации",
      ok: false,
    });
    }
  };

  return (
    <Box maxWidth={360} mx="auto" mt={8}>
      <Typography variant="h5" mb={2}>
        Регистрация
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField fullWidth label="Email" {...register("email")} />

        <TextField
          fullWidth
          type="password"
          label="Пароль"
          sx={{ mt: 2 }}
          {...register("password")}
          error={!!formState.errors.password}
          helperText={formState.errors.password && "Минимум 8 символов"}
        />

        <Button fullWidth variant="contained" sx={{ mt: 3 }} type="submit">
          Зарегистрироваться
        </Button>
      </form>

      {/* ----- Snackbar ----- */}
        {msg && (
        <Snackbar
            open
            autoHideDuration={2500}
            onClose={() => setMsg(null)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert
            severity={msg.ok ? "success" : "error"}
            variant="filled"
            onClose={() => setMsg(null)}
            sx={{ width: "100%" }}
            >
            {msg.text}
            </Alert>
        </Snackbar>
        )}

    </Box>
  );
}
