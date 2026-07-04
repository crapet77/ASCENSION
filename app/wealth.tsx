import { AppScreen } from "@/components/AppScreen";
import { Header } from "@/components/Header";
import { WealthSection } from "@/features/wealth/WealthSection";

export default function WealthScreen() {
  return (
    <AppScreen>
      <Header
        eyebrow="Patrimoine"
        title="Mon Patrimoine"
        subtitle="Renseigne et suis ta situation financière réelle."
      />
      <WealthSection />
    </AppScreen>
  );
}
