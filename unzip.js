// unpack the state baby name data
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Unpacking baby names...');

const zipFilePath = join(__dirname, 'sqlite', 'state-name-data.sqlite.zip');
const outputDir = join(__dirname, 'sqlite');

const unzip = async () => {
  const { default: AdmZip } = await import('adm-zip');
  const zip = new AdmZip(zipFilePath);
  zip.extractAllTo(outputDir, true);
  console.log('...baby names unpacked');
};

unzip().catch(console.error);