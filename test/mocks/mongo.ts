import { IMongoComponent } from '../../src/ports/mongoose'

export function createMockMongoComponent(): IMongoComponent {
  return {
    async start() {
      return
    },
    async stop() {
      return
    }
  }
}
