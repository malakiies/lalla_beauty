import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';
import Category from './models/Category.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le dossier des images
const imgsDir = path.join(__dirname, '../frontend/src/assets/imgs_lalla_beauty');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected for Seeder'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const getCategoryFromFilename = (filename) => {
  const lower = filename.toLowerCase();
  if (lower.includes('ghassoul')) return 'Soins Corps';
  if (lower.includes('skincare') || lower.includes('face')) return 'Soins Visage';
  if (lower.includes('argan') || lower.includes('oil')) return 'Huiles Naturelles';
  if (lower.includes('spa')) return 'Coffrets Cadeaux';
  if (lower.includes('rose water')) return 'Eaux Florales';
  return 'Cosmétique';
};

const generateDescription = (category) => {
  const descs = [
    "Une formule luxueuse et authentique puisée dans les secrets de beauté orientaux. Hydratation intense et éclat garanti.",
    "Riche en vitamines et minéraux, ce soin naturel revitalise votre peau tout en respectant son équilibre naturel.",
    "Le secret ancestral des femmes marocaines. Une texture riche, un parfum envoûtant, pour un rituel bien-être inégalé.",
    "Ce produit d'exception purifie, nourrit et illumine. Sans parabènes, sans sulfates, 100% naturel."
  ];
  return descs[Math.floor(Math.random() * descs.length)];
};

const importData = async () => {
  try {
    // 1. Vider la base de données actuelle
    await Product.deleteMany();
    console.log('Anciens produits supprimés.');

    // 2. Fetch or create categories
    const categoryNames = ['Soins Corps', 'Soins Visage', 'Huiles Naturelles', 'Coffrets Cadeaux', 'Eaux Florales', 'Cosmétique'];
    const categoryMap = {};
    for (const name of categoryNames) {
      let cat = await Category.findOne({ name });
      if (!cat) {
        cat = await Category.create({ name, description: `Catégorie ${name}` });
      }
      categoryMap[name] = cat._id;
    }

    // 3. Lire les fichiers
    const files = fs.readdirSync(imgsDir);
    console.log(`Trouvé ${files.length} images.`);

    const productsToInsert = [];

    files.forEach((file, index) => {
      // Ignorer les fichiers cachés
      if (file.startsWith('.')) return;

      const categoryName = getCategoryFromFilename(file);
      const categoryId = categoryMap[categoryName];

      // Nettoyer le nom du fichier pour le nom du produit
      let cleanName = file.replace(/\.[^/.]+$/, "").replace(/[0-9()]/g, '').trim();
      cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      if (cleanName.length < 3) cleanName = `${categoryName} Premium ${index + 1}`;

      // Prix aléatoire entre 100 et 800 MAD
      const price = Math.floor(Math.random() * 700) + 100;
      
      productsToInsert.push({
        name: `${cleanName} - Édition Limitée`,
        image: `/src/assets/imgs_lalla_beauty/${file}`,
        category: categoryId,
        description: generateDescription(categoryName),
        rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // entre 3.5 et 5.0
        numReviews: Math.floor(Math.random() * 200) + 10,
        price: price,
        stock: Math.floor(Math.random() * 50) + 5,
        featured: Math.random() > 0.8 // 20% des produits sont featured
      });
    });

    // 4. Insérer les produits
    await Product.insertMany(productsToInsert);
    console.log('✅ Base de données remplie avec succès avec ' + productsToInsert.length + ' produits !');
    process.exit();

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
};

importData();
