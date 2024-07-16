import mongoose from "mongoose";
const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    jobLocation: {
      type: String,
      required: true,
      enum: ["onsite", "remotely", "hybrid"],
    },
    workingTime: {
      type: String,
      required: true,
      enum: ["fullTime", "partTime"],
    },
    seniorityLevel: {
      type: String,
      required: true,
      enum: ["junior", "Mid-Level", "senior", "Team-Lead", "CTO"],
    },
    jobDescription: {
      type: String,
      required: true,
    },
    technicalSkills: {
      type: [String],
      default: [],
    },
    softSkills: {
      type: [String],
      default: [],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true, versionKey: false }
);

const jobModel = mongoose.model("job", jobSchema);
export default jobModel;
