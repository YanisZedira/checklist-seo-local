// Construit README.md et docs/index.html à partir d'une seule liste : node build.mjs
import { writeFileSync } from 'node:fs';

const GROUPS = [
  ['Fiche Google Business Profile', 'La fiche décide de votre présence sur Google Maps. Elle compte plus que le site pour une recherche du type « plombier près de moi ».', [
    ['La fiche est revendiquée et validée', 'Sans validation, vous ne pouvez ni répondre aux avis ni corriger une information fausse.'],
    ['Le nom est celui de l’enseigne, sans mot-clé ajouté', 'Ajouter « pas cher » ou une ville dans le nom est une cause fréquente de suspension.'],
    ['La catégorie principale décrit votre métier exact', 'C’est le critère le plus lourd de la fiche. « Plombier » plutôt que « Entrepreneur ».'],
    ['Deux à quatre catégories secondaires sont ajoutées', 'Elles ouvrent des recherches voisines sans brouiller la principale.'],
    ['Adresse ou zone desservie, jamais les deux à tort', 'Un artisan qui se déplace masque son adresse et déclare ses communes.'],
    ['Les horaires sont exacts, jours fériés compris', 'Un client qui trouve porte close laisse un avis à une étoile.'],
    ['Le téléphone est un numéro local qui décroche', 'Le même numéro partout : fiche, site, annuaires.'],
    ['Le lien mène à la bonne page du site', 'Vers la page de la ville ou du service, pas toujours vers l’accueil.'],
    ['Les services sont listés avec une description', 'Chaque service est une occasion d’apparaître sur une recherche précise.'],
    ['Dix photos réelles au minimum, renouvelées', 'Devanture, équipe, réalisations. Pas de banque d’images.'],
  ]],
  ['Avis clients', 'Le nombre, la note et la fraîcheur des avis pèsent sur le classement et sur le clic.', [
    ['Un lien direct « laisser un avis » est prêt à envoyer', 'Il se copie depuis la fiche. Par SMS le jour où le client est content.'],
    ['Chaque client est sollicité, sans tri', 'Demander seulement aux clients satisfaits est contraire aux règles de Google.'],
    ['Aucun avis n’est acheté ni échangé contre une remise', 'Google les retire et peut suspendre la fiche.'],
    ['Tous les avis reçoivent une réponse sous une semaine', 'Les avis négatifs d’abord, avec des faits et sans polémique.'],
    ['Un QR code d’avis est affiché en caisse ou sur les factures', 'Le moyen le plus simple d’obtenir des avis réguliers.'],
    ['Deux à quatre nouveaux avis arrivent chaque mois', 'Une fiche sans avis récent recule.'],
  ]],
  ['Site internet', 'Le site confirme à Google ce que dit la fiche, et transforme le visiteur en appel.', [
    ['Nom, adresse et téléphone identiques à la fiche, dans le pied de page', 'Au caractère près. Les écarts sèment le doute.'],
    ['Une page par service important', 'Une page « Dépannage chauffe-eau » se classe mieux qu’une ligne dans une liste.'],
    ['Une page par ville réellement desservie, avec un contenu propre', 'Pas de pages clonées où seul le nom de la ville change.'],
    ['Le titre de chaque page contient le service et la ville', 'Moins de 60 caractères, lisible par un humain.'],
    ['Une description unique par page, avec une raison de cliquer', 'Prix de départ, délai, note Google.'],
    ['Le téléphone est cliquable en haut de chaque page', 'Sur mobile, c’est le premier bouton utilisé.'],
    ['Le site s’affiche en moins de 2,5 secondes sur téléphone', 'Mesure à faire avec PageSpeed Insights, onglet mobile.'],
    ['Le site est en HTTPS, sans page en erreur', 'Search Console, rapport « Pages ».'],
    ['Une carte ou un itinéraire figure sur la page contact', 'Utile au visiteur, cohérent avec la fiche.'],
  ]],
  ['Données structurées', 'Elles disent aux moteurs, sans ambiguïté, qui vous êtes et où vous travaillez.', [
    ['Un bloc LocalBusiness (ou un type plus précis) est présent', 'Plumber, Dentist, Restaurant... avec nom, adresse, téléphone, horaires.'],
    ['Les zones desservies sont déclarées avec areaServed', 'Indispensable pour une entreprise qui se déplace.'],
    ['Les questions fréquentes sont balisées en FAQPage', 'Seulement si les questions sont visibles sur la page.'],
    ['Le fil d’Ariane est balisé en BreadcrumbList', 'Il remplace l’URL brute dans le résultat.'],
    ['Le test des résultats enrichis de Google ne signale aucune erreur', 'À refaire après chaque refonte.'],
    ['Aucune note d’avis auto-attribuée n’est balisée', 'Google ignore les étoiles qu’une entreprise s’attribue sur son propre site.'],
  ]],
  ['Citations et liens locaux', 'Une citation est une mention de vos coordonnées sur un autre site. Leur cohérence compte autant que leur nombre.', [
    ['Bing Places et Apple Plans sont renseignés', 'Apple Plans alimente Siri et les iPhone.'],
    ['Pages Jaunes et les annuaires du métier sont à jour', 'Un seul annuaire sérieux vaut mieux que vingt fermes à liens.'],
    ['Les anciennes adresses et anciens numéros sont corrigés', 'Cherchez votre ancien numéro entre guillemets dans Google.'],
    ['La mairie, la CCI ou l’association de commerçants vous citent', 'Des liens locaux, difficiles à imiter.'],
    ['Vos partenaires et fournisseurs ont un lien vers votre site', 'Demandez-le : la plupart acceptent.'],
  ]],
  ['Mesure et suivi', 'Sans mesure, on optimise au hasard.', [
    ['La Search Console est ouverte et le sitemap envoyé', 'C’est la seule source fiable pour vos positions.'],
    ['Les appels et les formulaires sont comptés', 'Un clic sur le téléphone est une conversion à suivre.'],
    ['Les statistiques de la fiche sont relevées chaque mois', 'Appels, itinéraires, clics vers le site.'],
    ['Cinq requêtes cibles sont suivies, par ville', 'Position et clics, une fois par mois, dans un tableau.'],
  ]],
];

const total = GROUPS.reduce((n, g) => n + g[2].length, 0);
const SITE = 'https://yz-automation.fr';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// README
let md = `# Checklist SEO local\n\n${total} points à vérifier pour qu'une entreprise locale soit trouvée sur Google et sur Google Maps. Écrite pour des dirigeants de TPE, pas pour des référenceurs.\n\n**Version interactive, avec cases à cocher et progression : [yaniszedira.github.io/checklist-seo-local](https://yaniszedira.github.io/checklist-seo-local/)**\n\nVous pouvez aussi copier cette page dans un ticket GitHub : les cases restent cochables.\n`;
GROUPS.forEach(([title, intro, items], i) => {
  md += `\n## ${i + 1}. ${title}\n\n${intro}\n\n`;
  items.forEach(([label, why]) => { md += `- [ ] **${label}.** ${why}\n`; });
});
md += `\n## Par où commencer\n\nSi vous n'avez qu'une heure : la catégorie principale de la fiche, les horaires, dix photos, puis un message à vos dix derniers clients pour demander un avis. Ces quatre actions pèsent plus que tout le reste réuni.\n\n## Pour aller plus loin\n\n- [Référencement local : méthode et tarifs](${SITE}/seo-technique-local), la page de service de YZ Automation.\n- [Fiche Google suspendue : causes et réactivation](${SITE}/ressources/blog/fiche-google-suspendue).\n- [Répondre aux avis Google : modèles de réponses](${SITE}/ressources/blog/repondre-avis-google-modeles).\n- [llms-txt-generator](https://github.com/YanisZedira/llms-txt-generator) : générer un fichier llms.txt à partir d'un sitemap.\n- [Calculateur du temps perdu](https://github.com/YanisZedira/calculateur-temps-perdu) : chiffrer ce que coûtent les tâches répétitives.\n\n## Réutilisation\n\nLicence MIT. Vous pouvez reprendre la liste, la traduire ou l'adapter à un métier. La liste et la page sont produites par \`node build.mjs\` à partir d'un seul tableau : modifiez-le, puis proposez une demande de fusion.\n\nÉcrite par Yanis Zedira, fondateur de [YZ Automation](${SITE}).\n`;
writeFileSync('README.md', md, 'utf8');

// Page interactive
let n = 0;
const sections = GROUPS.map(([title, intro, items], i) => `
  <section>
    <h2>${i + 1}. ${esc(title)}</h2>
    <p class="intro">${esc(intro)}</p>
    <ul>${items.map(([label, why]) => `
      <li><label><input type="checkbox" data-k="c${n++}"><span><strong>${esc(label)}.</strong> ${esc(why)}</span></label></li>`).join('')}
    </ul>
  </section>`).join('');

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Checklist SEO local : ${total} points à vérifier</title>
<meta name="description" content="Checklist SEO local interactive : ${total} points pour la fiche Google, les avis, le site, les données structurées et les citations d'une entreprise locale.">
<link rel="canonical" href="https://yaniszedira.github.io/checklist-seo-local/">
<style>
:root{--bg:#f6f8fc;--card:#fff;--ink:#0b1120;--muted:#55607a;--line:#dfe5f0;--accent:#1d4ed8;--ok:#0f7b4f}
@media (prefers-color-scheme:dark){:root{--bg:#0b1120;--card:#121a2e;--ink:#eef2fb;--muted:#a3aec6;--line:#243049;--accent:#7aa5ff;--ok:#4ad295}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif}
main{max-width:760px;margin:0 auto;padding:32px 16px 64px}
h1{font-size:clamp(1.7rem,5vw,2.4rem);line-height:1.15;margin:0 0 12px}
h2{font-size:1.25rem;margin:0 0 6px}
p{margin:0 0 14px}
.lead,.intro{color:var(--muted)}
.bar{position:sticky;top:0;background:var(--bg);padding:12px 0;z-index:2;border-bottom:1px solid var(--line);margin-bottom:20px}
.bar div{display:flex;justify-content:space-between;gap:12px;align-items:center;font-weight:600;margin-bottom:8px}
progress{width:100%;height:10px;accent-color:var(--ok)}
button{font:inherit;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:8px;padding:6px 12px;cursor:pointer}
section{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px;margin-bottom:16px}
ul{list-style:none;margin:0;padding:0}
li+li{border-top:1px solid var(--line)}
label{display:flex;gap:12px;padding:12px 0;cursor:pointer;align-items:flex-start}
input{width:20px;height:20px;margin-top:3px;flex:none;accent-color:var(--ok)}
input:checked+span{color:var(--muted);text-decoration:line-through}
a{color:var(--accent)}
footer{color:var(--muted);font-size:.95rem;margin-top:28px}
@media print{.bar button{display:none}.bar{position:static}}
</style>
</head>
<body>
<main>
  <h1>Checklist SEO local</h1>
  <p class="lead">${total} points à vérifier pour qu'une entreprise locale soit trouvée sur Google et sur Google Maps. Vos coches sont gardées dans ce navigateur, rien n'est envoyé.</p>
  <div class="bar">
    <div><span id="count">0 sur ${total}</span><button type="button" id="reset">Tout décocher</button></div>
    <progress id="progress" max="${total}" value="0"></progress>
  </div>${sections}
  <section>
    <h2>Par où commencer</h2>
    <p>Si vous n'avez qu'une heure : la catégorie principale de la fiche, les horaires, dix photos, puis un message à vos dix derniers clients pour demander un avis. Ces quatre actions pèsent plus que tout le reste réuni.</p>
    <p>Pour la méthode complète, voir le <a href="${SITE}/seo-technique-local">référencement local chez YZ Automation</a>, ou les guides <a href="${SITE}/ressources/blog/fiche-google-suspendue">fiche Google suspendue</a> et <a href="${SITE}/ressources/blog/repondre-avis-google-modeles">répondre aux avis Google</a>.</p>
  </section>
  <footer>
    <p>Checklist libre (licence MIT), <a href="https://github.com/YanisZedira/checklist-seo-local">source sur GitHub</a>. Écrite par Yanis Zedira, fondateur de <a href="${SITE}">YZ Automation</a>.</p>
    <p>Autres outils : <a href="https://yaniszedira.github.io/calculateur-temps-perdu/">calculateur du temps perdu</a>, <a href="https://github.com/YanisZedira/llms-txt-generator">générateur de llms.txt</a>.</p>
  </footer>
</main>
<script>
(function () {
  var KEY = 'checklist-seo-local-v1', boxes = document.querySelectorAll('input[data-k]'), state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { state = {}; }
  function render() {
    var done = 0;
    boxes.forEach(function (b) { b.checked = !!state[b.dataset.k]; if (b.checked) done++; });
    document.getElementById('count').textContent = done + ' sur ' + boxes.length;
    document.getElementById('progress').value = done;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  boxes.forEach(function (b) { b.addEventListener('change', function () { state[b.dataset.k] = b.checked; save(); render(); }); });
  document.getElementById('reset').addEventListener('click', function () { state = {}; save(); render(); });
  render();
})();
</script>
</body>
</html>
`;
writeFileSync('docs/index.html', html, 'utf8');
console.log(total, 'points');
