import path from 'path';
import fs from 'fs-extra';
import moment from 'moment-jalaali';

export function getExtensionFor(target) {
    if (target === 'excel') {
        return '.xlsx';
    }

    if (target === 'json') {
        return '.json';
    }

    if (target === 'html') {
        return '.html';
    }
    
    throw Error('invalid argument exception!');
}

export function getImageDirectoryFor(filePath, fileExtension) {
   const prefix = path.basename(path.resolve(filePath), fileExtension);
    const imagesDir = path.resolve(path.join(path.dirname(filePath), prefix + '_images'));

    if (fs.existsSync(imagesDir)) {
        const timeSuffix = moment().format('YYYY-MM-DD_H-mm-ss');
        fs.moveSync(imagesDir, `${imagesDir}__renamed_at_${timeSuffix}`);
    }
    // fs.ensureDirSync(imagesDir); this would raise a destination already exists exception 
 
    return imagesDir;
}

export function getHtmlDirectoryFor(filePath) {
    const prefix = path.basename(path.resolve(filePath), '.html');
    const htmlsDir = path.resolve(path.join(path.dirname(filePath), prefix + '_htmls'));
    if (fs.existsSync(htmlsDir)) {
        const timeSuffix = moment().format('YYYY-MM-DD_H-mm-ss');
        fs.moveSync(htmlsDir, `${htmlsDir}__renamed_at_${timeSuffix}`);
    }
    fs.ensureDirSync(htmlsDir);
    return htmlsDir;
 }