import { Controller, Get, Post, Delete, UploadedFile, Param, Res, HttpStatus, UseInterceptors, Put, Query, Next, NotFoundException, HttpException, Body } from '@nestjs/common';
import { AwsService } from '../aws/aws.service';
import { FileInterceptor } from '@nestjs/platform-express';
import express, { Express, NextFunction, Response } from 'express';
import { PadesSignatureFinisher, PadesSignatureStarter, StandardSignaturePolicies, PadesMeasurementUnits } from 'restpki-client';
import { PadesVisualElementsRestPki } from '../aws/utils/pades-visual-elements-restpki.utils';
import { StorageMock } from '../aws/utils/storage-mock.utils';
//import Util from 'src/aws/utils/utils.utils';
import { Util } from '../aws/utils/utils.utils';
import { SignService } from './sign.service';
import { uuid } from 'uuidv4';
import * as path  from 'path';


const APP_ROOT = process.cwd();


@Controller('sign')
export class SignController {
  constructor(
    
    private readonly awsService: AwsService,
    private readonly signService: SignService
    ) {}

  

    @Get('sign/:bucket/:name')
async signDocument(
    @Res() res: Response,
    @Next() next: NextFunction,
    @Param('name') name: string,
    @Param('bucket') bucket: string,
) {
  try {
    const { token, fileId } = await this.signService.createSignatureToken(name, bucket);
    Util.setExpiredPage(res);
    res.render('pades-signature-restpki', { token, fileId });
  } catch (err) {
    next(err);
  }
}

// @Post('/')
// async createSignature2(
//     @Body() createSignatureDto: CreateSignatureDto,
//     @Res() res: Response,
//     @Next() next: NextFunction,
// ) {
//     const signatureFinisher = new PadesSignatureFinisher(Util.getRestPkiClient());

//     try {
//         // Obter o token usando o SignatureService
//         const { token } = await this.signService.createSignatureToken(createSignatureDto.name, createSignatureDto.bucket);
        
//         signatureFinisher.token = token;

//         const result = await signatureFinisher.finish();

//         // Processamento do resultado
//         const signerCert = result.certificate;
//         StorageMock.createAppDataSync();
//         const filename = `${uuid()}.pdf`;

//         await result.writeToFile(path.join(APP_ROOT, 'app-data', filename));

//         // Renderizar a página de resultado
//         res.render('pades-signature-restpki/complete', {
//             signedPdf: filename,
//             signerCert,
//         });
//     } catch (err) {
//         next(err);
//     }
// }

  //     @Post('/')
  // async createSignature(
  //   @Body() createSignatureDto: CreateSignatureDto, 
  //   @Res() res: Response,
  //   @Next() next: NextFunction,
  //   ) {
   
  //   const signatureFinisher = new PadesSignatureFinisher(Util.getRestPkiClient());

	// // Set the token.
	//   signatureFinisher.token = req.body.token;

	// // Call the finish() method, which finalizes the signature process and
	// // returns the SignatureResult object.
	// signatureFinisher.finish()
	// 	.then((result) => {
	// 		// The "certificate" property of the SignatureResult object contains
	// 		// information about the certificate used by the user to sign the file.
	// 		const signerCert = result.certificate;

	// 		// At this point, you'd typically store the signed PDF on you database.
	// 		// For demonstration purposes, we'll store the PDF on a temporary
	// 		// folder publicly accessible and render a link to it.

	// 		StorageMock.createAppDataSync(); // Make sure the "app-data" folder exists.
	// 		const filename = `${uuid()}.pdf`;

	// 		// The SignatureResult object has functions for writing the signature
	// 		// file to a local life (writeToFile()) and to get its raw contents
	// 		// (getContent()). For large files, use writeToFile() in order to avoid
	// 		// memory allocation issues.
	// 		result.writeToFile(path.join(APP_ROOT, 'app-data', filename))
	// 		.then(()=>{
	// 			// Render the result page, showing the signed file and the signer
	// 			// certification info.
	// 			res.render('pades-signature-restpki/complete', {
	// 				signedPdf: filename,
	// 				signerCert,
	// 			});
	// 		})
	// 		.catch((err) => next(err));
	// 	})
	// 	.catch((err) => next(err));
  
  
  
  
  // }


}
