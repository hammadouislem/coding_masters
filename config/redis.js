const { createClient } = require('redis');

// Create a Redis client
const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379
  }
});

// Event listeners to track Redis client status
client.on('connect', () => console.log('Connected to Redis...'));
client.on('ready', () => console.log('Redis client is ready...'));
client.on('error', (err) => console.error('Redis Error:', err));
client.on('end', () => console.log('Redis connection closed'));
client.on('reconnecting', () => console.log('Reconnecting to Redis...'));
client.on('disconnect', () => console.log('Disconnected from Redis'));

// Ensure connection before exporting anything
const connectRedis = async () => {
  if (!client.isOpen) {
    await client.connect();
  }
};

// Async functions for interacting with Redis

const getAsync = async (key) => {
  try {
    return await client.get(key);
  } catch (err) {
    console.error('Error getting data from Redis:', err);
  }
};

const setAsync = async (key, value, ttl = 3600) => {
  try {
    await client.setEx(key, ttl, value);
  } catch (err) {
    console.error('Error setting data to Redis:', err);
  }
};

const delAsync = async (key) => {
  try {
    await client.del(key);
  } catch (err) {
    console.error('Error deleting data from Redis:', err);
  }
};

const batchDelete = async (keys) => {
  if (!keys || keys.length === 0) return;

  const multi = client.multi();
  keys.forEach((key) => multi.del(key));

  try {
    await multi.exec();
  } catch (err) {
    console.error('Error deleting batch keys:', err);
  }
};

const blacklistToken = async (token, expiresIn) => {
  try {
    await setAsync(`blacklist:${token}`, 'blacklisted', expiresIn);
  } catch (err) {
    console.error('Error blacklisting token:', err);
  }
};

const isTokenBlacklisted = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const blacklisted = await getAsync(`blacklist:${token}`);
    if (blacklisted) {
      return res.status(401).json({ message: 'Token is blacklisted, please log in again.' });
    }
    next();
  } catch (err) {
    console.error('Error checking if token is blacklisted:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  connectRedis,
  client,
  getAsync,
  setAsync,
  delAsync,
  batchDelete,
  blacklistToken,
  isTokenBlacklisted,
};
