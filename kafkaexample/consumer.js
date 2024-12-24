const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['18.143.220.181:9092'],
});

const consumer = kafka.consumer({ groupId: 'my-group-id' });
const topic = 'ramaakafkademo';

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};

runConsumer().catch((err) => {
  console.error('Error initializing Kafka consumer:', err);
});
