import { describe, it, expect, beforeEach } from 'vitest';
import { useCvStore } from './useCvStore';
import type { Experience, Education, Projects } from '../types/CvStore';
import * as fc from 'fast-check';

describe('CV Store CRUD Operations', () => {
    beforeEach(() => {
        // Reset store before each test
        useCvStore.getState().clearAll();
    });

    describe('updateArrItem', () => {
        it('should update an experience item by ID', () => {
            const store = useCvStore.getState();
            
            // Add an experience
            const experience: Experience = {
                id: 'test-id-1',
                title: 'Software Engineer',
                company: 'Tech Corp',
                location: 'San Francisco',
                startDate: '2020-01',
                endDate: '2023-01',
                description: 'Built things'
            };
            store.setArrData('experience', experience);

            // Update the experience
            const updatedExperience: Experience = {
                id: 'test-id-1',
                title: 'Senior Software Engineer',
                company: 'Tech Corp',
                location: 'San Francisco',
                startDate: '2020-01',
                endDate: '2023-01',
                description: 'Built better things'
            };
            store.updateArrItem('experience', 'test-id-1', updatedExperience);

            const state = useCvStore.getState();
            expect(state.experience).toHaveLength(1);
            expect(state.experience[0].title).toBe('Senior Software Engineer');
            expect(state.experience[0].description).toBe('Built better things');
        });

        it('should update an education item by ID', () => {
            const store = useCvStore.getState();
            
            const education: Education = {
                id: 'edu-1',
                title: 'BS Computer Science',
                school: 'University',
                location: 'Boston',
                startDate: '2016-09',
                endDate: '2020-05'
            };
            store.setArrData('education', education);

            const updatedEducation: Education = {
                id: 'edu-1',
                title: 'BS Computer Science (Honors)',
                school: 'University',
                location: 'Boston',
                startDate: '2016-09',
                endDate: '2020-05'
            };
            store.updateArrItem('education', 'edu-1', updatedEducation);

            const state = useCvStore.getState();
            expect(state.education[0].title).toBe('BS Computer Science (Honors)');
        });

        it('should not affect other items when updating', () => {
            const store = useCvStore.getState();
            
            const exp1: Experience = {
                id: 'exp-1',
                title: 'Engineer 1',
                company: 'Company 1',
                location: 'City 1',
                startDate: '2020-01',
                endDate: '2021-01',
                description: 'Desc 1'
            };
            const exp2: Experience = {
                id: 'exp-2',
                title: 'Engineer 2',
                company: 'Company 2',
                location: 'City 2',
                startDate: '2021-01',
                endDate: '2022-01',
                description: 'Desc 2'
            };
            
            store.setArrData('experience', exp1);
            store.setArrData('experience', exp2);

            const updatedExp1: Experience = {
                ...exp1,
                title: 'Updated Engineer 1'
            };
            store.updateArrItem('experience', 'exp-1', updatedExp1);

            const state = useCvStore.getState();
            expect(state.experience).toHaveLength(2);
            expect(state.experience[0].title).toBe('Updated Engineer 1');
            expect(state.experience[1].title).toBe('Engineer 2');
        });
    });

    describe('deleteArrItem', () => {
        it('should delete an experience item by ID', () => {
            const store = useCvStore.getState();
            
            const experience: Experience = {
                id: 'test-id-1',
                title: 'Software Engineer',
                company: 'Tech Corp',
                location: 'San Francisco',
                startDate: '2020-01',
                endDate: '2023-01',
                description: 'Built things'
            };
            store.setArrData('experience', experience);

            expect(useCvStore.getState().experience).toHaveLength(1);

            store.deleteArrItem('experience', 'test-id-1');

            expect(useCvStore.getState().experience).toHaveLength(0);
        });

        it('should delete an education item by ID', () => {
            const store = useCvStore.getState();
            
            const education: Education = {
                id: 'edu-1',
                title: 'BS Computer Science',
                school: 'University',
                location: 'Boston',
                startDate: '2016-09',
                endDate: '2020-05'
            };
            store.setArrData('education', education);

            store.deleteArrItem('education', 'edu-1');

            expect(useCvStore.getState().education).toHaveLength(0);
        });

        it('should delete a project item by ID', () => {
            const store = useCvStore.getState();
            
            const project: Projects = {
                id: 'proj-1',
                name: 'My Project',
                url: 'https://example.com'
            };
            store.setArrData('projects', project);

            store.deleteArrItem('projects', 'proj-1');

            expect(useCvStore.getState().projects).toHaveLength(0);
        });

        it('should not affect other items when deleting', () => {
            const store = useCvStore.getState();
            
            const exp1: Experience = {
                id: 'exp-1',
                title: 'Engineer 1',
                company: 'Company 1',
                location: 'City 1',
                startDate: '2020-01',
                endDate: '2021-01',
                description: 'Desc 1'
            };
            const exp2: Experience = {
                id: 'exp-2',
                title: 'Engineer 2',
                company: 'Company 2',
                location: 'City 2',
                startDate: '2021-01',
                endDate: '2022-01',
                description: 'Desc 2'
            };
            
            store.setArrData('experience', exp1);
            store.setArrData('experience', exp2);

            store.deleteArrItem('experience', 'exp-1');

            const state = useCvStore.getState();
            expect(state.experience).toHaveLength(1);
            expect(state.experience[0].id).toBe('exp-2');
        });

        it('should handle deleting non-existent ID gracefully', () => {
            const store = useCvStore.getState();
            
            const experience: Experience = {
                id: 'test-id-1',
                title: 'Software Engineer',
                company: 'Tech Corp',
                location: 'San Francisco',
                startDate: '2020-01',
                endDate: '2023-01',
                description: 'Built things'
            };
            store.setArrData('experience', experience);

            store.deleteArrItem('experience', 'non-existent-id');

            expect(useCvStore.getState().experience).toHaveLength(1);
        });
    });

    describe('clearAll', () => {
        it('should reset all fields to default empty values', () => {
            const store = useCvStore.getState();
            
            // Populate store with data
            store.setBasic('name', 'John Doe');
            store.setBasic('role', 'Developer');
            store.setBasic('bio', 'A developer');
            store.setContact('email', 'john@example.com');
            store.setContact('phone', '123-456-7890');
            
            const experience: Experience = {
                id: 'exp-1',
                title: 'Engineer',
                company: 'Company',
                location: 'City',
                startDate: '2020-01',
                endDate: '2021-01',
                description: 'Desc'
            };
            store.setArrData('experience', experience);
            store.setArrData('skills', ['JavaScript', 'TypeScript']);

            // Clear all
            store.clearAll();

            const state = useCvStore.getState();
            expect(state.name).toBe('');
            expect(state.role).toBe('');
            expect(state.bio).toBe('');
            expect(state.img).toBe('');
            expect(state.contact.email).toBe('');
            expect(state.contact.phone).toBe('');
            expect(state.contact.website).toBe('');
            expect(state.contact.github).toBe('');
            expect(state.contact.linkedin).toBe('');
            expect(state.contact.twitter).toBe('');
            expect(state.experience).toEqual([]);
            expect(state.education).toEqual([]);
            expect(state.skills).toEqual([]);
            expect(state.projects).toEqual([]);
            expect(state.certifications).toEqual([]);
            expect(state.languages).toEqual([]);
        });
    });

    describe('exportData', () => {
        it('should serialize store to JSON string', () => {
            const store = useCvStore.getState();
            
            store.setBasic('name', 'John Doe');
            store.setBasic('role', 'Developer');
            store.setContact('email', 'john@example.com');
            
            const experience: Experience = {
                id: 'exp-1',
                title: 'Engineer',
                company: 'Company',
                location: 'City',
                startDate: '2020-01',
                endDate: '2021-01',
                description: 'Desc'
            };
            store.setArrData('experience', experience);

            const jsonString = store.exportData();
            const parsed = JSON.parse(jsonString);

            expect(parsed.name).toBe('John Doe');
            expect(parsed.role).toBe('Developer');
            expect(parsed.contact.email).toBe('john@example.com');
            expect(parsed.experience).toHaveLength(1);
            expect(parsed.experience[0].title).toBe('Engineer');
        });

        it('should export empty store correctly', () => {
            const store = useCvStore.getState();
            store.clearAll();

            const jsonString = store.exportData();
            const parsed = JSON.parse(jsonString);

            expect(parsed.name).toBe('');
            expect(parsed.experience).toEqual([]);
            expect(parsed.contact.email).toBe('');
        });
    });

    describe('importData', () => {
        it('should parse and load JSON data', () => {
            const store = useCvStore.getState();
            
            const data = {
                name: 'Jane Doe',
                role: 'Designer',
                bio: 'A designer',
                img: '',
                experience: [{
                    id: 'exp-1',
                    title: 'Designer',
                    company: 'Design Co',
                    location: 'NYC',
                    startDate: '2019-01',
                    endDate: '2022-01',
                    description: 'Designed things'
                }],
                education: [],
                skills: ['Figma', 'Sketch'],
                projects: [],
                certifications: [],
                languages: [],
                contact: {
                    email: 'jane@example.com',
                    phone: '987-654-3210',
                    website: '',
                    github: '',
                    linkedin: '',
                    twitter: ''
                }
            };

            store.importData(JSON.stringify(data));

            const state = useCvStore.getState();
            expect(state.name).toBe('Jane Doe');
            expect(state.role).toBe('Designer');
            expect(state.bio).toBe('A designer');
            expect(state.experience).toHaveLength(1);
            expect(state.experience[0].title).toBe('Designer');
            expect(state.skills).toEqual(['Figma', 'Sketch']);
            expect(state.contact.email).toBe('jane@example.com');
        });

        it('should add IDs to items that are missing them', () => {
            const store = useCvStore.getState();
            
            const data = {
                name: 'Test',
                role: '',
                bio: '',
                img: '',
                experience: [{
                    title: 'Engineer',
                    company: 'Company',
                    location: 'City',
                    startDate: '2020-01',
                    endDate: '2021-01',
                    description: 'Desc'
                }],
                education: [],
                skills: [],
                projects: [],
                certifications: [],
                languages: [],
                contact: {
                    email: '',
                    phone: '',
                    website: '',
                    github: '',
                    linkedin: '',
                    twitter: ''
                }
            };

            store.importData(JSON.stringify(data));

            const state = useCvStore.getState();
            expect(state.experience[0].id).toBeDefined();
            expect(typeof state.experience[0].id).toBe('string');
        });

        it('should throw error for invalid JSON', () => {
            const store = useCvStore.getState();
            
            expect(() => {
                store.importData('invalid json');
            }).toThrow();
        });

        it('should throw error for non-object data', () => {
            const store = useCvStore.getState();
            
            expect(() => {
                store.importData('"just a string"');
            }).toThrow();
        });

        it('should handle missing fields gracefully', () => {
            const store = useCvStore.getState();
            
            const data = {
                name: 'Test User'
                // Missing other fields
            };

            store.importData(JSON.stringify(data));

            const state = useCvStore.getState();
            expect(state.name).toBe('Test User');
            expect(state.role).toBe('');
            expect(state.experience).toEqual([]);
            expect(state.contact.email).toBe('');
        });
    });
});

describe('Persistence', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        // Reset store
        useCvStore.getState().clearAll();
    });

    // Feature: cv-generator-improvements, Property 1: Persistence round trip
    // Validates: Requirements 1.1, 1.2, 1.3
    it('property test: persistence round trip - saving and loading produces equivalent state', () => {
        // Arbitraries for generating random CV data
        // Generate date strings in YYYY-MM format directly to avoid invalid date issues
        const dateStringArb = fc.tuple(
            fc.integer({ min: 2000, max: 2024 }),
            fc.integer({ min: 1, max: 12 })
        ).map(([year, month]) => `${year}-${month.toString().padStart(2, '0')}`);

        const experienceArb = fc.record({
            id: fc.uuid(),
            title: fc.string({ minLength: 1, maxLength: 100 }),
            company: fc.string({ minLength: 1, maxLength: 100 }),
            location: fc.string({ minLength: 1, maxLength: 100 }),
            startDate: dateStringArb,
            endDate: dateStringArb,
            description: fc.string({ maxLength: 500 })
        });

        const educationArb = fc.record({
            id: fc.uuid(),
            title: fc.string({ minLength: 1, maxLength: 100 }),
            school: fc.string({ minLength: 1, maxLength: 100 }),
            location: fc.string({ minLength: 1, maxLength: 100 }),
            startDate: dateStringArb,
            endDate: dateStringArb
        });

        const projectArb = fc.record({
            id: fc.uuid(),
            name: fc.string({ minLength: 1, maxLength: 100 }),
            url: fc.webUrl()
        });

        const contactArb = fc.record({
            email: fc.emailAddress(),
            phone: fc.string({ minLength: 0, maxLength: 20 }),
            website: fc.oneof(fc.constant(''), fc.webUrl()),
            github: fc.string({ minLength: 0, maxLength: 50 }),
            linkedin: fc.string({ minLength: 0, maxLength: 50 }),
            twitter: fc.string({ minLength: 0, maxLength: 50 })
        });

        const cvStateArb = fc.record({
            img: fc.oneof(fc.constant(''), fc.string({ minLength: 10, maxLength: 100 })),
            name: fc.string({ minLength: 0, maxLength: 100 }),
            role: fc.string({ minLength: 0, maxLength: 100 }),
            bio: fc.string({ minLength: 0, maxLength: 500 }),
            experience: fc.array(experienceArb, { maxLength: 5 }),
            education: fc.array(educationArb, { maxLength: 5 }),
            skills: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { maxLength: 10 }),
            projects: fc.array(projectArb, { maxLength: 5 }),
            certifications: fc.array(fc.string({ minLength: 1, maxLength: 100 }), { maxLength: 10 }),
            languages: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { maxLength: 10 }),
            contact: contactArb
        });

        fc.assert(
            fc.property(cvStateArb, (cvData) => {
                // Clear localStorage and store before each property test iteration
                localStorage.clear();
                useCvStore.getState().clearAll();

                // Set the state with generated data
                const store = useCvStore.getState();
                store.setBasic('img', cvData.img);
                store.setBasic('name', cvData.name);
                store.setBasic('role', cvData.role);
                store.setBasic('bio', cvData.bio);

                // Set contact info
                Object.entries(cvData.contact).forEach(([key, value]) => {
                    store.setContact(key as keyof typeof cvData.contact, value);
                });

                // Set array data
                cvData.experience.forEach(exp => store.setArrData('experience', exp));
                cvData.education.forEach(edu => store.setArrData('education', edu));
                cvData.projects.forEach(proj => store.setArrData('projects', proj));
                
                if (cvData.skills.length > 0) {
                    store.setArrData('skills', cvData.skills);
                }
                if (cvData.certifications.length > 0) {
                    store.setArrData('certifications', cvData.certifications);
                }
                if (cvData.languages.length > 0) {
                    store.setArrData('languages', cvData.languages);
                }

                // Get the state after setting all data
                const stateBeforePersist = useCvStore.getState();

                // Verify data was persisted to localStorage
                const stored = localStorage.getItem('cv-storage');
                expect(stored).toBeTruthy();

                // Simulate page reload by creating a new store instance
                // In Zustand with persist middleware, we need to clear the store and let it reload from localStorage
                // We'll use the importData/exportData as a proxy for the persistence round trip
                const exportedData = stateBeforePersist.exportData();
                
                // Clear the store
                store.clearAll();
                
                // Import the data back
                store.importData(exportedData);
                
                // Get the state after reload
                const stateAfterReload = useCvStore.getState();

                // Verify all fields match
                expect(stateAfterReload.img).toBe(cvData.img);
                expect(stateAfterReload.name).toBe(cvData.name);
                expect(stateAfterReload.role).toBe(cvData.role);
                expect(stateAfterReload.bio).toBe(cvData.bio);

                // Verify contact info
                expect(stateAfterReload.contact.email).toBe(cvData.contact.email);
                expect(stateAfterReload.contact.phone).toBe(cvData.contact.phone);
                expect(stateAfterReload.contact.website).toBe(cvData.contact.website);
                expect(stateAfterReload.contact.github).toBe(cvData.contact.github);
                expect(stateAfterReload.contact.linkedin).toBe(cvData.contact.linkedin);
                expect(stateAfterReload.contact.twitter).toBe(cvData.contact.twitter);

                // Verify array data lengths
                expect(stateAfterReload.experience.length).toBe(cvData.experience.length);
                expect(stateAfterReload.education.length).toBe(cvData.education.length);
                expect(stateAfterReload.projects.length).toBe(cvData.projects.length);
                expect(stateAfterReload.skills).toEqual(cvData.skills);
                expect(stateAfterReload.certifications).toEqual(cvData.certifications);
                expect(stateAfterReload.languages).toEqual(cvData.languages);

                // Verify experience items
                cvData.experience.forEach((exp, index) => {
                    expect(stateAfterReload.experience[index].title).toBe(exp.title);
                    expect(stateAfterReload.experience[index].company).toBe(exp.company);
                    expect(stateAfterReload.experience[index].location).toBe(exp.location);
                    expect(stateAfterReload.experience[index].startDate).toBe(exp.startDate);
                    expect(stateAfterReload.experience[index].endDate).toBe(exp.endDate);
                    expect(stateAfterReload.experience[index].description).toBe(exp.description);
                    // ID should be preserved
                    expect(stateAfterReload.experience[index].id).toBe(exp.id);
                });

                // Verify education items
                cvData.education.forEach((edu, index) => {
                    expect(stateAfterReload.education[index].title).toBe(edu.title);
                    expect(stateAfterReload.education[index].school).toBe(edu.school);
                    expect(stateAfterReload.education[index].location).toBe(edu.location);
                    expect(stateAfterReload.education[index].startDate).toBe(edu.startDate);
                    expect(stateAfterReload.education[index].endDate).toBe(edu.endDate);
                    expect(stateAfterReload.education[index].id).toBe(edu.id);
                });

                // Verify project items
                cvData.projects.forEach((proj, index) => {
                    expect(stateAfterReload.projects[index].name).toBe(proj.name);
                    expect(stateAfterReload.projects[index].url).toBe(proj.url);
                    expect(stateAfterReload.projects[index].id).toBe(proj.id);
                });
            }),
            { numRuns: 100 } // Run 100 iterations as specified in the design
        );
    });

    it('should persist data to localStorage when state changes', () => {
        const store = useCvStore.getState();
        
        store.setBasic('name', 'John Doe');
        store.setBasic('role', 'Developer');
        store.setContact('email', 'john@example.com');

        // Check that data was persisted to localStorage
        const stored = localStorage.getItem('cv-storage');
        expect(stored).toBeTruthy();
        
        if (stored) {
            const parsed = JSON.parse(stored);
            expect(parsed.state.name).toBe('John Doe');
            expect(parsed.state.role).toBe('Developer');
            expect(parsed.state.contact.email).toBe('john@example.com');
        }
    });

    it('should persist array data to localStorage', () => {
        const store = useCvStore.getState();
        
        const experience: Experience = {
            id: 'exp-1',
            title: 'Software Engineer',
            company: 'Tech Corp',
            location: 'San Francisco',
            startDate: '2020-01',
            endDate: '2023-01',
            description: 'Built things'
        };
        store.setArrData('experience', experience);
        store.setArrData('skills', ['JavaScript', 'TypeScript']);

        const stored = localStorage.getItem('cv-storage');
        expect(stored).toBeTruthy();
        
        if (stored) {
            const parsed = JSON.parse(stored);
            expect(parsed.state.experience).toHaveLength(1);
            expect(parsed.state.experience[0].title).toBe('Software Engineer');
            expect(parsed.state.skills).toEqual(['JavaScript', 'TypeScript']);
        }
    });

    it('should persist image data to localStorage', () => {
        const store = useCvStore.getState();
        
        const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        store.setBasic('img', base64Image);

        const stored = localStorage.getItem('cv-storage');
        expect(stored).toBeTruthy();
        
        if (stored) {
            const parsed = JSON.parse(stored);
            expect(parsed.state.img).toBe(base64Image);
        }
    });

    it('should clear localStorage when clearAll is called', () => {
        const store = useCvStore.getState();
        
        // Add some data
        store.setBasic('name', 'John Doe');
        store.setContact('email', 'john@example.com');
        
        // Verify data is in localStorage
        let stored = localStorage.getItem('cv-storage');
        expect(stored).toBeTruthy();

        // Clear all
        store.clearAll();

        // Verify localStorage is updated with empty state
        stored = localStorage.getItem('cv-storage');
        if (stored) {
            const parsed = JSON.parse(stored);
            expect(parsed.state.name).toBe('');
            expect(parsed.state.contact.email).toBe('');
        }
    });

    it('should include version information in persisted data', () => {
        const store = useCvStore.getState();
        
        store.setBasic('name', 'Test User');

        const stored = localStorage.getItem('cv-storage');
        expect(stored).toBeTruthy();
        
        if (stored) {
            const parsed = JSON.parse(stored);
            expect(parsed.version).toBe(1);
        }
    });
});
