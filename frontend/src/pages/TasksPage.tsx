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
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import {
  useState,
  useContext,
  useEffect,
  useRef,
  Fragment,
} from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { blue, grey } from "@mui/material/colors";

type Task = {
  id: number;
  title: string;
  description?: string;
  is_done: boolean;
  created_at: string;
};

const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

export default function TasksPage() {
  const qc = useQueryClient();
  const { logout, email, login } = useContext(AuthContext);

  /* -------------------- local state -------------------- */
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDesc, setEditingDesc] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "done">(
    "all"
  );
  const [sort, setSort] = useState<"created" | "status">("created");

  const editTitleRef = useRef<HTMLInputElement>(null);

  /* -------------------- queries -------------------- */
  const { data: tasks = [], isFetching } = useQuery<Task[]>({
    queryKey: ["tasks", statusFilter, sort],
    queryFn: () =>
      api
        .get("/tasks", {
          params: {
            ...(statusFilter === "all" ? {} : { status: statusFilter === "done" }),
            sort,
          },
        })
        .then((r) => r.data),
  });

  /* -------------------- mutations -------------------- */
  const create = useMutation({
    mutationFn: () => api.post("/tasks", { title, description: desc }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      setTitle("");
      setDesc("");
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

  const update = useMutation({
    mutationFn: ({ id, title, description }: Task) =>
      api.put(`/tasks/${id}`, { title, description }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const isBusy =
    create.isPending ||
    toggle.isPending ||
    remove.isPending ||
    update.isPending ||
    isFetching;

  /* -------- задержка 300 мс, чтобы не мигало -------- */
    const [delayedBusy, setDelayedBusy] = useState(false);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;

        if (isBusy) {
            timer = setTimeout(() => setDelayedBusy(true), 300);
        } else {
            setDelayedBusy(false);
        }

        // ← здесь добавили фигурные скобки
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isBusy]);


  /* focus при старте редактирования */
  useEffect(() => {
    if (editingId !== null) editTitleRef.current?.focus();
  }, [editingId]);

  /* подтягиваем e-mail при F5 */
  useEffect(() => {
    if (!email) {
      api
        .get("/auth/me")
        .then((r) =>
          login(localStorage.getItem("token") ?? "", r.data.email as string)
        )
        .catch(() => logout());
    }
  }, [email, login, logout]);

  /* -------------------- helpers -------------------- */
  const startEdit = (t: Task) => {
    setEditingId(t.id);
    setEditingTitle(t.title);
    setEditingDesc(t.description ?? "");
  };

  const saveEdit = () => {
    if (editingId !== null)
      update.mutate({
        id: editingId,
        title: editingTitle,
        description: editingDesc,
        is_done: false,
        created_at: "", // не используется
      });
    setEditingId(null);
  };

  /* -------------------- UI -------------------- */
  return (
    <Box maxWidth={560} mx="auto" mt={5}>
      {/* шапка */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box fontWeight={600}>{email}</Box>
        <Button onClick={logout} size="small" variant="outlined">
          Выйти
        </Button>
      </Box>

      {/* фильтр + сортировка */}
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Tabs
          value={statusFilter}
          onChange={(_, v) => setStatusFilter(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ flexGrow: 1 }}
        >
          <Tab value="all" label="Все" />
          <Tab value="active" label="Активные" />
          <Tab value="done" label="Выполненные" />
        </Tabs>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="sort-label">Сортировка</InputLabel>
          <Select
            labelId="sort-label"
            label="Сортировка"
            value={sort}
            onChange={(e) => setSort(e.target.value as "created" | "status")}
          >
            <MenuItem value="created">По дате</MenuItem>
            <MenuItem value="status">По статусу</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* форма добавления */}
      <Box display="flex" flexDirection="column" gap={1} mb={2}>
        <TextField
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Заголовок"
          size="small"
        />
        <TextField
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          label="Описание"
          size="small"
          multiline
          minRows={2}
        />
        <Button
          variant="contained"
          onClick={() => create.mutate()}
          disabled={!title.trim()}
          sx={{ alignSelf: "flex-end", mt: 1 }}
        >
          +
        </Button>
      </Box>

      {/* список задач */}
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
                  alignItems: "flex-start",
                }}
                secondaryAction={
                  editingId === t.id ? (
                    <IconButton onClick={() => setEditingId(null)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  ) : (
                    <Fragment>
                      <IconButton onClick={() => startEdit(t)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => remove.mutate(t.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Fragment>
                  )
                }
              >
                <Checkbox
                  edge="start"
                  checked={t.is_done}
                  icon={<Chip label="todo" size="small" />}
                  checkedIcon={<DoneIcon sx={{ color: blue[600] }} />}
                  onChange={() => toggle.mutate(t)}
                  sx={{ mt: 0.5 }}
                />

                {editingId === t.id ? (
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      inputRef={editTitleRef}
                      fullWidth
                      variant="standard"
                      size="small"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                    />
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      variant="standard"
                      size="small"
                      sx={{ mt: 0.5 }}
                      value={editingDesc}
                      onChange={(e) => setEditingDesc(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    />
                  </Box>
                ) : (
                  <ListItemText
                    primary={t.title}
                    secondary={
                        <>
                        {t.description && <span>{t.description}<br/></span>}
                        <span style={{ color: "grey" }}>🕑 {fmtDate(t.created_at)}</span>
                        </>
                    }
                    sx={{
                      textDecoration: t.is_done ? "line-through" : "none",
                      mt: 0.5,
                    }}
                  />
                )}
              </ListItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </List>
      {/* --- loader --- */}
      <Backdrop open={delayedBusy} sx={{ zIndex: 1200, color: "#fff" }}>
        <CircularProgress />
      </Backdrop>
    </Box>
    
  );
}
