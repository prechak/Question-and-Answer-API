// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString: "postgresql://postgres:std5511pe@localhost:5432/my-quora",
  // "postgresql://your-db-username:your-db-password@localhost:5432/your-db-name",
});

export default connectionPool;
