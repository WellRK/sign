import { Controller, Get, Post, Delete, UploadedFile, Param, Res, HttpStatus, UseInterceptors, Put, Next } from '@nestjs/common';
import { AppService } from './app.service';
import { AwsService } from './aws/aws.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, NextFunction, Response } from 'express';
import { PadesSignatureStarter, StandardSignaturePolicies, PadesMeasurementUnits } from 'restpki-client';
import { PadesVisualElementsRestPki } from './aws/utils/pades-visual-elements-restpki.utils';
import { StorageMock } from './aws/utils/storage-mock.utils';
import { Util } from './aws/utils/utils.utils';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly awsService: AwsService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload/:bucket')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('bucket') bucket: string) {
    const uploadResult = await this.awsService.uploadFile(file.originalname, bucket, file);
    return uploadResult;
  }

  @Get('download/:bucket/:name')
  async downloadFile(@Param('name') name: string, @Param('bucket') bucket: string, @Res() res: Response) {
    const file = await this.awsService.downloadFile(name, bucket);
    console.log(file)
    res.status(HttpStatus.OK).send(file);
  }

  @Put('update/:bucket/:name')
    @UseInterceptors(FileInterceptor('file'))
    async updateFile(
        @UploadedFile() file: Express.Multer.File, 
        @Param('bucket') bucket: string,
        @Param('name') name: string
    ) {
        const updateResult = await this.awsService.updateFile(name, bucket, file);
        return updateResult;
    }

  @Delete('delete/:bucket/:name')
  async deleteFile(@Param('name') name: string, @Param('bucket') bucket: string) {
    await this.awsService.delete(bucket, name);
    return { message: 'Arquivo deletado com sucesso' };
  }

  // @Get('sign2/:bucket/:name')
  // async signDocument2(
  //     //@Query('fileId') fileId: string,
  //     @Res() res: Response,
  //     @Next() next: NextFunction,
  //     @Param('name') name: string,
  //     @Param('bucket') bucket: string,
  // ) {

  //   const fileId = await this.awsService.downloadFile(name, bucket);

  //   // if (!StorageMock.existsSync({ fileId })) {
  //   //   const notFound = new Error('The fileId was not found');
  //   //   notFound.status = 404;
  //   //   next(notFound);
  //   //   return;
  //   // }

  //   // const util = new Util();
  //   const signatureStarter = new PadesSignatureStarter(Util.getRestPkiClient());

  //   // Set PDF to be signed.
  //   signatureStarter.setPdfToSignFromPath(StorageMock.getDataPath(fileId));
  
  //   // Set the signature policy.
  //   signatureStarter.signaturePolicy = StandardSignaturePolicies.PADES_BASIC;
  
  //   // Set the security context to be used to determine trust in the certificate
  //   // chain. We have encapsulated the security context choice on util.js.
  //   signatureStarter.securityContext = Util.getSecurityContextId();
  
  //   // Set the unit of measurements used to edit the PDF marks and visual
  //   // representations.
  //   signatureStarter.measurementUnits = PadesMeasurementUnits.CENTIMETERS;
  
  //   // Set the visual representation to the signature. We have encapsulated this
  //   // code (on pades-visual-elements.js) to be used on various PAdES examples.
  //   PadesVisualElementsRestPki.getVisualRepresentation()
  //     .then((visualRepresentation) => {
  //       // Set the visual representation to signatureStarter.
  //       signatureStarter.visualRepresentation = visualRepresentation;
  
  //       // Call the startWithWebPki() method, which initiates the signature.
  //       // This yields the token, a 43-character case-sensitive URL-safe
  //       // string, which identifies this signature process. We'll use this
  //       // value to call the signWithRestPki() method on the WebPKI component
  //       // (see public/js/signature-form.js) and also to complete the signature
  //       // after the form is submitted (see post method). This should not be
  //       // mistaken with the API access token.
  //       return signatureStarter.startWithWebPki();
  //     })
  //     .then((result) => {
  //       // The token acquired can only be used for a single signature attempt.
  //       // In order to retry the signature it is necessary to get a new token.
  //       // This can be a problem if the user uses the back button of the
  //       // browser, since the browser might show a cached page that we rendered
  //       // previously, with a now stale token. To prevent this from happening,
  //       // we set some response headers specifying that the page should not be
  //       // cached.
  //       Util.setExpiredPage(res);
  
  //       // Render the signature page.
  //       res.render('pades-signature-restpki', {
  //         token: result.token,
  //         fileId: fileId,
  //     });
  //     })
  //     .catch((err) => next(err));




  //   }






}
