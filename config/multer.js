import multer from "multer";
import path from "path";
import os from "os";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedType = /jpeg|jpg|png|webp/;
  const extname = allowedType.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedType.test(file.mimetype);

  if (extname & mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Hanya gambar (JPEG, JPG, PNG, WEBP) yang diizinkan!"));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter,
});
