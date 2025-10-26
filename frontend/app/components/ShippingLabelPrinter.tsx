'use client'

import { useState, useRef } from 'react'

interface Order {
  id: string
  total: number
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingName: string
  shippingLine1: string
  shippingLine2: string
  shippingCity: string
  shippingState: string
  shippingPostalCode: string
  shippingCountry: string
  stripeSessionId: string
  items: Array<{
    id: string
    productId: string
    quantity: number
    price: number
  }>
}

interface ShippingLabelPrinterProps {
  order: Order
  onClose: () => void
}

export default function ShippingLabelPrinter({ order, onClose }: ShippingLabelPrinterProps) {
  const [status, setStatus] = useState('')
  const [isPrinting, setIsPrinting] = useState(false)
  const [device, setDevice] = useState<BluetoothDevice | null>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  const connectToPrinter = async () => {
    try {
      setStatus('Connecting to printer...')

      // Request Bluetooth device with PL70e-BT filter
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { name: 'PL70e-BT' },
          { namePrefix: 'PL' },
          { services: ['000018f0-0000-1000-8000-00805f9b34fb'] } // Generic printer service
        ],
        optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
      })

      setDevice(device)
      setStatus(`Connected to ${device.name}`)

      return device
    } catch (error) {
      console.error('Bluetooth connection error:', error)
      setStatus(`Error: ${error instanceof Error ? error.message : 'Failed to connect'}`)
      return null
    }
  }

  const generateESCPOSCommands = (): Uint8Array => {
    const commands: number[] = []

    // ESC/POS Commands for 4x6 label (72mm x 100mm)
    // Initialize printer
    commands.push(0x1B, 0x40) // ESC @

    // Set page mode for 4x6 label
    commands.push(0x1B, 0x4C) // ESC L (Page mode)

    // Set print area for 4x6 (576 dots x 832 dots at 203dpi)
    commands.push(0x1D, 0x57, 0x40, 0x02, 0x40, 0x03) // GS W

    // Company header
    commands.push(0x1B, 0x61, 0x01) // Center align
    commands.push(0x1D, 0x21, 0x11) // Double height and width
    commands.push(...this.textToBytes("SHENNA'S STUDIO\n"))
    commands.push(0x1D, 0x21, 0x00) // Normal size

    commands.push(...this.textToBytes('Ocean-Themed Products\n'))
    commands.push(...this.textToBytes('10% to Ocean Conservation\n'))
    commands.push(...this.textToBytes('www.shennastudio.com\n'))
    commands.push(0x1B, 0x64, 0x02) // Feed 2 lines

    // Divider line
    commands.push(...this.textToBytes('================================\n'))

    // Order number
    commands.push(0x1B, 0x61, 0x00) // Left align
    commands.push(0x1D, 0x21, 0x01) // Double width
    const orderNum = order.stripeSessionId?.substring(8, 17).toUpperCase() || order.id.substring(0, 8)
    commands.push(...this.textToBytes(`ORDER: ${orderNum}\n`))
    commands.push(0x1D, 0x21, 0x00) // Normal size
    commands.push(0x1B, 0x64, 0x01) // Feed 1 line

    // Ship to section
    commands.push(0x1D, 0x21, 0x11) // Double height and width
    commands.push(...this.textToBytes('SHIP TO:\n'))
    commands.push(0x1D, 0x21, 0x00) // Normal size

    commands.push(0x1B, 0x45, 0x01) // Bold on
    commands.push(...this.textToBytes(`${order.shippingName}\n`))
    commands.push(0x1B, 0x45, 0x00) // Bold off

    commands.push(...this.textToBytes(`${order.shippingLine1}\n`))
    if (order.shippingLine2) {
      commands.push(...this.textToBytes(`${order.shippingLine2}\n`))
    }
    commands.push(...this.textToBytes(`${order.shippingCity}, ${order.shippingState} ${order.shippingPostalCode}\n`))
    commands.push(...this.textToBytes(`${order.shippingCountry}\n`))

    if (order.customerPhone) {
      commands.push(...this.textToBytes(`Tel: ${order.customerPhone}\n`))
    }

    commands.push(0x1B, 0x64, 0x01) // Feed 1 line

    // Divider
    commands.push(...this.textToBytes('--------------------------------\n'))

    // Items
    commands.push(0x1B, 0x45, 0x01) // Bold on
    commands.push(...this.textToBytes(`ITEMS (${order.items?.length || 0}):\n`))
    commands.push(0x1B, 0x45, 0x00) // Bold off

    if (order.items && order.items.length > 0) {
      order.items.forEach((item, index) => {
        commands.push(...this.textToBytes(`${index + 1}. Qty: ${item.quantity}\n`))
      })
    }

    commands.push(0x1B, 0x64, 0x01) // Feed 1 line

    // Total
    commands.push(0x1D, 0x21, 0x01) // Double width
    const totalFormatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(order.total / 100)
    commands.push(...this.textToBytes(`TOTAL: ${totalFormatted}\n`))
    commands.push(0x1D, 0x21, 0x00) // Normal size

    commands.push(0x1B, 0x64, 0x02) // Feed 2 lines

    // Footer
    commands.push(0x1B, 0x61, 0x01) // Center align
    commands.push(...this.textToBytes('Thank you for supporting\n'))
    commands.push(...this.textToBytes('Ocean Conservation!\n'))
    commands.push(0x1B, 0x61, 0x00) // Left align

    // Cut paper
    commands.push(0x1D, 0x56, 0x42, 0x00) // GS V - partial cut

    commands.push(0x1B, 0x64, 0x05) // Feed 5 lines

    return new Uint8Array(commands)
  }

  private textToBytes = (text: string): number[] => {
    const bytes: number[] = []
    for (let i = 0; i < text.length; i++) {
      bytes.push(text.charCodeAt(i))
    }
    return bytes
  }

  const printLabel = async () => {
    try {
      setIsPrinting(true)
      setStatus('Preparing label...')

      let bluetoothDevice = device

      if (!bluetoothDevice) {
        bluetoothDevice = await connectToPrinter()
        if (!bluetoothDevice) return
      }

      setStatus('Connecting to printer service...')

      const server = await bluetoothDevice.gatt?.connect()
      if (!server) {
        setStatus('Failed to connect to GATT server')
        return
      }

      // Try different service UUIDs for thermal printers
      const serviceUUIDs = [
        '000018f0-0000-1000-8000-00805f9b34fb', // Generic printer
        '49535343-fe7d-4ae5-8fa9-9fafd205e455', // Common thermal printer service
      ]

      let service = null
      for (const uuid of serviceUUIDs) {
        try {
          service = await server.getPrimaryService(uuid)
          if (service) break
        } catch (e) {
          console.log(`Service ${uuid} not found, trying next...`)
        }
      }

      if (!service) {
        setStatus('Printer service not found. Try disconnecting and reconnecting.')
        return
      }

      setStatus('Getting printer characteristics...')

      const characteristics = await service.getCharacteristics()
      const writeCharacteristic = characteristics.find(c => c.properties.write || c.properties.writeWithoutResponse)

      if (!writeCharacteristic) {
        setStatus('Printer write characteristic not found')
        return
      }

      setStatus('Sending label data to printer...')

      const labelData = generateESCPOSCommands()

      // Send data in chunks (max 512 bytes per write for Bluetooth)
      const chunkSize = 512
      for (let i = 0; i < labelData.length; i += chunkSize) {
        const chunk = labelData.slice(i, Math.min(i + chunkSize, labelData.length))
        await writeCharacteristic.writeValue(chunk)
        await new Promise(resolve => setTimeout(resolve, 50)) // Small delay between chunks
      }

      setStatus('✅ Label printed successfully!')
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Print error:', error)
      setStatus(`Error: ${error instanceof Error ? error.message : 'Failed to print'}`)
    } finally {
      setIsPrinting(false)
    }
  }

  const printViaUSB = () => {
    // Fallback: open browser print dialog with formatted label
    if (labelRef.current) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Shipping Label</title>
              <style>
                @page { size: 4in 6in; margin: 0; }
                body { margin: 0; padding: 0.25in; font-family: monospace; font-size: 12pt; }
                .label { width: 3.5in; }
                .header { text-align: center; font-weight: bold; margin-bottom: 0.2in; }
                .header h1 { font-size: 18pt; margin: 0; }
                .header p { margin: 0; font-size: 10pt; }
                .section { margin: 0.15in 0; }
                .section-title { font-weight: bold; font-size: 14pt; margin-bottom: 0.1in; }
                .address { font-size: 12pt; line-height: 1.3; }
                .divider { border-top: 1px dashed #000; margin: 0.15in 0; }
                .footer { text-align: center; margin-top: 0.2in; font-size: 10pt; }
              </style>
            </head>
            <body>
              ${labelRef.current.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 500)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Print Shipping Label</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Label Preview */}
          <div
            ref={labelRef}
            className="border-2 border-gray-300 p-6 mb-6 bg-white"
            style={{ width: '4in', margin: '0 auto' }}
          >
            <div className="header">
              <h1>SHENNA'S STUDIO</h1>
              <p>Ocean-Themed Products</p>
              <p>10% to Ocean Conservation</p>
              <p>www.shennastudio.com</p>
            </div>

            <div className="divider"></div>

            <div className="section">
              <p style={{ fontWeight: 'bold', fontSize: '14pt' }}>
                ORDER: {order.stripeSessionId?.substring(8, 17).toUpperCase() || order.id.substring(0, 8)}
              </p>
            </div>

            <div className="section">
              <div className="section-title">SHIP TO:</div>
              <div className="address">
                <p style={{ fontWeight: 'bold' }}>{order.shippingName}</p>
                <p>{order.shippingLine1}</p>
                {order.shippingLine2 && <p>{order.shippingLine2}</p>}
                <p>{order.shippingCity}, {order.shippingState} {order.shippingPostalCode}</p>
                <p>{order.shippingCountry}</p>
                {order.customerPhone && <p>Tel: {order.customerPhone}</p>}
              </div>
            </div>

            <div className="divider"></div>

            <div className="section">
              <p style={{ fontWeight: 'bold' }}>ITEMS ({order.items?.length || 0}):</p>
              {order.items && order.items.map((item, index) => (
                <p key={item.id}>
                  {index + 1}. Qty: {item.quantity}
                </p>
              ))}
            </div>

            <div className="section">
              <p style={{ fontWeight: 'bold', fontSize: '14pt' }}>
                TOTAL: {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(order.total / 100)}
              </p>
            </div>

            <div className="footer">
              <p>Thank you for supporting</p>
              <p>Ocean Conservation!</p>
            </div>
          </div>

          {/* Status Message */}
          {status && (
            <div className={`mb-4 p-3 rounded-lg ${
              status.includes('Error') || status.includes('Failed')
                ? 'bg-red-50 text-red-700'
                : status.includes('✅')
                ? 'bg-green-50 text-green-700'
                : 'bg-blue-50 text-blue-700'
            }`}>
              {status}
            </div>
          )}

          {/* Print Buttons */}
          <div className="flex gap-3">
            <button
              onClick={printLabel}
              disabled={isPrinting}
              className="flex-1 px-6 py-3 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              {isPrinting ? 'Printing...' : 'Print via Bluetooth (PL70e-BT)'}
            </button>

            <button
              onClick={printViaUSB}
              className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print via USB/Browser
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-4 text-center">
            💡 Bluetooth printing requires HTTPS and browser support. USB printing works everywhere.
          </p>
        </div>
      </div>
    </div>
  )
}
