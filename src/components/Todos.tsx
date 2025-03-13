import { useEffect, useState } from "react";

interface Todo {
    id: number;
    title: string;
    description: string;
    date: string;
    completed: boolean;
}

const BASEURL = "http://localhost:3000/todos"; // Базовый URL для API

export default function Todos() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState({ title: "", description: "" });
    const [editTodo, setEditTodo] = useState<Todo | null>(null);

    useEffect(() => {
        fetch(BASEURL)
            .then((res) => res.json())
            .then((data) => setTodos(data));
    }, []);

    const addTodo = () => {
        fetch(BASEURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...newTodo, date: new Date(), completed: false }),
        })
            .then((res) => res.json())
            .then((data) => setTodos([...todos, data]));
    };

    const deleteTodo = (id: number) => {
        fetch(`${BASEURL}/${id}`, { method: "DELETE" }).then(() =>
            setTodos(todos.filter((t) => t.id !== id))
        );
    };

    const updateTodo = (id: number, updatedFields: Partial<Todo>) => {
        fetch(`${BASEURL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFields),
        })
            .then((res) => res.json())
            .then((updatedTodo) =>
                setTodos(todos.map((t) => (t.id === id ? { ...t, ...updatedTodo } : t)))
            );
    };

    const updateCompleted = (id: number, completed?: boolean) => {
        fetch(`${BASEURL}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(completed),
        })
            .then((res) => res.json())
            .then((updatedTodo) =>
                setTodos(todos.map((t) => (t.id === id ? { ...t, ...updatedTodo } : t)))
            );
    };

    const startEditing = (todo: Todo) => {
        setEditTodo(todo);
    };

    const saveEdit = () => {
        if (editTodo) {
            updateTodo(editTodo.id, {
                title: editTodo.title,
                description: editTodo.description,
            });
            setEditTodo(null); // Сбросить режим редактирования
        }
    };

    const cancelEdit = () => {
        setEditTodo(null); // Сбросить режим редактирования
    };

    return (
        <div className="container">
            <h1>Todos</h1>
            <div className={"inputs"}>
                <input
                    type="text"
                    placeholder="Title"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                />
                <textarea
                    placeholder="Description"
                    value={newTodo.description}
                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                />
                <button onClick={addTodo}>Add Todo</button>
            </div>




            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <div className="text">
                            <strong className={'title'}>{todo.title}</strong>
                            <strong className={'description'}> {todo.description}</strong>
                            <p>{new Date(todo.date).toLocaleString()}</p> {/* Форматированное время */}

                        </div>
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => updateCompleted(todo.id)}
                        />

                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                        <button onClick={() => startEditing(todo)}>Edit</button>
                        {editTodo && (
                            <div>
                                <h2>Edit Todo</h2>
                                <input
                                    type="text"
                                    value={editTodo.title}
                                    onChange={(e) => setEditTodo({ ...editTodo, title: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={editTodo.description}
                                    onChange={(e) => setEditTodo({ ...editTodo, description: e.target.value })}
                                />
                                <button onClick={saveEdit}>Save</button>
                                <button onClick={cancelEdit}>Cancel</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>


        </div>
    );
}