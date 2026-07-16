export const METRIC_SECTIONS = [
  {
    label: 'Fundamental Metrics',
    group: 'fundamentals',
    rows: [
      {
        key: 'pbv',
        label: 'PBV',
        description:
          'Price-to-Book Value — compares the stock price to its book value per share. A lower PBV may indicate the stock is trading below its asset value.',
      },
      {
        key: 'per',
        label: 'PER',
        description:
          'Price-to-Earnings Ratio — compares stock price to earnings per share. A lower PER may indicate the stock is cheap relative to its earnings.',
      },
      {
        key: 'forwardPE',
        label: 'Forward PE',
        description:
          'Forward Price-to-Earnings — uses projected earnings for the next 12 months instead of historical earnings. If Forward PE is lower than Trailing PE, the market expects earnings growth ahead.',
      },
      {
        key: 'roe',
        label: 'ROE',
        description:
          "Return on Equity — measures how efficiently the company generates profit from shareholders' equity. Higher ROE generally indicates a more profitable business.",
      },
      {
        key: 'der',
        label: 'DER',
        description:
          "Debt-to-Equity Ratio — compares total debt to shareholders' equity. A lower DER means less financial leverage and generally lower financial risk.",
      },
      {
        key: 'eps',
        label: 'EPS',
        description:
          'Earnings Per Share — net profit divided by total shares outstanding. Higher EPS means more profit attributable to each share.',
      },
      {
        key: 'dividendYield',
        label: 'Dividend Yield',
        description:
          'Dividend Yield — annual dividend paid per share divided by the current stock price. A higher yield means more income relative to the price paid. ≥4% is considered high yield for IDX stocks.',
      },
      {
        key: 'insiderOwnership',
        label: 'Insider Ownership',
        description:
          'Percentage of shares held by company directors, executives, and major internal shareholders. Higher insider ownership means management has more "skin in the game" — their interests are aligned with shareholders.',
      },
      {
        key: 'institutionalOwnership',
        label: 'Institutional Ownership',
        description:
          'Percentage of shares held by professional fund managers, mutual funds, and institutional investors. Higher institutional ownership often signals confidence from sophisticated money managers.',
      },
      {
        key: 'peg',
        label: 'PEG Ratio',
        description:
          "Price/Earnings to Growth ratio — combines valuation (PER) with earnings growth. A PEG below 1 suggests the stock may be undervalued relative to its growth rate. Above 1.5 may indicate the growth is already priced in. Negative or >10 values are shown as N/A since they're not meaningful.",
      },
      {
        key: 'graham',
        label: 'Graham Number',
        description:
          "Graham Number — the maximum fair price based on EPS and book value per share (√22.5 × EPS × BVPS). A stock trading below this number may be undervalued by Benjamin Graham's standard.",
      },
    ],
  },
  {
    label: 'Monte Carlo',
    group: 'monteCarlo',
    rangeGauge: true,
    description:
      "Monte Carlo simulation runs 1,000 randomized price paths based on the stock's historical daily returns and volatility. It projects where the price could land over the next year — giving a probabilistic range (bear, base, bull) rather than a single prediction. The wider the spread between P10 and P90, the more uncertain and volatile the stock is.",
    rows: [
      {
        key: 'price',
        label: 'Current Price',
        description:
          'The latest market price of the stock, used as the starting point for Monte Carlo simulations.',
      },
      {
        key: 'p10',
        label: 'P10 (Bear case)',
        description:
          'The 10th percentile outcome from 1,000 simulated price paths. Only 10% of simulated scenarios end lower than this — representing a pessimistic outlook.',
      },
      {
        key: 'p50',
        label: 'P50 (Base case)',
        description:
          "The median (50th percentile) outcome from Monte Carlo simulations. This is the most likely price endpoint based on the stock's historical volatility and returns.",
      },
      {
        key: 'p90',
        label: 'P90 (Bull case)',
        description:
          'The 90th percentile outcome from 1,000 simulated price paths. Only 10% of simulated scenarios end higher than this — representing an optimistic outlook.',
      },
    ],
  },
  {
    label: 'Historical PE Valuation',
    group: 'fundamentals',
    description:
      "Fair value estimates derived from the stock's own historical PE multiples, applied to the current EPS. Bear uses the lowest historical annual PE, Base uses the average, and Bull uses the highest. The wider the bear–bull spread, the more the market's valuation of this stock has varied over time.",
    rows: [
      {
        key: 'historicalPEBear',
        label: 'Bear (Min PE)',
        description:
          'Bear case — current EPS × lowest historical annual PE. Represents the price if the market re-rates this stock to its historically cheapest valuation multiple.',
      },
      {
        key: 'historicalPEBase',
        label: 'Base (Avg PE)',
        description:
          'Base case — current EPS × average historical annual PE. Represents the historically fair price based on what the market has typically paid for each unit of earnings.',
      },
      {
        key: 'historicalPEBull',
        label: 'Bull (Max PE)',
        description:
          'Bull case — current EPS × highest historical annual PE. Represents the price if the market re-rates this stock to its historically most expensive valuation multiple.',
      },
      {
        key: 'avgHistoricalPE',
        label: 'Avg PE',
        description:
          'The average PE ratio this stock has traded at over available historical annual data (used for Base case).',
      },
      {
        key: 'minHistoricalPE',
        label: 'Min PE',
        description: 'The lowest annual average PE this stock has traded at (used for Bear case).',
      },
      {
        key: 'maxHistoricalPE',
        label: 'Max PE',
        description: 'The highest annual average PE this stock has traded at (used for Bull case).',
      },
    ],
  },
  {
    label: 'P/BV Valuation',
    group: 'pbvAnalysis',
    description:
      'Valuation estimates anchored to the book value of the company. Historical P/BV Target shows the fair price if the stock trades back to its historical average P/BV multiple. Cost of Equity (via CAPM) shows the required return — if ROE exceeds it, the company creates value and deserves a P/BV above 1.',
    rows: [
      {
        key: 'bvps',
        label: 'BVPS',
        description:
          "Book Value Per Share — total shareholders' equity divided by shares outstanding. Represents the net asset value attributable to each share. Lower stock price vs BVPS means cheaper on assets.",
      },
      {
        key: 'targetHistoricalPBV',
        label: 'Hist. P/BV Target',
        description:
          "Fair value price using the stock's average historical P/BV multiple applied to the current BVPS. Computed from annual average prices and annual book values over the available historical period.",
      },
      {
        key: 'roe',
        label: 'ROE',
        description:
          "Return on Equity — how much profit the company generates per unit of shareholders' equity. In P/BV context: if ROE > Cost of Equity, the stock deserves a P/BV above 1. If ROE < Cost of Equity, the stock may only be worth book value or less.",
      },
      {
        key: 'costOfEquity',
        label: 'Cost of Equity',
        description:
          'The minimum return shareholders require, estimated via CAPM: Rf (6.5% IDX risk-free rate) + β × 5.5% (equity risk premium). Compare with ROE — if ROE > Cost of Equity, the business creates shareholder value.',
      },
    ],
  },
  {
    label: 'DCF Valuation',
    group: 'dcfValuation',
    description:
      "Discounted Cash Flow — estimates intrinsic value by projecting the company's Free Cash Flow forward, then discounting back to present value using WACC. The terminal value captures all value beyond the projection window via the Gordon Growth Model. Growth rate is sourced from analyst consensus earnings growth (default 8% if unavailable). WACC is computed from Cost of Equity (CAPM) and estimated cost of debt (9%), weighted by capital structure.",
    rows: [
      {
        key: 'dcfFCF',
        label: 'Free Cash Flow',
        description:
          'Current Free Cash Flow in IDR Billion — operating cash flow minus capital expenditures. This is the starting FCF used for all projection years. Negative FCF means the company is currently burning cash, making DCF unreliable.',
      },
      {
        key: 'dcfGrowthRate',
        label: 'Growth Rate FCF',
        description:
          'Annual FCF growth rate applied for each projection year. Sourced from analyst consensus earnings growth. Falls back to 8% if the analyst figure is unavailable or negative. Capped at 30% to prevent unrealistic projections.',
      },
      {
        key: 'dcfWACC',
        label: 'WACC',
        description:
          'Weighted Average Cost of Capital — the blended required return across equity and debt, weighted by capital structure. Computed as: Ke × (E/V) + Kd × (1−T) × (D/V), where Ke = CAPM cost of equity, Kd = 9% estimated debt cost, T = 22% Indonesian corporate tax rate.',
      },
      {
        key: 'dcfTerminalGrowth',
        label: 'Terminal Growth Rate',
        description:
          'The assumed perpetual growth rate after the projection window — fixed at 3.5%, approximating long-run nominal GDP growth for Indonesia. Must be below WACC for the Gordon Growth Model to produce a finite terminal value.',
      },
      {
        key: 'dcfProjectionYears',
        label: 'Projection Years',
        description:
          'Number of years the FCF is explicitly projected before applying the terminal value. Fixed at 10 years — long enough to capture near-term growth, short enough to limit compounding uncertainty.',
      },
      {
        key: 'dcfFairValue',
        label: 'DCF Fair Value',
        description:
          'Estimated intrinsic value per share from the DCF model: (sum of discounted FCFs + discounted terminal value − net debt) ÷ shares outstanding. A BUY signal means the current price is below intrinsic value; SELL means it is above.',
      },
    ],
  },
  {
    label: 'Risk Metrics',
    group: 'risk',
    rows: [
      {
        key: 'sharpe1y',
        label: 'Sharpe 1Y',
        description:
          'Sharpe Ratio (1-year) — measures excess return per unit of total risk (volatility). A higher Sharpe ratio means better risk-adjusted performance over the past year.',
      },
      {
        key: 'sharpe3y',
        label: 'Sharpe 3Y',
        description:
          'Sharpe Ratio (3-year) — measures excess return per unit of total risk over 3 years. A higher value indicates more consistent risk-adjusted returns over the medium term.',
      },
      {
        key: 'sharpe5y',
        label: 'Sharpe 5Y',
        description:
          'Sharpe Ratio (5-year) — measures excess return per unit of total risk over 5 years. Useful for evaluating long-term risk-adjusted performance.',
      },
      {
        key: 'sortino1y',
        label: 'Sortino 1Y',
        description:
          'Sortino Ratio (1-year) — like Sharpe but only penalizes downside volatility. A higher Sortino means better return relative to the risk of losses over the past year.',
      },
      {
        key: 'sortino3y',
        label: 'Sortino 3Y',
        description:
          'Sortino Ratio (3-year) — measures return relative to downside risk over 3 years. Focuses on harmful volatility rather than total volatility.',
      },
      {
        key: 'sortino5y',
        label: 'Sortino 5Y',
        description:
          'Sortino Ratio (5-year) — measures return relative to downside risk over 5 years. A higher value means the stock delivered better returns with less downside risk long-term.',
      },
      {
        key: 'calmar',
        label: 'Calmar Ratio',
        description:
          'Calmar Ratio — annualized return divided by maximum drawdown. A higher Calmar means the stock generated more return relative to its worst historical decline.',
      },
      {
        key: 'maxdd',
        label: 'Max Drawdown',
        description:
          'Maximum Drawdown — the largest peak-to-trough decline in historical price. A smaller (less negative) drawdown means the stock experienced milder losses at its worst point.',
      },
    ],
  },
  {
    label: 'Analyst Consensus',
    group: 'analystConsensus',
    gauge: true,
    description:
      'Aggregated price targets and recommendations from professional sell-side analysts covering this stock. The gauge shows where the current price sits relative to analyst target range. Small-cap IDX stocks may have zero analyst coverage.',
    rows: [
      {
        key: 'targetMean',
        label: 'Target Mean Price',
        description:
          'The average 12-month price target from all covering analysts. Represents the consensus view of fair value.',
      },
      {
        key: 'upsidePercent',
        label: 'Upside / Downside',
        description:
          'Percentage difference between the current price and the analyst mean target price. Positive = upside potential, negative = downside risk according to analyst consensus.',
      },
      {
        key: 'recommendationKey',
        label: 'Recommendation',
        description:
          'Consensus analyst recommendation aggregated from all covering analysts: Strong Buy, Buy, Hold, Sell, or Strong Sell.',
      },
      {
        key: 'numberOfAnalysts',
        label: 'Analyst Count',
        description:
          'Number of analysts providing coverage and price targets for this stock. More analysts generally means a more reliable consensus.',
      },
    ],
  },
]
