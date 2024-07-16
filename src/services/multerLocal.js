import multer from "multer";
import { nanoid } from "nanoid";
import AppError from "../utils/appError.js";
import path from "path";
import fs from "fs";

export const multerLocal = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const allPath = path.resolve("uploads");
      if (!fs.existsSync(allPath)) {
        fs.mkdirSync(allPath, { recursive: true });
      }
      cb(null, allPath);
    },
    filename: function (req, file, cb) {
      cb(null, nanoid(3) + file.originalname);
    },
  });

  const fileFilter = function (req, file, cb) {
    if (file.mimetype == "application/pdf") {
      cb(null, true);
    } else {
      cb(new AppError("Only PDF resumes are allowed!", 400), false);
    }
  };

  const upload = multer({ storage, fileFilter });
  return upload;
};
export default multerLocal;
