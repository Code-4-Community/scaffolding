import { Injectable } from "@nestjs/common";
import { SiteModel, SiteStatus } from "./site.model";
import { DynamoDbService } from "../dynamodb"; 

@Injectable()
export class SiteService {

    private readonly tableName = 'greenInfraBostonSites';

    constructor(private readonly dynamoDbService: DynamoDbService) {}

    /**
     * Gets a site information based on that site's id.
     * @param siteId
     * @returns
    */
    public async getSite(siteId: number): Promise<SiteModel> {
        try{
            const key = { 'Object ID?': { N: siteId } };
            const data = await this.dynamoDbService.getItem(this.tableName, key);
            return(this.mapDynamoDBItemToSite(siteId, data));
        }  
        catch(e) {
            throw new Error("Unable to get site data: "+ e)
        }
    }

    public async getSitesByStatus(status: string): Promise<SiteModel[]> {
        try {
            const data = await this.dynamoDbService.scanTable(this.tableName, "Site Status = :status", { ":status": { S: status } });
            const sites: SiteModel[] = [];
            for (let i = 0; i < data.length; i++) {
                sites.push(this.mapDynamoDBItemToSite(data[i]["Object ID?"].N, data[i]));
            }
            return sites;
        }
        catch(e) {
            throw new Error("Unable to get site data: "+ e)
        }

    }

    private mapDynamoDBItemToSite = (objectId: number, item: { [key: string]: any }): SiteModel => {
        return {
            siteID: objectId,
            siteName: item["Asset Name"].S,
            siteStatus: SiteStatus.AVAILABLE, //placeholder until table is updated
            assetType: item["Asset Type"].S,
            symbolType: item["Symbol Type"].S,
            siteLatitude: item["Lat"].S,
            siteLongitude: item["Long"].S,
            dateAdopted: new Date(), //placeholder until table is updated
            maintenanceReports: [], //placeholder until table is updated
            neighborhood: item["Neighborhood"].S,
            address: item["Address"].S
        };
    };

}