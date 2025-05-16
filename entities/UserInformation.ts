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
    avatarUrl?: string

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date

    @Column({ type: "datetime" })
    lastLoginAt!: Date

    @Column({ default: false })
    isDormant!: boolean

    @Column({ type: "datetime", nullable: true })
    dormantAt?: Date

    @Column({ default: false })
    isDeleted!: boolean

    @Column({ type: "datetime", nullable: true })
    deletedAt?: Date
}