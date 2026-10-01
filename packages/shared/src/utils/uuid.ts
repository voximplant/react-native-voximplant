import uuid from 'react-native-uuid';

/**
 * @hidden
 */
function generateUUID(): string {
  return uuid.v4();
}

export { generateUUID };
