import multer from "multer";

export const handleUpload = (docName: string, size: number) => {
  const storage = multer.memoryStorage();
  console.log(`Uploading document: ${docName}`);
  return multer({
    storage: storage,
    limits: { fileSize: size }, // 5MB limit
  }).single(docName);
};
