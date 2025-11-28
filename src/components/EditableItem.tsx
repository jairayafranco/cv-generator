import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import type { Experience, Education, Projects } from '../types/CvStore';

type EditableItemData = Experience | Education | Projects | string;

interface EditableItemProps {
  type: 'experience' | 'education' | 'project' | 'skill' | 'certification' | 'language';
  data: EditableItemData;
  id: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  children: React.ReactNode;
}

export default function EditableItem({
  type,
  data,
  id,
  onEdit,
  onDelete,
  children
}: EditableItemProps) {
  const handleEdit = () => {
    onEdit(id);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  const getAriaLabel = () => {
    if (typeof data === 'string') {
      return data;
    }
    
    switch (type) {
      case 'experience':
        return `${(data as Experience).title} at ${(data as Experience).company}`;
      case 'education':
        return `${(data as Education).title} at ${(data as Education).school}`;
      case 'project':
        return (data as Projects).name;
      default:
        return 'item';
    }
  };

  const itemLabel = getAriaLabel();

  return (
    <div className="relative group" role="article" aria-label={`${type}: ${itemLabel}`}>
      <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 bg-base-100/90 backdrop-blur-sm rounded-lg p-1 shadow-soft">
        <button
          className="btn btn-sm btn-circle btn-ghost hover:bg-primary/10 hover:text-primary transition-all duration-200"
          onClick={handleEdit}
          aria-label={`Edit ${itemLabel}`}
          title="Edit"
        >
          <FiEdit2 size={16} />
        </button>
        <button
          className="btn btn-sm btn-circle btn-ghost text-error hover:bg-error/10 transition-all duration-200"
          onClick={handleDelete}
          aria-label={`Delete ${itemLabel}`}
          title="Delete"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
      {children}
    </div>
  );
}
