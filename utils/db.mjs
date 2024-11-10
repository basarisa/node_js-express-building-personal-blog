import pkg from "pg"; // นำเข้าโมดูล pg ทั้งหมดแล้วตั้งชื่อตัวแปรว่า pkg
const { Pool } = pkg; // ดึงค่า Pool จากภายใน pg

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:postgres@localhost:5432/personal-blog",
});

export default connectionPool;
