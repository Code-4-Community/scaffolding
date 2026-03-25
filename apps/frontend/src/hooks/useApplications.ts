import { useEffect, useState } from 'react';
import apiClient, { type Application, type Applicant } from '@api/apiClient';

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

function mergeData(
  applications: Application[],
  applicants: Applicant[],
): ApplicationRow[] {
  const applicantsByAppId = new Map(applicants.map((a) => [a.appId, a]));

  return applications.map((app) => {
    const applicant = applicantsByAppId.get(app.appId);
    return {
      appId: app.appId,
      name: applicant
        ? `${applicant.firstName} ${applicant.lastName}`
        : app.email,
      email: app.email,
      proposedStartDate: applicant?.proposedStartDate ?? '',
      actualStartDate: applicant?.actualStartDate ?? '',
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
        const [apps, applicants] = await Promise.all([
          apiClient.getApplications(),
          apiClient.getApplicants(),
        ]);
        if (!cancelled) {
          setApplications(mergeData(apps, applicants));
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
