import {
  BACKUP_STARTED,
  BACKUP_FAILED,
  BACKUP_SUCCESS,
} from './action_types';

export function startBackup(payload) {
  return {
    type: BACKUP_STARTED,
    payload
  }
};
