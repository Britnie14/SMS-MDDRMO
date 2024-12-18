import express from "express";
import { db } from "./firebaseConst"; // Import Firestore

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Firestore collection reference
const collectionRef = db.collection("sms_received");

// CREATE: Add a new document
app.post("/sms-received", async (req, res) => {
    try {
        const newDoc = req.body; // Expect a JSON body with the document data
        const docRef = await collectionRef.add(newDoc);
        res.status(201).json({ message: "Document created successfully", id: docRef.id });
    } catch (error) {
        console.error("Error creating document:", error);
        res.status(500).json({ error: "Failed to create document" });
    }
});

// READ: Get all documents
app.get("/sms-received", async (req, res) => {
    try {
        const snapshot = await collectionRef.get();
        const documents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(documents);
    } catch (error) {
        console.error("Error reading documents:", error);
        res.status(500).json({ error: "Failed to fetch documents" });
    }
});

// READ: Get a single document by ID
app.get("/sms-received/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await collectionRef.doc(id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.status(200).json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error("Error reading document:", error);
        res.status(500).json({ error: "Failed to fetch document" });
    }
});

// UPDATE: Update a document by ID
app.put("/sms-received/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body; // Expect a JSON body with the updated data
        await collectionRef.doc(id).update(updatedData);
        res.status(200).json({ message: "Document updated successfully" });
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ error: "Failed to update document" });
    }
});

// DELETE: Delete a document by ID
app.delete("/sms-received/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await collectionRef.doc(id).delete();
        res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        console.error("Error deleting document:", error);
        res.status(500).json({ error: "Failed to delete document" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
