// utils/i18nVoices.js
// Utility to provide i18n-ready voices data for MayaVoiceTranslator

/**
 * Returns the voices array with all user-facing strings wrapped in t()
 * @param {function} t - translation function from useTranslation()
 */
export function getVoicesData(t) {
  return [
    {
      language: t('Maya Yucatèque'),
      flag: '🇲🇽',
      code: 'yua',
      samples: [
        { text: 'Bix a beel?', translation: t('Comment ça va ?') },
        { text: 'Yum bóotik', translation: t('Merci beaucoup') },
        { text: "Mixba'al", translation: t('Au revoir') }
      ]
    },
    {
      language: t('Quechua'),
      flag: '🇵🇪',
      code: 'qu',
      samples: [
        { text: 'Imaynalla kashkanki?', translation: t('Comment ça va ?') },
        { text: 'Añay', translation: t('Merci') },
        { text: 'Ripukusaq', translation: t('Au revoir') }
      ]
    },
    {
      language: t('Guarani'),
      flag: '🇵🇾',
      code: 'gn',
      samples: [
        { text: 'Mbaéichapa reiko?', translation: t('Comment ça va ?') },
        { text: 'Aguyjé', translation: t('Merci') },
        { text: 'Jajoecha peve', translation: t('Au revoir') }
      ]
    },
    {
      language: t('Nahuatl'),
      flag: '🇲🇽',
      code: 'nah',
      samples: [
        { text: 'Quen tinemi?', translation: t('Comment ça va ?') },
        { text: 'Tlazocamati', translation: t('Merci') },
        { text: 'Moztla', translation: t('À demain') }
      ]
    }
  ];
}
