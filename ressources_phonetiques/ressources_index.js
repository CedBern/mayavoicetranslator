// Index global des ressources phonétiques/articulatoires
// Ce fichier peut être importé dans n'importe quel module (analyse, UI, API...)
// Il référence toutes les ressources connues, même incomplètes, et peut être enrichi à chaque ajout

module.exports = [
  {
    name: "UltraSuite Doc",
    type: "documentation",
    path: "ressources_phonetiques/docs_institutionnelles/ultrasuite_github_io/",
    fiche: "ressources_phonetiques/docs_institutionnelles/ultrasuite_github_io/INTEGRATION.md",
    status: "complet",
    description: "Documentation officielle UltraSuite (guides, protocoles, publications)",
    usage: ["UI", "analyse", "doc", "onboarding"]
  },
  {
    name: "UltraSuite Corpus",
    type: "corpus",
    path: "ressources_phonetiques/bases_de_donnees/ultrasuite/",
    fiche: "ressources_phonetiques/bases_de_donnees/ultrasuite/INTEGRATION.md",
    status: "en cours",
    description: "Corpus articulatoire UltraSuite (données brutes, fichiers audio, annotations)",
    usage: ["analyse", "tests", "API"]
  },
  {
    name: "Principes pragmatiques du langage comme action",
    type: "synthese",
    path: "ressources_phonetiques/pragmatique_langage_action.md",
    fiche: "ressources_phonetiques/pragmatique_langage_action.md",
    status: "complet",
    description: "Synthèse structurée des 5 principes fondamentaux (Holtgraves et al.) et applications pédagogiques pour l’analyse, l’annotation, l’UX et l’API.",
    usage: ["analyse", "annotation", "UI", "API", "formation", "interopérabilité", "accessibilité"],
    standards: ["LEXINFO++", "ELAN", "xAPI"],
    keywords: ["pragmatique", "actes de langage", "interaction", "compétence", "annotation", "feedback", "UX"]
  },
  {
    name: "Éthique de l’IA (Floridi, 2023)",
    type: "synthese",
    path: "ressources_phonetiques/ethique_ia_floridi.md",
    fiche: "ressources_phonetiques/ethique_ia_floridi.md",
    status: "complet",
    description: "Résumé structuré des principes, enjeux et recommandations éthiques de l’IA selon Floridi. Applications pour la gouvernance, l’UX, l’API, l’audit, l’accessibilité, l’alignement ODD.",
    usage: ["gouvernance", "audit", "UX", "API", "accessibilité", "interopérabilité", "formation"],
    standards: ["xAI", "XAI", "LTI", "xAPI", "ODD"],
    keywords: ["éthique", "Floridi", "IA", "gouvernance", "audit", "justice", "explicabilité", "bienfaisance", "non-malfaisance", "autonomie"]
  },
  // Ajoutez ici d'autres ressources au fur et à mesure
];
