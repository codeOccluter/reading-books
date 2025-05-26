import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm"

@Entity("user_information")
export class UserInformation {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    password!: string

    @Column()
    name!: string

    @Column({ type: "date" })
    birthday!: Date

    @Column({ type: "text", nullable: true })
    avatar_url?: string

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    @Column({ type: "datetime" })
    last_login_at!: Date

    @Column({ default: false })
    is_dormant!: boolean

    @Column({ type: "datetime", nullable: true })
    dormant_at?: Date

    @Column({ default: false })
    is_deleted!: boolean

    @Column({ type: "datetime", nullable: true })
    deleted_at?: Date

    @Column({ type: "boolean", default: false })
    is_admin!: boolean
}