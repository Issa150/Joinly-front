import { LegalNotice } from '../../components/event/Terms-Conditions';

export default function MentionsLegalesPage() {  // Changed from LegalPage to default export
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mentions Légales</h1>
      
      <div className="space-y-6">
        <LegalNotice type="general" />
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Conditions d'utilisation</h2>
          <LegalNotice type="account" />
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Organisation d'événements</h2>
          <LegalNotice type="event" />
        </div>
      </div>
    </div>
  );
}