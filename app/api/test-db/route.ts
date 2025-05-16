import { NextResponse } from "next/server"
import { AppDataSource } from "@/lib/typeorm.config"

export async function GET() {
    
    try{
        if(!AppDataSource.isInitialized) {
            await AppDataSource.initialize()
        }

        const result = await AppDataSource.query("SHOW TABLES")
        const tables = result.map((row: any) => Object.values(row)[0])

        return NextResponse.json({ tables })
    }catch(error) {

        return NextResponse.json(
            { message: "테이블 조회 실패 Not console", error },
            { status: 500 }
        )
    }
}