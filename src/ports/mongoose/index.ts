import { IBaseComponent, ILoggerComponent, IConfigComponent } from '@well-known-components/interfaces'
import { IMetricsComponent, IMongoComponent, Options } from './types'
import mongoose from 'mongoose'

export * from './types'

export async function createMongoComponent(
  components: createMongoComponent.NeededComponents,
  options: Options = {}
): Promise<IMongoComponent & IBaseComponent> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { config, logs } = components
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const logger = logs.getLogger('mongo-component')

  async function start() {
    await mongoose.connect(options.server || 'mongodb://127.0.0.1/catatest')
  }
  async function stop() {
    await mongoose.disconnect()
  }

  return { start, stop }
}

/**
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace createMongoComponent {
  export type NeededComponents = {
    logs: ILoggerComponent
    config: IConfigComponent
    metrics: IMetricsComponent
  }
}
