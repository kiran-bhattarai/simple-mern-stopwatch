import "./config/dotenv.js";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { getPort } from "./config/port.js";

connectDB();
const PORT = getPort();
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) })