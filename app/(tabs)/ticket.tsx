import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";

import { AppScreen } from "@/components/AppScreen";
import { GlassCard } from "@/components/GlassCard";
import { PremiumButton } from "@/components/PremiumButton";
import { colors, radii, spacing } from "@/constants/theme";
import { AcademyEngine } from "@/engine/academy";
import { UserAccessService } from "@/features/access/userAccess";
import {
  getBankrollBetGrossReturn,
  getBankrollBetProfit,
  getBankrollStats,
  setInitialCapital
} from "@/features/bankroll/math";
import { loadBankrollState, saveBankrollState } from "@/features/bankroll/storage";
import { syncTicketsToBankroll } from "@/features/bankroll/ticketSync";
import { BankrollBet, BankrollState } from "@/features/bankroll/types";
import { AscensionAIService } from "@/features/ascensionAI";
import { filterTomorrowPredictionsWithoutTickets } from "@/features/tickets/categoryDedupe";
import {
  getPronosticStatus,
  isSettledResult,
  pronosticStatusLabel
} from "@/features/tickets/pronosticStatus";
import { canPlayTicket, ignoreTicket, markTicketAsPlayed, settleTicket } from "@/features/tickets/actions";
import { updateResults } from "@/features/tickets/resultsSync";
import { loadTickets, saveTickets } from "@/features/tickets/storage";
import { loadTomorrowPredictions, saveTomorrowPredictions } from "@/features/tickets/tomorrowStorage";
import {
  AscensionTicket,
  AscensionTicketPlayStatus,
  AscensionTicketResultStatus,
  TomorrowPrediction
} from "@/features/tickets/types";
import { formatCurrency } from "@/utils/format";

const playOptions: Array<{ label: string; value: AscensionTicketPlayStatus }> = [
  { label: "Joué", value: "played" },
  { label: "Ignorer", value: "not_played" }
];

const LIVE_RESULTS_SYNC_INTERVAL_MS = 5000;

const resultTone: Record<AscensionTicketResultStatus, string> = {
  pending: colors.gold,
  won: colors.success,
  lost: colors.danger,
  void: "#C8C8C8"
};

const resultLabel: Record<AscensionTicketResultStatus, string> = {
  pending: "En attente",
  won: "Gagné",
  lost: "Perdu",
  void: "Annulé"
};

const manualResultOptions: Array<{
  label: string;
  status: Exclude<AscensionTicketResultStatus, "pending">;
  color: string;
}> = [
  { label: "Gagné", status: "won", color: colors.success },
  { label: "Perdu", status: "lost", color: colors.danger },
  { label: "Annulé", status: "void", color: "#C8C8C8" }
];
const academyRoute = "/(tabs)/academy" as never;

function getTicketStatusLabel(ticket: AscensionTicket) {
  return pronosticStatusLabel[getPronosticStatus(ticket)];
}

function getTicketStatusTone(ticket: AscensionTicket) {
  const status = getPronosticStatus(ticket);

  if (status === "not_played") {
    return "#C8C8C8";
  }

  if (status === "pre_selection" || status === "played" || status === "pending") {
    return colors.gold;
  }

  return resultTone[status];
}

function getNumberTone(value: number) {
  if (value < 0) {
    return colors.danger;
  }

  if (value > 0) {
    return colors.success;
  }

  return colors.white;
}

function safeInputValue(value: string | null | undefined) {
  if (value === null || value === undefined || String(value).toLowerCase() === "null") {
    return "";
  }

  return String(value);
}

export default function TicketScreen() {
  const router = useRouter();
  const [tickets, setTickets] = useState<AscensionTicket[]>([]);
  const [bankroll, setBankroll] = useState<BankrollState | null>(null);
  const [capitalInput, setCapitalInput] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastSyncLabel, setLastSyncLabel] = useState("Auto");
  const [tomorrowItems, setTomorrowItems] = useState<TomorrowPrediction[]>([]);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [importJsonInput, setImportJsonInput] = useState("");
  const [hasSportPremiumAccess, setHasSportPremiumAccess] = useState(false);

  const applyOfficialResults = useCallback(async (currentTickets: AscensionTicket[]) => {
    const syncResult = await updateResults(currentTickets);

    if (syncResult.didUpdate) {
      setTickets(syncResult.tickets);
      setLastSyncLabel("Résultats mis à jour");
      return syncResult.tickets;
    }

    setLastSyncLabel("Aucun nouveau résultat");
    return currentTickets;
  }, []);

  useFocusEffect(
    useCallback(() => {
      Promise.all([loadTickets(), loadBankrollState(), loadTomorrowPredictions(), AcademyEngine.getState()])
        .then(async ([loadedTickets, loadedBankroll, loadedTomorrowPredictions, academyState]) => {
          const accessState = await UserAccessService.getState(academyState);
          setHasSportPremiumAccess(accessState.fullAccess || accessState.premiumAccess.sport);
          const syncedTickets = await applyOfficialResults(loadedTickets);
          const availableTomorrowPredictions = filterTomorrowPredictionsWithoutTickets(
            loadedTomorrowPredictions,
            syncedTickets
          );
          setTickets(syncedTickets);
          setTomorrowItems(availableTomorrowPredictions);
          const syncedBankroll = syncTicketsToBankroll(loadedBankroll, syncedTickets);
          setBankroll(syncedBankroll);
          await Promise.all([
            saveBankrollState(syncedBankroll),
            saveTomorrowPredictions(availableTomorrowPredictions)
          ]);
        })
        .finally(() => setIsLoaded(true));
    }, [applyOfficialResults])
  );

  useEffect(() => {
    if (!isLoaded || tickets.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      applyOfficialResults(tickets);
    }, LIVE_RESULTS_SYNC_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [applyOfficialResults, isLoaded, tickets]);

  useEffect(() => {
    if (isLoaded) {
      saveTickets(tickets);
      setBankroll((currentBankroll) => {
        if (!currentBankroll) {
          return currentBankroll;
        }

        const syncedBankroll = syncTicketsToBankroll(currentBankroll, tickets);
        saveBankrollState(syncedBankroll);
        return syncedBankroll;
      });
    }
  }, [isLoaded, tickets]);

  const dailyPronostics = useMemo(
    () => tickets.filter((ticket) => ticket.input.playStatus === "not_decided"),
    [tickets]
  );
  const officialDailySelection = dailyPronostics[0] ? [dailyPronostics[0]] : [];
  const pendingTickets = useMemo(
    () =>
      tickets.filter(
        (ticket) => ticket.input.playStatus === "played" && ticket.selection.status === "pending"
      ),
    [tickets]
  );
  const ticketHistoryBets = useMemo<BankrollBet[]>(
    () =>
      [...(bankroll?.bets ?? [])]
        .filter((bet) => bet.source === "ticket" && isSettledResult(bet.result))
        .sort((left, right) => right.placedAt.localeCompare(left.placedAt)),
    [bankroll]
  );
  const ticketBetsForStats = useMemo<BankrollBet[]>(
    () => [...(bankroll?.bets ?? [])].filter((bet) => bet.source === "ticket"),
    [bankroll]
  );
  const stats = useMemo(
    () =>
      getBankrollStats({
        initialCapital: bankroll?.initialCapital ?? 0,
        transactions: [],
        bets: ticketBetsForStats,
        updatedAt: bankroll?.updatedAt ?? ""
      }),
    [bankroll, ticketBetsForStats]
  );

  function updateTicket(id: string, updater: (ticket: AscensionTicket) => AscensionTicket) {
    setTickets((currentTickets) =>
      currentTickets.map((ticket) => (ticket.selection.id === id ? updater(ticket) : ticket))
    );
  }

  function playTicket(ticket: AscensionTicket) {
    if (!canPlayTicket(ticket)) {
      Alert.alert("Données manquantes", "Renseigne une cote réelle et une mise avant de jouer ce pronostic.");
      return;
    }

    updateTicket(ticket.selection.id, markTicketAsPlayed);
  }

  function skipTicket(ticket: AscensionTicket) {
    updateTicket(ticket.selection.id, ignoreTicket);
  }

  function completeTicket(ticket: AscensionTicket, status: Exclude<AscensionTicketResultStatus, "pending">) {
    updateTicket(ticket.selection.id, (current) => settleTicket(current, status));
  }

  async function refreshTicketResults() {
    const syncedTickets = await applyOfficialResults(tickets);
    const syncedBankroll = bankroll ? syncTicketsToBankroll(bankroll, syncedTickets) : null;

    await saveTickets(syncedTickets);

    if (syncedBankroll) {
      setBankroll(syncedBankroll);
      await saveBankrollState(syncedBankroll);
    }
  }

  async function confirmInitialBankroll() {
    const bankroll = Number(capitalInput.replace(",", "."));

    if (!Number.isFinite(bankroll) || bankroll <= 0) {
      return;
    }

    const currentBankroll = await loadBankrollState();
    const nextBankroll = setInitialCapital(currentBankroll, bankroll);
    await saveBankrollState(nextBankroll);
    setBankroll(nextBankroll);
    setCapitalInput("");
  }

  async function importChatGPTJson() {
    try {
      const importResult = AscensionAIService.importFromJson({
        json: importJsonInput,
        tickets,
        tomorrowPredictions: tomorrowItems
      });
      const syncedBankroll = bankroll ? syncTicketsToBankroll(bankroll, importResult.tickets) : null;
      const remainingTomorrowPredictions = filterTomorrowPredictionsWithoutTickets(
        importResult.tomorrowPredictions,
        importResult.tickets
      );

      setTickets(importResult.tickets);
      setTomorrowItems(remainingTomorrowPredictions);
      await Promise.all([
        saveTickets(importResult.tickets),
        saveTomorrowPredictions(remainingTomorrowPredictions),
        syncedBankroll ? saveBankrollState(syncedBankroll) : Promise.resolve()
      ]);

      if (syncedBankroll) {
        setBankroll(syncedBankroll);
      }

      setImportJsonInput("");
      setIsImportModalVisible(false);
      Alert.alert(
        "Import terminé",
        `${importResult.importedTickets} sélection(s) importée(s), ${importResult.importedTomorrowPredictions} prévision(s) ajoutée(s).`
      );
    } catch (error) {
      Alert.alert(
        "Import impossible",
        error instanceof Error ? error.message : "Le JSON collé n'est pas valide."
      );
    }
  }

  function renderTicketCard(ticket: AscensionTicket, mode: "daily" | "pending" = "daily") {
    const statusTone = getTicketStatusTone(ticket);
    const isPendingMode = mode === "pending";

    return (
      <GlassCard
        key={ticket.selection.id}
        style={styles.card}
      >
        <View style={styles.cardTop}>
          <View style={styles.sportPill}>
            <Ionicons name="flash" size={13} color={colors.gold} />
            <Text style={styles.sportText}>{ticket.selection.sport}</Text>
          </View>
          <Text style={styles.time}>{ticket.selection.kickoffTime}</Text>
        </View>

        <View style={styles.statusRow}>
          <Text style={[styles.statusText, { color: statusTone }]}>{getTicketStatusLabel(ticket)}</Text>
          {ticket.selection.scoreFinal || ticket.selection.officialScore ? (
            <Text style={styles.officialScore}>
              Score final : {ticket.selection.scoreFinal ?? ticket.selection.officialScore}
            </Text>
          ) : null}
        </View>

        <Text style={styles.match}>{ticket.selection.match}</Text>
        <Text style={styles.competition}>{ticket.selection.competition}</Text>

        <View style={styles.marketBox}>
          <View>
            <Text style={styles.metaLabel}>Marché conseillé</Text>
            <Text style={styles.market}>{ticket.selection.recommendedMarket ?? ticket.selection.market}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.metaLabel}>Score</Text>
            <Text style={styles.score}>{ticket.selection.ascensionScore}</Text>
          </View>
        </View>

        <Text style={styles.pick}>{ticket.selection.pick}</Text>
        <Text style={styles.explanation}>
          Cote estimée : {ticket.selection.estimatedOdds?.toFixed(2) ?? "À jouer"}
        </Text>
        {isPendingMode ? (
          <>
            <View style={styles.historyNumbers}>
              <Text style={styles.historyNumber}>Cote réelle {safeInputValue(ticket.input.realOdds) || "-"}</Text>
              <Text style={styles.historyNumber}>Mise {formatCurrency(Number(safeInputValue(ticket.input.stake).replace(",", ".")) || 0)}</Text>
              <Text style={[styles.historyNumber, { color: colors.gold }]}>En attente</Text>
            </View>
            <View style={styles.resultGrid}>
              {manualResultOptions.map((option) => (
                <Pressable
                  key={option.status}
                  onPress={() => completeTicket(ticket, option.status)}
                  style={styles.resultButton}
                >
                  <View style={[styles.resultDot, { backgroundColor: option.color }]} />
                  <Text style={styles.resultText}>{option.label}</Text>
                </Pressable>
              ))}
            </View>
            <PremiumButton label="Actualiser résultat" icon="refresh-circle" onPress={refreshTicketResults} />
          </>
        ) : (
          <>
            <View style={styles.inputsRow}>
              <TextInput
                value={safeInputValue(ticket.input.realOdds)}
                onChangeText={(realOdds) =>
                  updateTicket(ticket.selection.id, (current) => ({
                    ...current,
                    input: { ...current.input, realOdds }
                  }))
                }
                placeholder="Cote réelle"
                placeholderTextColor="#7D7D7D"
                keyboardType="decimal-pad"
                style={styles.input}
              />
              <TextInput
                value={safeInputValue(ticket.input.stake)}
                onChangeText={(stake) =>
                  updateTicket(ticket.selection.id, (current) => ({
                    ...current,
                    input: { ...current.input, stake }
                  }))
                }
                placeholder="Mise"
                placeholderTextColor="#7D7D7D"
                keyboardType="decimal-pad"
                style={styles.input}
              />
            </View>

            <View style={styles.segmented}>
              {playOptions.map((option) => {
                const active = ticket.input.playStatus === option.value;

                return option.value === "played" ? (
                  <PremiumButton
                    key={option.value}
                    label={option.label}
                    icon="checkmark-circle"
                    onPress={() => playTicket(ticket)}
                    style={styles.playPrimary}
                  />
                ) : (
                  <Pressable
                    key={option.value}
                    onPress={() => skipTicket(ticket)}
                    style={[styles.segment, active && styles.segmentMutedActive]}
                  >
                    <Text style={[styles.segmentText, active && styles.segmentMutedTextActive]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </GlassCard>
    );
  }

  function renderTomorrowPrediction(prediction: TomorrowPrediction) {
    return (
      <GlassCard
        key={prediction.id}
        style={styles.card}
      >
        <View style={styles.cardTop}>
          <View style={styles.sportPill}>
            <Ionicons name="eye-outline" size={13} color={colors.gold} />
            <Text style={styles.sportText}>{prediction.sport}</Text>
          </View>
          <Text style={styles.time}>{prediction.kickoffTime}</Text>
        </View>
        <View style={styles.statusRow}>
          <Text style={[styles.statusText, { color: colors.gold }]}>
            {prediction.status === "forecast" ? "Prévision" : prediction.status === "confirm_tomorrow" ? "À jouer demain" : "Rejeté"}
          </Text>
        </View>
        <Text style={styles.match}>{prediction.match}</Text>
        <Text style={styles.competition}>{prediction.competition}</Text>
        <View style={styles.marketBox}>
          <View>
            <Text style={styles.metaLabel}>Marché envisagé</Text>
            <Text style={styles.market}>{prediction.plannedMarket}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.metaLabel}>Score</Text>
            <Text style={styles.score}>{prediction.ascensionScore}</Text>
          </View>
        </View>
        <Text style={styles.explanation}>
          Cote estimée : {prediction.estimatedOdds?.toFixed(2) ?? "À jouer"} · Confiance : {prediction.provisionalConfidence}
        </Text>
        <Text style={styles.explanation}>
          Points à vérifier : {prediction.checkpoints.join(" · ")}
        </Text>
      </GlassCard>
    );
  }

  return (
    <AppScreen>
      <Modal visible={isLoaded && bankroll?.initialCapital === null} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <LinearGradient colors={["#111111", "#050505"]} style={styles.modalCard}>
            <Text style={styles.modalTitle}>Quel capital veux-tu consacrer aux paris ?</Text>
            <Text style={styles.modalText}>
              Ce montant devient ta bankroll de départ pour le test réel.
            </Text>
            <TextInput
              value={capitalInput}
              onChangeText={setCapitalInput}
              placeholder="Ex : 500"
              placeholderTextColor="#7D7D7D"
              keyboardType="decimal-pad"
              style={styles.modalInput}
            />
            <PremiumButton label="Valider ma bankroll" icon="checkmark-circle" onPress={confirmInitialBankroll} />
          </LinearGradient>
        </View>
      </Modal>
      <Modal visible={isImportModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <LinearGradient colors={["#111111", "#050505"]} style={styles.modalCard}>
            <Text style={styles.modalTitle}>Importer sélections ChatGPT</Text>
            <Text style={styles.modalText}>
              Colle ici le JSON fourni par ChatGPT. Ascension répartira automatiquement les sélections.
            </Text>
            <TextInput
              value={importJsonInput}
              onChangeText={setImportJsonInput}
              placeholder='[{"date":"2026-06-29","sport":"Football",...}]'
              placeholderTextColor="#7D7D7D"
              multiline
              textAlignVertical="top"
              style={[styles.modalInput, styles.importInput]}
            />
            <PremiumButton label="Importer" icon="download-outline" onPress={importChatGPTJson} />
            <Pressable onPress={() => setIsImportModalVisible(false)} style={styles.segment}>
              <Text style={styles.segmentText}>Annuler</Text>
            </Pressable>
          </LinearGradient>
        </View>
      </Modal>

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Pronostics</Text>
          <Text style={styles.subtitle}>Sélection officielle et suivi des tickets.</Text>
        </View>
        <Pressable onPress={() => setIsImportModalVisible(true)} style={styles.importButton}>
          <Ionicons name="download-outline" size={15} color={colors.gold} />
          <Text style={styles.importButtonText}>Importer</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Sélection officielle du jour</Text>
          <Text style={styles.historyMeta}>{hasSportPremiumAccess ? `${officialDailySelection.length} sélection` : "Premium"}</Text>
        </View>
        <View style={styles.list}>
          {!hasSportPremiumAccess ? (
            <GlassCard style={styles.lockedPanel}>
              <Ionicons name="lock-closed-outline" size={28} color={colors.gold} />
              <Text style={styles.emptyTitle}>Opportunités du jour réservées</Text>
              <Text style={styles.emptyText}>
                En Mode Découverte, tu peux consulter l'historique et la méthode. Les pronostics du jour nécessitent les conditions applicables et un abonnement actif.
              </Text>
              <PremiumButton label="Ouvrir Academy" icon="school-outline" onPress={() => router.push(academyRoute)} />
            </GlassCard>
          ) : officialDailySelection.length === 0 ? (
            <GlassCard style={styles.emptyCard}>
              <Ionicons name="shield-checkmark-outline" size={28} color={colors.gold} />
              <Text style={styles.emptyTitle}>Aucune sélection officielle.</Text>
              <Text style={styles.emptyText}>
                La sélection Ascension du jour apparaîtra ici.
              </Text>
            </GlassCard>
          ) : null}
          {hasSportPremiumAccess ? officialDailySelection.map((ticket) => renderTicketCard(ticket)) : null}
        </View>
      </View>

      {hasSportPremiumAccess ? (
        <View style={styles.section}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Paris en cours</Text>
          <Text style={styles.historyMeta}>{pendingTickets.length} en attente</Text>
        </View>
        <View style={styles.list}>
          {pendingTickets.length === 0 ? (
            <GlassCard style={styles.emptyCard}>
              <Ionicons name="time-outline" size={28} color={colors.gold} />
              <Text style={styles.emptyTitle}>Aucun ticket en attente.</Text>
              <Text style={styles.emptyText}>
                Un ticket passe ici après avoir choisi Joué, avec une cote réelle et une mise.
              </Text>
            </GlassCard>
          ) : null}
          {pendingTickets.map((ticket) => renderTicketCard(ticket, "pending"))}
        </View>
      </View>
      ) : null}

      <View style={styles.section}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Historique Ascension</Text>
          <Text style={styles.historyMeta}>
            {stats.wonCount} gagnés · {stats.lostCount} perdus
          </Text>
        </View>

        <View style={styles.list}>
          {ticketHistoryBets.map((bet) => {
            const grossReturn = getBankrollBetGrossReturn(bet);
            const netProfit = getBankrollBetProfit(bet);
            const tone = getNumberTone(netProfit);
            const sourceTicket = tickets.find((ticket) => ticket.selection.id === bet.sourceId);
            const finalResult = sourceTicket?.selection.scoreFinal ?? sourceTicket?.selection.officialScore;

            return (
              <GlassCard key={bet.id} style={styles.historyCard}>
                <View style={styles.historyTop}>
                  <Text style={styles.historyDate}>{new Date(bet.placedAt).toLocaleDateString("fr-FR")}</Text>
                  <Text style={[styles.historyStatus, { color: tone }]}>{resultLabel[bet.result]}</Text>
                </View>
                <Text style={styles.historyEvent}>{bet.event}</Text>
                {finalResult ? (
                  <Text style={styles.historyNumber}>Résultat : {finalResult}</Text>
                ) : null}
                <View style={styles.historyNumbers}>
                  <Text style={styles.historyNumber}>Cote {bet.odds.toFixed(2)}</Text>
                  <Text style={styles.historyNumber}>Mise {formatCurrency(bet.stake)}</Text>
                  <Text style={styles.historyNumber}>Gain brut {formatCurrency(grossReturn)}</Text>
                  <Text style={[styles.historyNumber, { color: tone }]}>Net {formatCurrency(netProfit)}</Text>
                </View>
              </GlassCard>
            );
          })}
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  title: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "700"
  },
  subtitle: {
    color: "#C8C8C8",
    fontSize: 13,
    fontWeight: "400"
  },
  badge: {
    minHeight: 34,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    backgroundColor: "#050505"
  },
  badgeText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "700"
  },
  importButton: {
    minHeight: 34,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    backgroundColor: "rgba(228, 169, 69, 0.08)"
  },
  importButtonText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: "700"
  },
  syncText: {
    color: "#8A8A8A",
    fontSize: 11,
    fontWeight: "400",
    marginTop: -spacing.sm
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  statCard: {
    width: "31.8%",
    minHeight: 72,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.md,
    backgroundColor: "#050505",
    padding: spacing.sm,
    justifyContent: "center",
    gap: 5
  },
  section: {
    gap: spacing.sm
  },
  historySection: {
    gap: spacing.sm
  },
  historyHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  historyTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700"
  },
  historyMeta: {
    color: "#C8C8C8",
    fontSize: 12,
    fontWeight: "500"
  },
  historyCard: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.md,
    backgroundColor: "#050505",
    padding: spacing.md,
    gap: spacing.sm
  },
  historyTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  historyDate: {
    color: "#C8C8C8",
    fontSize: 12,
    fontWeight: "500"
  },
  historyStatus: {
    fontSize: 12,
    fontWeight: "700"
  },
  historyEvent: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700"
  },
  historyNumbers: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  historyNumber: {
    color: "#C8C8C8",
    fontSize: 12,
    fontWeight: "500"
  },
  statLabel: {
    color: "#C8C8C8",
    fontSize: 11,
    fontWeight: "400"
  },
  statValue: {
    color: colors.success,
    fontSize: 16,
    fontWeight: "700"
  },
  list: {
    gap: spacing.md
  },
  emptyCard: {
    minHeight: 160,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.md,
    backgroundColor: "#050505",
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm
  },
  emptyTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center"
  },
  emptyText: {
    color: "#C8C8C8",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center"
  },
  lockedPanel: {
    minHeight: 240,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.md,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md
  },
  card: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.sm
  },
  cardTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700"
  },
  sportPill: {
    minHeight: 28,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    backgroundColor: "rgba(228, 169, 69, 0.08)"
  },
  sportText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: "700"
  },
  time: {
    color: "#C8C8C8",
    fontSize: 12,
    fontWeight: "500"
  },
  match: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700"
  },
  competition: {
    color: "#C8C8C8",
    fontSize: 12,
    fontWeight: "400"
  },
  marketBox: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: radii.sm,
    padding: spacing.sm,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#050505"
  },
  metaLabel: {
    color: "#8A8A8A",
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase"
  },
  market: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600"
  },
  scoreBox: {
    alignItems: "flex-end"
  },
  score: {
    color: colors.gold,
    fontSize: 24,
    fontWeight: "700"
  },
  pick: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: "700"
  },
  officialScore: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "600"
  },
  explanation: {
    color: "#C8C8C8",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400"
  },
  analysisBox: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: radii.sm,
    padding: spacing.sm,
    gap: 5,
    backgroundColor: "#050505"
  },
  analysisTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700"
  },
  profitRow: {
    minHeight: 38,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#050505"
  },
  ticketProfit: {
    fontSize: 15,
    fontWeight: "700"
  },
  inputsRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  input: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.sm,
    backgroundColor: "#050505",
    color: colors.white,
    paddingHorizontal: spacing.sm,
    fontSize: 14,
    fontWeight: "500"
  },
  segmented: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.sm,
    padding: 4,
    flexDirection: "row",
    gap: 4,
    backgroundColor: "#050505"
  },
  playPrimary: {
    flex: 1
  },
  segment: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)"
  },
  segmentMutedActive: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.16)"
  },
  segmentText: {
    color: "#C8C8C8",
    fontSize: 12,
    fontWeight: "600"
  },
  segmentMutedTextActive: {
    color: colors.white
  },
  resultGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs
  },
  resultButton: {
    width: "48.8%",
    minHeight: 34,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#050505"
  },
  resultDot: {
    width: 7,
    height: 7,
    borderRadius: radii.pill
  },
  resultText: {
    color: "#C8C8C8",
    fontSize: 12,
    fontWeight: "600"
  },
  modalBackdrop: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: "rgba(0, 0, 0, 0.78)",
    alignItems: "center",
    justifyContent: "center"
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    borderWidth: 1,
    borderColor: colors.goldBorder,
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.md
  },
  modalTitle: {
    color: colors.white,
    fontSize: 21,
    fontWeight: "700"
  },
  modalText: {
    color: "#C8C8C8",
    fontSize: 13,
    lineHeight: 20
  },
  modalInput: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.10)",
    borderRadius: radii.md,
    backgroundColor: "#050505",
    color: colors.white,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    fontWeight: "600"
  },
  importInput: {
    minHeight: 180,
    paddingTop: spacing.md
  },
});
