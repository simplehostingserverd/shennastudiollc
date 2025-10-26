import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Order Schema Tests', () => {
  let testOrderId: string

  afterAll(async () => {
    // Clean up test data
    if (testOrderId) {
      await prisma.orderItem.deleteMany({ where: { orderId: testOrderId } })
      await prisma.order.delete({ where: { id: testOrderId } }).catch(() => {})
    }
    await prisma.$disconnect()
  })

  it('should create an order with full address information', async () => {
    const order = await prisma.order.create({
      data: {
        total: 4999, // $49.99 in cents
        status: 'completed',
        stripeSessionId: 'cs_test_123456',
        stripePaymentIntent: 'pi_test_123456',

        // Customer Information
        customerEmail: 'customer@test.com',
        customerName: 'John Doe',
        customerPhone: '+1234567890',

        // Shipping Address
        shippingName: 'John Doe',
        shippingLine1: '123 Ocean Ave',
        shippingLine2: 'Apt 4B',
        shippingCity: 'Miami',
        shippingState: 'FL',
        shippingPostalCode: '33139',
        shippingCountry: 'US',

        // Billing Address
        billingName: 'John Doe',
        billingLine1: '123 Ocean Ave',
        billingLine2: 'Apt 4B',
        billingCity: 'Miami',
        billingState: 'FL',
        billingPostalCode: '33139',
        billingCountry: 'US',
      },
    })

    expect(order).toBeDefined()
    expect(order.customerEmail).toBe('customer@test.com')
    expect(order.shippingLine1).toBe('123 Ocean Ave')
    expect(order.billingCity).toBe('Miami')
    expect(order.total).toBe(4999)

    testOrderId = order.id
  })

  it('should retrieve order with all address fields', async () => {
    const order = await prisma.order.findUnique({
      where: { id: testOrderId },
    })

    expect(order).toBeDefined()
    expect(order?.shippingName).toBe('John Doe')
    expect(order?.shippingState).toBe('FL')
    expect(order?.billingPostalCode).toBe('33139')
  })

  it('should find order by stripe session id', async () => {
    const order = await prisma.order.findUnique({
      where: { stripeSessionId: 'cs_test_123456' },
    })

    expect(order).toBeDefined()
    expect(order?.id).toBe(testOrderId)
  })

  it('should find orders by customer email', async () => {
    const orders = await prisma.order.findMany({
      where: { customerEmail: 'customer@test.com' },
    })

    expect(orders).toBeDefined()
    expect(orders.length).toBeGreaterThan(0)
    expect(orders[0].customerEmail).toBe('customer@test.com')
  })

  it('should create order items for an order', async () => {
    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: testOrderId,
        productId: 'stripe-price_123',
        quantity: 2,
        price: 4999,
      },
    })

    expect(orderItem).toBeDefined()
    expect(orderItem.orderId).toBe(testOrderId)
    expect(orderItem.quantity).toBe(2)
  })

  it('should retrieve order with items', async () => {
    const order = await prisma.order.findUnique({
      where: { id: testOrderId },
      include: {
        items: true,
      },
    })

    expect(order).toBeDefined()
    expect(order?.items).toBeDefined()
    expect(order?.items.length).toBeGreaterThan(0)
  })

  it('should handle orders without shipping address (optional fields)', async () => {
    const orderNoShipping = await prisma.order.create({
      data: {
        total: 2999,
        status: 'pending',
        customerEmail: 'noshipping@test.com',
      },
    })

    expect(orderNoShipping).toBeDefined()
    expect(orderNoShipping.shippingLine1).toBeNull()
    expect(orderNoShipping.billingLine1).toBeNull()

    // Clean up
    await prisma.order.delete({ where: { id: orderNoShipping.id } })
  })
})
