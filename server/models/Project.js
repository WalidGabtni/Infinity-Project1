import mongoose from 'mongoose';

const { Schema } = mongoose;

const commentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
});

const topicSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  locked: {
    type: Boolean,
    default: false,
  },
  pinned: {
    type: Boolean,
    default: false, // Default value is false
  },
  hidden: {
    type: Boolean,
    default: false, // Default value is false (topic is not hidden)
  },
  destination: {
    type: String, // or any other relevant type for representing the destination
    required: false, // or adjust as per your requirements
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [commentSchema],
});


const ProjectSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    currentStatus: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started',
    },
    picturePath: String,
    userPicturePath: String,
    projectImage: String,
    projectCover: String,
    members: [
      {
        userId: {
          type: String,
          required: true,
        },
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        picturePath: String,
        userPicturePath: String,
        occupation: String,
      },
    ],
    pendingRequests: [
      {
        userId: {
          type: String,
          required: true,
        },
        notificationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Notification',
          required: true,
        },
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        picturePath: String,
        userPicturePath: String,
        occupation: String,
      },
    ],
    topics: [topicSchema], // Array of public topic objects
    privateTopics: [topicSchema], // Array of private topic objects
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
