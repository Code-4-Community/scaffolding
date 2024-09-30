import { Injectable } from "@nestjs/common";
import { SiteModel } from "./site.model";

@Injectable()
export class SiteService {

    /**
     * Gets a company information based on that company's id.
     * @param companyId
     * @returns
    */
    public async getCompany(siteId: number): Promise<SiteModel> {
        try{
            return await getSiteData(siteId) as Promise<SiteModel>
        }  
        catch(e) {
            throw new Error("Unable to get site data")
        }

    }

}