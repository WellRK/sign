import { AwsService } from './aws.service';
//import { S3 } from 'aws-sdk';

describe('AwsService', () => {
    let awsService: AwsService;
    let mockS3;

    beforeEach(async () => {
        
        mockS3 = {
            upload: jest.fn().mockReturnThis(),
            getObject: jest.fn(),
            deleteObject: jest.fn().mockReturnThis(),
            promise: jest.fn(),
        };

       
        awsService = new AwsService();
        awsService['s3'] = mockS3;
    });

    it('Faz upload de um arquivo', async () => {
        const mockFile = {
          buffer: Buffer.from('teste'),
          originalname: 'testfile.txt',
          fieldname: 'file',
          encoding: '7bit',
          mimetype: 'text/plain',
          size: Buffer.from('teste').length,
          destination: '',
          filename: '',
          path: '',
          stream: null,
        };

        mockS3.promise.mockResolvedValue('Resultado do S3');

        const result = await awsService.uploadFile('testfile.txt', 'bucket-teste', mockFile);

        expect(mockS3.upload).toHaveBeenCalled();
        expect(result).toEqual('Resultado do S3');
    });


  it('Faz download de um arquivo', async () => {
    const expectedBuffer = Buffer.from('conteúdo do arquivo');

    mockS3.getObject.mockImplementation(() => ({
        promise: () => Promise.resolve({ Body: expectedBuffer }),
    }));

    const result = await awsService.downloadFile('testfile.txt', 'bucket-teste');

    expect(mockS3.getObject).toHaveBeenCalledWith({
        Bucket: 'bucket-teste',
        Key: 'testfile.txt',
    });
    expect(result).toEqual(expectedBuffer);
});

  it('Exclui um arquivo', async () => {
    const bucket = 'bucket-teste';
    const key = 'testfile.txt';

    mockS3.promise.mockResolvedValue('Resultado da exclusão');

    await awsService.delete(bucket, key);

    expect(mockS3.deleteObject).toHaveBeenCalledWith({
        Bucket: bucket,
        Key: key,
    });
    expect(mockS3.promise).toHaveBeenCalled();
  });


    
});
