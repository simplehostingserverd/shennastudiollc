declare module 'pg' {
  export class Client {
    constructor(config?: any)
    connect(): Promise<void>
    end(): Promise<void>
    query(text: string, params?: any[]): Promise<any>
  }
}