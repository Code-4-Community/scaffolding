import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { AdminsService } from './admin-info.service';
import { Admin } from './admin-info.entity';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminEmailDto } from './dto/update-admin-email.dto';

/**
 * Controller to expose callable HTTP endpoints to interface
 * extract, and change information about the app's admins.
 */
@Controller('admins')
@UseInterceptors(CurrentUserInterceptor) // Apply authentication to all routes
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  /**
   * Exposes an endpoint to create an admin in the system.
   * @param createAdminDto object containing all of the necessary fields to create an admin.
   * @returns the new admin object.
   * @throws {Error} anything that the repository throws.
   */
  @Post()
  async create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return await this.adminsService.create(createAdminDto);
  }

  /**
   * Exposes an endpoint to return an admin's information by their email.
   * @param email the email of the desired admin (primary key).
   * @returns the admin with the desired email.
   * @throws {NotFoundException} if an admin with the desired email does not exist.
   * @throws {Error} anything that the repository throws.
   */
  @Get('email/:email')
  async findOne(@Param('email') email: string): Promise<Admin> {
    return await this.adminsService.findOne(email);
  }

  /**
   * Exposes an endpoint to return an admin by email, or null if not found.
   * @param email the email of the desired admin.
   * @returns the admin with the desired email, or null if not found.
   * @throws {Error} anything that the repository throws.
   */
  @Get('by-email/:email')
  async findByEmail(@Param('email') email: string): Promise<Admin | null> {
    return await this.adminsService.findByEmail(email);
  }

  /**
   * Exposes an endpoint to update an admin's email.
   * @param email the email of the admin to update (current primary key).
   * @param updateEmailDto object containing the new email.
   * @returns the updated admin object.
   * @throws {Error} anything that the repository throws.
   */
  @Patch('email/:email')
  async updateEmail(
    @Param('email') email: string,
    @Body() updateEmailDto: UpdateAdminEmailDto,
  ): Promise<Admin> {
    return await this.adminsService.updateEmail(email, updateEmailDto);
  }

  /**
   * Exposes an endpoint to delete an admin by email.
   * @param email the email of the admin to be deleted (primary key).
   * @returns object with a message confirming deletion.
   * @throws {Error} anything that the repository throws.
   */
  @Delete('email/:email')
  async remove(@Param('email') email: string): Promise<{ message: string }> {
    await this.adminsService.remove(email);
    return { message: `Admin with email ${email} has been deleted` };
  }
}
