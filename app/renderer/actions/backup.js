import {
  BACKUP_STARTED,
} from './action_types';

export function startBackup(payload) {
  return {
    type: BACKUP_STARTED,
    payload
  }
};
