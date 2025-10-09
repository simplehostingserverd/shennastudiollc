// Reset admin password script for Medusa v2
// Run this on Railway Backend service

import { MedusaModule, Modules } from '@medusajs/framework/modules-sdk';
import { hashPassword } from '@medusajs/framework/utils';

const ADMIN_EMAIL = 'admin@shennastudio.com';
const NEW_PASSWORD = 'ShennaStudio2024Admin';

(async () => {
  try {
    console.log('Resetting admin password...');
    console.log('Email:', ADMIN_EMAIL);

    const userModule = MedusaModule.resolve(Modules.USER);
    const hashedPassword = await hashPassword(NEW_PASSWORD);

    // Find the user first
    const users = await userModule.listUsers({ email: ADMIN_EMAIL });

    if (users.length === 0) {
      console.log('User not found. Creating new admin user...');
      await userModule.createUsers({
        email: ADMIN_EMAIL,
        password: hashedPassword,
      });
      console.log('✓ Admin user created!');
    } else {
      console.log('User found. Updating password...');
      await userModule.updateUsers(users[0].id, {
        password: hashedPassword
      });
      console.log('✓ Password updated!');
    }

    console.log('');
    console.log('Login credentials:');
    console.log('  Email:', ADMIN_EMAIL);
    console.log('  Password:', NEW_PASSWORD);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
