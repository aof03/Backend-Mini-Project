import pkg from 'pg';
const { Pool } = pkg;

const connectionPool = new Pool({
  connectionString: "postgresql://postgres:aof091986@localhost:5432/Book-app",
});

export default connectionPool;