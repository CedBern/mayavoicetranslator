
import mongoose from 'mongoose';

const { Schema } = mongoose;

const CorrectionSchema = new Schema({
  taskId: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    required: true,
  },
  data: {
    type: Schema.Types.Mixed,
    required: true,
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  reviewedAt: {
    type: Date,
    default: null,
  },
  feedback: {
    type: String,
    default: null,
  },
}, { timestamps: true });

const Correction = mongoose.model('Correction', CorrectionSchema);

export default Correction;
