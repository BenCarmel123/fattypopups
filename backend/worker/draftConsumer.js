import { ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { sqs } from '../config/index.js';
import { orchestrateDraft } from '../services/draft/orchestrateDraft.js';
import { orchestrateEventCreate } from '../services/orchestrator/crud/create.js';
import { buildMetadata } from '../services/orchestrator/utils/metadata.js';
import { logger } from '../utils/logger.js';

// Runs the AI pipeline on a message and saves the result as a draft
const processMessage = async (message) => {
  const { prompt, posterUrl, contextUrl } = JSON.parse(message.Body);

  const draft = await orchestrateDraft(prompt, posterUrl, contextUrl);

  const metadata = buildMetadata(
    draft.venue_name,
    draft.venue_instagram,
    draft.venue_address,
    draft.chef_names,
    draft.chef_instagrams
  );

  await orchestrateEventCreate({ ...draft, metadata: JSON.stringify(metadata) }, null);
  logger.info('[WORKER] Draft saved to DB');

  await sqs.send(new DeleteMessageCommand({
    QueueUrl: process.env.SQS_DRAFT_QUEUE_URL,
    ReceiptHandle: message.ReceiptHandle,
  }));
  logger.info('[WORKER] Message deleted from queue');
};

// Fetches up to 1 message from SQS using long polling (waits up to 20s for a message before returning empty)
const receiveMessages = async () => {
  const command = new ReceiveMessageCommand({
    QueueUrl: process.env.SQS_DRAFT_QUEUE_URL,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 20,
  });

  const response = await sqs.send(command);
  return response.Messages ?? [];
};

// Continuously polls SQS and processes messages one at a time
const start = async () => {
  logger.info('[WORKER] Starting draft consumer');
  while (true) {
    const messages = await receiveMessages();
    for (const message of messages) {
      try {
        await processMessage(message);
      } catch (err) {
        logger.error('[WORKER] Failed to process message:', err.message || err);
      }
    }
  }
};

start();
