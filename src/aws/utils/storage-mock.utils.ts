import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const APP_ROOT = process.cwd();

export enum SampleDocs {
  SAMPLE_PDF,
  PDF_SIGNED_ONCE,
  PDF_SIGNED_TWICE,
  CMS_SIGNED_ONCE,
  CMS_SIGNED_TWICE,
  SAMPLE_XML,
  SAMPLE_NFE,
  CMS_DETACHED_1,
  CMS_DETACHED_2,
  CMS_ATTACHED_1,
  CMS_ATTACHED_2,
  CMS_DATA_FILE,
}

export class StorageMock {
  static get appDataPath(): string {
    return path.join(APP_ROOT, 'app-data');
  }

  static get resourcesPath(): string {
    return path.join(APP_ROOT, 'resources');
  }

//   static getDataPath(fileId: any, extension = ''): any {
//     const filename = fileId.replace('_', '.');
//     return path.join(StorageMock.appDataPath, filename + extension);
//   }

  static getDataPath(fileId, extension = '') {
	const filename = fileId.replace('_', '.');
	return path.join(StorageMock.appDataPath, filename + extension);
}


  static getResourcePath(resource: string): string {
    return path.join(StorageMock.resourcesPath, resource);
  }

//   static existsSync({ fileId, extension = '', outputFilename = false }):any   { //{ exists: boolean; filename: string }
//     const filename = fileId.replace('_', '.') + extension;
//     const filePath = path.join(StorageMock.appDataPath, filename);
//     const exists = fs.existsSync(filePath);

//     if (outputFilename) {
//       return { exists, filename };
//     }

//     return exists;
//   }

  static existsSync({ fileId, extension = '', outputFilename = false }) {
	const filename = fileId.replace('_', '.') + extension;
	const filePath = path.join(StorageMock.appDataPath, filename);
	const exists = fs.existsSync(filePath);

	if (outputFilename) {
		return { exists, filename };
	}

	return fs.existsSync(filePath);
}

//   static storeSync(content: any, filename: string | null = null, extension = ''): string {
//     StorageMock.createAppDataSync();

//     if (!filename) {
//       filename = uuidv4();
//     }
//     const fileId = filename + extension;

//     const filePath = path.join(StorageMock.appDataPath, fileId);
//     fs.writeFileSync(filePath, content);

//     return fileId.replace('.', '_');
//   }

  static storeSync(content, filename = null, extension = '') {
	// Guarantees that the 'app-data' folder exists.
	StorageMock.createAppDataSync();

	// Generate fileId.
	if (!filename) {
		filename = uuidv4();
	}
	const fileId = filename + extension;

	// Store file.
	const filePath = path.join(StorageMock.appDataPath, fileId);
	fs.writeFileSync(filePath, content);

	// Replace extension '.' to '_' to be passed as parameters on URL for
	// URL safety.
	return fileId.replace('.', '_');
}



  // Returns the verification code associated with the given document, or null
	// if no verification code has been associated with it.
	static getVerificationCode(session, fileId) {
		// >>>>> NOTICE <<<<<
		// This should be implemented on your application as a SELECT on your
		// "document table" by the ID of the document, returning the value of the
		// verification code column.
		if (session[`Files/${fileId}/Code`]) {
			return session[`Files/${fileId}/Code`];
		}
		return null;
	}

	// Registers the verification code for a given document.
	static setVerificationCode(session, fileId, code) {
		// >>>>> NOTICE <<<<<
		// This should be implemented on your application as a UPDATE on your
		// "document table" filling the verification code column, which should be
		// an indexed column.
		session[`Files/${fileId}/Code`] = code;
		session[`Codes/${code}`] = fileId;
	}

	// Returns the ID of the document associated with a given verification code,
	// or null if no document matches the given code.
	static lookupVerificationCode(session, code) {
		if (!code) {
			return null;
		}
		// >>>>> NOTICE <<<<<
		// This should be implemented on your application as a SELECT on your
		// "document table" by the verification code column, which should be an
		// indexed column.
		if (session[`Codes/${code}`]) {
			return session[`Codes/${code}`];
		}
		return null;
	}

	static readSync(fileId, extension = '') {
		const filename = fileId.replace('_', '.') + extension;
		const filePath = path.join(StorageMock.appDataPath, filename);
		return fs.readFileSync(filePath);
	}

	static readSampleDocSync(sampleId) {
		const filePath = this.getSampleDocPath(sampleId);
		return fs.readFileSync(filePath);
	}

	static getSampleDocName(sampleId) {
		switch (sampleId) {
		case SampleDocs.SAMPLE_PDF:
			return 'SampleDocument.pdf';
		case SampleDocs.PDF_SIGNED_ONCE:
			return 'SamplePdfSignedOnce.pdf';
		case SampleDocs.PDF_SIGNED_TWICE:
			return 'SamplePdfSignedTwice.pdf';
		case SampleDocs.CMS_SIGNED_ONCE:
			return 'SampleCms.p7s';
		case SampleDocs.CMS_SIGNED_TWICE:
			return 'SampleCmsSignedTwice.p7s';
		case SampleDocs.SAMPLE_XML:
			return 'SampleDocument.xml';
		case SampleDocs.SAMPLE_NFE:
			return 'SampleNFe.xml';
		case SampleDocs.CMS_ATTACHED_1:
			return 'CMSAttached1.p7s';
		case SampleDocs.CMS_ATTACHED_2:
			return 'CMSAttached2.p7s';
		case SampleDocs.CMS_DETACHED_1:
			return 'CMSDetached1.p7s';
		case SampleDocs.CMS_DETACHED_2:
			return 'CMSDetached2.p7s';
		case SampleDocs.CMS_DATA_FILE:
			return 'CMSDataFile.pdf';
		default:
			throw new Error('Invalid sample document identification.');
		}
	}

	static getSampleDocPath(sampleId) {
		const filename = StorageMock.getSampleDocName(sampleId);
		return path.join(APP_ROOT, 'public', filename);
	}

	static getPdfStampPath() {
		return path.join(APP_ROOT, 'public', 'PdfStamp.png');
	}

	static getPdfStampContent() {
		return fs.readFileSync(path.join(APP_ROOT, 'public', 'PdfStamp.png'));
	}

	static getSamplePkcs12Path() {
		return path.join(APP_ROOT, 'public', 'Pierre de Fermat.pfx');
	}

	static getBatchDocPath(id) {
		return path.join(APP_ROOT, 'public', `0${id % 10}.pdf`);
	}

  static createAppDataSync(): void {
    if (!fs.existsSync(StorageMock.appDataPath)) {
      fs.mkdirSync(StorageMock.appDataPath);
    }
  }
}
