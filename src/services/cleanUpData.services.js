import cron from 'node-cron';
import {userModel} from '../models/authorisiedUser.model.js'; 

const startCleanupTask = () => {
    cron.schedule('0 0 * * *', async () => {
        try {
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            const result = await userModel.deleteMany({
                status: 'PENDING',
                createdAt: { $lt: sevenDaysAgo } // $lt means "Less Than"
            });

            console.log(`Cleanup Complete: Removed ${result.deletedCount} expired requests.`);
        } catch (error) {
            console.error('Cleanup Task Error:', error);
        }
    });
};

export default startCleanupTask;