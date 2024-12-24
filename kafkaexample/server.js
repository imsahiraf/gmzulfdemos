const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['18.143.220.181:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'my-group-id' });
const topic = 'ramaakafkademo';

const runProducer = async () => {
  await producer.connect();
  const message = {
    value: 'Hello, Kafka!',
  };
  await producer.send({
    topic: topic,
    messages: [message],
  });
  await producer.disconnect();
};

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
setInterval(runProducer, 5000);
// runProducer().catch((err) => {
//   console.error('Error producing message:', err);
// });

runConsumer().catch((err) => {
  console.error('Error initializing Kafka consumer:', err);
});
