import { useState, useCallback } from 'react';
import { Plus, Check, Trash2, ListTodo, Filter } from 'lucide-react';
import { useTodoStore } from '../../store/toolsStore';

export default function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = useTodoStore();
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleAdd = useCallback(() => {
    const text = newTodo.trim();
    if (!text) return;
    addTodo(text);
    setNewTodo('');
  }, [newTodo, addTodo]);

  const handleEdit = useCallback((id: string) => {
    const text = editText.trim();
    if (!text) return;
    editTodo(id, text);
    setEditingId(null);
    setEditText('');
  }, [editText, editTodo]);

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="bg-white rounded-2xl border border-[rgba(0,0,0,0.1)] overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-2 mb-4">
          <ListTodo size={18} className="text-[#28A71A]" />
          <h3 className="text-sm font-semibold text-[#303030]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            To-do List
          </h3>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Tambah tugas baru..."
            className="flex-1 px-3 py-2.5 border border-[rgba(0,0,0,0.1)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#28A71A]/20 focus:border-[#28A71A] placeholder:text-[#B0B0B0]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          />
          <button
            onClick={handleAdd}
            disabled={!newTodo.trim()}
            className="px-4 py-2.5 bg-[#28A71A] disabled:bg-[#D4D4D4] text-white rounded-lg hover:bg-[#1C7712] transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 px-5 py-2.5 bg-[#FAFAFA] border-b border-[rgba(0,0,0,0.1)]">
        <Filter size={14} className="text-[#555]" />
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              filter === f
                ? 'bg-[#28A71A] text-white'
                : 'text-[#555] hover:bg-[#F0F4F8]'
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {f === 'all' ? 'Semua' : f === 'active' ? 'Aktif' : 'Selesai'}
          </button>
        ))}
        <div className="flex-1" />
        <span className="text-[10px] text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {activeCount} tersisa
        </span>
      </div>

      {/* Todo List */}
      <div className="max-h-64 overflow-y-auto">
        {filteredTodos.length === 0 ? (
          <div className="p-6 text-center text-sm text-[#555]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {filter === 'all' ? 'Belum ada tugas. Tambahkan tugas baru!' : 'Tidak ada tugas.'}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 px-5 py-3.5 border-b border-[rgba(0,0,0,0.1)] last:border-b-0 hover:bg-[#FAFAFA] transition-colors group"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  todo.completed
                    ? 'bg-[#28A71A] border-[#28A71A]'
                    : 'border-[rgba(0,0,0,0.1)] hover:border-[#28A71A]'
                }`}
              >
                {todo.completed && <Check size={12} className="text-white" />}
              </button>

              {editingId === todo.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => handleEdit(todo.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEdit(todo.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="flex-1 px-2 py-1 border border-[#28A71A] rounded text-sm focus:outline-none"
                  autoFocus
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                />
              ) : (
                <span
                  onClick={() => {
                    setEditingId(todo.id);
                    setEditText(todo.text);
                  }}
                  className={`flex-1 text-sm cursor-pointer ${
                    todo.completed ? 'line-through text-[#B0B0B0]' : 'text-[#303030]'
                  }`}
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {todo.text}
                </span>
              )}

              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Clear completed */}
      {todos.some((t) => t.completed) && (
        <div className="px-5 py-2.5 border-t border-[rgba(0,0,0,0.1)]">
          <button
            onClick={clearCompleted}
            className="text-xs text-[#555] hover:text-red-500 transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Hapus yang sudah selesai
          </button>
        </div>
      )}
    </div>
  );
}
