import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function createPublishableKey({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);

  try {
    logger.info("Creating publishable API key...");

    // Get the default sales channel
    const salesChannels = await salesChannelModuleService.listSalesChannels();
    const defaultSalesChannel = salesChannels.find(sc => sc.name === "Default Sales Channel") || salesChannels[0];
    
    if (!defaultSalesChannel) {
      logger.error("No sales channel found. Please run seed script first.");
      return;
    }

    // Create API key
    const { result: apiKeys } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Store Frontend Key",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });

    const apiKey = apiKeys[0];

    logger.info(`API key created: ${apiKey.id}`);

    // Link API key to sales channel
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: apiKey.id,
        add: [defaultSalesChannel.id],
      },
    });

    logger.info(`✅ Publishable API key created successfully!`);
    logger.info(`🔑 Key ID: ${apiKey.id}`);
    logger.info(`🔗 Linked to sales channel: ${defaultSalesChannel.name}`);
    logger.info(`📝 Add this to your frontend .env:`);
    logger.info(`   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${apiKey.token}`);

    return apiKey;
  } catch (error) {
    logger.error("Failed to create publishable API key:", error);
    throw error;
  }
}