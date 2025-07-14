const { adaptTextForTTS } = require('./phoneticAdaptation');

describe('adaptTextForTTS', () => {
  it('adapte correctement le texte pour le maya yucatèque', () => {
    const adaptations = {
      "'": ' ',
      'x': 'sh',
      'j': 'h',
      'aa': 'a:',
      'ee': 'e:',
      'ii': 'i:',
      'oo': 'o:',
      'uu': 'u:'
    };
    expect(adaptTextForTTS("Bix a beel?", adaptations)).toBe("Bish a be:l?");
    expect(adaptTextForTTS("kaaj", adaptations)).toBe("ka:h");
    expect(adaptTextForTTS("xii", adaptations)).toBe("shi:");
  });

  it('adapte correctement le texte pour le quechua', () => {
    const adaptations = {
      'q': 'k',
      'ñ': 'ny',
      'ch': 'tch',
      'sh': 'ch',
      'y': 'j'
    };
    expect(adaptTextForTTS("chay", adaptations)).toBe("tchaj");
    expect(adaptTextForTTS("ñuqanchik", adaptations)).toBe("njukantchik");
  });

  it('retourne le texte inchangé si aucune adaptation', () => {
    expect(adaptTextForTTS("Test", {})).toBe("Test");
  });
});
