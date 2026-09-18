import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import fs from "fs";
import path from "path";

// Engångsskript: uppdaterar bilder, beskrivning och specifikationer på den
// befintliga HP 305XL-produkten med data hämtad från Icecat
// (src/scripts/produkt-bilder/fetch-icecat-images.py).
// Körs med: npx medusa exec ./src/scripts/update-hp305xl-images.ts

const PRODUCT_ID = "prod_01M2T0T48D64YARXCZD7JF1Z8J";
const IMAGES_DIR = path.join(__dirname, "produkt-bilder");
const FILES = ["1169161.webp", "1169162.webp"];

const DESCRIPTION =
  "Idealisk för hushåll, mikroföretag och mindre kontor som skriver ut en mängd olika vardagliga dokument och foton i färg. Skriv ut skarp text och levande foton i färg för hemmet och småföretag med HP originalbläckpatroner. Välj mellan patroner i olika storlekar för att matcha din utskriftsvolym och budget.";

const SPECIFICATIONS = "Typ av svart bläck:Pigmentbaserat bläck,Antal per förpackning:1 styck,Antal svarta bläckpatroner:1,Volym svart patron:4 ml,Antal sidor med svart bläckpatron:300 sidor,Modell:Original,Bläckpatron kapacitet:Hög (XL) avkastning,Typ av bläck:Pigmentbaserat bläck,Skrivarfäger:Svart,Brand kompatibilitet:HP,Produktens färg:Svart"
  .split(",")
  .map((entry) => {
    const [label, value] = entry.split(":").map((s) => s.trim());
    return { label, value };
  })
  .filter((spec) => spec.label && spec.value);

export default async function updateHp305xlImages({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const fileModuleService = container.resolve(Modules.FILE);
  const productModuleService = container.resolve(Modules.PRODUCT);

  const uploaded = await fileModuleService.createFiles(
    FILES.map((filename) => ({
      filename,
      mimeType: "image/webp",
      content: fs.readFileSync(path.join(IMAGES_DIR, filename)).toString("binary"),
      access: "public" as const,
    }))
  );

  logger.info(`Uppladdade: ${uploaded.map((f) => f.url).join(", ")}`);

  const product = await productModuleService.retrieveProduct(PRODUCT_ID);

  await productModuleService.updateProducts(PRODUCT_ID, {
    images: uploaded.map((file) => ({ url: file.url })),
    description: DESCRIPTION,
    metadata: {
      ...(product.metadata || {}),
      specifications: SPECIFICATIONS,
    },
  });

  logger.info(`Produkt ${PRODUCT_ID} uppdaterad med bild, beskrivning och specifikationer från Icecat.`);
}
