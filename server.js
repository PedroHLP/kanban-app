const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://suramu:appdata29@bielzera.1suha15.mongodb.net/kanban?retryWrites=true&w=majority&appName=Bielzera', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Atualização do Schema para incluir 'description'
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['ToDo', 'InProgress', 'Done'],
    default: 'ToDo',
  },
});

const Task = mongoose.model('Task', taskSchema);

// Rota para obter todas as tarefas
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar tarefas', error });
  }
});

// Rota para criar uma nova tarefa
app.post('/tasks', async (req, res) => {
  const { title, description, status } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Título e Descrição são obrigatórios' });
  }

  try {
    const task = new Task({ title, description, status });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar tarefa', error });
  }
});

// Rota para atualizar uma tarefa existente
app.put('/tasks/:id', async (req, res) => {
  const { title, description, status } = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar tarefa', error });
  }
});

// Rota para deletar uma tarefa
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }
    res.json({ message: 'Tarefa deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar tarefa', error });
  }
});

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
