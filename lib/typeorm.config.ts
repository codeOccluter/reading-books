import "reflect-metadata"
import { DataSource } from "typeorm"
import { UserInformation } from "@/entities/UserInformation"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "20018"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [UserInformation],
    synchronize: true, // 개발 중에는 true, (실서버는 false)
    logging: false,
    ssl: {
        rejectUnauthorized: false
    }
})