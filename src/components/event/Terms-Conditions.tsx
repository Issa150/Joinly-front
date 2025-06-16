import React from 'react';

interface LegalNoticeProps {
  type: 'event' | 'account' | 'general';
}

export const LegalNotice: React.FC<LegalNoticeProps> = ({ type }) => {
  const getLegalText = () => {
    switch (type) {
      case 'event':
        return (
          <>
            <h4 className="font-semibold mb-2">Mentions légales événement</h4>
            <p className="text-sm text-gray-600">
              En créant cet événement, vous acceptez :
              <ul className="list-disc ml-4 mt-2">
                <li>De respecter les conditions d'utilisation de Joinly</li>
                <li>D'être responsable des informations fournies</li>
                <li>De respecter la réglementation en vigueur concernant l'organisation d'événements</li>
                <li>De traiter les données personnelles des participants conformément au RGPD</li>
              </ul>
            </p>
          </>
        );

      case 'account':
        return (
          <>
            <h4 className="font-semibold mb-2">Mentions légales compte utilisateur</h4>
            <p className="text-sm text-gray-600">
              En créant un compte, vous acceptez :
              <ul className="list-disc ml-4 mt-2">
                <li>Que vos données personnelles soient traitées conformément au RGPD</li>
                <li>De recevoir des communications relatives à votre compte</li>
                <li>Les conditions générales d'utilisation de Joinly</li>
                <li>Notre politique de confidentialité</li>
              </ul>
            </p>
          </>
        );

      case 'general':
        return (
          <>
            <h4 className="font-semibold mb-2">Mentions légales générales</h4>
            <p className="text-sm text-gray-600">
              Joinly - Application de gestion d'événements
              <ul className="list-disc ml-4 mt-2">
                <li>Éditeur : [Nom de la société]</li>
                <li>Siège social : [Adresse]</li>
                <li>Contact : [Email]</li>
                <li>Hébergeur : [Nom et coordonnées de l'hébergeur]</li>
              </ul>
            </p>
          </>
        );
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
      {getLegalText()}
    </div>
  );
};