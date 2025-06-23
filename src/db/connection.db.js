import mysql2 from "mysql2";

export const connection = mysql2.createConnection({
  host: "bvjvcqclbz3tausg6vhv-mysql.services.clever-cloud.com",
  user: "uhihgea8kpo9khpb",
  password: "13fG15O6KTgZvqk5V5TT",
  database: "bvjvcqclbz3tausg6vhv",
  port: 3306,
});

export const establishDBConnection = () => {
  connection.connect((err) => {
    if (err) {
      console.error("Database connection failed:", err.message);
    } else {
      console.log("Database connected successfully.");
    }
  });
};
