import { PadesVisualPositioningPresets } from 'restpki-client';
import { StorageMock } from './storage-mock.utils';
//import Util from './utils.utils';
import { Util } from './utils.utils';


//@Injectable()
export class PadesVisualElementsRestPki {
  // constructor(
  //   private readonly util: Util
  //   ) {}


  static async getVisualRepresentation(): Promise<any> {
    const pageNumber = 1; // Por exemplo, assinatura na primeira página
    const rows = 1;
    //const util = new Util();
    //const client = util.getRestPkiClient();
    const visualRepresentation: {
        text: {
          text: string;
          fontSize: number;
          includeSigningTime: boolean;
          horizontalAlign: string;
          container: {
            left: number;
            top: number;
            right: number;
            bottom: number;
          };
        };
        image: {
          resource: {
            content: string;
            mimeType: string;
          };
          horizontalAlign: string;
          verticalAlign: string;
        };
        position?: any; // Substitua 'any' pelo tipo correto se você souber
      } = {
        text: {

          // For a full list of the supported tags, see:
          // https://docs.lacunasoftware.com/articles/rest-pki/pades-tags.html
          text: 'Signed by {{name}} ({{national_id}})',
          fontSize: 13.0,
          // Specify that the signing time should also be rendered.
          includeSigningTime: true,
          // Optionally set the horizontal alignment of the text ('Left' or
          // 'Right'), if not set the default is 'Left'.
          horizontalAlign: 'Left',
          // Optionally set the container within the signature rectangle on
          // which to place the text. By default, the text can occupy the
          // entire rectangle (how much of the rectangle the text will actually
          // fill depends on the length and font size). Below, we specify that
          // the text should respect a right margin of 1.5 cm.
          container: {
            left: 0.2,
            top: 0.2,
            right: 0.2,
            bottom: 0.2,
          },
  
        },
        image: {
  
          // We'll use as background the image content/PdfStamp.png
          resource: {
            content: Buffer.from(StorageMock.getPdfStampContent()).toString('base64'), // Base-64 encoded!
            mimeType: 'image/png',
          },
  
          // Align the image to the right horizontally.
          horizontalAlign: 'Right',
          // Align the image to the center vertically.
          verticalAlign: 'Center',
        },
      };
  

      return new Promise(((resolve, reject) => {
        // Position of the visual representation. We get the footnote position
        // preset and customize it.
    
        const pageNumber = 1; // Defina o número da página onde a assinatura será colocada
        const rows = 1;       // Defina o número de linhas para a assinatura
    
        PadesVisualPositioningPresets.getFootnote(Util.getRestPkiClient(), pageNumber, rows)
          .then((visualPositioning) => {
            // Customize position preset.
            visualPositioning.auto.container.height = 4.94;
            visualPositioning.auto.signatureRectangleSize.width = 8.0;
            visualPositioning.auto.signatureRectangleSize.height = 4.94;
    
            // Add position to visual representation.
            visualRepresentation.position = visualPositioning;
    
            resolve(visualRepresentation);
          })
          .catch((err) => reject(err));
    }));






    }
}