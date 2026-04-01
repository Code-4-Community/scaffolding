import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import apiClient from '@api/apiClient';
import { useApplications } from './useApplications';
import type { Application } from '@api/types';

const mockApplications = [
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
    weeklyHours: 20,
    pronouns: 'she/her',
    desiredExperience: 'clinical',
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
    heardAboutFrom: [],
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
    weeklyHours: 10,
    pronouns: 'they/them',
    desiredExperience: 'community outreach',
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
    heardAboutFrom: [],
  },
] as Application[];

vi.mock('@api/apiClient', () => {
  return {
    default: {
      getApplications: vi.fn(),
    },
  };
});

describe('useApplications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should start in a loading state', () => {
    vi.mocked(apiClient.getApplications).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useApplications());

    expect(result.current.loading).toBe(true);
    expect(result.current.applications).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch applications and map to rows', async () => {
    vi.mocked(apiClient.getApplications).mockResolvedValue(mockApplications);

    const { result } = renderHook(() => useApplications());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.applications).toHaveLength(2);

    const first = result.current.applications[0];
    expect(first.appId).toBe(1);
    expect(first.name).toBe('jane@example.com');
    expect(first.email).toBe('jane@example.com');
    expect(first.discipline).toBe('RN');
    expect(first.status).toBe('App submitted');
    expect(first.experienceType).toBe('BS');
    expect(first.applicantType).toBe('Learner');

    const second = result.current.applications[1];
    expect(second.appId).toBe(2);
    expect(second.name).toBe('noname@example.com');
  });

  it('should set error state when API call fails', async () => {
    vi.mocked(apiClient.getApplications).mockRejectedValue(
      new Error('Network error'),
    );

    const { result } = renderHook(() => useApplications());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Failed to load applications');
    expect(result.current.applications).toEqual([]);
  });

  it('should handle empty response', async () => {
    vi.mocked(apiClient.getApplications).mockResolvedValue([]);

    const { result } = renderHook(() => useApplications());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.applications).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should call the API endpoint exactly once', async () => {
    vi.mocked(apiClient.getApplications).mockResolvedValue([]);

    renderHook(() => useApplications());

    await waitFor(() => {
      expect(apiClient.getApplications).toHaveBeenCalledTimes(1);
    });
  });
});
