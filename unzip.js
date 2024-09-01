// unpack the state baby name data
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Unpacking baby names...');

const stateNameZipFilePath = join(__dirname, 'sqlite', 'state-name-data.sqlite.zip');
const usNameZipFilePath = join(__dirname, 'sqlite', 'us-name-data.sqlite.zip');
const usNameDetailsZipFilePath = join(__dirname, 'sqlite', 'us-name-details.sqlite.zip');

const outputDir = join(__dirname, 'sqlite');

const unzip = async () => {
  const { default: AdmZip } = await import('adm-zip');

  const usNameDetailsZip = new AdmZip(usNameDetailsZipFilePath);
  usNameDetailsZip.extractAllTo(outputDir, true);
  console.log('...usNameDetailsZip unpacked');

  const stateNameZip = new AdmZip(stateNameZipFilePath);
  stateNameZip.extractAllTo(outputDir, true);
  console.log('...stateNameZip unpacked');

  const usNameZip = new AdmZip(usNameZipFilePath);
  usNameZip.extractAllTo(outputDir, true);
  console.log('...usNameZip unpacked');

  console.log('\n\nus baby names unpacked!\n\n');
};

unzip().catch(console.error);