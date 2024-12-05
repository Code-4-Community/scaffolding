export type NewApplicationInput = {
    appId: number; // Optional if auto-generated
    userId: number;
    siteId: number;
    names: string[]; // Array with empty string by default if not provided
    status: ApplicationStatus; // Defaults to "PENDING"
    dateApplied: string; // Defaults to an ISO string if not provided
    isFirstApplication: boolean;
  };
  
  export enum ApplicationStatus {
    APPROVED = 'Approved',
    PENDING = 'Pending',
    DENIED = 'Denied',
  }
  
