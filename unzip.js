// unpack the state baby name data
const AdmZip = require('adm-zip');
const path = require('path');

console.log('Unpacking baby names...');

const zipFilePath = path.join(__dirname, 'sqlite', 'state-name-data.sqlite.zip');
const outputDir = path.join(__dirname, 'output');

const zip = new AdmZip(zipFilePath);
zip.extractAllTo(outputDir, true);

console.log('...baby names unpacked');