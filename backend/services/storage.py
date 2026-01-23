import boto3
import os
import logging
from botocore.exceptions import ClientError
from typing import Optional

logger = logging.getLogger(__name__)

class StorageService:
    def __init__(self):
        self.bucket_name = os.getenv("AWS_STORAGE_BUCKET_NAME")
        self.region = os.getenv("AWS_REGION", "us-east-1")
        
        # S3 client
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=self.region
        ) if os.getenv("AWS_ACCESS_KEY_ID") else None

    async def upload_file(self, file_content, object_name: str, content_type: Optional[str] = None):
        """
        Upload a file to S3 bucket.
        """
        if not self.s3_client:
            logger.info(f"DEMO MODE: Storage not available (no credentials). Mocking upload for {object_name}")
            return f"https://mock-storage.learnflow.ai/{object_name}"

        try:
            extra_args = {}
            if content_type:
                extra_args['ContentType'] = content_type
            
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=object_name,
                Body=file_content,
                **extra_args
            )
            
            return f"https://{self.bucket_name}.s3.{self.region}.amazonaws.com/{object_name}"
        except ClientError as e:
            logger.error(f"S3 Upload error: {e}")
            return None

    def get_signed_url(self, object_name: str, expiration=3600):
        """
        Generate a signed URL to share an S3 object
        """
        if not self.s3_client:
            return f"https://mock-storage.learnflow.ai/{object_name}"

        try:
            response = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': object_name},
                ExpiresIn=expiration
            )
            return response
        except ClientError as e:
            logger.error(f"S3 URL error: {e}")
            return None

# Global instance
storage_service = StorageService()
