import express from 'express';
import appRouter from './routes/index.js';

const app = express();
const PORT =  3000;

app.use(express.json());

app.use("/api",appRouter);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});