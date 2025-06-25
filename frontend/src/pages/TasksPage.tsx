import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { TextField, Button, Box, Checkbox, IconButton, List, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type Task = { id: number; title: string; is_done: boolean };

export default function TasksPage() {
  const qc = useQueryClient();
  const { logout } = useContext(AuthContext);
  const [title, setTitle] = useState("");

  const { data: tasks } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => api.get("/tasks").then(r => r.data),});

const create = useMutation({
  mutationFn: () => api.post("/tasks", { title }),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["tasks"] });
    setTitle("");
  },
});

const toggle = useMutation({
  mutationFn: (task: Task) =>
    api.put(`/tasks/${task.id}`, { ...task, is_done: !task.is_done }),
  onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
});

const remove = useMutation({
  mutationFn: (id: number) => api.delete(`/tasks/${id}`),
  onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
});

  return (
    <Box maxWidth={480} mx="auto" mt={4}>
      <Box display="flex" gap={1}>
        <TextField fullWidth value={title} onChange={e => setTitle(e.target.value)} label="Новая задача" />
        <Button variant="contained" onClick={() => create.mutate()} disabled={!title.trim()}>
          Добавить
        </Button>
      </Box>

      <List>
        <AnimatePresence>
          {tasks?.map((t: Task) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ListItem
                secondaryAction={
                  <IconButton onClick={() => remove.mutate(t.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <Checkbox checked={t.is_done} onChange={() => toggle.mutate(t)} />
                <ListItemText
                  primary={t.title}
                  sx={{ textDecoration: t.is_done ? "line-through" : "none" }}
                />
              </ListItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </List>

      <Button onClick={logout} sx={{ mt: 2 }}>
        Выйти
      </Button>
    </Box>
  );
}
