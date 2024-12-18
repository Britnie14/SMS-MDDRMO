import express from "express";
import { parseString } from "xml2js"; // For XML to JSON conversion
import { db } from "./firebaseConst.js";
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

const app = express();
const PORT = 3000;

// Middleware to parse JSON globally
app.use(express.json());

// Middleware for XML parsing specific to `/sms-received` POST requests
const xmlMiddleware = express.text({ type: "application/xml" });

// Firestore collection reference
const collectionRef = collection(db, "sms_received");

// Function to validate and parse XML structure
const validateXML = (xmlData) => {
    return new Promise((resolve, reject) => {
        parseString(xmlData, { explicitArray: false }, (err, result) => {
            if (err) {
                reject({ error: "Invalid XML format", details: err.message });
            } else {
                const data = result?.root; // Assuming XML root element is <root>
                if (!data) {
                    reject({ error: "Invalid structure: Missing root element" });
                }
                resolve(data);
            }
        });
    });
};

// CREATE: Add a new document with XML validation
app.post("/sms-received", xmlMiddleware, async (req, res) => {
    const xmlData = req.body; // Raw XML data

    try {
        // Validate and parse XML
        const jsonData = await validateXML(xmlData);

        // Validate required fields
        const requiredFields = ["actionRespond", "barangay", "colorCode", "incidentType", "message", "sender"];
        const missingFields = requiredFields.filter(field => !(jsonData && jsonData[field]));

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: "Missing required fields",
                missingFields: missingFields,
            });
        }

        // Save the validated JSON data to Firestore
        const docRef = await addDoc(collectionRef, jsonData);
        res.status(201).json({
            message: "XML is valid and saved to Firestore",
            documentId: docRef.id,
            data: jsonData,
        });
    } catch (error) {
        console.error("Error processing XML:", error);
        res.status(400).json(error);
    }
});

// READ: Get all documents
app.get("/sms-received", async (req, res) => {
    try {
        const snapshot = await getDocs(collectionRef);
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
        const docRef = doc(db, "sms_received", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return res.status(404).json({ error: "Document not found" });
        }

        res.status(200).json({ id: docSnap.id, ...docSnap.data() });
    } catch (error) {
        console.error("Error reading document:", error);
        res.status(500).json({ error: "Failed to fetch document" });
    }
});

// Root route
app.get("/", (req, res) => {
    res.status(200).send("Welcome to the SMS Received API!");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
