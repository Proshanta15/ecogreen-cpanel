// One-off migration: strip any absolute origin (e.g. http://localhost:3000)
// from stored image paths so they become relative ("uploads/...") and resolve
// against the current (HTTPS) origin. Run with: node backend/scripts/fix-image-urls.mjs
import mongoose from "mongoose";
import dotenv from "dotenv";
import { normalizeImagePath } from "../utils/image-path.js";
import HomePage from "../models/home-model.js";
import Service from "../models/service-model.js";
import AboutPage from "../models/about-model.js";

dotenv.config();

function cleanString(v) {
  return typeof v === "string" ? normalizeImagePath(v) : v;
}

function cleanArray(arr, fields) {
  if (!Array.isArray(arr)) return arr;
  return arr.map((item) => {
    if (!item || typeof item !== "object") return item;
    const next = { ...item };
    for (const f of fields) {
      if (next[f] != null) next[f] = cleanString(next[f]);
    }
    return next;
  });
}

async function fixHome() {
  const docs = await HomePage.find({});
  for (const doc of docs) {
    let changed = false;
    if (doc.banner) {
      for (const f of ["image", "video"]) {
        if (doc.banner[f]) {
          const c = cleanString(doc.banner[f]);
          if (c !== doc.banner[f]) { doc.banner[f] = c; changed = true; }
        }
      }
    }
    if (doc.expertise?.cards) {
      const c = cleanArray(doc.expertise.cards, ["image"]);
      if (JSON.stringify(c) !== JSON.stringify(doc.expertise.cards)) { doc.expertise.cards = c; changed = true; }
    }
    if (doc.showcase?.products) {
      const c = cleanArray(doc.showcase.products, ["image"]);
      if (JSON.stringify(c) !== JSON.stringify(doc.showcase.products)) { doc.showcase.products = c; changed = true; }
    }
    if (doc.brands?.brands) {
      const c = cleanArray(doc.brands.brands, ["logo"]);
      if (JSON.stringify(c) !== JSON.stringify(doc.brands.brands)) { doc.brands.brands = c; changed = true; }
    }
    if (changed) { await doc.save(); console.log("Updated HomePage", doc._id); }
  }
}

async function fixService() {
  const docs = await Service.find({});
  for (const doc of docs) {
    let changed = false;
    if (doc.image) {
      const c = cleanString(doc.image);
      if (c !== doc.image) { doc.image = c; changed = true; }
    }
    if (doc.items && typeof doc.items === "object") {
      for (const g of ["men", "women", "children"]) {
        if (Array.isArray(doc.items[g])) {
          const c = cleanArray(doc.items[g], ["image"]);
          if (JSON.stringify(c) !== JSON.stringify(doc.items[g])) { doc.items[g] = c; changed = true; }
        }
      }
    }
    if (changed) { await doc.save(); console.log("Updated Service", doc._id); }
  }
}

async function fixAbout() {
  const docs = await AboutPage.find({});
  for (const doc of docs) {
    let changed = false;
    for (const f of ["hero", "aboutContent", "cta"]) {
      if (doc[f]?.image) {
        const c = cleanString(doc[f].image);
        if (c !== doc[f].image) { doc[f].image = c; changed = true; }
      }
    }
    if (doc.visionMission) {
      for (const f of ["vision", "mission"]) {
        if (doc.visionMission[f]?.image) {
          const c = cleanString(doc.visionMission[f].image);
          if (c !== doc.visionMission[f].image) { doc.visionMission[f].image = c; changed = true; }
        }
      }
    }
    if (doc.values) {
      const c = cleanArray(doc.values, ["image"]);
      if (JSON.stringify(c) !== JSON.stringify(doc.values)) { doc.values = c; changed = true; }
    }
    if (changed) { await doc.save(); console.log("Updated AboutPage", doc._id); }
  }
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("Connected. Migrating image URLs...");
  await fixHome();
  await fixService();
  await fixAbout();
  console.log("Done.");
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
