import mongoose from 'mongoose';

const { Schema } = mongoose;

const topicSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model
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
    ref: 'User', // Referencing the User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add more fields as needed
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
    topics: [topicSchema], // Array of topic objects
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', ProjectSchema);

export default Project;
