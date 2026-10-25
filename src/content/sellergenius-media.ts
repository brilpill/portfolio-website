import type { CaseScreen } from "./project-slides";

/**
 * SellerGenius screens (public/cases/sellergenius/), exported 25 Oct 2026 from the "All Screen UI (Light&Dark)" pages of
 * the SellerGenius Figma file (the app frame only, without its wallpaper). All sample: brands, products, figures and the
 * AI answers are design content, not client data or results. 1728 × 1117 at 1x; each screen draws its own window bar.
 * The notification list was left out because it shows people's email addresses.
 */
const dir = "/cases/sellergenius";
const screen = (file: string, label: string, alt: string): CaseScreen => ({ src: `${dir}/${file}.png`, label, alt });

export const SG_RATIO = "1728 / 1117";

export const sg = {
  dashboard: screen("dashboard", "Dashboard", "Sample SellerGenius dashboard with sales, ad spend, ACoS and a profit waterfall"),
  dashboardDark: screen("dashboard-dark", "Dark", "Sample SellerGenius dashboard in the dark theme"),
  customize: screen("customize", "Customise", "Sample SellerGenius dashboard in edit mode, with widgets on a grid"),
  addWidget: screen("add-widget", "Add a widget", "Sample SellerGenius widget library opened over the dashboard"),
  widgetFormat: screen("widget-format", "Choose a view", "Sample SellerGenius widget settings with a choice of chart view"),
  profit: screen("profit", "Profit", "Sample SellerGenius profit analytics with trends, fees and marketplace comparison"),
  plOverview: screen("pl-overview", "P&L", "Sample SellerGenius profit and loss table beside a profit waterfall"),
  profitSku: screen("profit-sku", "By SKU", "Sample SellerGenius profitability by SKU and brand"),
  feeBreakdown: screen("fee-breakdown", "Fees", "Sample SellerGenius fee breakdown with a key insight card"),
  advertising: screen("advertising", "Advertising", "Sample SellerGenius advertising overview with campaign metrics"),
  recommendations: screen("recommendations", "Recommendations", "Sample SellerGenius advertising recommendations with suggested actions"),
  brands: screen("brands", "All brands", "Sample SellerGenius overview of brands and their stores"),
  brandDetail: screen("brand-detail", "One brand", "Sample SellerGenius detail view of one brand and its connected stores"),
  aiChat: screen("ai-chat", "Ask AI", "Sample SellerGenius AI assistant start screen with saved prompts"),
  aiReport: screen("ai-report", "Report from a prompt", "Sample SellerGenius AI answer summarising sales and ad spend for a brand"),
  aiWindow: screen("ai-window", "Assistant in context", "Sample SellerGenius AI assistant opened as a window over the advertising page"),
};
