import React, { useState, useEffect } from 'react';
import ClipboardItem from './ClipboardItem';

import { closestCorners, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';

const App = () => {
  const [input, setInput] = useState('');
  const [clips, setClips] = useState([]);

  useEffect(() => {
    const savedClips = JSON.parse(localStorage.getItem('clippy-items')) || [];
    setClips(savedClips);
  }, []);

  useEffect(() => {
    localStorage.setItem('clippy-items', JSON.stringify(clips));
  }, [clips]);

  const handleAddClip = () => {
    if (!input.trim()) return;
    setClips([{ text: input, id: Date.now() }, ...clips]);
    setInput('');
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleDelete = (id) => {
    setClips(clips.filter(item => item.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddClip();
    }
  };

  const getPos = id => clips.findIndex(clip => clip.id === id);

  const handleDragEnd = (event) => {
    const {active, over} = event;
    if (active.id !== over.id) {
      
      setClips(clips => {
        const origPos = getPos(active.id);
        const newPos = getPos(over.id);

        return arrayMove(clips, origPos, newPos);
      })
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter : sortableKeyboardCoordinates
    })
  )


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">📋 Clippy</h1>
        <textarea
          className="w-full border p-3 rounded-xl resize-none"
          rows={3}
          placeholder="Type something to save..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={handleAddClip}
          className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
        >
          Save to Clipboard
        </button>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>

          <SortableContext items={clips} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {clips.length === 0 ? (
              <p className="text-gray-500 text-center">No saved clips yet.</p>
            ) : (
              clips.map((clip) => (
                <ClipboardItem
                  key={clip.id}
                  text={clip.text}
                  onCopy={() => handleCopy(clip.text)}
                  onDelete={() => handleDelete(clip.id)}
                  id={clip.id}
                />
              ))
            )}
          </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

export default App;
