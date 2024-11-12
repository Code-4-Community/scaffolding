import {
    Controller,
    Get,
    Param,
    Put,
    Body
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserModel, EditUserModel } from "./user.model";

/**
 * The controller for user endpoints.
 */
@Controller("user")
export class UserController {
    constructor(private userService: UserService) {}

    @Get(":id")
    public async getUser(
        @Param("id") userId?: number
        ): Promise<UserModel> {
            return this.userService.getUser(userId);
        }

    
    @Get(":id/sites")
    public async getUserSites(@Param("id") userId?: number): Promise<any> {
        return this.userService.getUserTables(userId);
    }

    @Put("/editUser/:id")
    public async editUser(
        @Param("id") userId?: number, 
        @Body() editUserModel?: EditUserModel
    ): Promise<UserModel> {
        return this.userService.editUser(userId, editUserModel);
    }


}