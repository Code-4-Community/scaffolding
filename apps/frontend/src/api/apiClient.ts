import axios, { type AxiosInstance } from 'axios';
import {
  ApplicantType,
  AppStatus,
  DISCIPLINE_VALUES,
  ExperienceType,
  HeardAboutFrom,
  InterestArea,
} from './types';

export interface AvailabilityFields {
  mondayAvailability: string;
  tuesdayAvailability: string;
  wednesdayAvailability: string;
  thursdayAvailability: string;
  fridayAvailability: string;
  saturdayAvailability: string;
}

export interface Application extends AvailabilityFields {
  appId: number;
  email: string;
  discipline: DISCIPLINE_VALUES;
  otherDisciplineDescription?: string;
  appStatus: AppStatus;
  mondayAvailability: string;
  tuesdayAvailability: string;
  wednesdayAvailability: string;
  thursdayAvailability: string;
  fridayAvailability: string;
  saturdayAvailability: string;
  experienceType: ExperienceType;
  interest: InterestArea[];
  license: string;
  phone: string;
  applicantType: ApplicantType;
  referred?: boolean;
  referredEmail?: string;
  weeklyHours: number;
  pronouns: string;
  nonEnglishLangs?: string;
  desiredExperience: string;
  elaborateOtherDiscipline?: string;
  resume: string;
  coverLetter: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  heardAboutFrom: HeardAboutFrom[];
}

const defaultBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({ baseURL: defaultBaseUrl });
  }

  public async getHello(): Promise<string> {
    return this.get('/api') as Promise<string>;
  }

  public async getApplication(appId: number): Promise<Application> {
    return this.get(`/api/applications/${appId}`) as Promise<Application>;
  }

  public async updateAvailability(
    appId: number,
    availability: Partial<AvailabilityFields>,
  ): Promise<Application> {
    return this.patch(
      `/api/applications/${appId}/availability`,
      availability,
    ) as Promise<Application>;
  }

  private async get(path: string): Promise<unknown> {
    return this.axiosInstance.get(path).then((response) => response.data);
  }

  private async post(path: string, body: unknown): Promise<unknown> {
    return this.axiosInstance
      .post(path, body)
      .then((response) => response.data);
  }

  private async patch(path: string, body: unknown): Promise<unknown> {
    return this.axiosInstance
      .patch(path, body)
      .then((response) => response.data);
  }

  private async delete(path: string): Promise<unknown> {
    return this.axiosInstance.delete(path).then((response) => response.data);
  }
}

export default new ApiClient();
