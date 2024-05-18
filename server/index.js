import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import notificationRoutes from './routes/notification.js';
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { createProject } from "./controllers/projects.js"; 
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import projectRoutes from "./routes/projects.js";
import { etl } from "./etl.js"; // Import the etl function


// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

// Middleware setup
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use(cors());

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

// FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public/assets"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
app.post("/projects", verifyToken, upload.fields([{ name: 'projectImage', maxCount: 1 }, { name: 'projectCover', maxCount: 1 }]), createProject);
app.post("/upload-image", upload.single("projectImage"), (req, res) => {
  try {
    const { filename } = req.file;
    res.status(200).json({ message: 'Image uploaded successfully', filename });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});
app.post("/upload-cover", upload.single("projectCover"), (req, res) => {
  try {
    const { filename } = req.file;
    res.status(200).json({ message: 'Cover uploaded successfully', filename });
  } catch (error) {
    console.error('Error uploading cover:', error);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});

app.get('/transformed-data', async (req, res) => {
  try {
      // Call the etl function to perform ETL and get the transformed data
      const transformedData = await etl();

      // Send the transformed data as a JSON response
      res.json(transformedData);
  } catch (error) {
      console.error('Error fetching transformed data:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/projects", projectRoutes);
app.use('/notifications', notificationRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server port: ${PORT}`));
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));
