import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Editor from './Editor';
import type { Experience } from '../types/CvStore';

// Mock the CV store
vi.mock('../store/useCvStore', () => ({
  useCvStore: () => ({
    name: '',
    role: '',
    bio: '',
    contact: {
      email: '',
      phone: '',
      website: '',
      github: '',
      linkedin: '',
      twitter: '',
    },
    setBasic: vi.fn(),
    setContact: vi.fn(),
    setArrData: vi.fn(),
  }),
}));

describe('Editor Component', () => {
  it('should render with edit mode props', () => {
    const mockExperienceEditMode = {
      isEditing: false,
      editingId: null,
      editData: null,
      startEdit: vi.fn(),
      cancelEdit: vi.fn(),
      saveEdit: vi.fn(),
    };

    const mockEducationEditMode = {
      isEditing: false,
      editingId: null,
      editData: null,
      startEdit: vi.fn(),
      cancelEdit: vi.fn(),
      saveEdit: vi.fn(),
    };

    const mockProjectsEditMode = {
      isEditing: false,
      editingId: null,
      editData: null,
      startEdit: vi.fn(),
      cancelEdit: vi.fn(),
      saveEdit: vi.fn(),
    };

    render(
      <Editor
        experienceEditMode={mockExperienceEditMode}
        educationEditMode={mockEducationEditMode}
        projectsEditMode={mockProjectsEditMode}
      />
    );

    // Check that the component renders
    expect(screen.getByText('Basic Info')).toBeDefined();
    expect(screen.getByText('Experience')).toBeDefined();
    expect(screen.getByText('Education')).toBeDefined();
    expect(screen.getByText('Projects')).toBeDefined();
  });

  it('should show "Add Experience" button when not editing', () => {
    const mockExperienceEditMode = {
      isEditing: false,
      editingId: null,
      editData: null,
      startEdit: vi.fn(),
      cancelEdit: vi.fn(),
      saveEdit: vi.fn(),
    };

    const mockEducationEditMode = {
      isEditing: false,
      editingId: null,
      editData: null,
      startEdit: vi.fn(),
      cancelEdit: vi.fn(),
      saveEdit: vi.fn(),
    };

    const mockProjectsEditMode = {
      isEditing: false,
      editingId: null,
      editData: null,
      startEdit: vi.fn(),
      cancelEdit: vi.fn(),
      saveEdit: vi.fn(),
    };

    render(
      <Editor
        experienceEditMode={mockExperienceEditMode}
        educationEditMode={mockEducationEditMode}
        projectsEditMode={mockProjectsEditMode}
      />
    );

    expect(screen.getByText('Add Experience')).toBeDefined();
  });

  it('should show "Update Experience" button when editing', () => {
    const mockExperienceEditMode = {
      isEditing: true,
      editingId: '123',
      editData: {
        id: '123',
        title: 'Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco',
        startDate: '2020-01',
        endDate: '2023-01',
        description: 'Worked on cool stuff',
      } as Experience,
      startEdit: vi.fn(),
      cancelEdit: vi.fn(),
      saveEdit: vi.fn(),
    };

    const mockEducationEditMode = {
      isEditing: false,
      editingId: null,
      editData: null,
      startEdit: vi.fn(),
      cancelEdit: vi.fn(),
      saveEdit: vi.fn(),
    };

    const mockProjectsEditMode = {
      isEditing: false,
      editingId: null,
      editData: null,
      startEdit: vi.fn(),
      cancelEdit: vi.fn(),
      saveEdit: vi.fn(),
    };

    render(
      <Editor
        experienceEditMode={mockExperienceEditMode}
        educationEditMode={mockEducationEditMode}
        projectsEditMode={mockProjectsEditMode}
      />
    );

    expect(screen.getByText('Update Experience')).toBeDefined();
    expect(screen.getByText('Cancel')).toBeDefined();
  });
});
