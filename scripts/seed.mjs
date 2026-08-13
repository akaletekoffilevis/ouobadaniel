import { createClient } from "@supabase/supabase-js";
import pg from "pg";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { imageSize } from "image-size";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, ".env.local");
  const env = { ...process.env };
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const env = loadEnv();
if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "❌ Variables SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquantes.\n   Créez le fichier .env.local (voir .env.example)."
  );
  process.exit(1);
}

const DEFAULT_ADMIN_PASSWORD = env.DEFAULT_ADMIN_PASSWORD || "impact2026";
const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function ensureSchema() {
  if (!env.DATABASE_URL) {
    console.log("ℹ️  DATABASE_URL absent — tables supposées déjà créées (schéma SQL à exécuter dans le SQL Editor de Supabase).");
    return;
  }
  const client = new pg.Client({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    family: 4,
  });
  await client.connect();
  const schema = fs.readFileSync(path.join(root, "supabase", "schema.sql"), "utf8");
  await client.query(schema);
  await client.end();
  console.log("✅ Tables (works, settings) créées ou déjà présentes.");
}

async function ensureBucket() {
  const { error } = await supabase.storage.createBucket("works", {
    public: true,
  });
  if (error && !String(error.message).toLowerCase().includes("already exists")) {
    console.error("❌ Bucket :", error.message);
    process.exit(1);
  }
}

async function seedSettings() {
  const { error } = await supabase
    .from("settings")
    .upsert(
      {
        id: 1,
        whatsapp: env.SETTINGS_WHATSAPP || "+227 74 82 64 86",
        phone: env.SETTINGS_PHONE || "+227 82 39 09 93",
        email:
          env.SETTINGS_EMAIL || "Kamparlembaouobalamourdjoadani@gmail.com",
        location: env.SETTINGS_LOCATION || "Niamey, Niger",
        password_hash: hashPassword(DEFAULT_ADMIN_PASSWORD),
      },
      { onConflict: "id" }
    )
    .select();
  if (error) {
    console.error("❌ Settings :", error.message);
    process.exit(1);
  }
  console.log("✅ Coordonnées enregistrées.");
  console.log(`🔑 Mot de passe admin par défaut : ${DEFAULT_ADMIN_PASSWORD}`);
  console.log("   ⚠️  Changez-le dès la première connexion dans /admin.");
}

async function seedWorks() {
  const dir = path.join(root, "works-source");
  if (!fs.existsSync(dir)) return;
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
    .sort();

  for (let i = 0; i < files.length; i++) {
    const name = files[i];
    const filePath = path.join(dir, name);
    const buffer = fs.readFileSync(filePath);
    const { width, height } = imageSize(buffer);
    const ext = path.extname(name).slice(1);
    const storagePath = `works/seed-${Date.now()}-${i}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("works")
      .upload(storagePath, buffer, { contentType: `image/${ext}` });

    if (uploadError) {
      console.warn(`⚠️ Upload échoué pour ${name} : ${uploadError.message}`);
      continue;
    }

    const imageUrl = supabase.storage.from("works").getPublicUrl(storagePath).data.publicUrl;

    const { error: insertError } = await supabase.from("works").insert({
      title: `Création ${i + 1}`,
      category: "Design",
      image_url: imageUrl,
      image_path: storagePath,
      width,
      height,
    });

    if (insertError) {
      console.warn(`⚠️ Insertion échouée pour ${name} : ${insertError.message}`);
      continue;
    }
    console.log(`✅ ${name} (${width}×${height})`);
  }
}

console.log("🚀 Seed Impact Création…");
await ensureSchema();
await ensureBucket();
await seedSettings();
await seedWorks();
console.log("🎉 Terminé ! Démarrez le site : npm run dev");
