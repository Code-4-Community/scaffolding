import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { Admin } from './admin.entity';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UpdateAdminEmailDto } from './dtos/update-admin-email.dto';

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
   * Exposes an endpoint to return an admin's information by their Id.
   * @param id the id of the desired admin.
   * @returns the admin with the desired Id.
   * @throws {Error} anything that the repository throws.
   * @throws {NotFoundException} if an admin with the
   *         desired id does not exist in the system.
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Admin> {
    return await this.adminsService.findOne(id);
  }

  /**
   * Exposes an endpoint to return an admin's information by their email.
   * @param email the email of the desired admin.
   * @returns the admin with the desired email,
   *          or null if an admin with the specified email does not exist in the system.
   * @throws {Error} anything that the repository throws.
   */
  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<Admin | null> {
    return await this.adminsService.findByEmail(email);
  }

  /**
   * Exposes an endpoint to update an admin's email.
   * @param id the id fo the desired admin to update.
   * @param updateEmailDto object containing the new email to update to.
   * @returns the new admin object.
   * @throws {Error} anything that the repository throws.
   */
  @Patch(':id/email')
  async updateEmail(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmailDto: UpdateAdminEmailDto,
  ): Promise<Admin> {
    return await this.adminsService.updateEmail(id, updateEmailDto);
  }

  /**
   * Exposes an endpoint to delete an admin by id
   * @param id the id of the admin to be deleted
   * @returns object with a message containing 'Admin with ID <id> has been deleted'
   * @throws {Error} anything that the repository throws
   */
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.adminsService.remove(id);
    return { message: `Admin with ID ${id} has been deleted` };
  }
}
