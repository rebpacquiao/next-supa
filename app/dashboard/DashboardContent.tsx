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
} from "@mui/material";
import { createTask, getTasks } from "../../services/task";

interface Task {
  id: number;
  title: string;
  completed?: boolean;
}

export default function DashboardContent() {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getTasks(rowsPerPage, page * rowsPerPage);
      setTasks(data.posts);
      setTotalTasks(data.total);
    };
    fetchTasks();
  }, [page, rowsPerPage]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateTask = async () => {
    const newTask = await createTask(description);
    setOpen(false);
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    setDescription("");
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
        <div className="container px-6 py-8 mx-auto">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-medium text-gray-700">Dashboard</h3>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
            >
              Add Task
            </Button>
          </div>

          <div className="flex flex-col mt-8">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Completed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.completed ? "Yes" : "No"}</TableCell>
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
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </div>
        </div>
      </main>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Task</DialogTitle>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateTask} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
