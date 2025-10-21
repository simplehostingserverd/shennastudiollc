const { MedusaModule, Modules } = require('@medusajs/framework/modules-sdk');
const { hashPassword } = require('@medusajs/framework/utils');

(async () => {
  const userModule = MedusaModule.resolve(Modules.USER);
  const newPassword = 'ShennaStudio2024Admin';
  const hashedPassword = await hashPassword(newPassword);
  
  await userModule.updateUsers({
    selector: { email: 'admin@shennastudio.com' },
    data: { password: hashedPassword }
  });
  
  console.log('Password updated successfully!');
  process.exit(0);
})();
