import { ref, computed, onMounted } from "vue";
import { InputSystem } from "../../../entities/system";

export const icons = [
  "home",
  "menu",
  "cancel",
  "login",
  "close",
  "block",
  "remove",
];

export function verifyInputsSystems(system: InputSystem) {
  for (const key in system) {
    if (Object.prototype.hasOwnProperty.call(system, key)) {
      const value = system[key as keyof InputSystem];
      if (!value) {
        return false;
      }
    }
  }
  return true;
}

export const t = (key: string, localeRef: string) => {
  const currentLocale = localeRef || "";
  const isPt =
    currentLocale.toLowerCase().includes("br") ||
    currentLocale.toLowerCase().includes("pt");

  const translations: Record<string, { pt: string; en: string }> = {
    title: { pt: "Selecionar Ícone", en: "Select Icon" },
    searchPlaceholder: { pt: "Buscar ícone...", en: "Search icon..." },
    tabAll: { pt: "Todos", en: "All" },
    tabCustom: { pt: "Personalizados", en: "Custom" },
    noIconsFound: { pt: "Nenhum ícone encontrado", en: "No icons found" },
    addCustomTitle: { pt: "Caminho do SVG manual", en: "Manual SVG path" },
    customNameLabel: { pt: "Nome do ícone", en: "Icon name" },
    customPathLabel: {
      pt: "Caminho do SVG (começa com M...)",
      en: "SVG Path (starts with M...)",
    },
    customPathPlaceholder: { pt: "M12 2C6.48 2...", en: "M12 2C6.48 2..." },
    btnAdd: { pt: "Adicionar e Selecionar", en: "Add & Select" },
    dropZoneLabel: {
      pt: "Clique ou arraste um arquivo SVG aqui",
      en: "Click or drag an SVG file here",
    },
    uploadedLabel: {
      pt: "SVG carregado — clique para trocar",
      en: "SVG loaded — click to change",
    },
    uploadSuccess: {
      pt: "Ícone SVG carregado com sucesso!",
      en: "SVG icon uploaded successfully!",
    },
    uploadError: {
      pt: "Erro ao ler o arquivo SVG",
      en: "Error reading SVG file",
    },
    uploadErrorOnlySvg: {
      pt: "Por favor, envie apenas arquivos SVG",
      en: "Please upload SVG files only",
    },
  };
  return translations[key]?.[isPt ? "pt" : "en"] || key;
};

export const predefinedIcons: Array<{
  name: string;
  label: string;
  type: "material" | "svg";
}> = [
  { name: "home", label: "Home", type: "material" },
  { name: "settings", label: "Settings", type: "material" },
  { name: "person", label: "Person", type: "material" },
  { name: "folder", label: "Folder", type: "material" },
  { name: "description", label: "Document", type: "material" },
  { name: "camera", label: "Camera", type: "material" },
  { name: "login", label: "Login", type: "material" },
  { name: "close", label: "Close", type: "material" },
  { name: "menu", label: "Menu", type: "material" },
  { name: "check", label: "Check", type: "material" },
  { name: "search", label: "Search", type: "material" },
  { name: "info", label: "Info", type: "material" },
  { name: "help", label: "Help", type: "material" },
  { name: "phone", label: "Phone", type: "material" },
  { name: "calendar_month", label: "Calendar", type: "material" },
  { name: "email", label: "Email", type: "material" },
  { name: "star", label: "Star", type: "material" },
  { name: "favorite", label: "Favorite", type: "material" },
  { name: "share", label: "Share", type: "material" },
  { name: "download", label: "Download", type: "material" },
  {
    name: "M12.002 20.301L19.467 7.373h-4.316L12.002 12.87 8.85 7.373H4.535z M12.002 2L2 19.302h4.536L12.002 8.795l5.466 10.507H22z",
    label: "Vue.js",
    type: "svg",
  },
  {
    name: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
    label: "GitHub",
    type: "svg",
  },
  {
    name: "M12 2C6.5 2 2 4.2 2 7v10c0 2.8 4.5 5 10 5s10-2.2 10-5V7c0-2.8-4.5-5-10-5zm0 2c4.4 0 8 1.6 8 3s-3.6 3-8 3-8-1.6-8-3 3.6-3 8-3zm-8 6c0-1.2 2.8-2.6 6.8-2.9v1.9c-2 .3-3.6 1-3.6 2s1.6 1.7 3.6 2v1.9c-4-.3-6.8-1.7-6.8-2.9zm16 7c0 1.2-2.8 2.6-6.8 2.9v-1.9c2-.3 3.6-1 3.6-2s-1.6-1.7-3.6-2v-1.9c4 .3 6.8 1.7 6.8 2.9z",
    label: "Database",
    type: "svg",
  },
  {
    name: "img:/ico/partithura_logo.svg",
    label: "Partithura Logo",
    type: "svg",
  },
  { name: "img:/LOGO_CIRON.png", label: "Ciron Logo", type: "svg" },
  { name: "img:/ico/ICO_FUNDIMISA.avif", label: "Fundimisa Logo", type: "svg" },
];
