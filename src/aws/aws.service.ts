import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class AwsService {
    private s3: S3;

    constructor() {
        this.s3 = new S3({
            region: 'us-east-2',
            accessKeyId: '',     
            secretAccessKey: '', 
        });
    }

    async uploadFile(name: string, bucket: string, file: Express.Multer.File) {
        try {
            const resposta = await this.s3.upload({
                Bucket: bucket,
                Body: file.buffer,
                Key: name,
            }).promise();

            console.log('Está funcionando', resposta);
            return resposta;
        } catch (error) {
            console.error('Erro ao salvar no S3:', error);
            throw error; 
        }
    }

    async downloadFile(name: string, bucket: string): Promise<String> {
      const params = {
          Bucket: bucket,
          Key: name,
      };
      
      try {
          const data = await this.s3.getObject(params).promise();
          
          console.log(`Download realizado: ${name} do bucket ${bucket}`);
          //return data.Body as Buffer;
          return data.Body.toString('base64');
        
      } catch (error) {
          console.error('Erro ao baixar o arquivo:', error);
          throw new Error('Erro ao baixar o arquivo');
      }
  }

  async downloadFilePath(name: string, bucket: string): Promise<string> {
    const params = {
        Bucket: bucket,
        Key: name,
    };
    
    try {
        const data = await this.s3.getObject(params).promise();
        
        console.log(`Download realizado: ${name} do bucket ${bucket}`);
        
        
        const bucketFilePath = `${bucket}/${name}`;
        console.log(bucketFilePath);
        
        // Pode optar por retornar apenas o bucketFilePath ou um objeto contendo ambos os dados
        return bucketFilePath; // ou { bucketFilePath: bucketFilePath, fileData: data.Body.toString('base64') };
      
    } catch (error) {
        console.error('Erro ao baixar o arquivo:', error);
        throw new Error('Erro ao baixar o arquivo');
    }
}

  

 


  async updateFile(name: string, bucket: string, file: Express.Multer.File) {
    try {
        const deleteParams = {
            Bucket: bucket,
            Key: name,
        };
        await this.s3.deleteObject(deleteParams).promise();

        const uploadParams = {
            Bucket: bucket,
            Body: file.buffer,
            Key: name,
        };
        const resposta = await this.s3.upload(uploadParams).promise();

        console.log('Arquivo atualizado com sucesso', resposta);
        return resposta;
    } catch (error) {
        console.error('Erro ao atualizar o arquivo:', error);
        throw error;
    }
    }

  async delete(bucket: string, key: string) {
    try {
        await this.s3.deleteObject({
            Bucket: bucket,
            Key: key,
        }).promise();

        console.log(`Arquivo excluído com sucesso: ${key} do bucket ${bucket}`);
    } catch (error) {
        console.error('Erro ao deletar o arquivo:', error);
        throw new Error('Erro ao deletar o arquivo');
    }
}

  
}
