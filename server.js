import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// Serwuj statyczne pliki z /dist
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback - wszystkie nieznane routes → index.html
// React Router przejmuje routing po stronie klienta
app.get('*', (req, res) => {
  // Dla /api/ nie zwracaj index.html - express.static już obsłużył pliki
  if (req.path.startsWith('/api/')) {
    return res.status(404).send('Not found');
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
