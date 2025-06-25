import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  TextField,
  Button,
  Box,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/CheckCircle";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { blue, grey } from "@mui/material/colors";

type Task = { id: number; title: string; is_done: boolean };

export default function TasksPage() {
  const qc = useQueryClient();
  const { logout, email } = useContext(AuthContext);
  if (!email) {
    console.log("NO EMAIL")
  }
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const editInput = useRef<HTMLInputElement>(null);

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: () => api.get("/tasks").then((r) => r.data),
  });

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

  const rename = useMutation({
    mutationFn: ({ id, title }: { id: number; title: string }) =>
      api.put(`/tasks/${id}`, { title }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  useEffect(() => {
    if (editingId !== null) editInput.current?.focus();
  }, [editingId]);

  return (
    <Box maxWidth={520} mx="auto" mt={5}>
      {/* ───── шапка ───── */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box fontWeight={600}>{email}</Box>
        <Button onClick={logout} size="small" variant="outlined">
          Выйти
        </Button>
      </Box>

      {/* ───── форма добавления ───── */}
      <Box display="flex" gap={1} mb={2}>
        <TextField
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Новая задача"
          size="small"
        />
        <Button
          variant="contained"
          onClick={() => create.mutate()}
          disabled={!title.trim()}
        >
          +
        </Button>
      </Box>

      {/* ───── список задач ───── */}
      <List>
        <AnimatePresence>
          {tasks.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              <ListItem
                sx={{
                  bgcolor: t.is_done ? grey[100] : "background.paper",
                  borderRadius: 1,
                  mb: 1,
                }}
                secondaryAction={
                  <>
                    <IconButton onClick={() => setEditingId(t.id)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => remove.mutate(t.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                }
              >
                <Checkbox
                  edge="start"
                  checked={t.is_done}
                  icon={<Chip label="todo" size="small" />}
                  checkedIcon={<DoneIcon sx={{ color: blue[600] }} />}
                  onChange={() => toggle.mutate(t)}
                />

                {editingId === t.id ? (
                  <TextField
                    inputRef={editInput}
                    defaultValue={t.title}
                    size="small"
                    variant="standard"
                    onBlur={(e) => {
                      rename.mutate({ id: t.id, title: e.target.value });
                      setEditingId(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        (e.target as HTMLInputElement).blur();
                    }}
                    sx={{ flex: 1 }}
                  />
                ) : (
                  <ListItemText
                    primary={t.title}
                    sx={{
                      textDecoration: t.is_done ? "line-through" : "none",
                    }}
                  />
                )}
              </ListItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </List>
    </Box>
  );
}
