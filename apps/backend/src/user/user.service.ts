import { Injectable } from "@nestjs/common";
import { UserModel } from "./user.model";

@Injectable()
export class UserService {

 

    /**
     * Gets a user's information based on the user's id
     * @param userId The user's id
     * @returns The user's information
     */
    public async getUser(userId: number): Promise<UserModel> {
        try {
            return null
            // TODO add logic to communicate with database
            // return await getUserData(userId) as Promise<UserModel>
        }
        catch(e) {
            throw new Error("Unable to get user")
        }

    }



}