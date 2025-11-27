import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEditMode } from './useEditMode';
import { useCvStore } from '../store/useCvStore';
import type { Experience, Education, Projects } from '../types/CvStore';

describe('useEditMode', () => {
  beforeEach(() => {
    // Reset store before each test
    const { clearAll } = useCvStore.getState();
    clearAll();
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useEditMode<Experience>('experience'));

      expect(result.current.isEditing).toBe(false);
      expect(result.current.editingId).toBeNull();
      expect(result.current.editData).toBeNull();
    });
  });

  describe('startEdit', () => {
    it('should set editing state with provided data', () => {
      const { result } = renderHook(() => useEditMode<Experience>('experience'));

      const testData: Experience = {
        id: 'test-id-1',
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco',
        startDate: '2020-01',
        endDate: '2023-01',
        description: 'Developed software',
      };

      act(() => {
        result.current.startEdit('test-id-1', testData);
      });

      expect(result.current.isEditing).toBe(true);
      expect(result.current.editingId).toBe('test-id-1');
      expect(result.current.editData).toEqual(testData);
    });

    it('should work with education data', () => {
      const { result } = renderHook(() => useEditMode<Education>('education'));

      const testData: Education = {
        id: 'edu-id-1',
        title: 'Computer Science',
        school: 'University',
        location: 'Boston',
        startDate: '2016-09',
        endDate: '2020-05',
      };

      act(() => {
        result.current.startEdit('edu-id-1', testData);
      });

      expect(result.current.isEditing).toBe(true);
      expect(result.current.editingId).toBe('edu-id-1');
      expect(result.current.editData).toEqual(testData);
    });

    it('should work with projects data', () => {
      const { result } = renderHook(() => useEditMode<Projects>('projects'));

      const testData: Projects = {
        id: 'proj-id-1',
        name: 'My Project',
        url: 'https://example.com',
      };

      act(() => {
        result.current.startEdit('proj-id-1', testData);
      });

      expect(result.current.isEditing).toBe(true);
      expect(result.current.editingId).toBe('proj-id-1');
      expect(result.current.editData).toEqual(testData);
    });
  });

  describe('cancelEdit', () => {
    it('should clear editing state', () => {
      const { result } = renderHook(() => useEditMode<Experience>('experience'));

      const testData: Experience = {
        id: 'test-id-1',
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco',
        startDate: '2020-01',
        endDate: '2023-01',
        description: 'Developed software',
      };

      act(() => {
        result.current.startEdit('test-id-1', testData);
      });

      expect(result.current.isEditing).toBe(true);

      act(() => {
        result.current.cancelEdit();
      });

      expect(result.current.isEditing).toBe(false);
      expect(result.current.editingId).toBeNull();
      expect(result.current.editData).toBeNull();
    });
  });

  describe('saveEdit', () => {
    it('should update item in store and clear editing state', () => {
      const { result } = renderHook(() => useEditMode<Experience>('experience'));
      const store = useCvStore.getState();

      // Add initial item to store
      const initialData: Experience = {
        id: 'test-id-1',
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco',
        startDate: '2020-01',
        endDate: '2023-01',
        description: 'Developed software',
      };

      act(() => {
        store.setArrData('experience', initialData);
      });

      // Start editing
      act(() => {
        result.current.startEdit('test-id-1', initialData);
      });

      // Update data
      const updatedData: Experience = {
        ...initialData,
        title: 'Senior Software Engineer',
        company: 'New Tech Corp',
      };

      act(() => {
        result.current.saveEdit(updatedData);
      });

      // Check that editing state is cleared
      expect(result.current.isEditing).toBe(false);
      expect(result.current.editingId).toBeNull();
      expect(result.current.editData).toBeNull();

      // Check that store was updated
      const storeState = useCvStore.getState();
      expect(storeState.experience[0].title).toBe('Senior Software Engineer');
      expect(storeState.experience[0].company).toBe('New Tech Corp');
    });

    it('should not update if not in editing mode', () => {
      const { result } = renderHook(() => useEditMode<Experience>('experience'));
      const store = useCvStore.getState();

      // Add initial item to store
      const initialData: Experience = {
        id: 'test-id-1',
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco',
        startDate: '2020-01',
        endDate: '2023-01',
        description: 'Developed software',
      };

      act(() => {
        store.setArrData('experience', initialData);
      });

      // Try to save without starting edit
      const updatedData: Experience = {
        ...initialData,
        title: 'Senior Software Engineer',
      };

      act(() => {
        result.current.saveEdit(updatedData);
      });

      // Store should not be updated
      const storeState = useCvStore.getState();
      expect(storeState.experience[0].title).toBe('Software Engineer');
    });

    it('should update education items correctly', () => {
      const { result } = renderHook(() => useEditMode<Education>('education'));
      const store = useCvStore.getState();

      const initialData: Education = {
        id: 'edu-id-1',
        title: 'Computer Science',
        school: 'University',
        location: 'Boston',
        startDate: '2016-09',
        endDate: '2020-05',
      };

      act(() => {
        store.setArrData('education', initialData);
      });

      act(() => {
        result.current.startEdit('edu-id-1', initialData);
      });

      const updatedData: Education = {
        ...initialData,
        title: 'Master of Computer Science',
      };

      act(() => {
        result.current.saveEdit(updatedData);
      });

      const storeState = useCvStore.getState();
      expect(storeState.education[0].title).toBe('Master of Computer Science');
    });

    it('should update projects items correctly', () => {
      const { result } = renderHook(() => useEditMode<Projects>('projects'));
      const store = useCvStore.getState();

      const initialData: Projects = {
        id: 'proj-id-1',
        name: 'My Project',
        url: 'https://example.com',
      };

      act(() => {
        store.setArrData('projects', initialData);
      });

      act(() => {
        result.current.startEdit('proj-id-1', initialData);
      });

      const updatedData: Projects = {
        ...initialData,
        name: 'Updated Project',
        url: 'https://newurl.com',
      };

      act(() => {
        result.current.saveEdit(updatedData);
      });

      const storeState = useCvStore.getState();
      expect(storeState.projects[0].name).toBe('Updated Project');
      expect(storeState.projects[0].url).toBe('https://newurl.com');
    });
  });

  describe('complete workflow', () => {
    it('should handle complete edit workflow', () => {
      const { result } = renderHook(() => useEditMode<Experience>('experience'));
      const store = useCvStore.getState();

      // Add multiple items
      const item1: Experience = {
        id: 'id-1',
        title: 'Engineer 1',
        company: 'Company 1',
        location: 'Location 1',
        startDate: '2020-01',
        endDate: '2021-01',
        description: 'Description 1',
      };

      const item2: Experience = {
        id: 'id-2',
        title: 'Engineer 2',
        company: 'Company 2',
        location: 'Location 2',
        startDate: '2021-01',
        endDate: '2022-01',
        description: 'Description 2',
      };

      act(() => {
        store.setArrData('experience', item1);
        store.setArrData('experience', item2);
      });

      // Edit first item
      act(() => {
        result.current.startEdit('id-1', item1);
      });

      expect(result.current.isEditing).toBe(true);
      expect(result.current.editingId).toBe('id-1');

      // Update first item
      const updatedItem1: Experience = {
        ...item1,
        title: 'Senior Engineer 1',
      };

      act(() => {
        result.current.saveEdit(updatedItem1);
      });

      // Verify state cleared
      expect(result.current.isEditing).toBe(false);

      // Verify store updated correctly
      const storeState = useCvStore.getState();
      expect(storeState.experience).toHaveLength(2);
      expect(storeState.experience[0].title).toBe('Senior Engineer 1');
      expect(storeState.experience[1].title).toBe('Engineer 2');
    });
  });
});
