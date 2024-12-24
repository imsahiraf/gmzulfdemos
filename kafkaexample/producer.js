const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['18.143.220.181:9092'],
});

const producer = kafka.producer();
const topic = 'ramaakafkademo';

const runProducer = async () => {
  await producer.connect();

  let counter = 1;
  const sendMessage = async () => {
    const message = {
      value: counter.toString(),
    };
    await producer.send({
      topic: topic,
      messages: [message],
    });
    console.log(`Produced message: ${counter}`);
    counter++;
  };

  setInterval(sendMessage, 1000);
};

runProducer().catch((err) => {
  console.error('Error producing message:', err);
});
