import mongoose from 'mongoose';
import { readFile } from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const DATA_DIR = path.join(process.cwd(), 'data');
const MONGO_URI = process.env.MONGO_URI?.trim();

if (!MONGO_URI) {
    console.error('MONGO_URI is not set - set it to your MongoDB Atlas URI first.');
    process.exit(1);
}

const toObjectId = (value) =>
    value && typeof value === 'string' && mongoose.Types.ObjectId.isValid(value)
        ? new mongoose.Types.ObjectId(value)
        : value;

// Restore an exported JSON doc: rebuild the _id and ObjectId reference fields
// that JSON.stringify turned into hex strings.
const restore = (doc, refFields = []) => {
    const d = JSON.parse(JSON.stringify(doc));
    if (d && d._id) d._id = toObjectId(d._id);
    for (const field of refFields) {
        if (d && d[field]) d[field] = toObjectId(d[field]);
    }
    return d;
};

const conn = await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
console.log(`Connected: ${conn.connection.host}/${conn.connection.name}`);

const plans = [
    { file: 'categories.json', model: Category, refFields: [] },
    { file: 'products.json', model: Product, refFields: ['category', 'seller'] },
    { file: 'users.json', model: User, refFields: [] },
];

let totalInserted = 0;
let totalPresent = 0;

for (const { file, model, refFields } of plans) {
    const filePath = path.join(DATA_DIR, file);
    let raw;
    try {
        raw = JSON.parse(await readFile(filePath, 'utf8'));
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log(`${file}: file not found, skipping`);
            continue;
        }
        console.error(`${file}: failed to read -> ${err.message}`);
        continue;
    }

    if (!raw.length) {
        console.log(`${file}: 0 documents (nothing to import)`);
        continue;
    }

    const ops = raw.map((doc) => ({
        replaceOne: {
            filter: { _id: toObjectId(doc?._id) },
            replacement: restore(doc, refFields),
            upsert: true,
        },
    }));

    const result = await model.bulkWrite(ops, { ordered: false });
    const inserted = result.upsertedCount || 0;
    const present = result.matchedCount || 0;
    totalInserted += inserted;
    totalPresent += present;

    const writeErrors = result.writeErrors || [];
    console.log(
        `${file}: ${raw.length} processed (${inserted} inserted, ${present} already present${
            writeErrors.length ? `, ${writeErrors.length} errors` : ''
        })`
    );
    for (const err of writeErrors.slice(0, 5)) {
        console.error(`   -> ${err.errmsg || err.message}`);
    }
}

await mongoose.disconnect();
console.log(`Import finished. Newly inserted: ${totalInserted}, already present: ${totalPresent}.`);
process.exit(0);