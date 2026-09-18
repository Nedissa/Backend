import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createProductsWorkflow } from "@medusajs/medusa/core-flows";
import fs from "fs";
import path from "path";

// Körs med: npx medusa exec ./src/scripts/import-itegra-products.ts
// Läser CSV-filen src/scripts/itegra-produkter.csv (skapa den från itegra-produkter.csv.example)
// Bilder läggs i src/scripts/produkt-bilder/, filnamn = SKU (t.ex. HAMA-USBC-1M.jpg, HAMA-USBC-1M-2.jpg)

const CSV_PATH = path.join(__dirname, "itegra-produkter.csv");
const IMAGES_DIR = path.join(__dirname, "produkt-bilder");

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
};

type Row = {
  group: string;
  title: string;
  sku: string;
  manufacturer_sku: string;
  price_sek: string;
  color: string;
  color_hex: string;
  features: string;
  specifications: string;
  description: string;
  description_sections: string;
  image_url: string;
};

function parseCsv(content: string): Row[] {
  const lines = content.trim().split("\n").filter((l) => l.trim().length > 0);
  const [headerLine, ...rows] = lines;
  const headers = headerLine.split(";").map((h) => h.trim());

  return rows.map((line) => {
    const cells = line.split(";").map((c) => c.trim());
    const row = {} as Row;
    headers.forEach((header, i) => {
      (row as any)[header] = cells[i] ?? "";
    });
    return row;
  });
}

const CATEGORY_KEYWORDS: { handle: string; keywords: string[] }[] = [
  { handle: "blackpatroner", keywords: ["bläckpatron", "toner", "bläck"] },
  { handle: "kablar", keywords: ["kabel", "laddare", "laddning"] },
  { handle: "batterier", keywords: ["batteri", "batterier"] },
  { handle: "vaskor", keywords: ["väska", "väskor", "fodral"] },
  { handle: "stationardator-tillbehor", keywords: ["mus", "möss", "tangentbord"] },
  { handle: "grafikkort", keywords: ["grafikkort"] },
  { handle: "laptops", keywords: ["laptop", "bärbar dator"] },
];

// Måste hållas i synk med COLOR_HEX_MAP i Frontend/apps/frontend/app/lib/productDisplay.ts
const COLOR_HEX_MAP: Record<string, string> = {
  svart: "#000000", black: "#000000",
  vit: "#FFFFFF", white: "#FFFFFF",
  silver: "#C0C0C0", grå: "#808080", gray: "#808080", grey: "#808080",
  röd: "#EF4444", red: "#EF4444",
  blå: "#3B82F6", blue: "#3B82F6",
  grön: "#22C55E", green: "#22C55E",
  gul: "#EAB308", yellow: "#EAB308",
  cyan: "#00AEEF",
  magenta: "#EC008C",
};

// Plockar ut kända färgnamn ur t.ex. "Färg (cyan, magenta, gul)" → ["cyan", "magenta", "gul"]
function extractNamedColors(colorText: string): string[] {
  const match = colorText.match(/\(([^)]+)\)/);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((name) => COLOR_HEX_MAP[name]);
}

function matchCategoryHandle(title: string): string | null {
  const lower = title.toLowerCase();
  for (const { handle, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((kw) => lower.includes(kw))) return handle;
  }
  return null;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function findImagesForSku(sku: string, logger: any): string[] {
  if (!fs.existsSync(IMAGES_DIR)) return [];

  const matches = fs
    .readdirSync(IMAGES_DIR)
    .filter((filename) => {
      const ext = path.extname(filename).toLowerCase();
      if (!MIME_TYPES[ext]) return false;
      const base = path.basename(filename, ext);
      return base === sku || base.startsWith(`${sku}-`);
    })
    .sort();

  const baseNames = new Set(matches.map((f) => path.basename(f, path.extname(f))));
  if (baseNames.size < matches.length) {
    logger.warn(`${sku}: flera filformat hittades för samma bildnamn (${matches.join(", ")}) — ta bort dubbletter i ${IMAGES_DIR}.`);
  }

  return matches.map((filename) => path.join(IMAGES_DIR, filename));
}

export default async function importItegraProducts({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fileModuleService = container.resolve(Modules.FILE);

  if (!fs.existsSync(CSV_PATH)) {
    logger.error(`Hittar inte ${CSV_PATH}. Skapa filen från itegra-produkter.csv.example.`);
    return;
  }

  const rows = parseCsv(fs.readFileSync(CSV_PATH, "utf-8"));
  if (rows.length === 0) {
    logger.warn("CSV-filen är tom, inget att importera.");
    return;
  }

  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id"],
  });
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "handle"],
  });

  if (!salesChannels[0] || !shippingProfiles[0]) {
    logger.error("Hittar ingen sales channel eller shipping profile i butiken.");
    return;
  }

  const handleToCategoryId = new Map(categories.map((c) => [c.handle, c.id]));

  const groups = new Map<string, Row[]>();
  for (const row of rows) {
    const key = row.group || row.sku;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(row);
  }

  const products = [];

  for (const [, groupRows] of groups) {
    const mainRow = groupRows[0];
    const allImageUrls: string[] = [];
    const colorToImageUrl: Record<string, string> = {};

    for (const row of groupRows) {
      const imagePaths = findImagesForSku(row.sku, logger);
      let firstUrlForRow: string | undefined;

      if (imagePaths.length > 0) {
        const uploaded = await fileModuleService.createFiles(
          imagePaths.map((filePath) => {
            const filename = path.basename(filePath);
            const ext = path.extname(filename).toLowerCase();
            return {
              filename,
              mimeType: MIME_TYPES[ext],
              content: fs.readFileSync(filePath).toString("binary"),
              access: "public" as const,
            };
          })
        );
        allImageUrls.push(...uploaded.map((file) => file.url));
        firstUrlForRow = uploaded[0]?.url;
        logger.info(`${row.sku}: laddade upp ${uploaded.length} bild(er).`);
      } else if (row.image_url) {
        allImageUrls.push(row.image_url);
        firstUrlForRow = row.image_url;
      } else {
        logger.warn(`${row.sku}: ingen bild hittad i ${IMAGES_DIR}.`);
      }

      if (row.color && firstUrlForRow) {
        colorToImageUrl[row.color] = firstUrlForRow;
      }
    }

    const categoryHandle = matchCategoryHandle(mainRow.title);
    const categoryId = categoryHandle ? handleToCategoryId.get(categoryHandle) : undefined;
    if (categoryHandle && !categoryId) {
      logger.warn(`${mainRow.sku}: kategorin "${categoryHandle}" hittades inte i Medusa.`);
    } else if (!categoryHandle) {
      logger.warn(`${mainRow.sku}: ingen kategori matchade titeln "${mainRow.title}".`);
    }

    const colorValues = groupRows.map((row) => row.color || "Ej specificerad");

    const colorMap: Record<string, string> = {};
    for (const row of groupRows) {
      if (!row.color) continue;

      let hexes: string[] = [];
      if (row.color_hex) {
        hexes = row.color_hex.split(",").map((h) => h.trim()).filter(Boolean);
      } else {
        const namedColors = extractNamedColors(row.color);
        hexes = namedColors.map((name) => COLOR_HEX_MAP[name]);
      }

      if (hexes.length === 1) {
        colorMap[row.color] = hexes[0];
      } else if (hexes.length > 1) {
        const step = 100 / hexes.length;
        const stops: string[] = [];
        hexes.forEach((hex, i) => {
          const start = i * step;
          const end = (i + 1) * step;
          stops.push(`${hex} ${start.toFixed(2)}%`);
          stops.push(`${hex} ${end.toFixed(2)}%`);
        });
        colorMap[row.color] = `linear-gradient(to right, ${stops.join(", ")})`;
      }
    }

    const metadata: Record<string, unknown> = {};
    if (mainRow.features) {
      metadata.features = mainRow.features.split(",").map((f) => f.trim()).filter(Boolean);
    }
    if (mainRow.specifications) {
      metadata.specifications = mainRow.specifications
        .split("~")
        .map((entry) => {
          const [label, value] = entry.split(":").map((s) => s.trim());
          return { label, value };
        })
        .filter((spec) => spec.label && spec.value);
    }
    if (mainRow.description_sections) {
      metadata.descriptionSections = mainRow.description_sections
        .split("|||")
        .map((entry) => {
          const [heading, body] = entry.split("::").map((s) => s.trim());
          return { heading, body };
        })
        .filter((section) => section.heading && section.body);
    }
    if (Object.keys(colorMap).length > 0) {
      metadata.colorMap = colorMap;
    }
    if (Object.keys(colorToImageUrl).length > 1) {
      metadata.imageMap = colorToImageUrl;
    }
    const manufacturerSkus = groupRows
      .filter((row) => row.manufacturer_sku)
      .map((row) => `${row.sku}:${row.manufacturer_sku}`);
    if (manufacturerSkus.length > 0) {
      metadata.manufacturer_sku = manufacturerSkus.join(",");
    }

    const descriptionMap: Record<string, string> = {};
    for (const row of groupRows) {
      if (row.color && row.description) {
        descriptionMap[row.color] = row.description;
      }
    }
    if (Object.keys(descriptionMap).length > 1) {
      metadata.descriptionMap = descriptionMap;
    }

    products.push({
      title: mainRow.title,
      handle: slugify(mainRow.title),
      description: mainRow.description,
      status: "published" as const,
      shipping_profile_id: shippingProfiles[0].id,
      sales_channels: [{ id: salesChannels[0].id }],
      category_ids: categoryId ? [categoryId] : [],
      images: allImageUrls.map((url) => ({ url })),
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      options: [
        {
          title: "Färg",
          values: colorValues,
        },
      ],
      variants: groupRows.map((row) => ({
        title: row.title,
        sku: row.sku,
        manage_inventory: false,
        options: { Färg: row.color || "Ej specificerad" },
        prices: [
          {
            amount: Number(row.price_sek),
            currency_code: "sek",
          },
        ],
      })),
    });
  }

  const { result } = await createProductsWorkflow(container).run({
    input: { products },
  });

  logger.info(`Importerade ${result.length} produkter (status: draft, alltid köpbara).`);
}
