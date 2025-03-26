import React from 'react';
import { Copy, Trash2 } from 'lucide-react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ClipboardItem = ({ id, text, onCopy, onDelete }) => {

    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} className="bg-gray-50 border rounded-xl p-4 flex justify-between items-start draggable" style={style}>
      <p className="text-gray-700 break-words w-full mr-4">{text}</p>
      <div className="flex flex-col gap-2">
        <button onClick={onCopy} className="text-blue-500 hover:text-blue-700">
          <Copy size={20} />
        </button>
        <button onClick={onDelete} className="text-red-500 hover:text-red-700">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default ClipboardItem;
