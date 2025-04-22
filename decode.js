import jwt from 'jsonwebtoken';

const token = "testuser"
const secret = "$2b$10$3qIZYHB8cot7Lav9XCcqOOVZBeNsIPA5ZE5It6TQawz9Lv5jcU1rK";  // กุญแจลับที่ใช้ในการเข้ารหัส

try {
  const decoded = jwt.verify(token, secret);
  console.log('Decoded Payload:', decoded);
} catch (err) {
  console.error('Invalid token:', err.message);
}
