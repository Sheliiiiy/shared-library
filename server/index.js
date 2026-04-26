require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccountPath =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.join(__dirname, "serviceAccountKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`
❌ Service account key not found at: ${serviceAccountPath}

Please download your Firebase service account key:
1. Go to https://console.firebase.google.com/project/shared-library-online/settings/serviceaccounts/adminsdk
2. Click "Generate new private key"
3. Save the downloaded JSON file as:
   ${serviceAccountPath}

Then restart the server.
`);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/library", require("./routes/library")(db));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

