import Profile from '../../logic/models/profile'
import Deployment from '../../logic/models/deployment'
import { HandlerContextWithPath } from '../../types'
Deployment
export async function profileHandler(context: HandlerContextWithPath<'logs' | 'mongo', '/profile/:address'>) {
  console.time('profile')
  const address = context.params.address
  const params = new URLSearchParams(context.url.search)
  const getDeployments = params.get('deployments')
  const getCount = params.get('count')

  if (!address.startsWith('0x') && address.length != 42) {
    console.timeEnd('profile')
    return { status: 400, body: 'Issue with the address' }
  }
  try {
    const profile = await Profile.findOne({ address })
    if (!profile) {
      console.timeEnd('profile')
      return { status: 404, body: `Can't find the profile` }
    }
    if (getCount) await profile?.populate('deploymentsCount')
    if (!profile.firstSeen) {
      await profile?.populate('deployments')
      const dep = (profile as any).deployments.sort((a: any, b: any) => +a.entity_timestamp - +b.entity_timestamp)
      profile.firstSeen = dep[0].entity_timestamp
      if (!getDeployments) profile.depopulate('deployments')
    }
    if (getDeployments && !profile.populated('deployments')) await profile?.populate('deployments')
    console.timeEnd('profile')
    return { status: 200, body: JSON.stringify(profile) }
  } catch (error) {
    console.log(error)

    return { status: 500, body: 'Server issue' }
  }
}
