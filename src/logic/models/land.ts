import mongoose from 'mongoose'

const Schema = mongoose.Schema

const LandSchema = new Schema<{ coordinate: string; firstSeen?: Date }>({
  coordinate: { type: String, required: true, unique: true },
  firstSeen: { type: Date, required: false }
})

// Export model
export default mongoose.model('Land', LandSchema)
