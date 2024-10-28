import {
    Controller,
    Get,
    Param,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserModel, UserStatus } from "./user.model";

@Controller("user")
export class UserController {
    constructor(private userService: UserService) {}

    /**
     * Gets a single user by ID.
     * @param userId The ID of the user to retrieve.
     * @returns The user's information as a UserModel object.
     */
    @Get(":id")
    public async getUser(
        @Param("id") userId: number
    ): Promise<UserModel> {
        return this.userService.getUser(userId);
    }

    /**
     * Gets users by their status.
     * @param status The status to filter users by (e.g., Approved, Pending, Denied).
     * @returns A list of users with the specified status.
     */
    @Get("status/:status")
    public async getUserByStatus(
        @Param("status") status: UserStatus
    ): Promise<UserModel[]> {
        console.log(status);
        return this.userService.getUserByStatus(status);
    }
}
