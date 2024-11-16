import { Member } from 'src/models/member/entities/member.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TournamentRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @OneToMany(() => Member, (member) => member.role)
  members: Member[];
}
