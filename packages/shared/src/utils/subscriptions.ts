import type { EventSubscription } from 'react-native';

/**
 * @hidden
 */
export class SubscriptionStore {
  private readonly subs: EventSubscription[] = [];

  public add(...subscriptions: EventSubscription[]): void {
    this.subs.push(...subscriptions);
  }

  public clear(): void {
    for (const subscription of this.subs) {
      subscription.remove();
    }
    this.subs.length = 0;
  }
}
