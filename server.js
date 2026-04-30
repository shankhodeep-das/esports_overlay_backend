import app from "./src/app.js";
import { connectDB } from "./src/db/db.js";
import startCleanupTask from "./src/services/cleanUpData.services.js";

connectDB();

app.listen(5000, () => {
    console.log("Server is runing on port 5000");
    startCleanupTask()
});