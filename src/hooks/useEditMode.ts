import { useState, useCallback } from 'react';
import { useCvStore } from '../store/useCvStore';
import type { setArrDataName, setArrDataValue } from '../types/CvStore';

interface UseEditModeReturn<T> {
  isEditing: boolean;
  editingId: string | null;
  editData: T | null;
  startEdit: (id: string, data: T) => void;
  cancelEdit: () => void;
  saveEdit: (data: T) => void;
}

/**
 * Custom hook for managing edit mode state for CV items
 * @param storeName - The name of the array in the CV store (e.g., 'experience', 'education')
 * @returns Edit mode state and control functions
 */
export function useEditMode<T extends { id: string }>(
  storeName: setArrDataName
): UseEditModeReturn<T> {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<T | null>(null);
  
  const updateArrItem = useCvStore((state) => state.updateArrItem);

  /**
   * Start editing an item by populating the form with its data
   */
  const startEdit = useCallback((id: string, data: T) => {
    setIsEditing(true);
    setEditingId(id);
    setEditData(data);
  }, []);

  /**
   * Cancel editing and clear the form
   */
  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditingId(null);
    setEditData(null);
  }, []);

  /**
   * Save the edited item to the store
   */
  const saveEdit = useCallback((data: T) => {
    if (editingId) {
      updateArrItem(storeName, editingId, data as unknown as setArrDataValue);
      cancelEdit();
    }
  }, [editingId, storeName, updateArrItem, cancelEdit]);

  return {
    isEditing,
    editingId,
    editData,
    startEdit,
    cancelEdit,
    saveEdit,
  };
}
