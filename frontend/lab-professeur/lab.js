// Navigation smooth scroll and accessibility
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  });
});

// Cercle d'amélioration communautaire (feedback)
const formAmelioration = document.getElementById('form-amelioration');
if (formAmelioration) {
  formAmelioration.onsubmit = function(e) {
    e.preventDefault();
    const txt = document.getElementById('amelioration-texte').value.trim();
    const feedback = document.getElementById('amelioration-feedback');
    if(txt.length < 5) {
      feedback.textContent = 'Merci de détailler davantage votre suggestion.';
      feedback.style.color = '#c62828';
      feedback.style.display = 'block';
      feedback.setAttribute('aria-live','polite');
      return;
    }
    feedback.textContent = 'Merci ! Votre proposition a été reçue et sera étudiée.';
    feedback.style.color = '#388e3c';
    feedback.style.display = 'block';
    feedback.setAttribute('aria-live','polite');
    document.getElementById('amelioration-texte').value = '';
    setTimeout(()=>{feedback.style.display='none';},2000);
  };
}


// --- Module d'annotation multimodale interactif ---
const annotationArea = document.getElementById('annotation-area');
const annotationContent = document.getElementById('annotation-content');
const annotationInstructions = document.getElementById('annotation-instructions');
const annotationFeedback = document.getElementById('annotation-feedback');
const annotationBadges = document.getElementById('annotation-badges');

const exemplesAnnotations = {
  texte: {
    item: 'Le jaguar est un animal sacré dans la culture maya.',
    question: 'Quelle est la fonction de ce texte ?',
    options: ['Description', 'Narration', 'Argumentation', 'Instruction'],
    correct: 0,
    badge: '📝'
  },
  audio: {
    item: 'audio-exemple.wav',
    question: 'Quel est le locuteur (genre) ?',
    options: ['Femme', 'Homme', 'Enfant', 'Inconnu'],
    correct: 1,
    badge: '🔊'
  },
  image: {
    item: 'maya-glyphe-exemple.png',
    question: 'Quel type de glyphe est illustré ?',
    options: ['Logogramme', 'Syllabaire', 'Numéral', 'Décoratif'],
    correct: 2,
    badge: '🖼️'
  },
  video: {
    item: 'maya-rituel-exemple.mp4',
    question: 'Quel rituel est représenté ?',
    options: ['Cérémonie du feu', 'Jeu de balle', 'Offrande', 'Danse'],
    correct: 0,
    badge: '🎬'
  }
};
let annotationScore = 0;
let annotationDone = { texte: false, audio: false, image: false, video: false };

function renderAnnotation(type) {
  annotationInstructions.textContent = 'Veuillez annoter l’élément ci-dessous selon les consignes.';
  let html = '';
  const ex = exemplesAnnotations[type];
  if(type === 'texte') {
    html += `<div style='background:#f3f6fa;padding:10px 8px;border-radius:8px;margin-bottom:8px;'>${ex.item}</div>`;
  } else if(type === 'audio') {
    html += `<audio controls src="../assets/audio/${ex.item}" style="margin-bottom:8px;"></audio>`;
  } else if(type === 'image') {
    html += `<img src="../assets/images/${ex.item}" alt="Exemple glyphe maya" style="max-width:180px;display:block;margin-bottom:8px;"/>`;
  } else if(type === 'video') {
    html += `<video controls src="../assets/video/${ex.item}" style="max-width:220px;display:block;margin-bottom:8px;"></video>`;
  }
  html += `<div style='margin-bottom:8px;font-weight:500;'>${ex.question}</div>`;
  ex.options.forEach((opt,i) => {
    html += `<button class='annot-btn' data-type='${type}' data-idx='${i}' style='margin:6px 8px 0 0;padding:7px 16px;font-size:1em;border-radius:7px;border:1.5px solid #43a047;background:#eaf1fb;color:#1976d2;cursor:pointer;transition:background 0.2s;'>${String.fromCharCode(97+i)}) ${opt}</button>`;
  });
  annotationContent.innerHTML = html;
  annotationFeedback.style.display = 'none';
  // Ajout listeners
  document.querySelectorAll('.annot-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute('data-idx'));
      const t = this.getAttribute('data-type');
      if(idx === exemplesAnnotations[t].correct) {
        annotationFeedback.textContent = '✔️ Bonne annotation !';
        annotationFeedback.style.color = '#43a047';
        annotationScore++;
        annotationDone[t] = true;
        showBadges();
      } else {
        annotationFeedback.textContent = '❌ Ce n’est pas la bonne réponse.';
        annotationFeedback.style.color = '#c62828';
      }
      annotationFeedback.style.display = 'block';
      annotationFeedback.setAttribute('aria-live','polite');
    };
    btn.onkeyup = function(e) { if(e.key==='Enter' || e.key===' ') this.click(); };
  });
}

function showBadges() {
  let html = '';
  Object.keys(annotationDone).forEach(type => {
    if(annotationDone[type]) {
      html += `<span style="display:inline-block;background:#43a047;color:#fff;padding:4px 10px;border-radius:8px;margin:2px 4px;font-weight:600;">${exemplesAnnotations[type].badge} ${type.charAt(0).toUpperCase()+type.slice(1)}</span>`;
    }
  });
  annotationBadges.innerHTML = html;
}

const btnAnnotTexte = document.getElementById('btn-annot-texte');
const btnAnnotAudio = document.getElementById('btn-annot-audio');
const btnAnnotImage = document.getElementById('btn-annot-image');
const btnAnnotVideo = document.getElementById('btn-annot-video');
if(btnAnnotTexte) btnAnnotTexte.onclick = () => renderAnnotation('texte');
if(btnAnnotAudio) btnAnnotAudio.onclick = () => renderAnnotation('audio');
if(btnAnnotImage) btnAnnotImage.onclick = () => renderAnnotation('image');
if(btnAnnotVideo) btnAnnotVideo.onclick = () => renderAnnotation('video');
