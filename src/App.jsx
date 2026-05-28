
import { useEffect, useState } from "react";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedHistory = localStorage.getItem("history");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("history", JSON.stringify(history));
  }, [tasks, history]);

  function addTask() {
    if (!task.trim()) return;

    const newTask = {
      id: Date.now(),
      text: task,
      done: false,
    };

    setTasks([...tasks, newTask]);
    setTask("");
  }

  function toggleTask(id) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        const updated = {
          ...task,
          done: !task.done,
        };

        if (!task.done) {
          setHistory((prev) => [
            {
              type: "Concluída",
              text: task.text,
              date: new Date().toLocaleString(),
            },
            ...prev,
          ]);
        }

        return updated;
      }

      return task;
    });

    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const taskToDelete = tasks.find(
      (task) => task.id === id
    );

    if (taskToDelete) {
      setHistory((prev) => [
        {
          type: "Excluída",
          text: taskToDelete.text,
          date: new Date().toLocaleString(),
        },
        ...prev,
      ]);
    }

    setTasks(
      tasks.filter((task) => task.id !== id)
    );
  }

  const completedTasks = tasks.filter(
    (task) => task.done
  ).length;

  const progress =
    tasks.length === 0
      ? 0
      : (completedTasks / tasks.length) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center p-5 relative">

      {/* HISTÓRICO */}

      {showHistory && (
        <div className="absolute top-0 left-0 h-full w-80 bg-gray-800 shadow-2xl p-5 overflow-y-auto z-50">

          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">
              Histórico
            </h2>

            <button
              onClick={() =>
                setShowHistory(false)
              }
              className="bg-red-600 px-3 py-1 rounded"
            >
              X
            </button>
          </div>

          {history.length === 0 && (
            <p className="text-gray-400">
              Nenhum histórico ainda.
            </p>
          )}

          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={index}
                className="bg-gray-700 p-3 rounded-lg"
              >
                <p className="font-bold">
                  {item.type}
                </p>

                <p>{item.text}</p>

                <p className="text-xs text-gray-400 mt-1">
                  {item.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTEÚDO */}

      <div className="bg-gray-800 w-full max-w-3xl p-6 rounded-2xl shadow-2xl">

        {/* TOPO */}

        <div className="flex justify-between items-center mb-6">

          <button
            onClick={() =>
              setShowHistory(true)
            }
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
          >
            Histórico
          </button>

          <h1 className="text-4xl font-bold">
            TaskForge
          </h1>

          <div></div>
        </div>

        {/* INPUT */}

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Digite sua tarefa..."
            value={task}
            onChange={(e) =>
              setTask(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
            className="flex-1 p-3 rounded-lg bg-gray-700 outline-none"
          />

          <button
            onClick={addTask}
            className="bg-blue-600 hover:bg-blue-700 px-5 rounded-lg transition"
          >
            Adicionar
          </button>
        </div>

        {/* ESTATÍSTICAS */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

          <div className="bg-green-700 p-4 rounded-xl text-center">
            <h2 className="text-2xl font-bold">
              {completedTasks}
            </h2>

            <p className="text-gray-100 text-sm">
              Concluídas
            </p>
          </div>

          <div className="bg-blue-700 p-4 rounded-xl text-center">
            <h2 className="text-2xl font-bold">
              {Math.round(progress)}%
            </h2>

            <p className="text-gray-100 text-sm">
              Produtividade
            </p>
          </div>

        </div>

        {/* BARRA */}

        <div className="mb-8">
          <div className="w-full bg-gray-700 rounded-full h-5 overflow-hidden">
            <div
              className="bg-green-500 h-5 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            ></div>
          </div>
        </div>

        {/* TAREFAS */}

        <div className="space-y-3">

          {tasks.length === 0 && (
            <p className="text-gray-400 text-center">
              Nenhuma tarefa adicionada.
            </p>
          )}

          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
            >
              <span
                className={
                  task.done
                    ? "line-through text-gray-400"
                    : ""
                }
              >
                {task.text}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    toggleTask(task.id)
                  }
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded transition"
                >
                  {task.done
                    ? "Desfazer"
                    : "Concluir"}
                </button>

                <button
                  onClick={() =>
                    deleteTask(task.id)
                  }
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;

