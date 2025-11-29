import Todo from "../models/Todo.js";

export const createTodo = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    if (!title) {
      res.status(400).json({ message: "Title wajib diisi!" });
    }

    const todo = await Todo.create({
      title,
      description,
      date: date || Date.now(),
      userId: req.user.id,
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error("Create Todo error:", error);
    res.status(500).json({ message: "Gagal membuat todo!" });
  }
};

export const getTodo = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(todos);
  } catch (error) {
    console.error("Get Todos error:", error);
    res.status(500).json({ message: "Gagal mengambil data todo!" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, isCompleted } = req.body;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, description, date, isCompleted },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Todo tidak ditemukan!" });
    }

    res.json(todo);
  } catch (error) {
    console.error("Update Todo error:", error);
    res.status(500).json({ message: "Gagal update todo!" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!todo) {
      return res.status(404).json({ message: "Todo tidak ditemukan!" });
    }

    res.json({ message: "Todo berhasil dihapus!" });
  } catch (error) {
    console.error("Delete Todo error:", error);
    res.status(500).json({ message: "Gagal menghapus todo!" });
  }
};
