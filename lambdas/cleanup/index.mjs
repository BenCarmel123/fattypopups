import { supabase } from '../../backend/config/clients/supabase.js'
import { s3 } from '../../backend/config/clients/s3.js'
import { ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3'

const cleanup = async () => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 2);

        const { error } = await supabase
            .from('events_new')
            .delete()
            .lt('end_datetime', cutoffDate.toISOString());

        if (error) throw error;

        const list = await s3.send(new ListObjectsV2Command({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Prefix: 'tmp/'
        }));

        if (list.Contents?.length) {
            await s3.send(new DeleteObjectsCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Delete: { Objects: list.Contents.map(obj => ({ Key: obj.Key })) }
            }));
        }

        console.log('[CLEANUP] Complete');
    }
    catch (error) {
        console.error('[ERROR]', error.message);
    }
}

export const handler = async () => {
    await cleanup();
    return { statusCode: 200, body: JSON.stringify({ message: 'Cleanup complete' }) };
};