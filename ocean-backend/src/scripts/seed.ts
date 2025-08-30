import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: "eur",
            is_default: true,
          },
          {
            currency_code: "usd",
          },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Europe",
          currency_code: "eur",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system"
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "European Warehouse",
          address: {
            city: "Copenhagen",
            country_code: "DK",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default"
  })
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
    await createShippingProfilesWorkflow(container).run({
      input: {
        data: [
          {
            name: "Default Shipping Profile",
            type: "default",
          },
        ],
      },
    });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "European Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Europe",
        geo_zones: [
          {
            country_code: "gb",
            type: "country",
          },
          {
            country_code: "de",
            type: "country",
          },
          {
            country_code: "dk",
            type: "country",
          },
          {
            country_code: "se",
            type: "country",
          },
          {
            country_code: "fr",
            type: "country",
          },
          {
            country_code: "es",
            type: "country",
          },
          {
            country_code: "it",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "Webshop",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product data...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Mugs & Drinkware",
          is_active: true,
        },
        {
          name: "Jewelry",
          is_active: true,
        },
        {
          name: "Art & Prints",
          is_active: true,
        },
        {
          name: "Ocean Accessories",
          is_active: true,
        },
      ],
    },
  });

  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Sea Turtle Ceramic Mug",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Mugs & Drinkware")!.id,
          ],
          description:
            "Start your morning with this beautiful ceramic mug featuring a detailed sea turtle design. Perfect for coffee, tea, or any warm beverage while connecting with ocean vibes.",
          handle: "sea-turtle-mug",
          weight: 350,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://res.cloudinary.com/demo/image/upload/w_400/c_scale/ocean-mug-turtle.jpg",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["11oz", "15oz"],
            },
          ],
          variants: [
            {
              title: "11oz",
              sku: "TURTLE-MUG-11OZ",
              options: {
                Size: "11oz",
              },
              prices: [
                {
                  amount: 1895,
                  currency_code: "eur",
                },
                {
                  amount: 1995,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "15oz",
              sku: "TURTLE-MUG-15OZ",
              options: {
                Size: "15oz",
              },
              prices: [
                {
                  amount: 2295,
                  currency_code: "eur",
                },
                {
                  amount: 2495,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Ocean Shell Necklace",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Jewelry")!.id,
          ],
          description:
            "A delicate handcrafted necklace featuring real ocean shells and pearls. Each piece is unique and brings the beauty of the sea to your everyday style.",
          handle: "shell-necklace",
          weight: 25,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://res.cloudinary.com/demo/image/upload/w_400/c_scale/shell-necklace.jpg",
            },
          ],
          options: [
            {
              title: "Length",
              values: ["16 inch", "18 inch", "20 inch"],
            },
            {
              title: "Style",
              values: ["Silver", "Gold"],
            },
          ],
          variants: [
            {
              title: "16 inch / Silver",
              sku: "SHELL-NECK-16-SIL",
              options: {
                Length: "16 inch",
                Style: "Silver",
              },
              prices: [
                {
                  amount: 3495,
                  currency_code: "eur",
                },
                {
                  amount: 3995,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "16 inch / Gold",
              sku: "SHELL-NECK-16-GOLD",
              options: {
                Length: "16 inch",
                Style: "Gold",
              },
              prices: [
                {
                  amount: 3795,
                  currency_code: "eur",
                },
                {
                  amount: 4295,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "18 inch / Silver",
              sku: "SHELL-NECK-18-SIL",
              options: {
                Length: "18 inch",
                Style: "Silver",
              },
              prices: [
                {
                  amount: 3695,
                  currency_code: "eur",
                },
                {
                  amount: 4195,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "18 inch / Gold",
              sku: "SHELL-NECK-18-GOLD",
              options: {
                Length: "18 inch",
                Style: "Gold",
              },
              prices: [
                {
                  amount: 3995,
                  currency_code: "eur",
                },
                {
                  amount: 4495,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "20 inch / Silver",
              sku: "SHELL-NECK-20-SIL",
              options: {
                Length: "20 inch",
                Style: "Silver",
              },
              prices: [
                {
                  amount: 3895,
                  currency_code: "eur",
                },
                {
                  amount: 4395,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "20 inch / Gold",
              sku: "SHELL-NECK-20-GOLD",
              options: {
                Length: "20 inch",
                Style: "Gold",
              },
              prices: [
                {
                  amount: 4195,
                  currency_code: "eur",
                },
                {
                  amount: 4695,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Coral Reef Necklace",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Jewelry")!.id,
          ],
          description:
            "An elegant coral-inspired necklace crafted with sustainable materials. Features intricate coral branch designs that celebrate marine life conservation.",
          handle: "coral-necklace",
          weight: 30,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://res.cloudinary.com/demo/image/upload/w_400/c_scale/coral-necklace.jpg",
            },
          ],
          options: [
            {
              title: "Style",
              values: ["Rose Gold", "Sterling Silver"],
            },
          ],
          variants: [
            {
              title: "Rose Gold",
              sku: "CORAL-NECK-ROSEGOLD",
              options: {
                Style: "Rose Gold",
              },
              prices: [
                {
                  amount: 4895,
                  currency_code: "eur",
                },
                {
                  amount: 5395,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "Sterling Silver",
              sku: "CORAL-NECK-SILVER",
              options: {
                Style: "Sterling Silver",
              },
              prices: [
                {
                  amount: 4495,
                  currency_code: "eur",
                },
                {
                  amount: 4995,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
        {
          title: "Ocean Waves Art Print",
          category_ids: [
            categoryResult.find((cat) => cat.name === "Art & Prints")!.id,
          ],
          description:
            "A stunning high-quality art print capturing the dynamic movement of ocean waves. Perfect for bringing the calming energy of the sea into your home or office.",
          handle: "ocean-poster",
          weight: 100,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            {
              url: "https://res.cloudinary.com/demo/image/upload/w_400/c_scale/ocean-waves-poster.jpg",
            },
          ],
          options: [
            {
              title: "Size",
              values: ["12x16", "18x24", "24x36"],
            },
            {
              title: "Frame",
              values: ["Unframed", "Black Frame", "White Frame"],
            },
          ],
          variants: [
            {
              title: "12x16 / Unframed",
              sku: "OCEAN-POSTER-12X16-UNFRAMED",
              options: {
                Size: "12x16",
                Frame: "Unframed",
              },
              prices: [
                {
                  amount: 2495,
                  currency_code: "eur",
                },
                {
                  amount: 2995,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "12x16 / Black Frame",
              sku: "OCEAN-POSTER-12X16-BLACK",
              options: {
                Size: "12x16",
                Frame: "Black Frame",
              },
              prices: [
                {
                  amount: 3995,
                  currency_code: "eur",
                },
                {
                  amount: 4495,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "12x16 / White Frame",
              sku: "OCEAN-POSTER-12X16-WHITE",
              options: {
                Size: "12x16",
                Frame: "White Frame",
              },
              prices: [
                {
                  amount: 3995,
                  currency_code: "eur",
                },
                {
                  amount: 4495,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "18x24 / Unframed",
              sku: "OCEAN-POSTER-18X24-UNFRAMED",
              options: {
                Size: "18x24",
                Frame: "Unframed",
              },
              prices: [
                {
                  amount: 3995,
                  currency_code: "eur",
                },
                {
                  amount: 4595,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "18x24 / Black Frame",
              sku: "OCEAN-POSTER-18X24-BLACK",
              options: {
                Size: "18x24",
                Frame: "Black Frame",
              },
              prices: [
                {
                  amount: 5995,
                  currency_code: "eur",
                },
                {
                  amount: 6595,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "18x24 / White Frame",
              sku: "OCEAN-POSTER-18X24-WHITE",
              options: {
                Size: "18x24",
                Frame: "White Frame",
              },
              prices: [
                {
                  amount: 5995,
                  currency_code: "eur",
                },
                {
                  amount: 6595,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "24x36 / Unframed",
              sku: "OCEAN-POSTER-24X36-UNFRAMED",
              options: {
                Size: "24x36",
                Frame: "Unframed",
              },
              prices: [
                {
                  amount: 5995,
                  currency_code: "eur",
                },
                {
                  amount: 6995,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "24x36 / Black Frame",
              sku: "OCEAN-POSTER-24X36-BLACK",
              options: {
                Size: "24x36",
                Frame: "Black Frame",
              },
              prices: [
                {
                  amount: 8995,
                  currency_code: "eur",
                },
                {
                  amount: 9995,
                  currency_code: "usd",
                },
              ],
            },
            {
              title: "24x36 / White Frame",
              sku: "OCEAN-POSTER-24X36-WHITE",
              options: {
                Size: "24x36",
                Frame: "White Frame",
              },
              prices: [
                {
                  amount: 8995,
                  currency_code: "eur",
                },
                {
                  amount: 9995,
                  currency_code: "usd",
                },
              ],
            },
          ],
          sales_channels: [
            {
              id: defaultSalesChannel[0].id,
            },
          ],
        },
      ],
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
