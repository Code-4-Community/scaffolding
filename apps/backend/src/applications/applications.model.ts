/**
 * Represents the model schema of an application
 */

export type ApplicationsModel = {
  appId: number;
  userId: number;
  siteId: number;
  names: Array<string>;
  status: ApplicationStatus;
  dateApplied: Date;
  isFirstApplication: boolean;
};

export type ApplicationInputModel = {
  appId: {
   N: string 
},
  userId: { N: string },
  siteId: { N: string },
  names: { SS: string[] },  // For an array of strings, use SS (String Set) in DynamoDB
  status: { S: string },
  dateApplied: { S: string },  // Date should be formatted as a string, typically ISO string
  isFirstApplication: { S: string },
};



export enum ApplicationStatus {
  APPROVED = 'Approved',
  PENDING = 'Pending',
  REJECTED = 'Rejected',
}
