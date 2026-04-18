import { createClient } from '@supabase/supabase-js';
import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

const s3 = new S3Client({ region: "il-central-1" });

const deletePastEvents = async () => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 2);

        const { data, error } = await supabase
            .from('events_new')
            .delete()
            .lt('end_datetime', cutoffDate.toISOString())
            .select('*');

        if (error) {
            console.error('[CLEANUP] Error deleting past events:', error);
            return;
        }

        const titles = data?.map(e => e.title ?? e.id) ?? [];
        console.log(`[CLEANUP] Deleted ${titles.length} past events: ${titles.join(', ')}`);
    } catch (error) {
        console.error('[CLEANUP] Unexpected error deleting past events:', error.message);
    }
};

const deleteTempS3Files = async () => {
    try {
        const list = await s3.send(new ListObjectsV2Command({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Prefix: 'tmp/'
        }));

        if (!list.Contents?.length) {
            console.log('[CLEANUP] No temp S3 files to delete');
            return;
        }

        await s3.send(new DeleteObjectsCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Delete: { Objects: list.Contents.map(obj => ({ Key: obj.Key })) }
        }));

        const keys = list.Contents.map(obj => obj.Key);
        console.log(`[CLEANUP] Deleted ${keys.length} temp S3 files: ${keys.join(', ')}`);
    } catch (error) {
        console.error('[CLEANUP] Unexpected error deleting temp S3 files:', error.message);
    }
};

export const handler = async () => {
    await deletePastEvents();
    await deleteTempS3Files();
    return { statusCode: 200, body: JSON.stringify({ message: 'Cleanup complete' }) };
};
