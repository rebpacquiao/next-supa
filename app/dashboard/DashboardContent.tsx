"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  SelectChangeEvent,
  Snackbar,
  CircularProgress,
  Backdrop,
  Stack,
} from "@mui/material";
import {
  createTask,
  getTasks,
  searchPosts,
  updatePost,
} from "../../services/task";
import SearchComponent from "./SearchComponent";

interface Task {
  id: number;
  title: string;
  body?: string;
  views?: number;
  tags?: string[];
}

const availableTags = ["history", "american", "crime", "science", "technology"];

export default function DashboardContent() {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTasks, setTotalTasks] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getTasks(rowsPerPage, page * rowsPerPage);
      setTasks(data.posts);
      setTotalTasks(data.total);
    };
    fetchTasks();
  }, [page, rowsPerPage]);

  const addNewPost = () => {
    setOpen(true);
  };

  const closeTasks = () => {
    setOpen(false);
    setEditTask(null);
  };

  const initCreateTasks = async () => {
    setLoading(true);
    if (editTask) {
      const updatedTask = await updatePost(editTask.id, description, tags);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } else {
      const newTask = await createTask(description);
      newTask.tags = tags;
      setTasks((prevTasks) => [newTask, ...prevTasks]);
    }
    setOpen(false);
    setDescription("");
    setTags([]);
    setLoading(false);
    setAlertOpen(true);
  };

  const initEditTask = (task: Task) => {
    setEditTask(task);
    setDescription(task.title);
    setTags(task.tags || []);
    setOpen(true);
  };

  const initChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const initChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const initChangeTag = (event: SelectChangeEvent<string[]>) => {
    setTags(event.target.value as string[]);
  };

  const closeAlert = () => {
    setAlertOpen(false);
  };

  const initSearchTitle = async (query: string) => {
    setLoading(true);
    if (query) {
      try {
        const posts = await searchPosts(query);
        setTasks(posts);
        setTotalTasks(posts.length);
      } catch (error) {
        console.error("Error searching posts:", error);
      }
    } else {
      const data = await getTasks(rowsPerPage, page * rowsPerPage);
      setTasks(data.posts);
      setTotalTasks(data.total);
    }
    setLoading(false);
  };

  return (
    <>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        <div className="container px-6 py-8 mx-auto">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-medium text-gray-700">Dashboard</h3>
            <Button variant="contained" color="primary" onClick={addNewPost}>
              {editTask ? "Edit Post" : "Add Post"}
            </Button>
          </div>

          <SearchComponent onSearch={initSearchTitle} />

          <div className="flex flex-col mt-8">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Views</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {task.tags?.map((tag) => (
                            <Chip color="success" key={tag} label={tag} />
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell>{task.views}</TableCell>
                      <TableCell>
                        <Button onClick={() => initEditTask(task)}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalTasks}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={initChangePage}
                onRowsPerPageChange={initChangeRowsPerPage}
              />
            </TableContainer>
          </div>
        </div>
      </main>
      <Dialog open={open} onClose={closeTasks}>
        <DialogTitle>{editTask ? "Edit Task" : "Add Task"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Description"
            type="text"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Tags</InputLabel>
            <Select
              multiple
              value={tags}
              onChange={initChangeTag}
              renderValue={(selected) => (
                <div>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </div>
              )}
            >
              {availableTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTasks} color="primary">
            Cancel
          </Button>
          <Button onClick={initCreateTasks} color="primary">
            {editTask ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={closeAlert}
        message={
          editTask ? "Successfully updated post" : "Successfully created post"
        }
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
