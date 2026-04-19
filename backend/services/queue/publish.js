import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { sqs } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

export const publishDraftJob = async ({ prompt, posterUrl, contextUrl, draftId }) => {
  logger.info('[QUEUE] Publishing draft job', { draftId, queueUrl: process.env.AWS_DRAFT_QUEUE_URL });

  const command = new SendMessageCommand({
    QueueUrl: process.env.AWS_DRAFT_QUEUE_URL,
    MessageBody: JSON.stringify({ prompt, posterUrl, contextUrl, draftId }),
  });

  const response = await sqs.send(command);
  logger.info('[QUEUE] Message sent', { messageId: response.MessageId });
};
