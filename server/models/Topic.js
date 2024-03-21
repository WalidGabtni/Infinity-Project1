import mongoose from 'mongoose';

const { Schema } = mongoose;

const topicSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add more fields as needed
});

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;
