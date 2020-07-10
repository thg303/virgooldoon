import {
  BACKUP_STARTED,
  BACKUP_ASK_DESTINATION
} from './action_types';

export function startBackup(payload) {
  return {
    type: BACKUP_STARTED,
    payload
  }
};

export function askForBackupFilePath(inFormat = '') {
  return {
    type: BACKUP_ASK_DESTINATION,
    payload: inFormat
  }
};
