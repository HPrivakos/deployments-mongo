import mongoose from 'mongoose'

const Schema = mongoose.Schema

const DeploymentSchema = new Schema({
  id: { type: Number, maxLength: 100, required: true, unique: true },
  deployer_address: { type: String, maxLength: 42, required: true, index: true },
  version: { type: String, maxLength: 10, required: true },
  entity_type: { type: String, enum: ['profile', 'scene', 'wearable', 'emote'], required: true },
  entity_id: { type: String, maxLength: 64, required: true, unique: true },
  entity_metadata: { type: Schema.Types.Mixed, required: true },
  entity_timestamp: { type: Date, default: Date.now, required: true },
  entity_pointers: [{ type: String, maxLength: 100, required: true }],
  local_timestamp: { type: Date, default: Date.now, required: true },
  auth_chain: { type: Schema.Types.Mixed, required: true },
  deleter_deployment: { type: Schema.Types.ObjectId, ref: 'Deployment', required: false },
  profile: { type: Schema.Types.ObjectId, ref: 'Profile', required: false, index: true },
  lands: [{ type: Schema.Types.ObjectId, ref: 'Land', required: false, index: true }]
})

// DeploymentSchema.index({ deployer_address: 1, type: -1 });

// Export model
export default mongoose.model('Deployment', DeploymentSchema)
