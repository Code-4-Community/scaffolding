import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { AdminsService } from './admin-info.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminEmailDto } from './dto/update-admin-email.dto';
import { Admin } from './admin-info.entity';
import { DISCIPLINE_VALUES } from '../disciplines/disciplines.constants';

describe('AdminsService', () => {
  let service: AdminsService;
  let repository: Repository<Admin>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockAdmin: Admin = {
    email: 'john@example.com',
    discipline: DISCIPLINE_VALUES.RN,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminsService,
        {
          provide: getRepositoryToken(Admin),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AdminsService>(AdminsService);
    repository = module.get<Repository<Admin>>(getRepositoryToken(Admin));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a new admin', async () => {
      const createAdminDto: CreateAdminDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        discipline: DISCIPLINE_VALUES.RN,
      };

      mockRepository.create.mockReturnValue(mockAdmin);
      mockRepository.save.mockResolvedValue(mockAdmin);

      const result = await service.create(createAdminDto);

      expect(mockRepository.create).toHaveBeenCalledWith({
        email: createAdminDto.email,
        discipline: createAdminDto.discipline,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockAdmin);
      expect(result).toEqual(mockAdmin);
    });

    it('should handle repository errors during creation', async () => {
      const createAdminDto: CreateAdminDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        discipline: DISCIPLINE_VALUES.RN,
      };

      mockRepository.create.mockReturnValue(mockAdmin);
      mockRepository.save.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.create(createAdminDto)).rejects.toThrow(
        'Database error',
      );
    });
    it('should pass along any repo errors without information loss during create', async () => {
      const createAdminDto: CreateAdminDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        discipline: DISCIPLINE_VALUES.RN,
      };

      mockRepository.create.mockImplementationOnce(() => {
        throw new Error('There was a problem creating the entry');
      });

      await expect(service.create(createAdminDto)).rejects.toThrow(
        'There was a problem creating the entry',
      );
    });

    it('should pass along any repo errors without information loss during save', async () => {
      const createAdminDto: CreateAdminDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        discipline: DISCIPLINE_VALUES.RN,
      };

      mockRepository.create.mockReturnValue(mockAdmin);
      mockRepository.save.mockRejectedValueOnce(
        new Error('There was a problem saving the entry'),
      );

      await expect(service.create(createAdminDto)).rejects.toThrow(
        'There was a problem saving the entry',
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of admins', async () => {
      const mockAdmins = [
        mockAdmin,
        { ...mockAdmin, email: 'jane@example.com' },
      ];
      mockRepository.find.mockResolvedValueOnce(mockAdmins);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockAdmins);
    });

    it('should return empty array when no admins exist', async () => {
      mockRepository.find.mockResolvedValueOnce([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should pass along any repo errors without information loss during retrieval', async () => {
      mockRepository.find.mockRejectedValueOnce(
        new Error('There was a problem retrieving the entries'),
      );

      await expect(service.findAll()).rejects.toThrow(
        'There was a problem retrieving the entries',
      );
    });
  });

  describe('findOne', () => {
    it('should return an admin by email', async () => {
      mockRepository.findOne.mockResolvedValue(mockAdmin);

      const result = await service.findOne('john@example.com');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(result).toEqual(mockAdmin);
    });

    it('should throw NotFoundException when admin not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('notfound@example.com')).rejects.toThrow(
        new NotFoundException(
          'Admin with email notfound@example.com not found',
        ),
      );
    });

    it('should pass along any repo errors without information loss during retrieval', async () => {
      mockRepository.findOne.mockRejectedValueOnce(
        new Error('There was a problem retrieving the entry'),
      );

      await expect(service.findOne('john@example.com')).rejects.toThrow(
        'There was a problem retrieving the entry',
      );
    });
  });

  describe('findByEmail', () => {
    it('should return an admin by email', async () => {
      mockRepository.findOne.mockResolvedValue(mockAdmin);

      const result = await service.findByEmail('john@example.com');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(result).toEqual(mockAdmin);
    });

    it('should return null when admin not found by email', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });

    it('should pass along any repo errors without information loss during retrieval', async () => {
      mockRepository.findOne.mockImplementationOnce(() => {
        throw new Error('There was a problem retrieving the entries');
      });

      await expect(service.findByEmail('n')).rejects.toThrow(
        'There was a problem retrieving the entries',
      );
    });
  });

  describe('updateEmail', () => {
    it('should update admin email and return the admin', async () => {
      const updateEmailDto: UpdateAdminEmailDto = {
        email: 'newemail@example.com',
      };

      const updatedAdmin = { ...mockAdmin, email: 'newemail@example.com' };

      mockRepository.findOne.mockResolvedValue(mockAdmin);
      mockRepository.save.mockResolvedValue(updatedAdmin);

      const result = await service.updateEmail(
        'john@example.com',
        updateEmailDto,
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'newemail@example.com' }),
      );
      expect(result.email).toBe('newemail@example.com');
      expect(result.discipline).toBe(mockAdmin.discipline);
    });

    it('should throw NotFoundException when admin not found for email update', async () => {
      const updateEmailDto: UpdateAdminEmailDto = {
        email: 'newemail@example.com',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateEmail('notfound@example.com', updateEmailDto),
      ).rejects.toThrow(
        new NotFoundException(
          'Admin with email notfound@example.com not found',
        ),
      );
    });

    it('should handle email validation', async () => {
      const updateEmailDto: UpdateAdminEmailDto = {
        email: 'valid@example.com',
      };

      const updatedAdmin = { ...mockAdmin, email: 'valid@example.com' };

      mockRepository.findOne.mockResolvedValue(mockAdmin);
      mockRepository.save.mockResolvedValue(updatedAdmin);

      const result = await service.updateEmail(
        'john@example.com',
        updateEmailDto,
      );

      expect(result.email).toBe('valid@example.com');
    });

    it('should pass along any repo errors without information loss during retrieval', async () => {
      const updateEmailDto: UpdateAdminEmailDto = {
        email: 'valid@example.com',
      };

      mockRepository.findOne.mockRejectedValueOnce(
        new Error('There was a problem retrieving the entry'),
      );

      await expect(
        service.updateEmail('john@example.com', updateEmailDto),
      ).rejects.toThrow('There was a problem retrieving the entry');
    });

    it('should pass along any repo errors without information loss during saving', async () => {
      const updateEmailDto: UpdateAdminEmailDto = {
        email: 'valid@example.com',
      };
      mockRepository.findOne.mockResolvedValue(mockAdmin);
      mockRepository.save.mockRejectedValueOnce(
        new Error('There was a problem saving the entry'),
      );
      await expect(
        service.updateEmail('john@example.com', updateEmailDto),
      ).rejects.toThrow('There was a problem saving the entry');
    });
  });

  describe('remove', () => {
    it('should remove an admin', async () => {
      mockRepository.findOne.mockResolvedValue(mockAdmin);
      mockRepository.remove.mockResolvedValue(mockAdmin);

      await service.remove('john@example.com');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockAdmin);
    });

    it('should throw NotFoundException when admin not found for removal', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('notfound@example.com')).rejects.toThrow(
        new NotFoundException(
          'Admin with email notfound@example.com not found',
        ),
      );
    });

    it('should pass along any repo errors without information loss during retrieval', async () => {
      mockRepository.findOne.mockRejectedValueOnce(
        new Error('There was a problem retrieving the entry'),
      );

      await expect(service.remove('john@example.com')).rejects.toThrow(
        'There was a problem retrieving the entry',
      );
    });

    it('should pass along any repo errors without information loss during removal', async () => {
      mockRepository.findOne.mockResolvedValue(mockAdmin);
      mockRepository.remove.mockRejectedValueOnce(
        new Error('There was a problem saving the entry'),
      );
      await expect(service.remove('john@example.com')).rejects.toThrow(
        'There was a problem saving the entry',
      );
    });
  });

  describe('edge cases', () => {
    it('should handle database connection errors', async () => {
      mockRepository.find.mockRejectedValue(new Error('Connection failed'));

      await expect(service.findAll()).rejects.toThrow('Connection failed');
    });

    it('should handle invalid email format in findByEmail', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('invalid-email');

      expect(result).toBeNull();
    });

    it('should handle email update with same email', async () => {
      const updateEmailDto: UpdateAdminEmailDto = {
        email: 'john@example.com',
      };

      mockRepository.findOne.mockResolvedValue(mockAdmin);
      mockRepository.save.mockResolvedValue(mockAdmin);

      const result = await service.updateEmail(
        'john@example.com',
        updateEmailDto,
      );

      expect(result.email).toBe('john@example.com');
    });
  });
});
