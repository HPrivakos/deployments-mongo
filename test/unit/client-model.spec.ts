import { Error } from 'mongoose'
import Client from '../../src/logic/models/client'
import ApiKey from '../../src/logic/models/apiKey'

describe('client-model-unit', () => {
  it('must create a client', async () => {
    const client = new Client({ name: 'HPrivakos', mailAddress: 'test@test.test' })
    expect(await client.validate()).toEqual(undefined)
  })
  it('must fail to create a client when mail missing', async () => {
    const client = new Client({ name: 'HPrivakos' })

    await expect(client.validate()).rejects.toThrow()
  })
})
