import { createContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { Task } from '../types';

export interface TasksContextValue {
  tasks: Task[];
  getTask: (id: string) => Task | undefined;
  addTask: (title: string, description: string) => void;
  updateTask: (id: string, title: string, description: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

// Contexto #2: los datos de las tareas, compartidos entre todas las
// paginas (lista, agregar/editar y detalle) sin pasar props de pagina en
// pagina.
export const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const [tasks, setTasks] = useState<Task[]>([]);

  // Las tareas se guardan por usuario en localStorage (Clase 04), asi cada
  // cuenta ve solo las suyas. (En el Challenge 06 pasan a la nube.)
  useEffect(() => {
    if (!uid) {
      setTasks([]);
      return;
    }
    try {
      const saved = localStorage.getItem(`tasks_${uid}`);
      setTasks(saved ? (JSON.parse(saved) as Task[]) : []);
    } catch {
      setTasks([]);
    }
  }, [uid]);

  // Actualiza el estado y persiste en un solo paso.
  const commit = (next: Task[]) => {
    setTasks(next);
    if (uid) localStorage.setItem(`tasks_${uid}`, JSON.stringify(next));
  };

  const getTask = (id: string) => tasks.find((t) => t.id === id);

  const addTask = (title: string, description: string) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      createdAt: Date.now(),
    };
    commit([task, ...tasks]);
  };

  const updateTask = (id: string, title: string, description: string) => {
    commit(tasks.map((t) => (t.id === id ? { ...t, title, description } : t)));
  };

  const toggleTask = (id: string) => {
    commit(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    commit(tasks.filter((t) => t.id !== id));
  };

  return (
    <TasksContext.Provider value={{ tasks, getTask, addTask, updateTask, toggleTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
}
