import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import apiClient from '@api/apiClient';
import { useApplications } from './useApplications';
import type { Application, Applicant } from '@api/apiClient';

const mockApplications: Application[] = [
  {
    appId: 1,
    email: 'jane@example.com',
    discipline: 'RN',
    appStatus: 'App submitted',
    experienceType: 'BS',
    interest: [],
    license: 'n/a',
    phone: '123-456-7890',
    applicantType: 'Learner',
    school: 'BU',
    weeklyHours: 20,
    pronouns: 'she/her',
    resume: 'resume.pdf',
    coverLetter: 'cover.pdf',
    emergencyContactName: 'Mom',
    emergencyContactPhone: '111-111-1111',
    emergencyContactRelationship: 'Mother',
    mondayAvailability: '9-5',
    tuesdayAvailability: '9-5',
    wednesdayAvailability: '9-5',
    thursdayAvailability: '9-5',
    fridayAvailability: '9-5',
    saturdayAvailability: 'none',
  },
  {
    appId: 2,
    email: 'noname@example.com',
    discipline: 'Social Work',
    appStatus: 'In review',
    experienceType: 'MS',
    interest: [],
    license: 'LCSW',
    phone: '222-333-4444',
    applicantType: 'Volunteer',
    school: 'NEU',
    weeklyHours: 10,
    pronouns: 'they/them',
    resume: 'resume2.pdf',
    coverLetter: 'cover2.pdf',
    emergencyContactName: 'Dad',
    emergencyContactPhone: '222-222-2222',
    emergencyContactRelationship: 'Father',
    mondayAvailability: 'none',
    tuesdayAvailability: '10-2',
    wednesdayAvailability: 'none',
    thursdayAvailability: '10-2',
    fridayAvailability: 'none',
    saturdayAvailability: 'none',
  },
];

const mockApplicants: Applicant[] = [
  {
    appId: 1,
    firstName: 'Jane',
    lastName: 'Doe',
    proposedStartDate: '2026-01-15',
    actualStartDate: '2026-02-01',
    endDate: '2026-06-30',
  },
];

vi.mock('@api/apiClient', () => {
  return {
    default: {
      getApplications: vi.fn(),
      getApplicants: vi.fn(),
    },
  };
});

describe('useApplications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should start in a loading state', () => {
    vi.mocked(apiClient.getApplications).mockReturnValue(new Promise(() => {}));
    vi.mocked(apiClient.getApplicants).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useApplications());

    expect(result.current.loading).toBe(true);
    expect(result.current.applications).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch and merge applications with applicants', async () => {
    vi.mocked(apiClient.getApplications).mockResolvedValue(mockApplications);
    vi.mocked(apiClient.getApplicants).mockResolvedValue(mockApplicants);

    const { result } = renderHook(() => useApplications());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.applications).toHaveLength(2);

    const first = result.current.applications[0];
    expect(first.appId).toBe(1);
    expect(first.name).toBe('Jane Doe');
    expect(first.proposedStartDate).toBe('2026-01-15');
    expect(first.actualStartDate).toBe('2026-02-01');
    expect(first.discipline).toBe('RN');
    expect(first.status).toBe('App submitted');
    expect(first.experienceType).toBe('BS');
    expect(first.applicantType).toBe('Learner');

    const second = result.current.applications[1];
    expect(second.appId).toBe(2);
    expect(second.name).toBe('noname@example.com');
    expect(second.proposedStartDate).toBe('');
    expect(second.actualStartDate).toBe('');
  });

  it('should fall back to email when no matching applicant exists', async () => {
    vi.mocked(apiClient.getApplications).mockResolvedValue(mockApplications);
    vi.mocked(apiClient.getApplicants).mockResolvedValue([]);

    const { result } = renderHook(() => useApplications());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.applications[0].name).toBe('jane@example.com');
    expect(result.current.applications[1].name).toBe('noname@example.com');
  });

  it('should set error state when API call fails', async () => {
    vi.mocked(apiClient.getApplications).mockRejectedValue(
      new Error('Network error'),
    );
    vi.mocked(apiClient.getApplicants).mockRejectedValue(
      new Error('Network error'),
    );

    const { result } = renderHook(() => useApplications());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Failed to load applications');
    expect(result.current.applications).toEqual([]);
  });

  it('should handle empty responses from both endpoints', async () => {
    vi.mocked(apiClient.getApplications).mockResolvedValue([]);
    vi.mocked(apiClient.getApplicants).mockResolvedValue([]);

    const { result } = renderHook(() => useApplications());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.applications).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should call both API endpoints exactly once', async () => {
    vi.mocked(apiClient.getApplications).mockResolvedValue([]);
    vi.mocked(apiClient.getApplicants).mockResolvedValue([]);

    renderHook(() => useApplications());

    await waitFor(() => {
      expect(apiClient.getApplications).toHaveBeenCalledTimes(1);
      expect(apiClient.getApplicants).toHaveBeenCalledTimes(1);
    });
  });
});
