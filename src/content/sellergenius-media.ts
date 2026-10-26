import type { CaseScreen } from "./project-slides";

/**
 * SellerGenius screens (public/cases/sellergenius/framed/), exported 26 Oct 2026 from the "All Screen UI (Light&Dark)"
 * pages of the SellerGenius Figma file as they are presented there: the app window on its macOS-style wallpaper, 1888 ×
 * 1277 at 1x. They go in `images` blocks (shown whole, no extra frame). All sample: brands, products, figures and AI
 * answers are design content. Left out because they show people's names and email addresses: the notification list, the
 * login code, invite teammates, account settings and workspace members screens.
 */
const dir = "/cases/sellergenius/framed";
const screen = (file: string, label: string, alt: string): CaseScreen => ({ src: `${dir}/${file}.png`, label, alt: `Sample SellerGenius ${alt}` });

/** The presentation frames' proportions, for the light/dark compare. */
export const SG_RATIO = "1888 / 1277";

export const sg = {
  // Sign-in and onboarding
  signup: screen("signup", "Create an account", "sign-up card with Google, Apple and email"),
  signupProfile: screen("signup-profile", "Your profile", "profile setup during sign-up"),
  connectAmazon: screen("connect-amazon", "Seller Central", "step for connecting Amazon Seller Central"),
  connectAds: screen("connect-ads", "Amazon Ads", "step for connecting the Amazon Ads account"),
  login: screen("login", "Log in", "log-in card"),
  loginWorkspace: screen("login-workspace", "Choose a workspace", "workspace choice after logging in"),
  // Dashboard
  dashboard: screen("dashboard", "Dashboard", "dashboard with sales, ad spend, ACoS and a profit waterfall"),
  dashboardDark: screen("dashboard-dark", "Dark", "dashboard in the dark theme"),
  customize: screen("customize", "Customise", "dashboard in edit mode, with widgets on a grid"),
  addWidget: screen("add-widget", "Add a widget", "widget library opened over the dashboard"),
  widgetFormat: screen("widget-format", "Choose a view", "widget settings with a choice of chart view"),
  // Profit and advertising
  profit: screen("profit", "Profit", "profit analytics with trends, fees and marketplace comparison"),
  plOverview: screen("pl-overview", "P&L", "profit and loss table beside a profit waterfall"),
  profitSku: screen("profit-sku", "By SKU", "profitability by SKU and brand"),
  feeBreakdown: screen("fee-breakdown", "Fees", "fee breakdown with a key insight card"),
  advertising: screen("advertising", "Advertising", "advertising overview with campaign metrics"),
  recommendations: screen("recommendations", "Recommendations", "advertising recommendations with suggested actions"),
  // Products and operations
  products: screen("products", "Products", "products overview"),
  productPerformance: screen("product-performance", "Performance", "product performance overview"),
  productsList: screen("products-list", "Products list", "product list with status, margin and stock"),
  inventory: screen("inventory", "Inventory", "inventory with stock levels and restock dates"),
  alerts: screen("alerts", "Alerts", "product alerts by severity"),
  listings: screen("listings", "Listings", "listing quality and issues"),
  cogsUpload: screen("cogs-upload", "COGS upload", "cost of goods upload"),
  productNotes: screen("product-notes", "Notes and tags", "product notes and tags"),
  tagsStatus: screen("tags-status", "Tags and statuses", "tag and status management"),
  operations: screen("operations", "Operations", "operations overview with a health score and issues"),
  sellerHealth: screen("seller-health", "Seller health", "seller health score and issue log"),
  returns: screen("returns", "Returns", "returns by product and reason"),
  // Brands and AI
  brands: screen("brands", "All brands", "overview of brands and their stores"),
  brandDetail: screen("brand-detail", "One brand", "detail view of one brand and its connected stores"),
  aiChat: screen("ai-chat", "Ask AI", "AI assistant start screen with saved prompts"),
  aiReport: screen("ai-report", "Report from a prompt", "AI answer summarising sales and ad spend for a brand"),
  aiWindow: screen("ai-window", "Assistant in context", "AI assistant opened as a window over the advertising page"),
  // Reports and settings
  reports: screen("reports", "Custom reports", "custom report builder with saved and generated reports"),
  reportBuilder: screen("report-builder", "Scheduled report", "scheduled report settings"),
  settingsSessions: screen("settings-account-3", "Sessions", "account settings with active sessions"),
  settingsNotifications: screen("settings-notifications", "Notifications", "notification settings by type"),
  settingsSellerAccounts: screen("settings-workspaces-2", "Seller accounts", "workspace settings with connected seller accounts"),
  settingsShared: screen("settings-workspaces-3", "Shared accounts", "workspace settings with shared and Ads accounts"),
};
