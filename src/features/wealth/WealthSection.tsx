import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

import { GlassCard, useGlassCardPalette } from "@/components/GlassCard";
import { PremiumButton } from "@/components/PremiumButton";
import { Section } from "@/components/Section";
import { radii, spacing, typography } from "@/constants/theme";
import {
  calculateWealthMetrics,
  createWealthItemId,
  emptyCashAccount,
  emptyCryptoAsset,
  emptyMarketInvestment,
  emptyOtherAsset,
  emptyRealEstateAsset,
  emptyWealthPersonalSituation,
  emptyWealthState,
  saveWealthSnapshot,
  wealthCashLabels,
  wealthConnectionLabels,
  wealthMarketTypeLabels
} from "@/features/wealth/calculations";
import { loadWealthState, saveWealthState } from "@/features/wealth/storage";
import {
  WealthBusinessExtras,
  WealthCashAccount,
  WealthCryptoAsset,
  WealthMarketInvestment,
  WealthOtherAsset,
  WealthPersonalSituation,
  WealthRealEstateAsset,
  WealthState
} from "@/features/wealth/types";
import { useAscensionTheme } from "@/features/theme/ascensionTheme";
import { formatCurrency } from "@/utils/format";

const personalFields: Array<{ key: keyof WealthPersonalSituation; label: string }> = [
  { key: "monthlyNetSalary", label: "Salaire mensuel net" },
  { key: "additionalIncome", label: "Revenus complémentaires" },
  { key: "fixedMonthlyExpenses", label: "Dépenses fixes mensuelles" },
  { key: "variableMonthlyExpenses", label: "Dépenses variables mensuelles" },
  { key: "monthlySavings", label: "Épargne mensuelle" },
  { key: "monthlyInvestmentCapacity", label: "Capacité d'investissement mensuelle" }
];

const marketFields: Array<{ key: keyof Omit<WealthMarketInvestment, "id" | "name" | "type" | "purchaseDate">; label: string }> = [
  { key: "quantity", label: "Quantité" },
  { key: "purchasePrice", label: "Prix d'achat" },
  { key: "currentValue", label: "Valeur actuelle" },
  { key: "dividendsReceived", label: "Dividendes perçus" }
];

const cryptoFields: Array<{ key: keyof Omit<WealthCryptoAsset, "id" | "name">; label: string }> = [
  { key: "quantity", label: "Quantité" },
  { key: "averagePurchasePrice", label: "Prix moyen d'achat" },
  { key: "currentValue", label: "Valeur actuelle" },
  { key: "annualStaking", label: "Staking annuel (%)" },
  { key: "rewardsReceived", label: "Récompenses perçues" }
];

type RealEstateEditableNumberField = "currentValue" | "remainingDebt" | "monthlyRent" | "charges" | "monthlyCredit" | "netIncome";

const realEstateFields: Array<{ key: RealEstateEditableNumberField; label: string }> = [
  { key: "currentValue", label: "Valeur actuelle" },
  { key: "remainingDebt", label: "Capital restant dû" },
  { key: "monthlyRent", label: "Loyer mensuel" },
  { key: "charges", label: "Charges" },
  { key: "monthlyCredit", label: "Crédit mensuel" },
  { key: "netIncome", label: "Revenus nets" }
];

export function WealthSection() {
  const { theme } = useAscensionTheme();
  const palette = useGlassCardPalette();
  const [wealthState, setWealthState] = useState<WealthState>(emptyWealthState);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [cashDraft, setCashDraft] = useState<WealthCashAccount>({ ...emptyCashAccount, id: createWealthItemId("cash") });
  const [marketDraft, setMarketDraft] = useState<WealthMarketInvestment>({ ...emptyMarketInvestment, id: createWealthItemId("market") });
  const [cryptoDraft, setCryptoDraft] = useState<WealthCryptoAsset>({ ...emptyCryptoAsset, id: createWealthItemId("crypto") });
  const [realEstateDraft, setRealEstateDraft] = useState<WealthRealEstateAsset>({ ...emptyRealEstateAsset, id: createWealthItemId("real-estate") });
  const [otherDraft, setOtherDraft] = useState<WealthOtherAsset>({ ...emptyOtherAsset, id: createWealthItemId("other") });

  useFocusEffect(
    useCallback(() => {
      loadWealthState().then(setWealthState);
    }, [])
  );

  const metrics = useMemo(() => calculateWealthMetrics(wealthState), [wealthState]);
  const personalRealEstateAssets = useMemo(
    () => wealthState.realEstateAssets.filter((item) => item.owner !== "eurl"),
    [wealthState.realEstateAssets]
  );
  const businessRealEstateAssets = useMemo(
    () => wealthState.realEstateAssets.filter((item) => item.owner === "eurl"),
    [wealthState.realEstateAssets]
  );
  const personalOtherAssets = useMemo(
    () => wealthState.otherAssets.filter((item) => item.type !== "professionalAsset"),
    [wealthState.otherAssets]
  );
  const businessOtherAssets = useMemo(
    () => wealthState.otherAssets.filter((item) => item.type === "professionalAsset"),
    [wealthState.otherAssets]
  );
  const compactAllocation = useMemo(() => {
    const getValue = (category: string) => metrics.global.allocation.find((item) => item.category === category)?.value ?? 0;
    const rows = [
      ["Liquidités", getValue("cash")],
      ["Bourse / ETF / Actions", getValue("market")],
      ["Crypto", getValue("crypto")],
      ["Immobilier", getValue("realEstate")],
      ["Entreprise", getValue("business")],
      ["Métaux précieux", getValue("commodities")],
      ["Autres", getValue("privateEquity") + getValue("other")]
    ] as Array<[string, number]>;
    const total = rows.reduce((sum, [, value]) => sum + value, 0);

    return rows.map(([label, value]) => ({
      label,
      value,
      percent: total > 0 ? (value / total) * 100 : 0
    }));
  }, [metrics.global.allocation]);
  const platformSummaries = useMemo(() => {
    const cashByName = (keyword: string) => wealthState.cash
      .filter((item) => `${item.id} ${item.name ?? ""}`.toLowerCase().includes(keyword))
      .reduce((sum, item) => sum + item.amount, 0);
    const marketByName = (keyword: string) => wealthState.marketInvestments
      .filter((item) => item.name.toLowerCase().includes(keyword))
      .reduce((sum, item) => sum + item.currentValue, 0);
    const cryptoByName = (keyword: string) => wealthState.cryptoAssets
      .filter((item) => item.name.toLowerCase().includes(keyword))
      .reduce((sum, item) => sum + item.currentValue, 0);
    const otherByName = (keyword: string) => wealthState.otherAssets
      .filter((item) => item.name.toLowerCase().includes(keyword))
      .reduce((sum, item) => sum + item.value, 0);
    const realEstateByName = (keyword: string) => wealthState.realEstateAssets
      .filter((item) => item.name.toLowerCase().includes(keyword))
      .reduce((sum, item) => sum + item.currentValue, 0);
    const businessGross = metrics.business.grossWealth;

    return [
      { id: "platform-bnp", icon: "business-outline" as const, label: "BNP", value: cashByName("bnp"), detail: "Compte bancaire" },
      { id: "platform-revolut", icon: "card-outline" as const, label: "Revolut", value: cashByName("revolut") + marketByName("revolut") + cryptoByName("revolut"), detail: "Investir, crypto, épargne, espèces" },
      { id: "platform-trade-republic", icon: "trending-up-outline" as const, label: "Trade Republic", value: marketByName("trade republic") + cryptoByName("trade republic") + otherByName("trade republic"), detail: "Compte-titres, crypto, non coté, PEA" },
      { id: "platform-bricks", icon: "home-outline" as const, label: "Bricks", value: cashByName("bricks") + realEstateByName("bricks"), detail: "Immobilier fractionné + solde disponible" },
      { id: "platform-business", icon: "storefront-outline" as const, label: "Entreprise", value: businessGross, detail: "Fonds de commerce et actifs EURL" }
    ];
  }, [metrics.business.grossWealth, wealthState.cash, wealthState.cryptoAssets, wealthState.marketInvestments, wealthState.otherAssets, wealthState.realEstateAssets]);
  const variationLabel = useMemo(() => {
    const history = metrics.history;

    if (history.length < 2) {
      return "Non renseignée";
    }

    const previousSnapshot = history[history.length - 2];
    const lastSnapshot = history[history.length - 1];
    const variation = lastSnapshot.netWealth - previousSnapshot.netWealth;

    return formatSignedCurrency(variation);
  }, [metrics.history]);

  function toggleSection(sectionId: string) {
    setExpandedSections((currentSections) => ({
      ...currentSections,
      [sectionId]: !currentSections[sectionId]
    }));
  }

  async function persist(nextState: WealthState, message = "Mon Patrimoine a été sauvegardé localement.") {
    const snapshottedState = saveWealthSnapshot(nextState);
    await saveWealthState(snapshottedState);
    setWealthState(snapshottedState);
    Alert.alert("Patrimoine enregistré", message);
  }

  function updatePersonalField(field: keyof WealthPersonalSituation, value: string) {
    const amount = parseAmount(value);
    setWealthState((currentState) => ({
      ...currentState,
      personalSituation: {
        ...currentState.personalSituation,
        [field]: amount
      }
    }));
  }

  async function savePersonalSituation() {
    await persist(wealthState, "Ta situation personnelle est à jour.");
  }

  async function addCashAccount() {
    await persist({
      ...wealthState,
      cash: upsertById(wealthState.cash, cashDraft)
    });
    setCashDraft({ ...emptyCashAccount, id: createWealthItemId("cash") });
  }

  async function addMarketInvestment() {
    await persist({
      ...wealthState,
      marketInvestments: upsertById(wealthState.marketInvestments, marketDraft)
    });
    setMarketDraft({ ...emptyMarketInvestment, id: createWealthItemId("market") });
  }

  async function addCryptoAsset() {
    await persist({
      ...wealthState,
      cryptoAssets: upsertById(wealthState.cryptoAssets, cryptoDraft)
    });
    setCryptoDraft({ ...emptyCryptoAsset, id: createWealthItemId("crypto") });
  }

  async function addRealEstateAsset() {
    await persist({
      ...wealthState,
      realEstateAssets: upsertById(wealthState.realEstateAssets, realEstateDraft)
    });
    setRealEstateDraft({ ...emptyRealEstateAsset, id: createWealthItemId("real-estate") });
  }

  async function addOtherAsset() {
    await persist({
      ...wealthState,
      otherAssets: upsertById(wealthState.otherAssets, otherDraft)
    });
    setOtherDraft({ ...emptyOtherAsset, id: createWealthItemId("other") });
  }

  async function removeItem(collection: keyof Pick<WealthState, "cash" | "marketInvestments" | "cryptoAssets" | "realEstateAssets" | "otherAssets">, id: string) {
    await persist({
      ...wealthState,
      [collection]: wealthState[collection].filter((item) => item.id !== id)
    });
  }

  return (
    <Section title="Mon Patrimoine">
      <GlassCard style={styles.heroCard}>
        <Text style={[styles.kicker, { color: theme.accentSoft }]}>SYNTHÈSE PATRIMOINE</Text>
        <Text style={[styles.heroTitle, { color: theme.text }]}>Vue globale</Text>
        <Text style={[styles.heroText, { color: theme.textMuted }]}>
          Données réelles locales. Le détail reste accessible uniquement au clic.
        </Text>

        <View style={styles.metricsGrid}>
          <Metric label="Patrimoine brut" value={formatCurrency(metrics.grossWealth)} />
          <Metric label="Total des dettes" value={formatCurrency(metrics.debt)} />
          <Metric label="Patrimoine net" value={formatCurrency(metrics.netWealth)} />
          <Metric label="Variation" value={variationLabel} />
        </View>
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={[styles.cardTitle, { color: theme.accentSoft }]}>RÉPARTITION</Text>
        <CompactAllocationRows rows={compactAllocation} />
      </GlassCard>

      <GlassCard style={styles.card}>
        <Text style={[styles.cardTitle, { color: theme.accentSoft }]}>PLATEFORMES</Text>
        <View style={styles.platformGrid}>
          {platformSummaries.map((platform) => (
            <PlatformCard
              key={platform.id}
              icon={platform.icon}
              label={platform.label}
              value={formatCurrency(platform.value)}
              detail={platform.detail}
              expanded={!!expandedSections[platform.id]}
              onPress={() => toggleSection(platform.id)}
            />
          ))}
        </View>
        {expandedSections["platform-bnp"] ? (
          <PlatformDetail title="BNP">
            <AssetList
              items={wealthState.cash.filter((item) => `${item.id} ${item.name ?? ""}`.toLowerCase().includes("bnp"))}
              emptyLabel="Aucune donnée BNP renseignée."
              getTitle={(item) => item.name || wealthCashLabels[item.label]}
              getMeta={(item) => `${wealthCashLabels[item.label]} · ${formatCurrency(item.amount)}`}
              onRemove={(id) => removeItem("cash", id)}
            />
          </PlatformDetail>
        ) : null}
        {expandedSections["platform-revolut"] ? (
          <PlatformDetail title="Revolut">
            <AssetList items={wealthState.cash.filter((item) => `${item.id} ${item.name ?? ""}`.toLowerCase().includes("revolut"))} emptyLabel="Aucune liquidité Revolut." getTitle={(item) => item.name || wealthCashLabels[item.label]} getMeta={(item) => `${wealthCashLabels[item.label]} · ${formatCurrency(item.amount)}`} onRemove={(id) => removeItem("cash", id)} />
            <AssetList items={wealthState.marketInvestments.filter((item) => item.name.toLowerCase().includes("revolut"))} emptyLabel="Aucun investissement Revolut." getTitle={(item) => item.name} getMeta={(item) => `${wealthMarketTypeLabels[item.type]} · ${formatCurrency(item.currentValue)}`} onRemove={(id) => removeItem("marketInvestments", id)} />
            <AssetList items={wealthState.cryptoAssets.filter((item) => item.name.toLowerCase().includes("revolut"))} emptyLabel="Aucune crypto Revolut." getTitle={(item) => item.name} getMeta={(item) => formatCurrency(item.currentValue)} onRemove={(id) => removeItem("cryptoAssets", id)} />
          </PlatformDetail>
        ) : null}
        {expandedSections["platform-trade-republic"] ? (
          <PlatformDetail title="Trade Republic">
            <AssetList items={wealthState.marketInvestments.filter((item) => item.name.toLowerCase().includes("trade republic"))} emptyLabel="Aucun titre Trade Republic." getTitle={(item) => item.name} getMeta={(item) => `${wealthMarketTypeLabels[item.type]} · ${formatCurrency(item.currentValue)}`} onRemove={(id) => removeItem("marketInvestments", id)} />
            <AssetList items={wealthState.cryptoAssets.filter((item) => item.name.toLowerCase().includes("trade republic"))} emptyLabel="Aucune crypto Trade Republic." getTitle={(item) => item.name} getMeta={(item) => formatCurrency(item.currentValue)} onRemove={(id) => removeItem("cryptoAssets", id)} />
            <AssetList items={wealthState.otherAssets.filter((item) => item.name.toLowerCase().includes("trade republic"))} emptyLabel="Aucun actif Trade Republic." getTitle={(item) => item.name} getMeta={getOtherAssetMeta} onRemove={(id) => removeItem("otherAssets", id)} />
          </PlatformDetail>
        ) : null}
        {expandedSections["platform-bricks"] ? (
          <PlatformDetail title="Bricks">
            <AssetList items={wealthState.cash.filter((item) => `${item.id} ${item.name ?? ""}`.toLowerCase().includes("bricks"))} emptyLabel="Aucun solde Bricks." getTitle={(item) => item.name || wealthCashLabels[item.label]} getMeta={(item) => `${wealthCashLabels[item.label]} · ${formatCurrency(item.amount)}`} onRemove={(id) => removeItem("cash", id)} />
            <RealEstateAssetList items={wealthState.realEstateAssets.filter((item) => item.name.toLowerCase().includes("bricks"))} emptyLabel="Aucun actif Bricks." onRemove={(id) => removeItem("realEstateAssets", id)} />
          </PlatformDetail>
        ) : null}
        {expandedSections["platform-business"] ? (
          <PlatformDetail title="Entreprise">
            <AssetList items={businessOtherAssets} emptyLabel="Aucun actif professionnel renseigné." getTitle={(item) => item.name} getMeta={getOtherAssetMeta} onRemove={(id) => removeItem("otherAssets", id)} />
            <RealEstateAssetList items={businessRealEstateAssets} emptyLabel="Aucun mur commercial renseigné." onRemove={(id) => removeItem("realEstateAssets", id)} />
          </PlatformDetail>
        ) : null}
      </GlassCard>

      <AccordionCard
        icon="person-circle-outline"
        title="Patrimoine personnel"
        subtitle="Liquidités, bourse, crypto, métaux précieux, Bricks et non coté."
        expanded={!!expandedSections.personal}
        onPress={() => toggleSection("personal")}
      >
        <AssetList
          items={wealthState.cash}
          emptyLabel="Aucune liquidité renseignée."
          getTitle={(item) => item.name || wealthCashLabels[item.label]}
          getMeta={(item) => `${wealthCashLabels[item.label]} · ${formatCurrency(item.amount)}`}
          onRemove={(id) => removeItem("cash", id)}
        />
        <AssetList
          items={wealthState.marketInvestments}
          emptyLabel="Aucun investissement boursier renseigné."
          getTitle={(item) => item.name}
          getMeta={(item) => `${wealthMarketTypeLabels[item.type]} · ${formatCurrency(item.currentValue)}`}
          onRemove={(id) => removeItem("marketInvestments", id)}
        />
        <AssetList
          items={wealthState.cryptoAssets}
          emptyLabel="Aucune crypto renseignée."
          getTitle={(item) => item.name}
          getMeta={(item) => `${item.quantity} · ${formatCurrency(item.currentValue)}`}
          onRemove={(id) => removeItem("cryptoAssets", id)}
        />
        <RealEstateAssetList items={personalRealEstateAssets} emptyLabel="Aucun bien immobilier personnel renseigné." onRemove={(id) => removeItem("realEstateAssets", id)} />
        <AssetList items={personalOtherAssets} emptyLabel="Aucun autre actif renseigné." getTitle={(item) => item.name} getMeta={getOtherAssetMeta} onRemove={(id) => removeItem("otherAssets", id)} />
      </AccordionCard>

      <AccordionCard
        icon="storefront-outline"
        title="Entreprise"
        subtitle="Fonds de commerce et champs professionnels EURL. Les murs restent personnels."
        expanded={!!expandedSections.business}
        onPress={() => toggleSection("business")}
      >
        <AssetList items={businessOtherAssets} emptyLabel="Aucun actif professionnel renseigné." getTitle={(item) => item.name} getMeta={getOtherAssetMeta} onRemove={(id) => removeItem("otherAssets", id)} />
        <RealEstateAssetList items={businessRealEstateAssets} emptyLabel="Aucun bien immobilier détenu par l'EURL." onRemove={(id) => removeItem("realEstateAssets", id)} />
        <BusinessPreparedFields extras={wealthState.businessExtras} />
      </AccordionCard>

      <AccordionCard
        icon="add-circle-outline"
        title="Ajouter ou modifier"
        subtitle="Formulaires manuels repliés pour garder la page courte."
        expanded={!!expandedSections.forms}
        onPress={() => toggleSection("forms")}
      >
        <Text style={[styles.cardTitle, { color: theme.accentSoft }]}>SITUATION PERSONNELLE</Text>
        <View style={styles.formGrid}>
          {personalFields.map((field) => (
            <NumberField key={field.key} label={field.label} value={wealthState.personalSituation[field.key]} onChange={(value) => updatePersonalField(field.key, value)} />
          ))}
        </View>
        <PremiumButton label="Enregistrer ma situation" icon="save-outline" onPress={savePersonalSituation} />

        <Text style={[styles.cardTitle, { color: theme.accentSoft }]}>AJOUTS MANUELS</Text>
        <View style={styles.formGrid}>
          <SelectField label="Liquidité" value={wealthCashLabels[cashDraft.label]} options={Object.entries(wealthCashLabels).map(([key, label]) => ({ key, label }))} onSelect={(label) => setCashDraft((draft) => ({ ...draft, label: label as WealthCashAccount["label"] }))} />
          <NumberField label="Montant" value={cashDraft.amount} onChange={(value) => setCashDraft((draft) => ({ ...draft, amount: parseAmount(value) }))} />
        </View>
        <PremiumButton label="Ajouter liquidités" icon="add-circle-outline" onPress={addCashAccount} />

        <TextField label="Nom bourse" value={marketDraft.name} onChange={(name) => setMarketDraft((draft) => ({ ...draft, name }))} placeholder="ETF, action, métal..." />
        <SelectField label="Type" value={wealthMarketTypeLabels[marketDraft.type]} options={Object.entries(wealthMarketTypeLabels).map(([key, label]) => ({ key, label }))} onSelect={(type) => setMarketDraft((draft) => ({ ...draft, type: type as WealthMarketInvestment["type"] }))} />
        <View style={styles.formGrid}>
          {marketFields.map((field) => (
            <NumberField key={field.key} label={field.label} value={marketDraft[field.key]} onChange={(value) => setMarketDraft((draft) => ({ ...draft, [field.key]: parseAmount(value) }))} />
          ))}
        </View>
        <PremiumButton label="Ajouter bourse" icon="add-circle-outline" onPress={addMarketInvestment} />

        <TextField label="Nom crypto" value={cryptoDraft.name} onChange={(name) => setCryptoDraft((draft) => ({ ...draft, name }))} placeholder="Bitcoin, Ethereum..." />
        <View style={styles.formGrid}>
          {cryptoFields.map((field) => (
            <NumberField key={field.key} label={field.label} value={cryptoDraft[field.key]} onChange={(value) => setCryptoDraft((draft) => ({ ...draft, [field.key]: parseAmount(value) }))} />
          ))}
        </View>
        <PremiumButton label="Ajouter crypto" icon="add-circle-outline" onPress={addCryptoAsset} />

        <TextField label="Nom immobilier" value={realEstateDraft.name} onChange={(name) => setRealEstateDraft((draft) => ({ ...draft, name }))} placeholder="Appartement, maison..." />
        <View style={styles.formGrid}>
          {realEstateFields.map((field) => (
            <NumberField key={field.key} label={field.label} value={realEstateDraft[field.key]} onChange={(value) => setRealEstateDraft((draft) => ({ ...draft, [field.key]: parseAmount(value) }))} />
          ))}
        </View>
        <PremiumButton label="Ajouter immobilier" icon="add-circle-outline" onPress={addRealEstateAsset} />

        <TextField label="Nom autre actif" value={otherDraft.name} onChange={(name) => setOtherDraft((draft) => ({ ...draft, name }))} placeholder="Projet, objet, activité..." />
        <View style={styles.formGrid}>
          <NumberField label="Valeur actuelle" value={otherDraft.value} onChange={(value) => setOtherDraft((draft) => ({ ...draft, value: parseAmount(value) }))} />
          <NumberField label="Revenu mensuel" value={otherDraft.monthlyIncome} onChange={(value) => setOtherDraft((draft) => ({ ...draft, monthlyIncome: parseAmount(value) }))} />
        </View>
        <TextField label="Commentaire" value={otherDraft.comment} onChange={(comment) => setOtherDraft((draft) => ({ ...draft, comment }))} placeholder="Note libre" />
        <PremiumButton label="Ajouter actif" icon="add-circle-outline" onPress={addOtherAsset} />
      </AccordionCard>

      <AccordionCard
        icon="link-outline"
        title="Données connectées plus tard"
        subtitle="Mode manuel actif. Connexions futures prêtes."
        expanded={!!expandedSections.connections}
        onPress={() => toggleSection("connections")}
      >
        <Text style={[styles.helperText, { color: theme.textMuted }]}>
          Source actuelle : saisie manuelle locale. Dernière mise à jour : {wealthState.updatedAt ? new Date(wealthState.updatedAt).toLocaleDateString("fr-FR") : "Non renseignée"}.
        </Text>
        <View style={styles.connectionGrid}>
          {wealthState.connections.map((connection) => (
            <View key={connection.provider} style={[styles.connectionPill, { borderColor: palette.line, backgroundColor: palette.overlay }]}>
              <Ionicons name="link-outline" size={14} color={palette.accentSoft} />
              <Text style={[styles.connectionText, { color: palette.title }]}>{wealthConnectionLabels[connection.provider]}</Text>
              <Text style={[styles.connectionStatus, { color: palette.secondary }]}>prévu</Text>
            </View>
          ))}
        </View>
      </AccordionCard>
    </Section>
  );
}

function UniverseSummary({
  title,
  subtitle,
  icon,
  metrics,
  allocation,
  debtAllocation
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  metrics: Array<[string, string]>;
  allocation: ReturnType<typeof calculateWealthMetrics>["allocation"];
  debtAllocation?: ReturnType<typeof calculateWealthMetrics>["debtAllocation"];
}) {
  const { theme } = useAscensionTheme();

  return (
    <GlassCard style={styles.card}>
      <View style={styles.assetHeader}>
        <View style={[styles.iconBox, { borderColor: theme.accentBorder, backgroundColor: theme.glowSoft }]}>
          <Ionicons name={icon} size={18} color={theme.accentSoft} />
        </View>
        <View style={styles.assetCopy}>
          <Text style={[styles.cardTitle, { color: theme.accentSoft }]}>{title}</Text>
          <Text style={[styles.helperText, { color: theme.textMuted }]}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.metricsGrid}>
        {metrics.map(([label, value]) => <Metric key={label} label={label} value={value} />)}
      </View>
      <Text style={[styles.helperText, { color: theme.textMuted }]}>Répartition des actifs</Text>
      <AllocationBars allocation={allocation} />
      {debtAllocation ? (
        <>
          <Text style={[styles.helperText, { color: theme.textMuted }]}>Répartition des dettes</Text>
          <AllocationBars allocation={debtAllocation} />
        </>
      ) : null}
    </GlassCard>
  );
}

function CompactAllocationRows({ rows }: { rows: Array<{ label: string; value: number; percent: number }> }) {
  const { theme } = useAscensionTheme();

  return (
    <View style={styles.allocationList}>
      {rows.map((row) => (
        <View key={row.label} style={styles.allocationRow}>
          <View style={styles.allocationTop}>
            <Text style={[styles.allocationLabel, { color: theme.text }]}>{row.label}</Text>
            <Text style={[styles.allocationValue, { color: theme.textMuted }]}>{formatCurrency(row.value)} · {row.percent.toFixed(1)}%</Text>
          </View>
          <View style={[styles.allocationTrack, { backgroundColor: theme.overlay }]}>
            <View style={[styles.allocationFill, { width: `${Math.min(100, row.percent)}%`, backgroundColor: theme.accentSoft }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

function PlatformCard({
  icon,
  label,
  value,
  detail,
  expanded,
  onPress
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  detail: string;
  expanded: boolean;
  onPress: () => void;
}) {
  const palette = useGlassCardPalette();

  return (
    <Pressable onPress={onPress} style={[styles.platformCard, { borderColor: palette.line, backgroundColor: palette.overlay }]}>
      <View style={styles.platformTop}>
        <Ionicons name={icon} size={18} color={palette.accentSoft} />
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={16} color={palette.secondary} />
      </View>
      <Text style={[styles.platformLabel, { color: palette.title }]}>{label}</Text>
      <Text style={[styles.platformValue, { color: palette.accentSoft }]}>{value}</Text>
      <Text style={[styles.platformDetail, { color: palette.secondary }]}>{detail}</Text>
    </Pressable>
  );
}

function PlatformDetail({ title, children }: { title: string; children: React.ReactNode }) {
  const palette = useGlassCardPalette();

  return (
    <View style={[styles.platformDetailBox, { borderColor: palette.line, backgroundColor: palette.overlay }]}>
      <Text style={[styles.platformDetailTitle, { color: palette.title }]}>{title}</Text>
      {children}
    </View>
  );
}

function AccordionCard({
  icon,
  title,
  subtitle,
  expanded,
  onPress,
  children
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  expanded: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) {
  const { theme } = useAscensionTheme();

  return (
    <GlassCard style={styles.card}>
      <Pressable onPress={onPress} style={styles.accordionHeader}>
        <View style={[styles.iconBox, { borderColor: theme.accentBorder, backgroundColor: theme.glowSoft }]}>
          <Ionicons name={icon} size={18} color={theme.accentSoft} />
        </View>
        <View style={styles.assetCopy}>
          <Text style={[styles.cardTitle, { color: theme.accentSoft }]}>{title}</Text>
          <Text style={[styles.helperText, { color: theme.textMuted }]}>{subtitle}</Text>
        </View>
        <View style={[styles.accordionPill, { borderColor: theme.line, backgroundColor: theme.overlay }]}>
          <Text style={[styles.accordionPillText, { color: theme.textMuted }]}>{expanded ? "Afficher moins" : "Voir le détail"}</Text>
          <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={14} color={theme.textMuted} />
        </View>
      </Pressable>
      {expanded ? <View style={styles.accordionBody}>{children}</View> : null}
    </GlassCard>
  );
}

function WealthAssetCard({ title, icon, children }: { title: string; icon: keyof typeof Ionicons.glyphMap; children: React.ReactNode }) {
  const { theme } = useAscensionTheme();

  return (
    <GlassCard style={styles.card}>
      <View style={styles.assetHeader}>
        <View style={[styles.iconBox, { borderColor: theme.accentBorder, backgroundColor: theme.glowSoft }]}>
          <Ionicons name={icon} size={18} color={theme.accentSoft} />
        </View>
        <Text style={[styles.cardTitle, { color: theme.accentSoft }]}>{title}</Text>
      </View>
      {children}
    </GlassCard>
  );
}

function BusinessPreparedFields({ extras }: { extras: WealthBusinessExtras }) {
  const palette = useGlassCardPalette();

  return (
    <View style={[styles.preparedBox, { borderColor: palette.line, backgroundColor: palette.overlay }]}>
      <Text style={[styles.assetTitle, { color: palette.title }]}>Champs entreprise prévus</Text>
      <Text style={[styles.assetMeta, { color: palette.secondary }]}>
        Aucune donnée inventée : les champs absents restent à 0 jusqu'à saisie réelle.
      </Text>
      <View style={styles.detailGrid}>
        <DetailMetric label="Trésorerie" value={formatCurrency(extras.treasury)} />
        <DetailMetric label="Matériel" value={formatCurrency(extras.equipment)} />
        <DetailMetric label="Véhicules pro" value={formatCurrency(extras.professionalVehicles)} />
        <DetailMetric label="Dettes pro" value={formatCurrency(extras.professionalDebts)} />
        <DetailMetric label="Taux crédit pro" value={`${(extras.professionalDebtRate ?? 0).toFixed(2)}%`} />
        <DetailMetric label="Mensualité pro" value={`${formatCurrency(extras.professionalDebtMonthlyPayment ?? 0)}/mois`} />
        <DetailMetric label="Comptes associés" value={formatCurrency(extras.shareholderCurrentAccounts)} />
      </View>
      <Text style={[styles.assetMeta, { color: palette.secondary }]}>
        Fin crédit professionnel : {extras.professionalDebtEndDate || "Non renseigné"}.
      </Text>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  const palette = useGlassCardPalette();

  return (
    <View style={[styles.metricBox, { borderColor: palette.line, backgroundColor: palette.overlay }]}>
      <Text style={[styles.metricLabel, { color: palette.secondary }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: palette.title }]}>{value}</Text>
    </View>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: string) => void }) {
  return <TextField label={label} value={String(value || 0)} onChange={onChange} keyboardType="numeric" placeholder="0" />;
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  keyboardType
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  keyboardType?: "numeric";
}) {
  const { theme } = useAscensionTheme();

  return (
    <View style={[styles.inputBox, { borderColor: theme.line, backgroundColor: theme.overlay }]}>
      <Text style={[styles.inputLabel, { color: theme.textMuted }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        style={[styles.input, { color: theme.text }]}
      />
    </View>
  );
}

function SelectField({
  label,
  value,
  options,
  onSelect
}: {
  label: string;
  value: string;
  options: Array<{ key: string; label: string }>;
  onSelect: (key: string) => void;
}) {
  const { theme } = useAscensionTheme();

  return (
    <View style={styles.selectBlock}>
      <Text style={[styles.inputLabel, { color: theme.textMuted }]}>{label} : {value}</Text>
      <View style={styles.chipGrid}>
        {options.map((option) => {
          const selected = option.label === value;

          return (
            <Pressable
              key={option.key}
              onPress={() => onSelect(option.key)}
              style={[
                styles.chip,
                { borderColor: selected ? theme.accentBorder : theme.line, backgroundColor: selected ? theme.glowSoft : theme.overlay }
              ]}
            >
              <Text style={[styles.chipText, { color: selected ? theme.accentSoft : theme.textMuted }]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function AssetList<T extends { id: string }>({
  items,
  emptyLabel,
  getTitle,
  getMeta,
  onRemove
}: {
  items: T[];
  emptyLabel: string;
  getTitle: (item: T) => string;
  getMeta: (item: T) => string;
  onRemove: (id: string) => void;
}) {
  const palette = useGlassCardPalette();

  return (
    <View style={styles.assetList}>
      {items.length === 0 ? <Text style={[styles.emptyText, { color: palette.secondary }]}>{emptyLabel}</Text> : null}
      {items.map((item) => (
        <View key={item.id} style={[styles.assetRow, { borderColor: palette.line, backgroundColor: palette.overlay }]}>
          <View style={styles.assetCopy}>
            <Text style={[styles.assetTitle, { color: palette.title }]}>{getTitle(item)}</Text>
            <Text style={[styles.assetMeta, { color: palette.secondary }]}>{getMeta(item)}</Text>
          </View>
          <Pressable onPress={() => onRemove(item.id)} style={[styles.removeButton, { borderColor: palette.danger }]}>
            <Ionicons name="trash-outline" size={15} color={palette.danger} />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

function RealEstateAssetList({
  items,
  emptyLabel,
  onRemove
}: {
  items: WealthRealEstateAsset[];
  emptyLabel: string;
  onRemove: (id: string) => void;
}) {
  const palette = useGlassCardPalette();

  return (
    <View style={styles.assetList}>
      {items.length === 0 ? <Text style={[styles.emptyText, { color: palette.secondary }]}>{emptyLabel}</Text> : null}
      {items.map((item) => {
        const totalCost = item.totalAcquisitionCost ?? 0;
        const latentGain = totalCost > 0 ? item.currentValue - totalCost : 0;
        const netValue = item.currentValue - item.remainingDebt;
        const cashFlow = item.monthlyRent - item.charges - item.monthlyCredit;
        const grossYield = totalCost > 0 ? (item.monthlyRent * 12 / totalCost) * 100 : 0;

        return (
          <View key={item.id} style={[styles.assetRow, styles.assetRowDetailed, { borderColor: palette.line, backgroundColor: palette.overlay }]}>
            <View style={styles.assetCopy}>
              <View style={styles.assetTitleRow}>
                <View style={styles.assetCopy}>
                  <Text style={[styles.assetTitle, { color: palette.title }]}>{item.name}</Text>
                  <Text style={[styles.assetMeta, { color: palette.secondary }]}>
                    {getRealEstateCategoryLabel(item.category)} · Valeur : {formatCurrency(item.currentValue)}
                  </Text>
                </View>
                <Pressable onPress={() => onRemove(item.id)} style={[styles.removeButton, { borderColor: palette.danger }]}>
                  <Ionicons name="trash-outline" size={15} color={palette.danger} />
                </Pressable>
              </View>

              <View style={styles.detailGrid}>
                <DetailMetric label="Plus-value latente" value={formatSignedCurrency(latentGain)} />
                <DetailMetric label="Capital restant dû" value={formatCurrency(item.remainingDebt)} />
                <DetailMetric label="Valeur nette" value={formatCurrency(netValue)} />
                <DetailMetric label="Cash-flow" value={`${formatSignedCurrency(cashFlow)}/mois`} />
                <DetailMetric label="Rendement brut" value={`${grossYield.toFixed(1)}%`} />
                <DetailMetric label="Mensualité" value={`${formatCurrency(item.monthlyCredit)}/mois`} />
              </View>

              {item.purchasePrice || item.acquisitionFees || item.totalAcquisitionCost ? (
                <Text style={[styles.assetMeta, { color: palette.secondary }]}>
                  Prix d'achat : {formatCurrency(item.purchasePrice ?? 0)} · Frais : {formatCurrency(item.acquisitionFees ?? 0)} · Coût total : {formatCurrency(item.totalAcquisitionCost ?? 0)}
                </Text>
              ) : null}

              {item.loanType ? (
                <Text style={[styles.assetMeta, { color: palette.secondary }]}>
                  Crédit : {item.loanType} · Début : {item.loanStartDate || "non renseigné"} · Fin estimée : {item.loanEndDate || "non renseignée"}
                </Text>
              ) : null}

              {item.propertyTaxNote ? <Text style={[styles.assetMeta, { color: palette.secondary }]}>{item.propertyTaxNote}</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  const palette = useGlassCardPalette();

  return (
    <View style={[styles.detailMetric, { borderColor: palette.line, backgroundColor: palette.overlay }]}>
      <Text style={[styles.detailMetricLabel, { color: palette.secondary }]}>{label}</Text>
      <Text style={[styles.detailMetricValue, { color: palette.title }]}>{value}</Text>
    </View>
  );
}

function AllocationBars({ allocation }: { allocation: ReturnType<typeof calculateWealthMetrics>["allocation"] }) {
  const { theme } = useAscensionTheme();

  return (
    <View style={styles.allocationList}>
      {allocation.map((item) => (
        <View key={item.category} style={styles.allocationRow}>
          <View style={styles.allocationTop}>
            <Text style={[styles.allocationLabel, { color: theme.text }]}>{item.label}</Text>
            <Text style={[styles.allocationValue, { color: theme.textMuted }]}>{formatCurrency(item.value)} · {item.percent.toFixed(1)}%</Text>
          </View>
          <View style={[styles.allocationTrack, { backgroundColor: theme.overlay }]}>
            <View style={[styles.allocationFill, { width: `${Math.min(100, item.percent)}%`, backgroundColor: theme.accentSoft }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

function upsertById<T extends { id: string }>(items: T[], item: T) {
  return items.some((currentItem) => currentItem.id === item.id)
    ? items.map((currentItem) => (currentItem.id === item.id ? item : currentItem))
    : [item, ...items];
}

function parseAmount(value: string) {
  const amount = Number(value.replace(",", ".").replace(/[^\d.-]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

function getRealEstateCategoryLabel(category: WealthRealEstateAsset["category"]) {
  if (category === "commercialPersonal") {
    return "Immobilier commercial personnel";
  }

  if (category === "commercialBusiness") {
    return "Immobilier commercial EURL";
  }

  if (category === "fractional") {
    return "Immobilier fractionné";
  }

  if (category === "residential") {
    return "Immobilier résidentiel";
  }

  return "Immobilier";
}

function formatSignedCurrency(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatCurrency(value)}`;
}

function getOtherAssetMeta(item: WealthOtherAsset) {
  const baseLabel = item.type === "professionalAsset"
    ? "Actif professionnel"
    : item.type === "privateEquity"
      ? "Non coté"
      : "Autre actif";
  const totalCost = item.totalAcquisitionCost ?? 0;

  if (item.type === "professionalAsset") {
    const latentGain = totalCost > 0 ? item.value - totalCost : 0;
    return `${baseLabel} · Valeur estimée : ${formatCurrency(item.value)} · Coût total : ${formatCurrency(totalCost)} · Plus-value latente : ${formatSignedCurrency(latentGain)}`;
  }

  return `${baseLabel} · ${formatCurrency(item.value)} · ${formatCurrency(item.monthlyIncome)}/mois`;
}

const styles = StyleSheet.create({
  heroCard: {
    padding: spacing.lg,
    gap: spacing.md
  },
  card: {
    padding: spacing.md,
    gap: spacing.md
  },
  kicker: {
    fontSize: 10,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: typography.eyebrowTracking,
    textTransform: "uppercase"
  },
  heroTitle: {
    fontSize: 22,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: typography.titleTracking,
    lineHeight: 29
  },
  heroText: {
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    lineHeight: 20
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  metricBox: {
    width: "48%",
    minHeight: 76,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.sm,
    justifyContent: "center",
    gap: 4
  },
  metricLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    letterSpacing: 0.7,
    textTransform: "uppercase"
  },
  metricValue: {
    fontSize: 16,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  cardTitle: {
    fontSize: typography.titleSize,
    fontFamily: typography.fontFamily,
    fontWeight: typography.titleWeight,
    letterSpacing: typography.titleTracking,
    textTransform: "uppercase"
  },
  formGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  platformGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  platformCard: {
    flexGrow: 1,
    flexBasis: "47%",
    minHeight: 116,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.sm,
    gap: 5,
    justifyContent: "space-between"
  },
  platformTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  platformLabel: {
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  platformValue: {
    fontSize: 16,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  platformDetail: {
    fontSize: 11,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    lineHeight: 16
  },
  platformDetailBox: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.sm,
    gap: spacing.sm
  },
  platformDetailTitle: {
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase"
  },
  accordionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  accordionBody: {
    gap: spacing.md,
    paddingTop: spacing.sm
  },
  accordionPill: {
    minHeight: 32,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    flexDirection: "row",
    gap: 5
  },
  accordionPillText: {
    fontSize: 10,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  inputBox: {
    flexGrow: 1,
    flexBasis: "48%",
    minHeight: 62,
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    justifyContent: "center",
    gap: 2
  },
  inputLabel: {
    fontSize: 10,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: 0.55,
    textTransform: "uppercase"
  },
  input: {
    minHeight: 30,
    padding: 0,
    fontSize: 14,
    fontFamily: typography.fontFamily,
    fontWeight: "600"
  },
  assetHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  selectBlock: {
    gap: spacing.xs
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs
  },
  chip: {
    minHeight: 32,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    justifyContent: "center"
  },
  chipText: {
    fontSize: 11,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  assetList: {
    gap: spacing.sm
  },
  emptyText: {
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    lineHeight: 20
  },
  assetRow: {
    minHeight: 62,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.sm,
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  assetRowDetailed: {
    alignItems: "stretch"
  },
  assetCopy: {
    flex: 1,
    gap: 3
  },
  assetTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  assetTitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  assetMeta: {
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "500",
    lineHeight: 17
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginTop: spacing.xs
  },
  detailMetric: {
    flexGrow: 1,
    flexBasis: "31%",
    minHeight: 56,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.xs,
    justifyContent: "center",
    gap: 3
  },
  detailMetricLabel: {
    fontSize: 9,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase"
  },
  detailMetricValue: {
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  preparedBox: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.sm,
    gap: spacing.xs
  },
  removeButton: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  helperText: {
    fontSize: 13,
    fontFamily: typography.fontFamily,
    fontWeight: "400",
    lineHeight: 20
  },
  allocationList: {
    gap: spacing.sm
  },
  allocationRow: {
    gap: spacing.xs
  },
  allocationTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  allocationLabel: {
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "600"
  },
  allocationValue: {
    fontSize: 11,
    fontFamily: typography.fontFamily,
    fontWeight: "500"
  },
  allocationTrack: {
    height: 7,
    borderRadius: radii.pill,
    overflow: "hidden"
  },
  allocationFill: {
    height: "100%",
    borderRadius: radii.pill
  },
  timelineBox: {
    minHeight: 48,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.sm,
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  connectionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  connectionPill: {
    minHeight: 36,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    flexDirection: "row",
    gap: 5
  },
  connectionText: {
    fontSize: 12,
    fontFamily: typography.fontFamily,
    fontWeight: "700"
  },
  connectionStatus: {
    fontSize: 10,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    textTransform: "uppercase"
  }
});
