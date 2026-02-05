import { TABLE_NAMES } from 'src/common/constants';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';
import { PasswordUtil } from 'src/common/utils/password.utils';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity(TABLE_NAMES.USERS)
export class User extends BaseEntity {
  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  verifiedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await PasswordUtil.hash(this.password);
    }
  }

  async comparePassword(plain: string): Promise<boolean> {
    return PasswordUtil.compare(plain, this.password);
  }
}
