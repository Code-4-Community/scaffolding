import {
    Controller,
    Get,
    Query,
} from "@nestjs/common";
import { SiteService } from "./site.service";
import { SiteModel } from "./site.model";

@Controller("site")
export class SiteController {
    constructor(private siteService: SiteService) {}

    @Get("siteInfo")
    public async getSite(
        @Query("siteId") siteId?: number
    ): Promise<SiteModel> {
        return this.siteService.getSite(siteId);
    }  


}