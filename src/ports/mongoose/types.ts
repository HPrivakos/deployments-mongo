import { IMetricsComponent as IBaseMetricsComponent } from '@well-known-components/interfaces'
import { metricDeclarations } from './metrics'
/**
 * @public
 */
export interface IMongoComponent {
  start(): Promise<void>

  stop(): Promise<void>
}

/**
 * @public
 */
export type Options = Partial<{ server: string }>

/**
 * @public
 */
export type IMetricsComponent = IBaseMetricsComponent<keyof typeof metricDeclarations>
