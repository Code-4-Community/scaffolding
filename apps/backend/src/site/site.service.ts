import { Injectable } from "@nestjs/common";
import { SiteModel } from "./site.model";

@Injectable()
export class SiteService {

    /**
     * Gets a site information based on that site's id.
     * @param siteId
     * @returns
    */
    public async getSite(siteId: number): Promise<SiteModel> {
        try{
            return await getSiteData(siteId) as Promise<SiteModel>
        }  
        catch(e) {
            throw new Error("Unable to get site data")
        }

    }

}