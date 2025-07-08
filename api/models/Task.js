
import mongoose from 'mongoose';

const { Schema } = mongoose;

const TranscriptionTaskDataSchema = new Schema({
  audioUrl: { type: String, required: true },
  existingTranscript: { type: String },
}, { _id: false });

const TranslationTaskDataSchema = new Schema({
  sourceLanguage: { type: String, required: true },
  targetLanguage: { type: String, required: true },
  text: { type: String, required: true },
}, { _id: false });

const LexicalEntrySchema = new Schema({
    headword: String,
    partOfSpeech: String,
    definitions: [{
        text: String,
        examples: [String]
    }],
    pronunciations: [{
        notation: String,
        value: String,
        audioUrl: String
    }]
}, { _id: false });


const DictionaryTaskDataSchema = new Schema({
  entry: { type: LexicalEntrySchema, required: true },
}, { _id: false });

const TaskSchema = new Schema({
  type: {
    type: String,
    enum: ['transcription', 'translation', 'dictionary'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'rejected'],
    default: 'pending',
    required: true,
  },
  data: {
    type: Schema.Types.Mixed,
    required: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  corrections: [{
    type: Schema.Types.ObjectId,
    ref: 'Correction'
  }]
}, { timestamps: true });

// Add a discriminator key to the data field to store the schema type
TaskSchema.path('data').discriminator = function(doc) {
    switch (doc.type) {
        case 'transcription':
            return 'TranscriptionTaskData';
        case 'translation':
            return 'TranslationTaskData';
        case 'dictionary':
            return 'DictionaryTaskData';
    }
};


const Task = mongoose.model('Task', TaskSchema);

Task.discriminator('TranscriptionTaskData', TranscriptionTaskDataSchema);
Task.discriminator('TranslationTaskData', TranslationTaskDataSchema);
Task.discriminator('DictionaryTaskData', DictionaryTaskDataSchema);


export default Task;
