import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "job",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    userTechSkills: {
      type: [String],
      default: [],
    },
    userSoftSkills: {
      type: [String],
      default: [],
    },
    userResume: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const applicationModel = mongoose.model("application", applicationSchema);
export default applicationModel;
