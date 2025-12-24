import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.request.dto';

/**
 * Service for applications that interfaces with the application repository
 */
@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  /**
   * Method to return all applications in the repository
   * @returns a promise for all applications in the repository
   * @throws anything the repository throws
   */
  async findAll(): Promise<Application[]> {
    return await this.applicationRepository.find();
  }

  /**
   * Method to return an application by Id from the repository
   * @param appId The desired application Id to search for
   * @returns a promise of the application with that id
   * @throws NotFoundException with message 'Application with ID <id> not found'
   *         if an application of that Id does not exist. Will also throw anything
   *         that the repository throws.
   */
  async findById(appId: number): Promise<Application> {
    const application: Application = await this.applicationRepository.findOne({
      where: { appId },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${appId} not found`);
    }

    return application;
  }

  /**
   * Method to create an application in the repository
   * @param createApplicationDto the expected data required to create an application (applicant's info)
   * @returns the newly created application
   * @throws anything the repository throws.
   */
  async create(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    const application = this.applicationRepository.create(createApplicationDto);
    return await this.applicationRepository.save(application);
  }

  /**
   * Method to update the status of the application in the repository
   * @param appId the Id of the application to update
   * @param updateData object containing the desired new application status
   * @returns the new application object after changes have been made
   * @throws NotFoundException with message 'Application with ID <id> not found'
   *         if an application of that Id does not exist. Will also throw anything
   *         that the repository throws.
   */
  async update(
    appId: number,
    updateData: Partial<CreateApplicationDto>,
  ): Promise<Application> {
    const application = await this.findById(appId);
    if (!application) {
      throw new NotFoundException(`Application with ID ${appId} not found`);
    }
    Object.assign(application, updateData);
    return await this.applicationRepository.save(application);
  }

  async delete(appId: number): Promise<void> {
    const application = await this.findById(appId);
    if (!application) {
      throw new NotFoundException(`Application with ID ${appId} not found`);
    }
    await this.applicationRepository.remove(application);
  }
}
