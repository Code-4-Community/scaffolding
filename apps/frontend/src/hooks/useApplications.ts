import { useEffect, useState } from 'react';
import apiClient from '@api/apiClient';
import type { Application, User } from '@api/types';

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

function toRows(
  applications: Application[],
  usersByEmail: Map<string, User>,
): ApplicationRow[] {
  return applications.map((app) => {
    const user = usersByEmail.get(app.email);
    const name = user ? `${user.firstName} ${user.lastName}` : app.email;

    return {
      appId: app.appId,
      name,
      email: app.email,
      proposedStartDate: app.proposedStartDate,
      actualStartDate: app.actualStartDate ?? '',
      experienceType: app.experienceType,
      discipline: app.discipline,
      applicantType: app.applicantType,
      status: app.appStatus,
    };
  });
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
        const [apps, users] = await Promise.all([
          apiClient.getApplications(),
          apiClient.getUsers(),
        ]);
        if (!cancelled) {
          const usersByEmail = new Map(users.map((u) => [u.email, u]));
          setApplications(toRows(apps, usersByEmail));
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
