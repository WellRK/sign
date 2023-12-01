import { Injectable, NotFoundException } from '@nestjs/common';
import { PadesMeasurementUnits, PadesSignatureStarter, StandardSignaturePolicies } from "restpki-client";
import { StorageMock } from '../aws/utils/storage-mock.utils';
import { AwsService } from '../aws/aws.service';
import { Util } from '../aws/utils/utils.utils';
import { PadesVisualElementsRestPki } from '../aws/utils/pades-visual-elements-restpki.utils';



@Injectable()
export class SignService {
 
  constructor(private readonly awsService: AwsService) {}

  async createSignatureToken(name: string, bucket: string): Promise<{ token: string, fileId: string }> {
    const base64String = await this.awsService.downloadFile(name, bucket);
    const fileBuffer = Buffer.from(base64String, 'base64');
    const fileId = StorageMock.storeSync(fileBuffer);

    if (!StorageMock.existsSync({ fileId })) {
      throw new NotFoundException('O fileId não foi encontrado');
    }

    const signatureStarter = new PadesSignatureStarter(Util.getRestPkiClient());
    signatureStarter.setPdfToSignFromPath(StorageMock.getDataPath(fileId));
    signatureStarter.signaturePolicy = StandardSignaturePolicies.PADES_BASIC;
    signatureStarter.securityContext = Util.getSecurityContextId();
    signatureStarter.measurementUnits = PadesMeasurementUnits.CENTIMETERS;

    const visualRepresentation = await PadesVisualElementsRestPki.getVisualRepresentation();
    signatureStarter.visualRepresentation = visualRepresentation;

    const result = await signatureStarter.startWithWebPki();
    return { token: result.token, fileId };
  }
}
