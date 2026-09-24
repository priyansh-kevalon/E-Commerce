import mongoose from 'mongoose';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const DATA_DIR = path.join(process.cwd(), 'data');
const MONGO_URI = process.env.MONGO_URI?.trim();

if (!MONGO_URI) {
    console.error('MONGO_URI is not set - point it at the database you want to export from.');
    process.exit(1);
}

const COLLECTIONS = ['categories', 'products', 'users'];

const conn = await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
console.log(`Connected: ${conn.connection.host}/${conn.connection.name}`);

await mkdir(DATA_DIR, { recursive: true });

for (const name of COLLECTIONS) {
    const docs = await conn.connection.db.collection(name).find({}).toArray();

    // JSON.stringify turns ObjectId -> hex and Date -> ISO automatically,
    // so the backup files stay readable and portable.
    const serialized = JSON.parse(
        JSON.stringify(docs, (key, value) => {
            if (value && typeof value === 'object' && value._bsontype === 'ObjectID') {
                return value.toHexString();
            }
            return value;
        })
    );

    const file = path.join(DATA_DIR, `${name}.json`);
    await writeFile(file, JSON.stringify(serialized, null, 2), 'utf8');
    console.log(`Exported ${serialized.length} ${name} -> ${file}`);
}

await mongoose.disconnect();
console.log('Export complete.');
process.exit(0);