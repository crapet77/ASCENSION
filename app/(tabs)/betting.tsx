import { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";

import { AppScreen } from "@/components/AppScreen";
import { Header } from "@/components/Header";
import { MetricCard } from "@/components/MetricCard";
import { PremiumButton } from "@/components/PremiumButton";
import { Section } from "@/components/Section";
import { colors, radii, spacing } from "@/constants/theme";
import {
  addBankrollTransaction,
  getBankrollBetProfit,
  getBankrollStats,
  setInitialCapital,
  upsertBankrollBet
} from "@/features/bankroll/math";
import { loadBankrollState, saveBankrollState } from "@/features/bankroll/storage";
import { BankrollState, BankrollTransactionType } from "@/features/bankroll/types";
import { BetResult } from "@/types/domain";
import { formatCurrency, formatPercent } from "@/utils/format";

const resultOptions: BetResult[] = ["pending", "won", "lost", "void"];

const resultLabels: Record<BetResult, string> = {
  pending: "En cours",
  won: "Gagne",
  lost: "Perdu",
  void: "Annule"
};

export default function BettingScreen() {
  const [bankroll, setBankroll] = useState<BankrollState>({
    initialCapital: null,
    transactions: [],
    bets: [],
    updatedAt: ""
  });
  const [event, setEvent] = useState("");
  const [odds, setOdds] = useState("");
  const [stake, setStake] = useState("");
  const [result, setResult] = useState<BetResult>("pending");
  const [fundAmount, setFundAmount] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadBankrollState().then(setBankroll);
    }, [])
  );

  const stats = useMemo(() => getBankrollStats(bankroll), [bankroll]);
  const allBets = bankroll.bets;

  async function commitBankroll(nextBankroll: BankrollState) {
    setBankroll(nextBankroll);
    await saveBankrollState(nextBankroll);
  }

  function addBet() {
    const parsedOdds = Number(odds.replace(",", "."));
    const parsedStake = Number(stake.replace(",", "."));

    if (!event.trim() || !Number.isFinite(parsedOdds) || !Number.isFinite(parsedStake) || parsedStake <= 0) {
      return;
    }

    commitBankroll(
      upsertBankrollBet(bankroll, {
        id: `b-${Date.now()}`,
        source: "manual",
        event: event.trim(),
        odds: parsedOdds,
        stake: parsedStake,
        result,
        placedAt: new Date().toISOString().slice(0, 10)
      })
    );
    setEvent("");
    setOdds("");
    setStake("");
    setResult("pending");
  }

  function addFunds(type: BankrollTransactionType) {
    const parsedAmount = Number(fundAmount.replace(",", "."));

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    if (type === "withdrawal" && parsedAmount > stats.currentCapital) {
      return;
    }

    commitBankroll(
      addBankrollTransaction(bankroll, {
        type,
        amount: parsedAmount,
        note: type === "deposit" ? "Ajout de fonds" : "Retrait de fonds"
      })
    );
    setFundAmount("");
  }

  function createInitialBankroll() {
    const parsedAmount = Number(fundAmount.replace(",", "."));

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    commitBankroll(setInitialCapital(bankroll, parsedAmount));
    setFundAmount("");
  }

  return (
    <AppScreen>
      <Header
        eyebrow="Paris sportifs"
        title="Bankroll"
        subtitle="Enregistre uniquement les mises, resultats et statistiques pour garder une gestion froide."
      />

      <View style={styles.metricsGrid}>
        <MetricCard label="Bankroll" value={formatCurrency(stats.currentCapital)} detail="capital actuel" tone="gold" />
        <MetricCard
          label="Profit / perte"
          value={formatCurrency(stats.profit)}
          detail={formatPercent(stats.roi)}
          tone={stats.profit >= 0 ? "success" : "danger"}
        />
        <MetricCard label="Win rate" value={`${stats.winRate.toFixed(0)}%`} detail={`${stats.pendingCount} en cours`} />
        <MetricCard label="Paris" value={`${stats.placedCount}`} detail={`${stats.settledCount} réglés`} />
      </View>

      <Section title={bankroll.initialCapital === null ? "Bankroll de départ" : "Mouvements de fonds"}>
        <View style={styles.form}>
          <TextInput
            value={fundAmount}
            onChangeText={setFundAmount}
            placeholder="Montant"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            style={styles.input}
          />
          {bankroll.initialCapital === null ? (
            <PremiumButton label="Créer la bankroll" icon="checkmark-circle" onPress={createInitialBankroll} />
          ) : (
            <View style={styles.formRow}>
              <PremiumButton label="Ajouter" icon="add-circle" onPress={() => addFunds("deposit")} style={styles.rowAction} />
              <Pressable onPress={() => addFunds("withdrawal")} style={[styles.segment, styles.withdrawButton]}>
                <Text style={styles.segmentText}>Retirer</Text>
              </Pressable>
            </View>
          )}
        </View>
      </Section>

      <Section title="Enregistrer un pari">
        <View style={styles.form}>
          <TextInput
            value={event}
            onChangeText={setEvent}
            placeholder="Evenement"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
          <View style={styles.formRow}>
            <TextInput
              value={odds}
              onChangeText={setOdds}
              placeholder="Cote"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              style={[styles.input, styles.rowInput]}
            />
            <TextInput
              value={stake}
              onChangeText={setStake}
              placeholder="Mise"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              style={[styles.input, styles.rowInput]}
            />
          </View>
          <View style={styles.segmented}>
            {resultOptions.map((option) => (
              <Pressable
                key={option}
                onPress={() => setResult(option)}
                style={[styles.segment, result === option && styles.segmentActive]}
              >
                <Text style={[styles.segmentText, result === option && styles.segmentTextActive]}>
                  {resultLabels[option]}
                </Text>
              </Pressable>
            ))}
          </View>
          <PremiumButton label="Ajouter le pari" icon="add-circle" onPress={addBet} />
        </View>
      </Section>

      <Section title="Historique">
        <View style={styles.betList}>
          {bankroll.transactions.map((transaction) => (
            <View key={transaction.id} style={styles.betRow}>
              <View style={styles.betCopy}>
                <Text style={styles.betEvent}>
                  {transaction.type === "deposit" ? "Ajout de fonds" : "Retrait de fonds"}
                </Text>
                <Text style={styles.betMeta}>{new Date(transaction.createdAt).toLocaleDateString("fr-FR")}</Text>
              </View>
              <View style={styles.betResult}>
                <Text style={styles.resultLabel}>Capital</Text>
                <Text style={[styles.profit, { color: transaction.type === "deposit" ? colors.success : colors.danger }]}>
                  {transaction.type === "deposit" ? "+" : "-"}{formatCurrency(transaction.amount)}
                </Text>
              </View>
            </View>
          ))}

          {allBets.map((bet) => {
            const profit = getBankrollBetProfit(bet);
            const profitTone = profit > 0 ? colors.success : profit < 0 ? colors.danger : colors.textMuted;

            return (
              <View key={bet.id} style={styles.betRow}>
                <View style={styles.betCopy}>
                  <Text style={styles.betEvent}>{bet.event}</Text>
                  <Text style={styles.betMeta}>
                    {bet.source === "ticket" ? "Ticket Ascension" : "Pari manuel"} · Cote {bet.odds.toFixed(2)} · Mise {formatCurrency(bet.stake)}
                  </Text>
                </View>
                <View style={styles.betResult}>
                  <Text style={styles.resultLabel}>{resultLabels[bet.result]}</Text>
                  <Text style={[styles.profit, { color: profitTone }]}>{formatCurrency(profit)}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Section>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  form: {
    gap: spacing.sm
  },
  formRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  rowInput: {
    flex: 1
  },
  rowAction: {
    flex: 1
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.md,
    backgroundColor: "#050505",
    color: colors.white,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    fontWeight: "500"
  },
  segmented: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.md,
    backgroundColor: "#050505",
    padding: 4,
    flexDirection: "row",
    gap: 4
  },
  segment: {
    flex: 1,
    minHeight: 40,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center"
  },
  segmentActive: {
    borderWidth: 1,
    borderColor: "rgba(228, 169, 69, 0.36)",
    backgroundColor: "rgba(228, 169, 69, 0.10)"
  },
  withdrawButton: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)"
  },
  segmentText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800"
  },
  segmentTextActive: {
    color: colors.goldSoft
  },
  betList: {
    gap: spacing.sm
  },
  betRow: {
    minHeight: 78,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.md,
    backgroundColor: "#050505",
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm
  },
  betCopy: {
    flex: 1,
    gap: 4
  },
  betEvent: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700"
  },
  betMeta: {
    color: "#C8C8C8",
    fontSize: 12,
    fontWeight: "400"
  },
  betResult: {
    minWidth: 86,
    alignItems: "flex-end",
    gap: 4
  },
  resultLabel: {
    color: "#C8C8C8",
    fontSize: 12,
    fontWeight: "400"
  },
  profit: {
    fontSize: 15,
    fontWeight: "700"
  }
});
