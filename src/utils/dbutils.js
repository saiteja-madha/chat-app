import { db } from "./firebase"

const createDocument = (collectionName, docData, fn) => {
    db.collection(collectionName).add(docData).then(createdDoc => {
        fn(createdDoc.id);
    })
}

export { createDocument }