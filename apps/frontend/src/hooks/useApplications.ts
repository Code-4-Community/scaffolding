import { useEffect, useState } from 'react';
import apiClient from '@api/apiClient';
import type { Application } from '@api/types';

export interface ApplicationRow {
  appId: number;
  name: string;
  email: string;
  proposedStartDate: string;
  actualStartDate: string;
  experienceType: string;
  discipline: string;
  applicantType: string;
  status: string;
}

interface UseApplicationsResult {
  applications: ApplicationRow[];
  loading: boolean;
  error: string | null;
}

function toRows(applications: Application[]): ApplicationRow[] {
  return applications.map((app) => ({
    appId: app.appId,
    name: app.email,
    email: app.email,
    proposedStartDate: '',
    actualStartDate: '',
    experienceType: app.experienceType,
    discipline: app.discipline,
    applicantType: app.applicantType,
    status: app.appStatus,
  }));
}

export function useApplications(): UseApplicationsResult {
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const apps = await apiClient.getApplications();
        if (!cancelled) {
          setApplications(toRows(apps));
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load applications');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  return { applications, loading, error };
}
