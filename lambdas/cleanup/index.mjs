import { S3Client, ListObjectsV2Command, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: "il-central-1" });

const cleanupPastEvents = async () => {
    const response = await fetch(`${process.env.BACKEND_URL}/api/events/cleanup-past`, {
        method: 'DELETE',
        headers: { 'x-internal-api-key': process.env.INTERNAL_API_KEY }
    });

    if (!response.ok) {
        console.error('[CLEANUP] Backend cleanup-past failed:', response.status, await response.text());
        return;
    }

    const { deleted, ids } = await response.json();
    console.log(`[CLEANUP] Deleted ${deleted} past events: ${ids.join(', ')}`);
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
    await cleanupPastEvents();
    await deleteTempS3Files();
    return { statusCode: 200, body: JSON.stringify({ message: 'Cleanup complete' }) };
};
