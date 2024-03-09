import mongoose from "mongoose";

const ProjectSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
<<<<<<< Updated upstream
=======
    picturePath: String,
    userPicturePath: String,
    projectImage: String,
    members: [
      {
        userId: String,
        firstName: String,
        lastName: String,
      },
    ],
>>>>>>> Stashed changes
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", ProjectSchema);

export default Project;
