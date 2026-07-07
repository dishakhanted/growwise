import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { computeNotePricing } from "@/lib/note-pricing/engine";
import { formatCurrency, formatPercent, formatSignedCurrency, formatSignedPercent } from "@/lib/note-pricing/format";
import {
  deriveMarketValues,
  getActiveMarkets,
  getImpliedProbabilityForSide,
} from "@/lib/note-pricing/markets";
import { NOTE_PRICING_CONFIG } from "@/lib/note-pricing/config";
import type { KalshiMarket, MarketSide } from "@/types/markets";

const INFEASIBLE_MESSAGE =
  "Not available at this protection level — increase protection to see a valid note.";

const activeMarkets = getActiveMarkets();

export const NoteBuilder = () => {
  const [selectedTicker, setSelectedTicker] = useState(activeMarkets[0]?.ticker ?? "");
  const [side, setSide] = useState<MarketSide>("YES");
  const [principal, setPrincipal] = useState<number>(NOTE_PRICING_CONFIG.defaultPrincipal);
  const [protectionPct, setProtectionPct] = useState(Math.round(NOTE_PRICING_CONFIG.defaultProtection * 100));
  const [principalError, setPrincipalError] = useState<string | null>(null);

  const selectedMarket = useMemo(
    () => activeMarkets.find((market) => market.ticker === selectedTicker) ?? activeMarkets[0],
    [selectedTicker],
  );

  const pricing = useMemo(() => {
    if (!selectedMarket) return null;

    const protection = protectionPct / 100;
    const impliedProbability = getImpliedProbabilityForSide(selectedMarket, side);
    const { tenorYears } = deriveMarketValues(selectedMarket);

    return computeNotePricing({
      principal,
      protection,
      impliedProbability,
      tenorYears,
    });
  }, [selectedMarket, side, principal, protectionPct]);

  const handlePrincipalChange = (value: string) => {
    const parsed = Number(value.replace(/,/g, ""));
    if (Number.isNaN(parsed)) {
      setPrincipalError("Enter a valid amount.");
      return;
    }

    if (parsed < NOTE_PRICING_CONFIG.minPrincipal) {
      setPrincipalError(`Minimum principal is ${formatCurrency(NOTE_PRICING_CONFIG.minPrincipal)}.`);
    } else {
      setPrincipalError(null);
    }

    setPrincipal(parsed);
  };

  if (!selectedMarket || !pricing) {
    return null;
  }

  const { tenorDays } = deriveMarketValues(selectedMarket);

  return (
    <section id="note-builder" className="border-b border-[hsl(var(--primary)/0.12)]">
      <div className="container mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[hsl(var(--accent))]">Note Builder</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--landing-text-muted)]">
          Build an illustrative principal-protected note linked to a live prediction-market event.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="landing-note-panel space-y-6 p-6 sm:p-8">
            <EventField market={selectedMarket} onChange={setSelectedTicker} />
            <SideField side={side} onChange={setSide} market={selectedMarket} />
            <PrincipalField
              principal={principal}
              error={principalError}
              onChange={handlePrincipalChange}
            />
            <ProtectionField protectionPct={protectionPct} onChange={setProtectionPct} />
            <p className="font-mono text-xs text-[var(--landing-text-muted)]">
              Tenor: {Math.round(tenorDays)} days (Act/365) · {selectedMarket.source}
            </p>
          </div>

          <div className="space-y-5">
            {!pricing.feasible ? (
              <div className="landing-note-panel p-6 sm:p-8">
                <p className="text-sm leading-relaxed text-[var(--landing-text-muted)]">{INFEASIBLE_MESSAGE}</p>
              </div>
            ) : (
              <>
                <OutcomeBlock
                  title="If your side resolves true"
                  variant="success"
                  rows={[
                    { label: "Coupon", value: `${formatCurrency(pricing.couponUSD)} (${formatPercent(pricing.couponPct)})` },
                    { label: "Total received", value: formatCurrency(pricing.winReceives) },
                    { label: "Period return", value: formatPercent(pricing.periodReturnWin) },
                    { label: "APY — simple", value: formatPercent(pricing.apySimpleWin) },
                    { label: "APY — compound", value: formatPercent(pricing.apyCompoundWin) },
                  ]}
                />
                <OutcomeBlock
                  title="If your side resolves false"
                  variant="failure"
                  rows={[
                    { label: "Capital returned", value: formatCurrency(pricing.loseReceives) },
                    {
                      label: "At risk",
                      value: `${formatSignedCurrency(-pricing.lossUSD)} (${formatSignedPercent(-pricing.lossPct)})`,
                      negative: true,
                    },
                    { label: "Coupon", value: formatCurrency(0) },
                  ]}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const EventField = ({
  market,
  onChange,
}: {
  market: KalshiMarket;
  onChange: (ticker: string) => void;
}) => (
  <div className="space-y-2">
    <Label className="font-mono text-xs uppercase tracking-wider text-[var(--landing-text-muted)]">Event</Label>
    <Select value={market.ticker} onValueChange={onChange}>
      <SelectTrigger className="h-12 border-[hsl(var(--primary)/0.25)] bg-[#0a0a0f] text-[var(--landing-text)]">
        <SelectValue placeholder="Select an event" />
      </SelectTrigger>
      <SelectContent className="border-[hsl(var(--primary)/0.25)] bg-[#0a0a0f] text-[var(--landing-text)]">
        {activeMarkets.map((item) => (
          <SelectItem key={item.ticker} value={item.ticker} className="focus:bg-[var(--landing-surface-elevated)]">
            {item.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const SideField = ({
  side,
  onChange,
  market,
}: {
  side: MarketSide;
  onChange: (side: MarketSide) => void;
  market: KalshiMarket;
}) => (
  <div className="space-y-2">
    <Label className="font-mono text-xs uppercase tracking-wider text-[var(--landing-text-muted)]">Side</Label>
    <ToggleGroup
      type="single"
      value={side}
      onValueChange={(value) => value && onChange(value as MarketSide)}
      className="grid grid-cols-2 gap-2"
    >
      <ToggleGroupItem
        value="YES"
        className="h-11 rounded-sm border border-[hsl(var(--primary)/0.25)] bg-[#0a0a0f] font-mono text-xs uppercase tracking-wider data-[state=on]:border-[hsl(var(--primary))] data-[state=on]:bg-[hsl(var(--primary)/0.15)] data-[state=on]:text-[hsl(var(--accent))]"
      >
        YES
      </ToggleGroupItem>
      <ToggleGroupItem
        value="NO"
        className="h-11 rounded-sm border border-[hsl(var(--primary)/0.25)] bg-[#0a0a0f] font-mono text-xs uppercase tracking-wider data-[state=on]:border-[hsl(var(--primary))] data-[state=on]:bg-[hsl(var(--primary)/0.15)] data-[state=on]:text-[hsl(var(--accent))]"
      >
        NO
      </ToggleGroupItem>
    </ToggleGroup>
    <p className="text-xs text-[var(--landing-text-muted)]">
      {side === "YES" ? market.yes_sub_title : market.no_sub_title}
    </p>
  </div>
);

const PrincipalField = ({
  principal,
  error,
  onChange,
}: {
  principal: number;
  error: string | null;
  onChange: (value: string) => void;
}) => (
  <div className="space-y-2">
    <Label htmlFor="principal" className="font-mono text-xs uppercase tracking-wider text-[var(--landing-text-muted)]">
      Principal
    </Label>
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[var(--landing-text-muted)]">
        $
      </span>
      <Input
        id="principal"
        type="text"
        inputMode="numeric"
        value={principal.toLocaleString("en-US")}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 border-[hsl(var(--primary)/0.25)] bg-[#0a0a0f] pl-8 text-[var(--landing-text)]"
      />
    </div>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

const ProtectionField = ({
  protectionPct,
  onChange,
}: {
  protectionPct: number;
  onChange: (value: number) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between gap-4">
      <Label className="font-mono text-xs uppercase tracking-wider text-[var(--landing-text-muted)]">
        Protection
      </Label>
      <span className="font-mono text-sm text-[hsl(var(--accent))]">{protectionPct}%</span>
    </div>
    <Slider
      value={[protectionPct]}
      onValueChange={([value]) => onChange(value)}
      min={0}
      max={100}
      step={1}
      className="[&_[role=slider]]:border-[hsl(var(--primary))] [&_[role=slider]]:bg-[#0a0a0f] [&_.bg-primary]:bg-[hsl(var(--primary))]"
    />
    <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--landing-text-muted)]">
      <span>0% — full upside</span>
      <span>100% — full protection</span>
    </div>
  </div>
);

const OutcomeBlock = ({
  title,
  variant,
  rows,
}: {
  title: string;
  variant: "success" | "failure";
  rows: Array<{ label: string; value: string; negative?: boolean }>;
}) => (
  <div
    className={`landing-note-panel p-6 sm:p-8 ${
      variant === "success" ? "landing-note-panel--success" : "landing-note-panel--failure"
    }`}
  >
    <h3 className="font-display text-xl text-[var(--landing-text)]">{title}</h3>
    <dl className="mt-5 space-y-3">
      {rows.map((row) => (
        <div key={row.label} className="flex items-baseline justify-between gap-4">
          <dt className="text-sm text-[var(--landing-text-muted)]">{row.label}</dt>
          <dd
            className={`font-mono text-sm ${
              row.negative ? "text-red-400" : "text-[var(--landing-text)]"
            }`}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);
