import createAdminUser from '../create-admin';
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils';

describe('createAdminUser', () => {
  let container;
  let logger;
  let userService;
  let authService;

  beforeEach(() => {
    logger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
    userService = {
      listUsers: jest.fn(),
      createUsers: jest.fn(),
    };
    authService = {
      createAuthIdentities: jest.fn(),
    };
    container = {
      resolve: jest.fn((key) => {
        if (key === ContainerRegistrationKeys.LOGGER) {
          return logger;
        }
        if (key === Modules.USER) {
          return userService;
        }
        if (key === Modules.AUTH) {
          return authService;
        }
      }),
    };
  });

  it('should create an admin user if one does not exist', async () => {
    userService.listUsers.mockResolvedValue([]);
    userService.createUsers.mockResolvedValue({ id: 'user-123' });

    await createAdminUser({ container });

    expect(userService.listUsers).toHaveBeenCalledWith({
      email: 'admin@shennastudio.com',
    });
    expect(userService.createUsers).toHaveBeenCalled();
    expect(authService.createAuthIdentities).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('✅ Admin user created successfully!');
  });

  it('should skip creation if an admin user already exists', async () => {
    userService.listUsers.mockResolvedValue([{ id: 'user-123' }]);

    await createAdminUser({ container });

    expect(userService.listUsers).toHaveBeenCalledWith({
      email: 'admin@shennastudio.com',
    });
    expect(userService.createUsers).not.toHaveBeenCalled();
    expect(authService.createAuthIdentities).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(
      '✅ Admin user already exists: admin@shennastudio.com'
    );
  });
});
