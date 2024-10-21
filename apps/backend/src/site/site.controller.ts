import {
    Controller,
    Get,
    Post,
    Body,
    Param,
} from "@nestjs/common";
import { SiteService } from "./site.service";
import { SiteModel } from "./site.model";
import { NewSiteInput } from "../dtos/newSiteDTO";


@Controller("sites")
export class SiteController {
    constructor(private siteService: SiteService) {}

    @Get(":id")
    public async getSite(
        @Param("id") siteId: number
    ): Promise<SiteModel> {
        return this.siteService.getSite(siteId);
    }  

    @Post("")
    public async postSite(@Body() siteData: NewSiteInput) {
        return this.siteService.postSite(siteData);
    }


}