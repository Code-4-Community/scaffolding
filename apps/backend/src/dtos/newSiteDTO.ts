export type NewSiteInput = {
    // siteID: number /// will be auto generated
    siteName: string,
    // siteStatus: string, will always be "AVAILABLE"
    assetType: string,
    symbolType: string,
    siteLatitude: number,
    siteLongitude: number,
    // dateAdopted: Date, will be null
    maintenanceReports: number[],
    neighborhood: string,
    address: string
};