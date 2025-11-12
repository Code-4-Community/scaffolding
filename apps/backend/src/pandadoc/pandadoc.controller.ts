import { Controller, Get, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PandadocService } from './pandadoc.service';

@ApiTags('PandaDoc')
@Controller('pandadoc')
export class PandadocController {
  private readonly logger = new Logger(PandadocController.name);

  constructor(private readonly pandadocService: PandadocService) {}

  @Get('test')
  @ApiOperation({ summary: 'Test PandaDoc API connection' })
  @ApiResponse({
    status: 200,
    description: 'Connection test result',
    schema: {
      example: {
        success: true,
        message: 'Successfully connected to PandaDoc API',
        apiVersion: 'v1',
        authenticated: true,
      },
    },
  })
  async testConnection() {
    this.logger.log('Testing PandaDoc API connection via endpoint');
    return this.pandadocService.testConnection();
  }

  @Get('templates')
  @ApiOperation({ summary: 'Fetch all available PandaDoc templates' })
  @ApiResponse({
    status: 200,
    description: 'List of templates',
    schema: {
      example: {
        success: true,
        count: 2,
        data: {
          results: [
            {
              id: 'template-id-1',
              name: 'Template Name',
              date_created: '2024-01-01T00:00:00.000Z',
            },
          ],
        },
      },
    },
  })
  async getTemplates() {
    this.logger.log('Fetching templates via endpoint');
    return this.pandadocService.getTemplates();
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Fetch a specific template by ID' })
  @ApiParam({
    name: 'id',
    description: 'The PandaDoc template ID',
    example: 'abc123def456',
  })
  @ApiResponse({
    status: 200,
    description: 'Template details',
    schema: {
      example: {
        success: true,
        data: {
          id: 'abc123def456',
          name: 'Template Name',
          tokens: [],
          fields: [],
        },
      },
    },
  })
  async getTemplateById(@Param('id') id: string) {
    this.logger.log(`Fetching template ${id} via endpoint`);
    return this.pandadocService.getTemplateById(id);
  }
}
