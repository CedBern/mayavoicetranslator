import { CreateBucketCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { promises as fs } from 'fs';
import path from 'path';

// --- Configuration ---
const MINIO_ENDPOINT = 'http://127.0.0.1:9000';
const MINIO_ACCESS_KEY = 'minioadmin';
const MINIO_SECRET_KEY = 'minioadmin';
const MINIO_BUCKET = 'mayavoicetranslator';
const REGION = 'us-east-1'; // S3 default, required by the SDK

const LFS_EXPORT_DIR = './lfs-export';

// --- S3 Client Setup for MinIO ---
// IMPORTANT: forcePathStyle is required for MinIO
const s3Client = new S3Client({
    endpoint: MINIO_ENDPOINT,
    region: REGION,
    credentials: {
        accessKeyId: MINIO_ACCESS_KEY,
        secretAccessKey: MINIO_SECRET_KEY,
    },
    forcePathStyle: true, 
});

// --- Bucket Verification and Creation ---
async function ensureBucketExists() {
    try {
        // A simple command like list objects (even if empty) can check for bucket existence and access.
        // However, a more direct approach is to try to create it and handle the error if it already exists.
        console.log(`Ensuring bucket '${MINIO_BUCKET}' exists...`);
        const command = new CreateBucketCommand({
            Bucket: MINIO_BUCKET,
        });
        await s3Client.send(command);
        console.log(`Bucket '${MINIO_BUCKET}' created successfully.`);
    } catch (error) {
        // If the bucket already exists, the SDK will throw a specific error.
        // For MinIO, this is often BucketAlreadyOwnedByYou.
        if (error.name === 'BucketAlreadyOwnedByYou' || error.name === 'BucketAlreadyExists') {
            console.log(`Bucket '${MINIO_BUCKET}' already exists.`);
        } else {
            // For any other error, we should fail fast.
            console.error("Error ensuring bucket exists:", error);
            throw error; // Re-throw the error to stop the migration
        }
    }
}

// --- Main Migration Logic ---
async function migrateLfsToMinio() {
    console.log('Starting migration from Git LFS export to MinIO...');

    try {
        // Step 1: Make sure the bucket exists before trying to upload.
        await ensureBucketExists();

        // Step 2: Proceed with file migration
        const files = await fs.readdir(LFS_EXPORT_DIR);
        console.log(`Found ${files.length} files to migrate.`);

        for (const file of files) {
            const localFilePath = path.join(LFS_EXPORT_DIR, file);
            const fileContent = await fs.readFile(localFilePath);
            
            // Using the filename as the object key in the bucket
            const objectKey = file; 

            console.log(`Uploading ${file} to bucket '${MINIO_BUCKET}'...`);

            const command = new PutObjectCommand({
                Bucket: MINIO_BUCKET,
                Key: objectKey,
                Body: fileContent,
            });

            await s3Client.send(command);
            console.log(`  -> Successfully uploaded ${objectKey}`);
        }

        console.log('\nMigration complete! All files have been uploaded to MinIO.');

    } catch (error) {
        console.error('\nAn error occurred during migration:');
        console.error(error);
        process.exit(1); // Exit with an error code
    }
}

// --- Run the migration ---
migrateLfsToMinio();
