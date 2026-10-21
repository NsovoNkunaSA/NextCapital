# NextCapital

NextCapital is a responsive financial learning and planning website for people building money skills, managing a small business or exploring investing. The home page organizes the experience into four sections: Markets, Learn, Business Growth and Investments. Visitors can open and use the tools without creating an account.

## What the website does

- **Markets:** Displays currency price movement on a chart. Visitors can select a currency pair and time range, refresh the view and compare the latest shown value with the period high and low. The page uses Twelve Data when configured; otherwise it clearly labels its generated sample values as illustrative, not current exchange rates.
- **Learn:** Provides short lessons about budgeting, business cash flow, digital payments, borrowing costs, investing and payment scams. Visitors can search by keyword, filter by topic and mark lessons complete.
- **Business Growth:** Helps young founders and township or rural businesses think through how digital tools can support starting, trading, getting paid, managing cash flow and reaching formal markets. A checklist covers business registration, digital payments, bookkeeping, procurement access, market links, funding readiness and fraud protection.
- **Investments:** Lets visitors adjust a starting amount, monthly contribution, estimated annual return and investment period to see a hypothetical compound-growth projection in South African rand.

## Current scope

NextCapital is an educational prototype, not a financial services platform. It does not currently register businesses, process payments, provide procurement listings, arrange funding or execute investments. The business checklist is a planning aid, not an application to a government or financial service. Lesson completion and checklist selections are held in page state and reset when the page reloads. The investment result is an estimate, not a guaranteed return or financial advice.

No demo login is required because the website currently has no sign-in feature. Market data is illustrative unless a Twelve Data API key is configured.

## Run locally

Requirements: Node.js and npm.

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Vite prints the local URL in the terminal, usually `http://localhost:5173`.

## Optional live market data

The Markets page uses the Twelve Data time-series API when an API key is configured. Create a `.env.local` file in the project root and add:

```dotenv
VITE_TWELVE_DATA_API_KEY=your_twelve_data_api_key
```

Restart the development server after changing environment variables. Keep `.env.local` private and do not commit API keys. Without a key, or if the feed cannot be reached, the page displays illustrative sample values.

## Available commands

```powershell
npm run dev
npm run lint
npm run build
npm run preview
```

## Technology

- React
- Vite
- React Router
- Recharts