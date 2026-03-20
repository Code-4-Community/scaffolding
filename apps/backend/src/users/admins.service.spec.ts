import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UpdateAdminEmailDto } from './dtos/update-admin-email.dto';
import { Admin } from './admin.entity';
import { DISCIPLINE_VALUES } from '../disciplines/disciplines.constants';

describe('AdminsService', () => {
  let service: AdminsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockAdmin: Admin = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
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

      expect(mockRepository.create).toHaveBeenCalledWith(createAdminDto);
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
        { ...mockAdmin, id: 2, email: 'jane@example.com' },
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
    it('should return an admin by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockAdmin);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockAdmin);
    });

    it('should throw NotFoundException when admin not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Admin with ID 999 not found'),
      );
    });

    it('should pass along any repo errors without information loss during retrieval', async () => {
      mockRepository.findOne.mockRejectedValueOnce(
        new Error('There was a problem retrieving the entry'),
      );

      await expect(service.findOne(1)).rejects.toThrow(
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

      const result = await service.updateEmail(1, updateEmailDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'newemail@example.com' }),
      );
      expect(result.email).toBe('newemail@example.com');
      expect(result.firstName).toBe(mockAdmin.firstName); // Should remain unchanged
      expect(result.lastName).toBe(mockAdmin.lastName); // Should remain unchanged
    });

    it('should throw NotFoundException when admin not found for email update', async () => {
      const updateEmailDto: UpdateAdminEmailDto = {
        email: 'newemail@example.com',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.updateEmail(999, updateEmailDto)).rejects.toThrow(
        new NotFoundException('Admin with ID 999 not found'),
      );
    });

    it('should handle email validation', async () => {
      const updateEmailDto: UpdateAdminEmailDto = {
        email: 'valid@example.com',
      };

      const updatedAdmin = { ...mockAdmin, email: 'valid@example.com' };

      mockRepository.findOne.mockResolvedValue(mockAdmin);
      mockRepository.save.mockResolvedValue(updatedAdmin);

      const result = await service.updateEmail(1, updateEmailDto);

      expect(result.email).toBe('valid@example.com');
    });

    it('should pass along any repo errors without information loss during retrieval', async () => {
      const updateEmailDto: UpdateAdminEmailDto = {
        email: 'valid@example.com',
      };

      mockRepository.findOne.mockRejectedValueOnce(
        new Error('There was a problem retrieving the entry'),
      );

      await expect(service.updateEmail(1, updateEmailDto)).rejects.toThrow(
        'There was a problem retrieving the entry',
      );
    });

    it('should pass along any repo errors without information loss during saving', async () => {
      const updateEmailDto: UpdateAdminEmailDto = {
        email: 'valid@example.com',
      };
      mockRepository.findOne.mockResolvedValue(mockAdmin);
      mockRepository.save.mockRejectedValueOnce(
        new Error('There was a problem saving the entry'),
      );
      await expect(service.updateEmail(1, updateEmailDto)).rejects.toThrow(
        'There was a problem saving the entry',
      );
    });
  });

  describe('remove', () => {
    it('should remove an admin', async () => {
      mockRepository.findOne.mockResolvedValue(mockAdmin);
      mockRepository.remove.mockResolvedValue(mockAdmin);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockAdmin);
    });

    it('should throw NotFoundException when admin not found for removal', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Admin with ID 999 not found'),
      );
    });

    it('should pass along any repo errors without information loss during retrieval', async () => {
      mockRepository.findOne.mockRejectedValueOnce(
        new Error('There was a problem retrieving the entry'),
      );

      await expect(service.remove(1)).rejects.toThrow(
        'There was a problem retrieving the entry',
      );
    });

    it('should pass along any repo errors without information loss during saving', async () => {
      mockRepository.findOne.mockResolvedValue(mockAdmin);
      mockRepository.remove.mockRejectedValueOnce(
        new Error('There was a problem saving the entry'),
      );
      await expect(service.remove(1)).rejects.toThrow(
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

      const result = await service.updateEmail(1, updateEmailDto);

      expect(result.email).toBe('john@example.com');
    });
  });
});
