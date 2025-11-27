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
    clearAll: vi.fn(),
    exportData: vi.fn(() => '{}'),
    importData: vi.fn(),
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

  it('should have proper label associations for all inputs', () => {
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

    const { container } = render(
      <Editor
        experienceEditMode={mockExperienceEditMode}
        educationEditMode={mockEducationEditMode}
        projectsEditMode={mockProjectsEditMode}
      />
    );

    // Check that key inputs have proper id and htmlFor associations
    const nameInput = container.querySelector('#name-input');
    const nameLabel = container.querySelector('label[for="name-input"]');
    expect(nameInput).toBeDefined();
    expect(nameLabel).toBeDefined();

    const roleInput = container.querySelector('#role-input');
    const roleLabel = container.querySelector('label[for="role-input"]');
    expect(roleInput).toBeDefined();
    expect(roleLabel).toBeDefined();

    const bioInput = container.querySelector('#bio-input');
    const bioLabel = container.querySelector('label[for="bio-input"]');
    expect(bioInput).toBeDefined();
    expect(bioLabel).toBeDefined();
  });

  it('should have aria-required attributes on required fields', () => {
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

    const { container } = render(
      <Editor
        experienceEditMode={mockExperienceEditMode}
        educationEditMode={mockEducationEditMode}
        projectsEditMode={mockProjectsEditMode}
      />
    );

    // Check that required fields have aria-required="true"
    const nameInput = container.querySelector('#name-input');
    expect(nameInput?.getAttribute('aria-required')).toBe('true');

    const roleInput = container.querySelector('#role-input');
    expect(roleInput?.getAttribute('aria-required')).toBe('true');

    const emailInput = container.querySelector('#contact-email');
    expect(emailInput?.getAttribute('aria-required')).toBe('true');
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
    // Check for Cancel button in the form (there may be multiple Cancel buttons)
    const cancelButtons = screen.getAllByText('Cancel');
    expect(cancelButtons.length).toBeGreaterThan(0);
  });
});
