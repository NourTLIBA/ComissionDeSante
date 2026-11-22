// Algerian Health Accreditation Referential - 100 points, 44 criteria, 7 domains
// Extracted & aligned with Ministère de la Santé - Instance Nationale d'Évaluation (Chapitre I & Référentiel Officiel)

export const DOMAINS = [
  {
    id: 'D1',
    label: 'Gouvernance et management',
    shortLabel: 'Gouvernance',
    icon: 'account_balance',
    weight: 15,
    criteria: [
      {
        id: 'D1C1',
        num: 1,
        label: 'Projet d\'établissement',
        definition: 'Existence d\'un projet d\'établissement formalisé, validé et actualisé (<= 5 ans), décliné en plans d\'action annuels.',
        type: 'Obligatoire',
        weight: 3,
        directive: 'Directive 1 — Projet d\'Établissement & Pilotage Stratégique',
        evidence: 'Document du projet d\'établissement, PV de réunions/groupes de réflexion, plan de la structure, expression formalisée des besoins par service, évaluation financière et calendrier d\'exécution.',
        details: 'Reflète la vision à long terme (objectifs et missions). Spécifie les spécialités médicales, chirurgicales, biologiques et radiologiques adaptées aux spécificités régionales (ex. Sud algérien) et services supports (DRH, DMM). Validation par l\'instance délibérante et réévaluation au minimum quinquennale.'
      },
      {
        id: 'D1C2',
        num: 2,
        label: 'Organigramme et délégation',
        definition: 'Organigramme officiel, fiches de poste, délégations de compétences documentées pour les postes de direction.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Directive 2 — L\'Organisation Hiérarchique',
        evidence: 'Organigramme fonctionnel et hiérarchique officiel daté et signé accessible au personnel, fiches de poste actualisées de la Direction Générale, tableau de suppléance ou de délégation de signature.',
        details: 'Assure la continuité et sécurise les actes administratifs et médicaux. Les délégations de signature et d\'habilitation doivent être formellement documentées et limitées au périmètre autorisé.'
      },
      {
        id: 'D1C3',
        num: 3,
        label: 'Comité de direction',
        definition: 'Comité de direction fonctionnel avec réunions documentées (PV), au moins mensuel, avec suivi des décisions.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Directive 3 — Le Fonctionnement des Instances de Décision',
        evidence: 'Procédure de gestion du Conseil d\'Administration / Comité de direction, procès-verbaux officiels synthétisant les débats (réunions <= 1 mois), annexe de suivi des décisions et plans d\'action d\'urgence.',
        details: 'La gestion s\'appuie sur une collégialité régulière entre les services de la direction générale. En cas d\'écart constaté ou d\'urgence, un plan d\'action (objectifs, responsables, calendrier) est élaboré.'
      },
      {
        id: 'D1C4',
        num: 4,
        label: 'Politique qualité',
        definition: 'Politique qualité écrite, diffusée à l\'ensemble du personnel, avec objectifs mesurables et tableau de bord.',
        type: 'Obligatoire',
        weight: 3,
        directive: 'Directive 4 — Politique Qualité & Sécurité des Soins',
        evidence: 'Déclaration de politique qualité rédigée et signée par la direction générale, preuves de diffusion à tous les niveaux, tableau de bord des objectifs S.M.A.R.T. et indicateurs d\'atteinte.',
        details: 'La direction générale est garante du maintien et de l\'amélioration continue de la qualité. La politique se décline en objectifs S.M.A.R.T (Spécifiques, Mesurables, Atteignables, Réalistes, Temporellement définis).'
      },
      {
        id: 'D1C5',
        num: 5,
        label: 'Gestion des risques institutionnels',
        definition: 'Cartographie des risques institutionnels actualisée, plan de traitement et suivi régulier par la direction.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Directive 5 — Gestion des Risques Institutionnels & Cliniques',
        evidence: 'Procédure de gestion des risques, cartographie formalisée et à jour des risques institutionnels (financiers, juridiques, RH, environnementaux, structuraux), plans d\'action préventifs.',
        details: 'Stratégie de gestion des risques susceptible d\'impacter la sécurité des patients, du personnel et la pérennité de l\'activité. Réexamen périodique par la direction générale pour réajuster le plan d\'action.'
      },
      {
        id: 'D1C6',
        num: 6,
        label: 'Éthique et déontologie',
        definition: 'Comité d\'éthique actif, procédures de recueil du consentement éclairé, charte des droits du patient affichée.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Directive 6 — Éthique & Droits des Patients',
        evidence: 'Décision de création du comité d\'éthique et de déontologie, règlement intérieur validé, charte des droits du patient affichée à l\'accueil/hébergement, formulaires de consentement éclairé, PVs de réunions.',
        details: 'L\'activité de soin s\'inscrit dans un cadre déontologique strict. Recueil du consentement éclairé (patient ou représentant légal) avant tout acte invasif. Comité d\'éthique actif pour accompagner les situations complexes.'
      },
      {
        id: 'D1C7',
        num: 7,
        label: 'Communication institutionnelle',
        definition: 'Stratégie de communication interne et externe documentée, rapport annuel d\'activité publié.',
        type: 'Recommandé',
        weight: 1,
        directive: 'Directive 7 — Communication Institutionnelle',
        evidence: 'Procédure de gestion de la communication, rapport d\'activité annuel publié aux autorités (résultats, indicateurs clés, bilan financier), supports de communication interne (bulletins, notes, réunions).',
        details: 'Stratégie de communication interne formalisée pour informer le personnel à tous les niveaux. Planification de la communication médiatique pour une maîtrise de la diffusion des informations.'
      },
    ],
  },
  {
    id: 'D2',
    label: 'Droits des patients et bientraitance',
    shortLabel: 'Droits patients',
    icon: 'person',
    weight: 12,
    criteria: [
      {
        id: 'D2C1',
        num: 1,
        label: 'Information et consentement',
        definition: 'Procédure de recueil du consentement éclairé écrit pour tout acte invasif, tracée dans le dossier du patient.',
        type: 'Obligatoire',
        weight: 3,
        directive: 'Directive 6.2 — Consentement Éclairé & Information du Patient',
        evidence: 'Formulaires de consentement éclairé signés dans le dossier patient, fiches d\'information médicale préalable par discipline.',
        details: 'Application systématique avant tout acte invasif, chirurgical ou anesthésique. Information loyale et compréhensible adaptée au patient.'
      },
      {
        id: 'D2C2',
        num: 2,
        label: 'Confidentialité des données',
        definition: 'Respect du secret médical, accès au dossier médical réservé aux professionnels habilités, conformité à la réglementation.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Secret Médical & Protection des Données de Santé',
        evidence: 'Charte de confidentialité signée par les agents, matrice des droits d\'accès au système d\'information, registres de communication des dossiers.',
        details: 'Garantie de la confidentialité des échanges et du secret professionnel à toutes les étapes du séjour.'
      },
      {
        id: 'D2C3',
        num: 3,
        label: 'Accueil et orientation',
        definition: 'Système d\'accueil formalisé, signalétique interne, délais d\'attente affichés, personnel dédié à l\'orientation.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Organisation de la Prise en Charge à l\'Accueil',
        evidence: 'Signalétique bilingue/trilingue lisible, tableaux d\'affichage des horaires et délais, présence d\'agents d\'accueil identifiés.',
        details: 'Orientation fluide du patient dès l\'entrée dans la structure et accompagnement adapté aux personnes vulnérables.'
      },
      {
        id: 'D2C4',
        num: 4,
        label: 'Gestion des plaintes',
        definition: 'Procédure de recueil, traitement et réponse aux réclamations des patients dans un délai <= 30 jours, avec registre officiel.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Traitement des Réclamations Usagers',
        evidence: 'Registre officiel des plaintes/réclamations coté et paraphé, courriers de réponse signés, PVs de la commission des usagers.',
        details: 'Procédure d\'instruction rapide avec analyse des causes des mécontentements et propositions d\'actions correctives.'
      },
      {
        id: 'D2C5',
        num: 5,
        label: 'Satisfaction des patients',
        definition: 'Enquête de satisfaction annuelle avec taux de participation >= 30%, résultats analysés et plan d\'amélioration.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Mesure de l\'Expérience Patient',
        evidence: 'Questionnaires d\'enquête de satisfaction, rapport statistique annuel d\'analyse des réponses, plan d\'amélioration affiché.',
        details: 'Évaluation régulière de la perception des patients sur la qualité des soins, du repas et de l\'hébergement.'
      },
      {
        id: 'D2C6',
        num: 6,
        label: 'Bientraitance et non-discrimination',
        definition: 'Formation du personnel à la bientraitance, protocole de signalement de maltraitance, accessibilité pour personnes à mobilité réduite.',
        type: 'Obligatoire',
        weight: 1,
        directive: 'Promotion de la Bientraitance & Accessibilité Universelle',
        evidence: 'Attestations de formation à la bientraitance, protocole institutionnel de signalement des vulnérabilités, aménagements PMR conformes.',
        details: 'Ancrage de l\'écoute bienveillante et garantie d\'un accès égal aux soins sans discrimination.'
      },
    ],
  },
  {
    id: 'D3',
    label: 'Qualité et sécurité des soins',
    shortLabel: 'Qualité soins',
    icon: 'medication',
    weight: 25,
    criteria: [
      {
        id: 'D3C1',
        num: 1,
        label: 'Identitovigilance',
        definition: 'Protocole d\'identification du patient à chaque étape du parcours de soins, bracelets d\'identification, vérification croisée.',
        type: 'Obligatoire',
        weight: 3,
        directive: 'Sécurité de l\'Identité du Patient',
        evidence: 'Procédure d\'identitovigilance formalisée, port systématique du bracelet d\'identification, audits de conformité de l\'identité.',
        details: 'Vérification active de l\'identité (nom, prénom, date de naissance) lors de tout acte thérapeutique ou diagnostique.'
      },
      {
        id: 'D3C2',
        num: 2,
        label: 'Hygiène et prévention des infections (CLIN)',
        definition: 'Comité de lutte contre les infections nosocomiales actif, plan d\'action annuel, taux d\'IRAS mesuré et inférieur aux seuils nationaux.',
        type: 'Obligatoire',
        weight: 4,
        directive: 'Prévention des Infections Associées aux Soins (IAS)',
        evidence: 'Décision de création du CLIN, rapport annuel d\'activité du CLIN, indicateurs de consommation des SHA, taux d\'IAS surveillés.',
        details: 'Mise en œuvre du programme annuel de maîtrise du risque infectieux et promotion des précautions standard.'
      },
      {
        id: 'D3C3',
        num: 3,
        label: 'Sécurité médicamenteuse',
        definition: 'Circuit du médicament sécurisé (prescription, dispensation, administration tracée), pharmacie clinique, gestion des stupéfiants conforme.',
        type: 'Obligatoire',
        weight: 4,
        directive: 'Management de la Prise en Charge Médicamenteuse',
        evidence: 'Procédure du circuit du médicament, armoires à pharmacie sécurisées par badge/clé, registre des stupéfiants conforme.',
        details: 'Sécurisation des étapes de prescription, préparation, délivrance et administration des produits de santé.'
      },
      {
        id: 'D3C4',
        num: 4,
        label: 'Sécurité chirurgicale',
        definition: 'Checklist chirurgicale OMS utilisée à 100%, protocole de comptage des compresses, vérification du site opératoire.',
        type: 'Obligatoire',
        weight: 3,
        directive: 'Sécurité des Actes Opératoires et Invasifs',
        evidence: 'Check-list sécurité du patient au bloc opératoire renseignée dans 100% des dossiers chirurgicaux, registre de comptage des compresses.',
        details: 'Temps d\'arrêt obligatoire ("Time-out") avant incision et contrôle systématique avant la sortie du bloc.'
      },
      {
        id: 'D3C5',
        num: 5,
        label: 'Gestion des événements indésirables graves (EIG)',
        definition: 'Système de déclaration des EIG opérationnel, analyse par méthode ALARM ou REMED, retours d\'expérience documentés.',
        type: 'Obligatoire',
        weight: 4,
        directive: 'Gestion des Événements Indésirables & Retours d\'Expérience',
        evidence: 'Fiches de déclaration d\'EIG, comptes-rendus d\'analyse approfondie des causes (ALARM/REMED), plan d\'actions correctives.',
        details: 'Culture non punitive de la déclaration visant l\'apprentissage collectif et l\'évitement des récidives.'
      },
      {
        id: 'D3C6',
        num: 6,
        label: 'Dossier patient',
        definition: 'Dossier patient unique, complet, daté, signé, archivé conformément à la réglementation algérienne (conservation 30 ans).',
        type: 'Obligatoire',
        weight: 3,
        directive: 'Tenue & Traçabilité du Dossier du Patient',
        evidence: 'Grille d\'évaluation de complétude du dossier patient, procédure d\'archivage réglementaire (conservation 30 ans), PVs d\'audit.',
        details: 'Le dossier contient l\'observation médicale initiale, les prescriptions, les compte-rendus opératoires et la lettre de liaison.'
      },
      {
        id: 'D3C7',
        num: 7,
        label: 'Pertinence des actes',
        definition: 'Protocoles de bon usage des examens complémentaires, antibiotiques et actes chirurgicaux, avec audit annuel de pertinence.',
        type: 'Recommandé',
        weight: 2,
        directive: 'Pertinence des Soins & Bon Usage',
        evidence: 'Protocoles thérapeutiques et diagnostiques validés, audits d\'évaluation des pratiques professionnelles (EPP) sur l\'antibiotérapie.',
        details: 'Recherche constante de la juste prescription d\'examens et de traitements dans le respect des recommandations scientifiques.'
      },
      {
        id: 'D3C8',
        num: 8,
        label: 'Transfusion et hémovigilance',
        definition: 'Procédure transfusionnelle conforme, traçabilité du don à la transfusion, comité d\'hémovigilance actif.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Sécurité Transfusionnelle & Hémovigilance',
        evidence: 'Fiches d\'effet indésirable receveur (FEIR), bordereaux de délivrance des PSL archivés, PVs du comité de sécurité transfusionnelle.',
        details: 'Traçabilité rigoureuse à 100% des produits sanguins labiles du centre de transfusion jusqu\'au receveur.'
      },
    ],
  },
  {
    id: 'D4',
    label: 'Ressources humaines et formation',
    shortLabel: 'RH & Formation',
    icon: 'groups',
    weight: 15,
    criteria: [
      {
        id: 'D4C1',
        num: 1,
        label: 'Adéquation effectifs/activité',
        definition: 'Ratio personnel soignant/lits conforme aux normes du MSPRH (ex. : 1 infirmier/6 lits en médecine), évalué annuellement.',
        type: 'Obligatoire',
        weight: 3,
        directive: 'Directive 2.2 / MSPRH — Adéquation des Effectifs',
        evidence: 'Tableau des effectifs physiques vs théoriques par service, ratios soignants/soignés calculés, bilan annuel RH.',
        details: 'Adéquation des ressources médicales et paramédicales à la charge de travail et aux exigences de sécurité des soins.'
      },
      {
        id: 'D4C2',
        num: 2,
        label: 'Formation continue',
        definition: 'Plan de formation annuel, budget dédié (>= 2% de la masse salariale), taux de réalisation >= 80%, traçabilité des formations suivies.',
        type: 'Obligatoire',
        weight: 3,
        directive: 'Développement des Compétences & Formation Continue',
        evidence: 'Plan de formation annuel approuvé par la DG, émargements des sessions de formation, bilan financier de réalisation (>= 2%).',
        details: 'Maintien et actualisation des compétences professionnelles face aux évolutions technologiques et réglementaires.'
      },
      {
        id: 'D4C3',
        num: 3,
        label: 'Évaluation du personnel',
        definition: 'Entretien annuel d\'évaluation systématique pour tout le personnel, avec objectifs et plan de développement individuel.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Évaluation Annuelle des Performances',
        evidence: 'Fiches d\'entretien annuel d\'évaluation signées, rapports synthétiques de performance individuel et collectif.',
        details: 'Dispositif équitable d\'appréciation des compétences et d\'accompagnement des parcours professionnels.'
      },
      {
        id: 'D4C4',
        num: 4,
        label: 'Gestion des gardes et astreintes',
        definition: 'Tableaux de gardes affichés, conformité aux durées légales de travail, registre des astreintes tenu à jour.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Permanence & Continuité des Soins',
        evidence: 'Tableaux de gardes médicales et paramédicales datés et signés, registres d\'appels des astreintes, fiches de repos compensateur.',
        details: 'Garantie de la présence des compétences requises 24h/24 et 7j/7 dans le respect du repos légal.'
      },
      {
        id: 'D4C5',
        num: 5,
        label: 'Santé et sécurité au travail',
        definition: 'Comité d\'hygiène et de sécurité au travail (CHSST) actif, suivi médical du personnel, plan de prévention des risques professionnels.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Prévention des Risques Professionnels & Santé au Travail',
        evidence: 'Procès-verbaux des réunions du CHSST, fiches d\'exposition aux risques, dossiers de médecine du travail (vaccinations à jour).',
        details: 'Protection de la santé physique et mentale des collaborateurs sur leurs lieux de travail.'
      },
      {
        id: 'D4C6',
        num: 6,
        label: 'Gestion prévisionnelle des emplois',
        definition: 'Plan de succession pour les postes clés, politique de recrutement formalisée, gestion des départs à la retraite anticipée.',
        type: 'Recommandé',
        weight: 1,
        directive: 'GPEC & Cartographie des Métiers',
        evidence: 'Référentiel des compétences de l\'établissement, plan de succession des fonctions stratégiques, procédures de recrutement.',
        details: 'Anticipation des départs et formalisation des compétences critiques indispensables à la continuité de service.'
      },
      {
        id: 'D4C7',
        num: 7,
        label: 'Bien-être au travail',
        definition: 'Enquête de satisfaction du personnel annuelle, programme de prévention des risques psychosociaux, médecine du travail active.',
        type: 'Recommandé',
        weight: 2,
        directive: 'Qualité de Vie et des Conditions de Travail (QVCT)',
        evidence: 'Rapport d\'analyse du climat social / enquête du personnel, plan d\'action contre les risques psychosociaux (RPS).',
        details: 'Démarche d\'amélioration continue de l\'environnement de travail favorisant l\'engagement des équipes.'
      },
    ],
  },
  {
    id: 'D5',
    label: 'Infrastructures et équipements',
    shortLabel: 'Infrastructures',
    icon: 'apartment',
    weight: 13,
    criteria: [
      {
        id: 'D5C1',
        num: 1,
        label: 'Conformité des locaux',
        definition: 'Locaux conformes aux normes architecturales et sanitaires algériennes (décret exécutif en vigueur), permis d\'occuper validé.',
        type: 'Obligatoire',
        weight: 3,
        directive: 'Directive 1.2 — Exigences Structurelles & Architecturale',
        evidence: 'Procès-verbal de la commission de sécurité administrative, permis d\'habiter/exploiter, plans de masse certifiés.',
        details: 'Conformité aux règles sanitaires, d\'hygiène et d\'accessibilité applicables aux établissements de santé.'
      },
      {
        id: 'D5C2',
        num: 2,
        label: 'Maintenance préventive',
        definition: 'Plan de maintenance préventive de tous les équipements critiques, registres de maintenance tenu à jour, GMAO recommandée.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Maintenance des Installations Techniques',
        evidence: 'Planning annuel de maintenance préventive, logiciel de GMAO ou registres d\'intervention technique signés.',
        details: 'Planification et réalisation systématique du contrôle des installations fluides, générateurs et traitement d\'air.'
      },
      {
        id: 'D5C3',
        num: 3,
        label: 'Équipements biomédicaux',
        definition: 'Inventaire des équipements biomédicaux, contrôle métrologique annuel, contrats de maintenance avec fournisseurs agréés.',
        type: 'Obligatoire',
        weight: 3,
        directive: 'Gestion Parcs Biomédicaux & Métrologie',
        evidence: 'Inventaire exhaustif des équipements biomédicaux, certificats de contrôle métrologique, contrats de maintenance avec agrément.',
        details: 'Garantie de la fiabilité, précision et sécurité d\'utilisation des dispositifs médicaux d\'exploration et de soin.'
      },
      {
        id: 'D5C4',
        num: 4,
        label: 'Gestion des déchets médicaux',
        definition: 'Filière de collecte, traitement et élimination des DASRI conforme au décret exécutif 03-478, traçabilité des bordereaux.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Gestion des Déchets d\'Activités de Soins (DASRI) — Décret 03-478',
        evidence: 'Bordereaux de suivi des déchets dangereux (BSD), convention avec un opérateur d\'incinération/broyage agréé, local DASRI conforme.',
        details: 'Tri à la source et élimination sécurisée des déchets infectieux et piquants/coupants sans risque environnemental.'
      },
      {
        id: 'D5C5',
        num: 5,
        label: 'Sécurité incendie',
        definition: 'Plan d\'évacuation affiché, exercices incendie annuels, système de détection et d\'extinction conforme, commissions de sécurité à jour.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Prévention du Risque Incendie & Évacuation',
        evidence: 'Registre de sécurité incendie à jour, PV de vérification quinquennale/annuelle des équipements d\'extinction, plans d\'évacuation.',
        details: 'Protection des personnes et des biens par la détection précoce, la formation du personnel et des moyens d\'extinction opérationnels.'
      },
      {
        id: 'D5C6',
        num: 6,
        label: 'Alimentation en eau et énergie',
        definition: 'Alimentation en eau potable contrôlée, générateurs de secours testés mensuellement, gaz médicaux sécurisés.',
        type: 'Obligatoire',
        weight: 1,
        directive: 'Continuité des Approvisonnements Critiques',
        evidence: 'Analyses bactériologiques de l\'eau, registres d\'essais en charge du groupe électrogène mensuel, fiches de contrôle des centrales à oxygène.',
        details: 'Autonomie minimale garantie en cas de rupture des réseaux publics d\'eau, d\'électricité et de fluides médicaux.'
      },
    ],
  },
  {
    id: 'D6',
    label: 'Système d\'information de santé (SIS)',
    shortLabel: 'Syst. Info.',
    icon: 'monitor_heart',
    weight: 10,
    criteria: [
      {
        id: 'D6C1',
        num: 1,
        label: 'Dossier patient informatisé (DPI)',
        definition: 'Dossier patient informatisé déployé dans les services cliniques, accessible à tous les professionnels habilités 24h/24.',
        type: 'Obligatoire',
        weight: 3,
        directive: 'Déploiement du Dossier Patient Informatisé',
        evidence: 'Licences du logiciel SIH/DPI, taux de déploiement par service, charte d\'accès utilisateur et traçabilité informatique.',
        details: 'Disponibilité immédiate des données médicales et soignantes pour une continuité des soins sans rupture.'
      },
      {
        id: 'D6C2',
        num: 2,
        label: 'Système de codification',
        definition: 'Codification des actes et diagnostics selon la CIM-10 (ou version en vigueur), taux de codification >= 90%.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Codification Médicale Nationale & CIM-10',
        evidence: 'Rapports d\'activité codés transmis au MSPRH, audits de qualité de la codification diagnostique et des actes.',
        details: 'Standardisation de la description de l\'activité médicale pour la gestion et le pilotage épidémiologique.'
      },
      {
        id: 'D6C3',
        num: 3,
        label: 'Sécurité et confidentialité des données',
        definition: 'Politique de sécurité du SI formalisée, sauvegardes journalières, gestion des accès et des habilitations tracée.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Sécurité des Systèmes d\'Information de Santé (PSSI)',
        evidence: 'Document de PSSI signé par le Directeur, journaux d\'évènements informatiques, PVs de test de restauration des sauvegardes.',
        details: 'Protection des serveurs et données de santé contre les attaques, pertes de données ou accès non autorisés.'
      },
      {
        id: 'D6C4',
        num: 4,
        label: 'Tableau de bord de pilotage',
        definition: 'Indicateurs clés de performance disponibles en temps réel pour la direction (DMS, taux d\'occupation, mortalité, EIG).',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Pilotage Stratégique Basé sur les Données',
        evidence: 'Captures/Rapports automatisés du système décisionnel de l\'établissement, comptes-rendus mensuels de la DG.',
        details: 'Outil d\'aide à la décision permettant une gouvernance réactive basée sur des indicateurs d\'activité certifiés.'
      },
      {
        id: 'D6C5',
        num: 5,
        label: 'Interopérabilité',
        definition: 'Échange de données avec le système national de santé (SNDS algérien), laboratoire, imagerie et pharmacie connectés.',
        type: 'Recommandé',
        weight: 1,
        directive: 'Interopérabilité & Échange de Données Médicales',
        evidence: 'Connecteurs d\'interface (HL7/DICOM), flux automatisés entre le SIH, le LIS (Laboratoire) et le PACS (Imagerie).',
        details: 'Raccordement des systèmes d\'information biomédicaux pour une transmission directe sans saisie manuelle.'
      },
    ],
  },
  {
    id: 'D7',
    label: 'Performance et amélioration continue',
    shortLabel: 'Performance',
    icon: 'verified',
    weight: 10,
    criteria: [
      {
        id: 'D7C1',
        num: 1,
        label: 'Indicateurs de résultats cliniques',
        definition: 'Suivi d\'au moins 10 indicateurs de résultats cliniques (mortalité, réadmissions, infections, durée de séjour) avec benchmarking.',
        type: 'Obligatoire',
        weight: 3,
        directive: 'Mesure de la Performance Clinique & Benchmarking',
        evidence: 'Fiches d\'indicateurs de résultats cliniques calculés, compte-rendu d\'analyse comparative par rapport aux standards nationaux.',
        details: 'Suivi méthodique de la qualité réelle des résultats de santé obtenus pour corriger les déviances.'
      },
      {
        id: 'D7C2',
        num: 2,
        label: 'Programme d\'audits internes',
        definition: 'Calendrier annuel d\'audits cliniques et organisationnels, au moins 4 audits/an, rapports et plans d\'action documentés.',
        type: 'Obligatoire',
        weight: 2,
        directive: 'Directive 8.1 — Amélioration Continue & Audit Interne',
        evidence: 'Procédure de gestion des audits internes, programme annuel d\'audits validé par la DG (>= 4 audits/an), rapports d\'audit rédigés par un personnel indépendant avec plans d\'action et ressources attribuées.',
        details: 'Réalisation d\'au moins 4 audits internes approfondis par an ciblant les activités médicales et organisationnelles critiques. Analyse des causes et attribution formalisée de ressources par la DG.'
      },
      {
        id: 'D7C3',
        num: 3,
        label: 'Revues de mortalité-morbidité (RMM)',
        definition: 'RMM mensuelles dans les services à haut risque (réanimation, chirurgie, maternité), PV et plans d\'action archivés.',
        type: 'Obligatoire',
        weight: 3,
        directive: 'Revues de Mortalité-Morbidité (RMM)',
        evidence: 'Comptes-rendus de RMM signés par les chefs de service, fiches d\'analyse de cas complexes, registre des mesures préventives.',
        details: 'Analyse collective et confraternelle des dossiers de décès ou de complications graves pour dégager des axes d\'amélioration.'
      },
      {
        id: 'D7C4',
        num: 4,
        label: 'Accréditation et certification externe',
        definition: 'Engagement dans une démarche de certification externe (nationale ou internationale), avec auto-évaluation triennale.',
        type: 'Recommandé',
        weight: 1,
        directive: 'Démarche d\'Accréditation Institutionnelle (INE)',
        evidence: 'Rapport d\'auto-évaluation transmis à l\'Instance Nationale d\'Évaluation, décisions de mise en conformité.',
        details: 'Valorisation de la qualité globale auprès des autorités de santé et des usagers par une reconnaissance officielle.'
      },
      {
        id: 'D7C5',
        num: 5,
        label: 'Innovation et recherche',
        definition: 'Participation à des protocoles de recherche clinique, convention avec CHU ou INSP, publications ou communications annuelles.',
        type: 'Recommandé',
        weight: 1,
        directive: 'Directive 8.2 — Promotion de l\'Innovation & Recherche Scientifique',
        evidence: 'Conventions de partenariat actives signées par la DG avec des centres de recherche/CHU, protocoles de recherche clinique validés, bilan annuel des publications ou communications scientifiques.',
        details: 'La direction générale programme la participation à des recherches épidémiologiques ou cliniques et publie le bilan scientifique annuel des équipes.'
      },
    ],
  },
];

export const GRADING = {
  A: { label: 'A', description: 'Entièrement satisfait', multiplier: 1.0, color: '#CBDCC9', textColor: '#2d5a27' },
  B: { label: 'B', description: 'Partiellement satisfait', multiplier: 0.5, color: '#D1E3F3', textColor: '#1a3a5c' },
  C: { label: 'C', description: 'Insuffisant', multiplier: 0.25, color: '#F3E5AB', textColor: '#6b4c00' },
  D: { label: 'D', description: 'Non satisfait', multiplier: 0.0, color: '#E9C0B9', textColor: '#7a2020' },
};

/**
 * Derive the A/B/C/D grade letter from a continuous 0-100 numeric score.
 */
export function getGradeFromScore(score) {
  if (score === null || score === undefined) return null;
  if (score >= 75) return 'A';
  if (score >= 50) return 'B';
  if (score >= 25) return 'C';
  return 'D';
}

/** Return the multiplier for a grade value that may be numeric (0-100) or a letter. */
function resolveMultiplier(grade) {
  if (grade === null || grade === undefined) return null;
  if (typeof grade === 'number') return grade / 100;
  return GRADING[grade]?.multiplier ?? null;
}

export const ACCREDITATION_LEVELS = [
  { label: 'Excellence', min: 90, max: 100, color: '#CBDCC9', textColor: '#2d5a27' },
  { label: 'Accrédité', min: 75, max: 89, color: '#D1E3F3', textColor: '#1a3a5c' },
  { label: 'Sous réserve', min: 50, max: 74, color: '#F3E5AB', textColor: '#6b4c00' },
  { label: 'Non accrédité', min: 0, max: 49, color: '#E9C0B9', textColor: '#7a2020' },
];

export const ESTABLISHMENTS = [
  { id: 'CHU-MUSTAPHA', name: 'CHU Mustapha Bacha', city: 'Alger', wilaya: 'Alger', type: 'CHU', beds: 1200, services: 28, code: 'DZ-16-001' },
  { id: 'CHU-CONSTANTINE', name: 'CHU Ibn Badis', city: 'Constantine', wilaya: 'Constantine', type: 'CHU', beds: 900, services: 22, code: 'DZ-25-001' },
  { id: 'CHU-ORAN', name: "CHU d'Oran", city: 'Oran', wilaya: 'Oran', type: 'CHU', beds: 850, services: 20, code: 'DZ-31-001' },
  { id: 'CHU-ANNABA', name: 'CHU Ibn Sina', city: 'Annaba', wilaya: 'Annaba', type: 'CHU', beds: 680, services: 16, code: 'DZ-23-001' },
  { id: 'CHU-TIZI-OUZOU', name: 'CHU Nedir Mohamed', city: 'Tizi Ouzou', wilaya: 'Tizi Ouzou', type: 'CHU', beds: 750, services: 18, code: 'DZ-15-001' },
  { id: 'CHU-BATNA', name: 'CHU Touhami Benflis', city: 'Batna', wilaya: 'Batna', type: 'CHU', beds: 600, services: 15, code: 'DZ-05-001' },
  { id: 'CHU-SIDI-BEL-ABBES', name: 'CHU Hassani Abdelkader', city: 'Sidi Bel Abbès', wilaya: 'Sidi Bel Abbès', type: 'CHU', beds: 550, services: 14, code: 'DZ-22-001' },
  { id: 'CHU-BEJAIA', name: 'CHU Khelil Amrane', city: 'Béjaïa', wilaya: 'Béjaïa', type: 'CHU', beds: 500, services: 12, code: 'DZ-06-001' },
  { id: 'CHU-BLIDA', name: 'CHU Frantz Fanon', city: 'Blida', wilaya: 'Blida', type: 'CHU', beds: 700, services: 17, code: 'DZ-09-001' },
  { id: 'CHU-TLEMCEN', name: 'CHU Tidjani Damerdji', city: 'Tlemcen', wilaya: 'Tlemcen', type: 'CHU', beds: 650, services: 16, code: 'DZ-13-001' },
  
  { id: 'EPH-AIN-TAYA', name: 'EPH Aïn Taya', city: 'Aïn Taya', wilaya: 'Alger', type: 'EPH', beds: 300, services: 8, code: 'DZ-16-012' },
  { id: 'EPH-SETIF', name: 'EPH Sétif', city: 'Sétif', wilaya: 'Sétif', type: 'EPH', beds: 450, services: 12, code: 'DZ-19-001' },
  { id: 'EPH-SKIKDA', name: 'EPH Abderrazak Bouhara', city: 'Skikda', wilaya: 'Skikda', type: 'EPH', beds: 350, services: 10, code: 'DZ-21-001' },
  { id: 'EPH-JIJEL', name: 'EPH Mohamed Seddik Benyahia', city: 'Jijel', wilaya: 'Jijel', type: 'EPH', beds: 320, services: 9, code: 'DZ-18-001' },
  { id: 'EPH-GUELMA', name: 'EPH Ibn Zohr', city: 'Guelma', wilaya: 'Guelma', type: 'EPH', beds: 280, services: 8, code: 'DZ-24-001' },
  { id: 'EPH-BORDJ-BOU-ARRERIDJ', name: 'EPH Lakhdar Bouzidi', city: 'Bordj Bou Arreridj', wilaya: 'Bordj Bou Arreridj', type: 'EPH', beds: 300, services: 9, code: 'DZ-34-001' },
  { id: 'EPH-M-SILA', name: 'EPH Zahraoui', city: 'M\'Sila', wilaya: 'M\'Sila', type: 'EPH', beds: 250, services: 7, code: 'DZ-28-001' },
  { id: 'EPH-DJELFA', name: 'EPH de Djelfa', city: 'Djelfa', wilaya: 'Djelfa', type: 'EPH', beds: 270, services: 8, code: 'DZ-17-001' },
  { id: 'EPH-TIARET', name: 'EPH Youssef Damerdji', city: 'Tiaret', wilaya: 'Tiaret', type: 'EPH', beds: 310, services: 9, code: 'DZ-14-001' },
  { id: 'EPH-SAIDA', name: 'EPH Ahmed Medeghri', city: 'Saïda', wilaya: 'Saïda', type: 'EPH', beds: 290, services: 8, code: 'DZ-20-001' },
  { id: 'EPH-MASCARA', name: 'EPH Meslem Tayeb', city: 'Mascara', wilaya: 'Mascara', type: 'EPH', beds: 330, services: 10, code: 'DZ-29-001' },
  { id: 'EPH-MOSTAGANEM', name: 'EPH Che Guevara', city: 'Mostaganem', wilaya: 'Mostaganem', type: 'EPH', beds: 340, services: 11, code: 'DZ-27-001' },
  { id: 'EPH-CHLEF', name: 'EPH Ouled Mohamed', city: 'Chlef', wilaya: 'Chlef', type: 'EPH', beds: 360, services: 10, code: 'DZ-02-001' },
  { id: 'EPH-MEDEA', name: 'EPH Mohamed Boudiaf', city: 'Médéa', wilaya: 'Médéa', type: 'EPH', beds: 300, services: 9, code: 'DZ-26-001' },
  { id: 'EPH-BOUIRA', name: 'EPH Mohamed Boudiaf', city: 'Bouira', wilaya: 'Bouira', type: 'EPH', beds: 280, services: 8, code: 'DZ-10-001' },
  { id: 'EPH-BOUMERDES', name: 'EPH Boumerdès', city: 'Boumerdès', wilaya: 'Boumerdès', type: 'EPH', beds: 250, services: 7, code: 'DZ-35-001' },
  { id: 'EPH-TIPAZA', name: 'EPH Tipaza', city: 'Tipaza', wilaya: 'Tipaza', type: 'EPH', beds: 240, services: 7, code: 'DZ-42-001' },
  { id: 'EPH-OUARGLA', name: 'EPH Mohamed Boudiaf', city: 'Ouargla', wilaya: 'Ouargla', type: 'EPH', beds: 400, services: 12, code: 'DZ-30-001' },
  { id: 'EPH-LAGHOUAT', name: 'EPH H\'mida Ben Adjila', city: 'Laghouat', wilaya: 'Laghouat', type: 'EPH', beds: 280, services: 8, code: 'DZ-03-001' },
  { id: 'EPH-GHARDAIA', name: 'EPH Tirichine Brahim', city: 'Ghardaïa', wilaya: 'Ghardaïa', type: 'EPH', beds: 250, services: 7, code: 'DZ-47-001' },
  { id: 'EPH-BECHAR', name: 'EPH Tourabi Boudjemaa', city: 'Béchar', wilaya: 'Béchar', type: 'EPH', beds: 300, services: 9, code: 'DZ-08-001' },
  { id: 'EPH-ADRAR', name: 'EPH Ibn Sina', city: 'Adrar', wilaya: 'Adrar', type: 'EPH', beds: 260, services: 8, code: 'DZ-01-001' },
  { id: 'EPH-TAMANRASSET', name: 'EPH Tamanrasset', city: 'Tamanrasset', wilaya: 'Tamanrasset', type: 'EPH', beds: 220, services: 7, code: 'DZ-11-001' },
  { id: 'EPH-ILLIZI', name: 'EPH Illizi', city: 'Illizi', wilaya: 'Illizi', type: 'EPH', beds: 150, services: 5, code: 'DZ-33-001' },
  { id: 'EPH-TINDOUF', name: 'EPH Tindouf', city: 'Tindouf', wilaya: 'Tindouf', type: 'EPH', beds: 180, services: 6, code: 'DZ-37-001' },
  { id: 'EPH-EL-OUED', name: 'EPH Ben Omar Djilani', city: 'El Oued', wilaya: 'El Oued', type: 'EPH', beds: 300, services: 9, code: 'DZ-39-001' },
  { id: 'EPH-BISKRA', name: 'EPH Bachir Bennacer', city: 'Biskra', wilaya: 'Biskra', type: 'EPH', beds: 350, services: 10, code: 'DZ-07-001' },
  { id: 'EPH-TEBESSA', name: 'EPH Bouguerra Benaouda', city: 'Tébessa', wilaya: 'Tébessa', type: 'EPH', beds: 320, services: 9, code: 'DZ-12-001' },
  { id: 'EPH-KHENCHELA', name: 'EPH Khenchela', city: 'Khenchela', wilaya: 'Khenchela', type: 'EPH', beds: 240, services: 7, code: 'DZ-40-001' },
  { id: 'EPH-OUM-EL-BOUAGHI', name: 'EPH Ibn Sina', city: 'Oum El Bouaghi', wilaya: 'Oum El Bouaghi', type: 'EPH', beds: 260, services: 8, code: 'DZ-04-001' },
  { id: 'EPH-SOUK-AHRAS', name: 'EPH Souk Ahras', city: 'Souk Ahras', wilaya: 'Souk Ahras', type: 'EPH', beds: 250, services: 7, code: 'DZ-41-001' },
  { id: 'EPH-MILA', name: 'EPH Mila', city: 'Mila', wilaya: 'Mila', type: 'EPH', beds: 230, services: 7, code: 'DZ-43-001' },

  { id: 'CLINIQUE-MAHMOUDI', name: 'Hôpital Mahmoudi', city: 'Tizi Ouzou', wilaya: 'Tizi Ouzou', type: 'Hôpital Privé', beds: 150, services: 12, code: 'DZ-15-P001' },
  { id: 'CLINIQUE-ATLAS', name: 'Clinique Atlas', city: 'Alger', wilaya: 'Alger', type: 'Clinique Privée', beds: 120, services: 6, code: 'DZ-16-P005' },
  { id: 'CLINIQUE-EL-AZHAR', name: 'Clinique El-Azhar', city: 'Blida', wilaya: 'Blida', type: 'Clinique Privée', beds: 80, services: 5, code: 'DZ-09-P002' },
  { id: 'CLINIQUE-DIAR-SAADA', name: 'Clinique Diar Saada', city: 'Alger', wilaya: 'Alger', type: 'Clinique Privée', beds: 90, services: 6, code: 'DZ-16-P008' },
  { id: 'CLINIQUE-CHAHRAZED', name: 'Clinique Chahrazed', city: 'Cheraga', wilaya: 'Alger', type: 'Clinique Privée', beds: 75, services: 5, code: 'DZ-16-P011' },
  { id: 'CLINIQUE-AL-AZHAR', name: 'Clinique Al-Azhar', city: 'Dely Ibrahim', wilaya: 'Alger', type: 'Clinique Privée', beds: 110, services: 8, code: 'DZ-16-P012' },
  { id: 'CLINIQUE-LES-ORANGERS', name: 'Clinique Les Orangers', city: 'Mascara', wilaya: 'Mascara', type: 'Clinique Privée', beds: 60, services: 4, code: 'DZ-29-P001' },
  { id: 'CLINIQUE-OASIS', name: 'Clinique Oasis', city: 'Ouargla', wilaya: 'Ouargla', type: 'Clinique Privée', beds: 50, services: 3, code: 'DZ-30-P002' },
];

export function computeScore(grades) {
  let totalScore = 0;
  DOMAINS.forEach(domain => {
    domain.criteria.forEach(criterion => {
      const grade = grades[criterion.id];
      const multiplier = resolveMultiplier(grade);
      if (multiplier !== null) {
        totalScore += criterion.weight * multiplier;
      }
    });
  });
  return Math.round(totalScore * 10) / 10;
}

export function computeDomainScore(domainId, grades) {
  const domain = DOMAINS.find(d => d.id === domainId);
  if (!domain) return { earned: 0, max: 0, percent: 0 };
  let earned = 0;
  domain.criteria.forEach(criterion => {
    const grade = grades[criterion.id];
    const multiplier = resolveMultiplier(grade);
    if (multiplier !== null) {
      earned += criterion.weight * multiplier;
    }
  });
  return {
    earned: Math.round(earned * 10) / 10,
    max: domain.weight,
    percent: Math.round((earned / domain.weight) * 100),
  };
}

export function getAccreditationLevel(score) {
  return ACCREDITATION_LEVELS.find(l => score >= l.min) || ACCREDITATION_LEVELS[3];
}

export const STORAGE_KEY = 'expertVisiteur_v1';

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}
