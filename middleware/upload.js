import multer from "multer";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });

// import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
