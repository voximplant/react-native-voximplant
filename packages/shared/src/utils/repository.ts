import type { WithId } from '../types';

/**
 * @hidden
 */
export abstract class Repository<
  Entity extends WithId<EntityId>,
  EntityData extends WithId<EntityId>,
  EntityId extends string = string
> {
  protected readonly storage = new Map<EntityId, Entity>();

  public get(id: EntityId): Entity | null {
    const stored = this.storage.get(id);

    if (stored) {
      if (this.sourceHas(id)) return stored;
      this.remove(id);
      return null;
    }

    const data = this.getEntityData(id);
    if (!data) return null;

    return this.store(data);
  }

  public remove(id: EntityId): Entity | null {
    const removed = this.storage.get(id);
    this.storage.delete(id);
    return removed ?? null;
  }

  public getMap(): Map<EntityId, Entity> {
    this.sync();
    return this.storage;
  }

  public getList(): Entity[] {
    return Array.from(this.getMap().values());
  }

  protected store(data: EntityData): Entity {
    const stored = this.storage.get(data.id);
    if (stored) return stored;

    const entity = this.createEntity(data);

    this.storage.set(data.id, entity);
    return entity;
  }

  protected sync(): void {
    const list = this.getEntityDataList();
    const idSet = new Set(list.map((source) => source.id));
    const storedIds = [...this.storage.keys()];

    for (const source of list) {
      this.store(source);
    }

    for (const id of storedIds) {
      if (!idSet.has(id)) {
        this.remove(id);
      }
    }
  }

  protected abstract getEntityData(id: EntityId): EntityData | null;

  protected abstract getEntityDataList(): readonly EntityData[];

  protected abstract createEntity(data: EntityData): Entity;

  protected abstract sourceHas(id: EntityId): boolean;
}
