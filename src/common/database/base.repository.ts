import { NotFoundException } from "@nestjs/common";
import { EntityManager, FindOptionsWhere, ObjectLiteral, Repository } from "typeorm";

export abstract class BaseRepository<T> {
    constructor(protected readonly repo: Repository<T extends ObjectLiteral ? T : any>) { }

    protected async findOneWithLock<K extends keyof T>(
        alias: string,
        cond: FindOptionsWhere<T> | FindOptionsWhere<T>[],
        select?: K[],
        manager?: EntityManager,
        lockMode?: DatabaseLockMode,
    ): Promise<Pick<T, K> & T> {
        const repository = manager?.getRepository(this.repo.target as any) ?? this.repo;

        const qb = repository.createQueryBuilder(alias);

        // Apply filters dynamically
        Object.entries(cond).forEach(([key, value]) => {
            if (value !== null && typeof value === 'object' && 'id' in value) {
                // relation condition e.g. { wallet: { id: '83d7f8c2...' } }
                qb.andWhere(`${alias}.${key} = :${key}`, { [key]: (value as any).id });
            } else {
                qb.andWhere(`${alias}.${key} = :${key}`, { [key]: value });
            }
        });

        // Apply select (only requested columns)
        if (select?.length) {
            qb.select(select.map((field) => `${alias}.${String(field)}`));
        }

        // Apply locking if requested (requires transaction)
        if (lockMode) {
            qb.setLock(lockMode);
        }

        const entity = await qb.getOne();
        if (!entity) throw new NotFoundException(`${alias} not found`);

        return entity as Pick<T, K> & T;
    }
}
