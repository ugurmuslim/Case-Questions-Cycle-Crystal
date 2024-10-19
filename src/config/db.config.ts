export const config = {
  HOST: "db",
  USER: "user",
  PASSWORD: "password",
  DB: "mydatabase",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

export const dialect = "postgres";
