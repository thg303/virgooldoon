export function getExtensionFor(target) {
    if (target === 'excel') {
        return '.xlsx';
    }
    if (target === 'json') {
        return '.json';
    }
    throw Error('invalid argument exception!');
}