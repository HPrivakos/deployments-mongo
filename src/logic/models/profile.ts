import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ProfileSchema = new Schema<{ address: string; firstSeen?: Date; number?: number }>(
  {
    address: { type: String, length: 42, maxLength: 42, required: true, unique: true },
    firstSeen: { type: Date, required: false },
    number: { type: Number, required: false }
  },
  {
    toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
    toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals
  }
)

ProfileSchema.virtual('deployments', {
  ref: 'Deployment',
  localField: '_id',
  foreignField: 'profile'
})

ProfileSchema.virtual('deploymentsCount', {
  ref: 'Deployment',
  localField: '_id',
  foreignField: 'profile',
  count: true
})

// Export model
export default mongoose.model('Profile', ProfileSchema)
