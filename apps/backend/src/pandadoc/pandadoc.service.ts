import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class PandadocService {
  private readonly logger = new Logger(PandadocService.name);
  private readonly apiClient: AxiosInstance;
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.NX_PANDADOC_API_KEY || '';

    if (!this.apiKey) {
      this.logger.warn(
        'PandaDoc API key not configured. Set NX_PANDADOC_API_KEY in .env file.',
      );
    }

    this.apiClient = axios.create({
      baseURL: 'https://api.pandadoc.com/public/v1',
      headers: {
        Authorization: `API-Key ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Fetch all available templates from PandaDoc
   * @returns Promise with templates data
   */
  async getTemplates() {
    try {
      this.logger.log('Fetching templates from PandaDoc...');

      const response = await this.apiClient.get('/templates');

      this.logger.log(
        `Successfully fetched ${response.data.results?.length || 0} templates`,
      );

      return {
        success: true,
        data: response.data,
        count: response.data.results?.length || 0,
      };
    } catch (error) {
      this.logger.error('Failed to fetch templates from PandaDoc', error);

      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data || error.message,
          statusCode: error.response?.status,
        };
      }

      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  }

  /**
   * Test the connection to PandaDoc API
   * @returns Promise with connection status
   */
  async testConnection() {
    try {
      this.logger.log('Testing PandaDoc API connection...');

      // A simple GET request to templates endpoint to verify authentication
      const response = await this.apiClient.get('/templates', {
        params: { count: 1 }, // Only fetch 1 template to minimize response size
      });

      this.logger.log('PandaDoc API connection successful');

      return {
        success: true,
        message: 'Successfully connected to PandaDoc API',
        apiVersion: 'v1',
        authenticated: true,
      };
    } catch (error) {
      this.logger.error('PandaDoc API connection test failed', error);

      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        let message = 'Connection failed';

        if (statusCode === 401) {
          message = 'Authentication failed. Please check your API key.';
        } else if (statusCode === 403) {
          message = 'Access forbidden. Please verify your API key permissions.';
        } else if (
          error.code === 'ENOTFOUND' ||
          error.code === 'ECONNREFUSED'
        ) {
          message =
            'Cannot reach PandaDoc API. Please check your internet connection.';
        }

        return {
          success: false,
          message,
          error: error.response?.data || error.message,
          statusCode,
        };
      }

      return {
        success: false,
        message: 'An unexpected error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get details of a specific template by ID
   * @param templateId The ID of the template
   * @returns Promise with template details
   */
  async getTemplateById(templateId: string) {
    try {
      this.logger.log(`Fetching template with ID: ${templateId}`);

      const response = await this.apiClient.get(
        `/templates/${templateId}/details`,
      );

      this.logger.log(
        `Successfully fetched template: ${response.data.name || templateId}`,
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch template ${templateId}`, error);

      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.response?.data || error.message,
          statusCode: error.response?.status,
        };
      }

      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  }
}
