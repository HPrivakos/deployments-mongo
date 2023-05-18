import mongoose from 'mongoose'
import { Pool } from 'pg'
import Deployment from './logic/models/deployment'
import Profile from './logic/models/profile'
import Land from './logic/models/land'

const cache: { [key: string]: { [id: string]: any } } = { profile: {}, land: {} }
async function main() {
  await mongoose.connect('mongodb://127.0.0.1/catatest')
  const pool: Pool = new Pool({ connectionString: process.env.POSTGRESQL_URL })

  let lastId = 0
  while (true) {
    const cacheDeployment: { [id: string]: any } = {}
    console.log(lastId)
    console.time('pg')
    const res = await pool.query(`SELECT * FROM deployments WHERE id > ${lastId} ORDER BY id LIMIT 10000`)
    console.timeEnd('pg')
    console.time('mongo')

    /* Profile and Lands */
    for (const row of res.rows) {
      if (row.entity_type == 'profile') {
        const address: string = row.entity_pointers[0].toLowerCase()
        const find = cache.profile[address] || (await Profile.findOne({ address }))
        if (!find) {
          const profile = new Profile({ address })
          await profile.save().catch((e) => {
            if (e.code == 11000) {
              return
            }
            console.error(e)
          })
          cache.profile[address] = profile._id
        } else cache.profile[address] = find._id
      }
      if (row.entity_type == 'scene') {
        for (const coordinate of row.entity_pointers) {
          const find = cache.land[coordinate] || (await Land.findOne({ coordinate }))
          if (!find) {
            const land = new Land({ coordinate })
            await land.save().catch((e) => {
              if (e.code == 11000) {
                return
              }
              console.error(e)
            })
            cache.land[coordinate] = land._id
          } else cache.land[coordinate] = find._id
        }
      }
    }

    /* Rafistolage */
    const rows = await Promise.all(
      res.rows.map(async (row) => {
        if (row.deleter_deployment) row.deleter_deployment = await Deployment.findOne({ id: row.deleter_deployment })
        if (row.entity_type == 'scene') row.lands = row.entity_pointers.map((coord: string) => cache.land[coord])
        if (row.entity_type == 'profile') row.profile = cache.profile[row.entity_pointers[0].toLowerCase()]
        return row
      })
    )

    /* deployments */
    try {
      const deployments = await Deployment.insertMany(res.rows)
      for (const deployment of deployments) {
        cacheDeployment[deployment.id] = deployment
      }
    } catch (error: any) {
      if (error.code == 11000) {
        for (const row of rows) {
          const deployment = new Deployment(row)
          await deployment.save().catch((e) => {
            if (e.code == 11000) {
              return
            }
            console.error(e)
          })
          cacheDeployment[deployment.id] = deployment
        }
      }
    }

    console.timeEnd('mongo')

    lastId = rows[rows.length - 1].id
    console.log(
      `Deployments: ${await Deployment.count()}, Profiles: ${await Profile.count()}, Lands: ${await Land.count()}`
    )
  }
}
void main()
