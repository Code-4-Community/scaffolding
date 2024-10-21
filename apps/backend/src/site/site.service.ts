import { Injectable } from "@nestjs/common";
import { SiteModel, SiteStatus, SymbolType } from "./site.model";
import { DynamoDbService } from "../dynamodb"; 
import { NewSiteInput } from "../dtos/newSiteDTO";

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

    public async postSite(siteData: NewSiteInput) {
        const siteModel = this.PostInputToSiteModel(siteData);
        try {
            const result = await this.dynamoDbService.postItem(this.tableName, siteModel);
            return result;
        } catch (e) {
            throw new Error("Unable to post new site: " + e);
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

    private PostInputToSiteModel = (input: NewSiteInput): SiteModel => {
        return {
            siteID: 1,
            siteName: input.siteName,
            siteStatus: SiteStatus.AVAILABLE,
            assetType: input.assetType,
            symbolType: input.symbolType as SymbolType,
            siteLatitude: input.siteLatitude,
            siteLongitude: input.siteLongitude,
            dateAdopted: null,
            maintenanceReports: input.maintenanceReports,
            neighborhood: input.neighborhood,
            address: input.address
        };
    }

}