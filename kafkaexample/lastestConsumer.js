const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['18.143.220.181:9092'],
});

const consumer = kafka.consumer({ groupId: 'my-group-id' });
const topic = 'ramaakafkademo';

let lastProducedValue = null;

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: topic, fromBeginning: false });

  const getLastProducedValue = async () => {
    const messages = await consumer.fetchMessages({
      topic: topic,
      partitions: [{ partition: 0, fetchOffset: 'latest' }],
    });

    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      lastProducedValue = lastMessage.message.value.toString();
    } else {
      lastProducedValue = 'Data is yet to be produced.';
    }
  };

  await getLastProducedValue();
  console.log(`Last produced value: ${lastProducedValue}`);

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      lastProducedValue = message.value.toString();
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: lastProducedValue,
      });
    },
  });
};

runConsumer().catch((err) => {
  console.error('Error initializing Kafka consumer:', err);
});
