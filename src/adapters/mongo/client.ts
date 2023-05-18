import Client from '../../logic/models/client'

export function createClient(client: { name: string; mailAddress: string; discordId?: string; balance?: number }) {
  const c = new Client(client)
  return c
}
