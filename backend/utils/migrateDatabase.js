import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const COLLECTIONS = [
    'categories',
    'products',
    'users',
    'carts',
    'wishlists',
    'contactmessages',
    'coupons',
    'orders',
];

const CONNECTION_OPTIONS = {
    serverSelectionTimeoutMS: 15000,
};

const isPresent = (value) =>
    value !== undefined && value !== null && String(value).trim() !== '';

const toNumber = (value, fallback = 0) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
};

const toImageArray = (value) => {
    if (Array.isArray(value)) return value.filter(isPresent);
    return isPresent(value) ? [value] : [];
};

const toPrice = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;

    const directNumber = Number(value);
    if (Number.isFinite(directNumber)) return directNumber;

    if (value && typeof value === 'object') {
        const values = Object.values(value)
            .map(Number)
            .filter(Number.isFinite);
        if (values.length) return Math.min(...values);
    }

    return 0;
};

const toDate = (value) => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
    if (isPresent(value)) {
        const date = new Date(value);
        if (!Number.isNaN(date.getTime())) return date;
    }
    return new Date();
};

const normalizeCategory = (document) => ({
    ...document,
    name: String(document.name || 'Imported Products').trim(),
    description: String(document.description || '').trim(),
    image: String(document.image || '').trim(),
    status: document.status === 'inactive' ? 'inactive' : 'active',
    createdAt: toDate(document.createdAt),
    updatedAt: toDate(document.updatedAt),
});

const normalizeProduct = (document, fallbackCategory) => {
    const legacy = isPresent(document.productName);
    const category = mongoose.Types.ObjectId.isValid(document.category)
        ? new mongoose.Types.ObjectId(document.category)
        : fallbackCategory;
    const name = String(document.name || document.productName || 'Imported product').trim();
    const description = String(
        document.description || document.productDescription || 'Imported product'
    ).trim();
    const normalized = {
        ...document,
        _id: document._id || new mongoose.Types.ObjectId(),
        name,
        description,
        price: toPrice(document.price),
        discountPrice: toNumber(document.discountPrice, 0),
        category,
        brand: String(document.brand || 'Imported').trim(),
        images: toImageArray(
            document.images && document.images.length ? document.images : document.productImage
        ),
        stock: toNumber(document.stock, legacy ? 1 : 0),
        rating: toNumber(document.rating, 0),
        numReviews: toNumber(document.numReviews, 0),
        isFeatured: document.isFeatured === undefined
            ? legacy
            : Boolean(document.isFeatured),
        status: document.status || 'approved',
        createdAt: toDate(document.createdAt),
        updatedAt: toDate(document.updatedAt),
    };

    delete normalized.productName;
    delete normalized.productImage;
    delete normalized.productDescription;

    return normalized;
};

const readDocuments = async (db, collectionName) =>
    db.collection(collectionName).find({}).toArray();

const replaceDocuments = async (db, collectionName, documents) => {
    if (!documents.length) return;

    await db.collection(collectionName).bulkWrite(
        documents.map((document) => ({
            replaceOne: {
                filter: { _id: document._id },
                replacement: document,
                upsert: true,
            },
        })),
        { ordered: false }
    );
};

const ensureImportedCategory = async (db) => {
    const collection = db.collection('categories');
    const existing = await collection.findOne({ name: 'Imported Products' });
    if (existing) return existing._id;

    const now = new Date();
    const category = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Imported Products',
        description: 'Products imported from the legacy catalogue',
        image: '',
        status: 'active',
        createdAt: now,
        updatedAt: now,
        __v: 0,
    };

    await collection.insertOne(category);
    return category._id;
};

const verifyDocuments = async (db, collectionName, documents) => {
    const ids = documents.map((document) => document._id).filter(Boolean);
    if (!ids.length) return 0;
    return db.collection(collectionName).countDocuments({ _id: { $in: ids } });
};

const migrate = async () => {
    const sourceUri = process.env.SOURCE_MONGO_URI;
    const targetUri = process.env.TARGET_MONGO_URI || process.env.MONGO_URI;
    const dryRun = process.argv.includes('--dry-run');
    const dropSource = process.argv.includes('--drop-source');
    const confirmDropSource = process.argv.includes('--confirm-drop-source');

    if (!isPresent(sourceUri)) {
        throw new Error('SOURCE_MONGO_URI is required.');
    }

    if (!dryRun && !isPresent(targetUri)) {
        throw new Error('TARGET_MONGO_URI or MONGO_URI is required.');
    }

    if (!dryRun && sourceUri === targetUri) {
        throw new Error('Source and target URIs must be different.');
    }

    const sourceConnection = await mongoose
        .createConnection(sourceUri, CONNECTION_OPTIONS)
        .asPromise();
    let targetConnection;

    try {
        const sourceDatabaseName = process.env.SOURCE_DB_NAME || sourceConnection.name;
        const sourceDb = sourceConnection.useDb(sourceDatabaseName).db;
        const sourceDocuments = {};

        for (const collectionName of COLLECTIONS) {
            sourceDocuments[collectionName] = await readDocuments(sourceDb, collectionName);
        }

        const sourceCounts = Object.fromEntries(
            COLLECTIONS.map((collectionName) => [collectionName, sourceDocuments[collectionName].length])
        );

        console.log(`Source database: ${sourceDatabaseName}`);
        console.log(JSON.stringify(sourceCounts, null, 2));

        if (dryRun) return;

        targetConnection = await mongoose
            .createConnection(targetUri, CONNECTION_OPTIONS)
            .asPromise();
        const targetDatabaseName = process.env.TARGET_DB_NAME || targetConnection.name;
        const targetDb = targetConnection.useDb(targetDatabaseName).db;

        const categories = sourceDocuments.categories.map(normalizeCategory);
        await replaceDocuments(targetDb, 'categories', categories);

        const needsFallbackCategory = sourceDocuments.products.some(
            (document) => !mongoose.Types.ObjectId.isValid(document.category)
        );
        const fallbackCategory = needsFallbackCategory
            ? await ensureImportedCategory(targetDb)
            : null;
        const products = sourceDocuments.products.map((document) =>
            normalizeProduct(document, fallbackCategory)
        );
        await replaceDocuments(targetDb, 'products', products);

        const migratedDocuments = {
            categories,
            products,
        };

        for (const collectionName of ['users', 'carts', 'wishlists', 'contactmessages', 'coupons', 'orders']) {
            const documents = sourceDocuments[collectionName];
            await replaceDocuments(targetDb, collectionName, documents);
            migratedDocuments[collectionName] = documents;
        }

        const verification = {};
        for (const collectionName of COLLECTIONS) {
            const expected = migratedDocuments[collectionName]?.length || 0;
            const actual = await verifyDocuments(targetDb, collectionName, migratedDocuments[collectionName] || []);
            if (actual !== expected) {
                throw new Error(`${collectionName} verification failed: expected ${expected}, found ${actual}`);
            }
            verification[collectionName] = actual;
        }

        console.log(`Target database: ${targetDatabaseName}`);
        console.log(JSON.stringify(verification, null, 2));

        if (dropSource) {
            if (!confirmDropSource) {
                throw new Error('Use --confirm-drop-source to delete the local source database.');
            }
            await sourceDb.dropDatabase();
            console.log('Local source database dropped.');
        } else {
            console.log('Source database preserved. Verify the target before using --drop-source --confirm-drop-source.');
        }
    } finally {
        await sourceConnection.close();
        if (targetConnection) await targetConnection.close();
    }
};

migrate().catch((error) => {
    console.error(`Migration failed: ${error.message}`);
    process.exitCode = 1;
});
