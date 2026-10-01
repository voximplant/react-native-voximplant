import type { MobileServices } from '../core';

/**
 * Enum that contains the nodes the Voximplant account may belong to.
 *
 * You can find more information about nodes in the [getting started](/docs/getting-started/platform/react-native) section.
 */
export enum ConnectionNode {
  Node1 = 'NODE_1',
  Node2 = 'NODE_2',
  Node3 = 'NODE_3',
  Node4 = 'NODE_4',
  Node5 = 'NODE_5',
  Node6 = 'NODE_6',
  Node7 = 'NODE_7',
  Node8 = 'NODE_8',
  Node9 = 'NODE_9',
  Node10 = 'NODE_10',
  Node11 = 'NODE_11',
  Node12 = 'NODE_12',
  Node13 = 'NODE_13',
}

/**
 * Connection options for [Core.Client.connect].
 */
export interface ConnectOptions {
  /**
   * Node the Voximplant account belongs to.
   *
   * Find more information about [Core.ConnectionNode] in the [getting started guide](/docs/getting-started/platform/react-native).
   */
  node: ConnectionNode;

  /**
   * Array of media gateway servers for connection.
   *
   * The default value is an empty array.
   */
  gateways?: string[];

  /**
   * Mobile services provider.
   *
   * @android
   */
  services?: MobileServices;
}
