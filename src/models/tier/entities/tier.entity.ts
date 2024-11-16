import { Member } from 'src/models/member/entities/member.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  value: number;

  @OneToMany(() => Member, (member) => member.tier)
  members: Member[];
}
