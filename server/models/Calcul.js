import mongoose from "mongoose";

const CalculSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
      unique: true, // Ensures only one entry per user
    },
    firstName: String,
    lastName: String,
    bookmarksCount: {
      type: Number,
      default: 0,
    },
    projectsCount: {
      type: Number,
      default: 0,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Calcul = mongoose.model("Calcul", CalculSchema);

export default Calcul;