// One-off data extraction script: reads the WORLDS data (hardcoded below,
// transcribed verbatim from the legacy index.html Component.DATA object) and
// writes clean per-world, per-entity-type JSON files under data/worlds/.
//
// Run with: node scripts/extract-data.js
'use strict';
const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/imageManifest.json'), 'utf8'));

function slugify(s) {
  return String(s == null ? '' : s)
    .replace(/[‘’']/g, '')
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const SLUG_ALIAS = { 'tamasa-andhakara': 'tamas-andhakara' };

function expandUrl(v) {
  const i = v.indexOf('|');
  if (i < 0) return v;
  const p = manifest._p && manifest._p[v.slice(0, i)];
  return p ? p + v.slice(i + 1) : v;
}

// Mirrors index.html's imgFor(): tries each category prefix in order against
// the slugified name (plus a known alias), returns the manifest key + URL of
// the first hit, or empty strings if nothing resolves.
function imgFor(name, prefixes) {
  const s = slugify(name);
  const alt = SLUG_ALIAS[s];
  for (const p of prefixes) {
    const key = p + '-' + s;
    const e = manifest[key] || (alt ? manifest[p + '-' + alt] : undefined);
    const foundKey = manifest[key] ? key : (alt ? p + '-' + alt : null);
    if (e && typeof e === 'object') {
      const url = e.url ? expandUrl(e.url) : (e.thumb ? expandUrl(e.thumb) : '');
      const thumb = e.thumb ? expandUrl(e.thumb) : url;
      return { imageKey: foundKey || '', url, thumb };
    }
  }
  return { imageKey: '', url: '', thumb: '' };
}

// ---------------------------------------------------------------------------
// Source data, transcribed verbatim from index.html Component.DATA (lines
// ~1318-1555 of the original file). Keys renamed per the rebuild decisions:
// "liminal" -> "border" world key (kept as source key here, remapped below).
// ---------------------------------------------------------------------------
const WORLDS = {
  warm: {
    meta: {
      bg: 'linear-gradient(180deg,#160b06,#241007)', accent: '#ffb347', ink: '#f4e8d4',
      sub: 'rgba(232,214,188,.7)', border: 'rgba(255,179,71,.4)', glow: 'rgba(255,78,46,.45)',
      cardBg: 'rgba(30,14,6,.75)', num: 'rgba(255,179,71,.12)', faint: 'rgba(255,179,71,.45)',
      title: '#ff4e2e', kicker: "THE WARM WORLD · RUDRAKSHI’S PATH", name: 'WELCOME TO NEELAVALLEY.',
      tag: 'THE WARM GLOW OF THE VALLEY IS RISING AND SHINING ITS LIGHT ON YOU.',
      cur: '₸ 108.00 TRIKAAL · beads accepted at every door', crumbBase: 'NEELAVALLEY',
      techTitle: 'TECH, WEAPONS & VESSELS', citiesTitle: 'THE WARM CITIES', citiesCrumb: 'CITIES & CORPORATIONS',
      charsTitle: 'THE WARM CAST', cxOrgHead: 'CORPORATIONS', worldName: 'Rudrakshi', displayName: 'The Warm World'
    },
    cities: [
      { n: 'Neelavalley', t: 'CAPITAL', type: 'The blue-throated valley', d: 'Seat of Aksha Academy. The valley floor glows a permanent Neelakantha blue — contained poison, held safely. Warm light pools in every doorway.' },
      { n: 'Trispire', t: 'INTERIOR', type: 'Devotion & broadcast', d: 'Three spires — past, present, future. Agnivaak broadcasts from the tallest; the whole warm world speaks from here.' },
      { n: 'Sandhivane', t: 'BORDER-EDGE', type: 'The place of meeting', d: 'Junction-town where warm lanes braid before the border. Loosest rules, warmest bars. First contact usually happens here.' },
      { n: 'Bhaswick', t: 'INTERIOR', type: 'Ash-town', d: 'Built over old burn-grounds — foundries, forge-vendors, ash-shrines. Proud, scarred, and defensive of its stolen myth.' },
      { n: 'Kanthreach', t: 'BORDER-EDGE', type: 'The containment coast', d: 'Where contained trauma is stored and studied. The deepest vaults, the most disciplined healers. If containment fails, it fails here first.' },
      { n: 'Vedavale', t: 'INTERIOR', type: 'The archive city', d: 'Terraced libraries and mantra-archives. Whoever controls Vedavale controls the source-code.' }
    ],
    principal: { n: 'RUDRAKSHI', r: 'FOUNDER · AKSHA ACADEMY', d: 'Boarding a train at Neelavalley, the weight of trauma around broke her completely — she collapsed, and didn’t move for hours. What came after wasn’t recovery. It was a calling: visions, symbols, a framework older than her understanding of herself, surfacing not as myth but as mechanism.', kit: 'TRISHULA · TRIKALA DRISHTI · RUDRAKSHA MALA · DAMRU' },
    cast: [
      { n: 'Viravane', r: 'FIELD-GUARDIAN', d: 'A soldier un-made from his wrath and rebuilt around compassion. Living proof of the framework’s promise.', kit: 'A reclaimed Trishulvane trident-tool; close-guard combat; the ability to physically hold a space stable while Rudrakshi runs a scan inside it.' },
      { n: 'Agnivaak', r: 'THE VOICE', d: 'Fire-speech. The warm world’s morale, news, and counter-propaganda all move on this frequency.', kit: 'Damru-based sound-tech that carries ETH-attuned frequencies across a whole city; the ability to steady a crowd’s collective grief through sound alone.' },
      { n: 'Tapashanth', r: 'STILL ENGINEER', d: 'Keeper of the oldest ETH cores. Reached total containment decades ago — and chose to maintain rather than heal.', kit: 'Mastery of the Kailasa Samhita meditative operating system; hand-built ETH cores; the still-point discipline that lets a healer hold without leaking.' },
      { n: 'Chandrahollis', r: 'DREAM-WALKER', d: 'Reads what could be. Has seen your worst future before you’ve lived it — invaluable, and slightly feared.', kit: 'Moon-attuned navigation through the Chandravault; the ability to walk a target’s possible futures before the scan begins; soma-linked dream-work.' },
      { n: 'Sharavinka', r: 'THE PRODIGY', d: 'The first fully Academy-raised pure soul. The gift without the wound; the sight without the scar.', kit: 'Natural three-ring sight from childhood; the fastest scan in the Academy; untested containment — she has never yet had to hold real poison.' },
      { n: 'Ziaraka', r: 'THE CROSSING', d: 'No powers — languages, contacts, safe-routes, and trust on both sides of the seam.', kit: 'No powers to speak of — pure human craft: languages, contacts, safe-routes, and the trust of people on both sides. Knows Antaryana better than anyone.' }
    ],
    informants: [
      { n: 'TIKKAKNUCKLE', d: 'Twitchy street runner; knows every warm back-lane and every debt owed on it.', kit: 'Every warm-world back-lane committed to memory, and a running ledger of who owes what on each of them.' },
      { n: 'BHAVSTATIC', d: 'Half-broken empath; reads the emotional static of a crowd. Useful and unstable.', kit: 'Reads the emotional static of a crowd and calls a mood before it turns — unreliable at range, worse under pressure.' },
      { n: 'BHAIRAVILOOM', d: 'Deals in the fiercer rumours — the ones that touch the border and Bhairava’s edge.', kit: 'A rumour-network reaching the border and Bhairava’s edge; carries the fiercer intel nobody else will touch.' }
    ],
    cxOrgs: [
      { n: 'Aksha Academy', s: 'HEALING / TRAINING', d: 'Part school, part hospital, part order — where pure souls learn to run the seven-stage ETH protocol ethically.' },
      { n: 'Rudra’s Pulse', s: 'BROADCAST', d: 'Agnivaak’s signal collective out of Trispire — the healing-frequency network and counter-propaganda voice.' },
      { n: 'The Tejopath Circle', s: 'ELITE ORDER', d: 'The warm world’s most radiant healers. Advisory, prestigious, quietly political. Keepers of the Tejomaya standards.' },
      { n: 'Kailasveil Market', s: 'MARKET', d: 'The tiered bazaar under Kailasgard’s shadow — beads, scanner parts, and mala-thread traded in the same breath.' },
      { n: 'Trinetra Nights', s: 'NIGHTLIFE', d: 'The valley’s late venue. Drums until the third eye opens, and a house rule that no one gets read without consent.' },
      { n: 'Shiva Seeds Backpackers', s: 'HOSTEL', d: 'Cheap bunks for pilgrims, drifters, and the newly awakened. Half the warm world’s first night is spent here.' },
      { n: 'Neelavale Shackbar', s: 'BAR', d: 'Driftwood bar on the containment coast — healers off shift, dock crews on, and the loudest arguments in Neelavalley.' },
      { n: 'Ganga’s Eve Corner', s: 'CHAI CORNER', d: 'A chai-and-coffee corner that stays open past everything else. Where the day gets set down before anyone walks home.' }
    ],
    cxTech: [
      { n: 'ETH SCANNER', d: 'Reads a wound across the three times; drives the three-ring gauge. Every heal begins here.' },
      { n: 'TEJOMAYA CIRCUIT', d: 'The radiant circuitry inside the scanner — the glow that carries the scan.' },
      { n: 'NECTMOHEIM', d: 'Stronghold sonic defence — drum-pulse tech scaled up to shield Kailasgard.' },
      { n: 'CHANDRAVAULT', d: 'Moon-attuned data-and-dream vault near Kanthreach; where possible futures are navigated.' },
      { n: 'PROJECT NECTSIPHON', d: 'The most guarded programme: permanent containment without suppression — the true nectar.' },
      { n: 'KSHEERDHARANE', d: 'The milk-stream healing elixir. Restorative, never suppressive.' }
    ],
    cxInfra: [
      { n: 'Kailasgard', f: 'The keep — Nectmoheim is mounted here' },
      { n: 'Nadiyana Docks', f: 'River-and-sea dockyard at Kanthreach' },
      { n: 'Khagavane Skyport', f: 'Skyport — that which moves through the sky' },
      { n: 'Trispiria Central', f: 'Central transit beneath the three spires' }
    ],
    cxTransit: [
      { n: 'Nandi’s Path', f: 'The primary sacred road' },
      { n: 'Rudra’s Wingline', f: 'Warm-world air line' },
      { n: 'Neelkanth Ferry-Flux', f: 'Containment-coast ferry to the border' },
      { n: 'Garuda Rickshaws', f: 'Street-level fast transport' },
      { n: 'Trikaal Cabs', f: 'Metered cabs, priced in Trikaal' },
      { n: 'Damruwick Depot', f: 'Ground depot — drum-named' }
    ],
    cxCurrency: [
      { n: '₸ TRIKAAL', d: 'Formal mainland currency — value across past, present, and future.' },
      { n: '“BEADS”', d: 'Street money, tied to the mala. Hand-to-hand, trusted — value that has passed through compassion.' }
    ],
    cxSlang: [
      { n: 'BEADED', d: 'Healed or marked by her mala; touched by a completed release.' },
      { n: 'PINGED', d: 'Detected by the Damru signal; on a healer’s radar.' },
      { n: 'RIPE', d: 'Ready to release; a wound at Stage 6. “Let it go, it’s ripe.”' },
      { n: 'THIRD-EYED', d: 'Seen straight through — read past-present-future, wanted or not.' },
      { n: 'BURNED CLEAN', d: 'Passed Stage 4; the false story burned off. A compliment.' },
      { n: 'DRISHTVANE', d: 'Formal-register slang for someone newly awakened — sight just opened.' }
    ]
  },
  cold: {
    meta: {
      bg: 'linear-gradient(180deg,#08080f,#101433)', accent: '#9fd7ff', ink: '#e2ecf6',
      sub: 'rgba(190,208,228,.65)', border: 'rgba(159,215,255,.35)', glow: 'rgba(159,215,255,.4)',
      cardBg: 'rgba(8,10,24,.75)', num: 'rgba(159,215,255,.1)', faint: 'rgba(159,215,255,.45)',
      title: '#9fd7ff', kicker: "THE COLD WORLD · TAMASA’S DOMAIN", name: 'TAMASA’S DOMAIN',
      tag: 'You have been measured and found admissible. Do not raise your voice. Do not hurry.',
      cur: '◇ 108 SHUNYACRED · balance withheld pending review', crumbBase: 'STHAVANTUM',
      techTitle: 'TECH, WEAPONS & VESSELS', citiesTitle: 'THE COLD CITIES', citiesCrumb: 'CITIES & CORPORATIONS',
      charsTitle: 'THE COLD CAST', cxOrgHead: 'ORDERS & SYSTEMS', worldName: 'Tamasa', displayName: 'The Cold World'
    },
    cities: [
      { n: 'Sthavantum', t: 'CAPITAL', type: 'Capital of stillness', d: 'Seat of Sthiti Nexus. Perfectly maintained; nothing is allowed to change. The streets are clean because nothing lives on them.' },
      { n: 'Pralastrata', t: 'ARCHIVE', type: 'The layered strata', d: 'Descending layers, each colder and more restricted. Where the cold world files what it wants dissolved.' },
      { n: 'Kaalnex', t: 'CONTROL', type: 'The clock-city', d: 'Time managed like a utility. Being late is a citable offence. The transit spine of the entire cold world.' },
      { n: 'Andhagrid', t: 'CONTROL', type: 'The blind grid', d: 'Tamasa’s private district — sensors that see everything while showing nothing. Her origin is buried somewhere in it.' },
      { n: 'Bhairacrux', t: 'ENFORCEMENT', type: 'The fierce cross', d: 'The cold world’s fist. The only cold city with heat in its palette — the ember-red of alarm, not warmth.' },
      { n: 'Sahasragard', t: 'ARCHIVE', type: 'The thousand-keep', d: 'A thousand vaults holding every stilled one, every case, every name. One vault, opened, exposes the Raktabija numbers.' }
    ],
    principal: { n: 'TAMASA ANDHAKARA', r: 'FOUNDER · STHITI NEXUS', d: 'The healer who could not bear the burn. A student of the protocol who refused Stage 4 and built a civilisation on the promise that nothing will ever be destroyed, changed, or felt again. She calls it mercy.', kit: 'STHITI BANDHAN · TRIKAALVALEX · THE NISHCHAL ORDER' },
    cast: [
      { n: 'Meralaine', r: 'STILLNESS ARCHITECT', d: 'The true believer. Where Tamasa built the empire from a personal flinch, Meralaine believes in stillness as a philosophy — that feeling is a wound and the kind thing is to end it. More dangerous than Tamasa because he has no guilt: he runs the clinics that turn citizens into stilled ones, and he sleeps perfectly.', style: 'Flawless indigo corporate tailoring, frost-blue subdermal interface lines, a voice engineered to lower the heart-rate of anyone who hears it. Beautiful the way a sealed room is beautiful.', kit: 'Master of the Sthiti Bandhan binding-code; a vocal synthesiser calibrated to induce compliance; command of the stilling clinics. He does not fight — he settles.', root: 'The preserving function (Sthiti) as seduction; the cold mirror of Uma’s bliss.' },
      { n: 'Devashaley', r: 'HEAD OF THE NISHCHAL ORDER', d: '"The hall of the god." Devashaley genuinely believes suppression is holy — that to still a soul is to protect it from the violence of change. The Order is his cathedral and the stilled ones are his congregation; he is the theological engine that lets ordinary people participate in cruelty and call it faith.', style: 'Austere ceremonial obsidian; a still, hall-like presence. Where Meralaine is corporate, Devashaley is clerical — the priest of the frozen god.', kit: 'Doctrinal authority; command of the Order’s enforcement rites; the Bhairava invocation as an instrument of "mercy." Controls who gets stilled and who gets erased.', root: 'Deva (god) + shala (hall) — the house of a god who has stopped moving.' },
      { n: 'Kavijyana', r: 'DOCTRINE-OFFICER', d: 'A poet before the Order took him. Kavijyana knows the Raktabija Protocol proves the whole system is a lie, because he is the one who keeps deleting the proof. The cold world’s most likely defector and its most valuable one — he carries the numbers that could bring Sthavantum down.', style: 'Understated frost-blue; ink-stained interface gloves; the tired eyes of someone who writes lies for a living and remembers when he wrote truth.', kit: 'Total access to Sahasragard’s vaults; narrative-control tooling; the ability to make a relapse-cascade disappear from every record in an afternoon.', root: 'Kavi (seer-poet) + jnana (knowledge) — knowledge forced to serve its own suppression.' },
      { n: 'Anisraya', r: 'WRATH-BORN ENFORCER', d: '"Without refuge." Anisraya was made the way Virabhadra was made — spun from a single act of severed grief, given a body and a purpose and no home to return to. Deployed against the warm world’s field-guardians. The cruellest question the story asks: can something manufactured from another’s wound be healed, or only released?', style: 'Grey-on-obsidian combat frame; no ornament, no expression, exposed enforcement-cybernetics. Moves without the small hesitations that mark a person who has a self to protect.', kit: 'Severance-grade combat cyberware; a strike-fist that installs the Sthiti Bandhan on contact, caging a target mid-motion; total obedience to Bhairacrux command.', root: 'An-ashraya (without refuge) + Virabhadra, the wrath-born from Shiva’s severed lock.' },
      { n: 'Mehlowick', r: 'STREET FIXER', d: 'A walking Raktabija Protocol — a stilled one who relapsed, spawned, and slipped the net, then turned around and started selling the very sedative that broke him. He hates the Order and depends on it: the clearest street-level evidence that Tamasa’s system manufactures its own black market.', style: 'Low-sector frost-blue grime; a kiosk-runner’s hunch; interface-scars from too many cheap stilling-sessions.', kit: 'A supply line of black-market Vasvishantum; contacts in Nishchalwick Kiosk; the survival-cunning of someone the system used up and spat out.', root: 'The relapse-duplicate that escaped; the -wick vendor-suffix of the cold streets.' },
      { n: 'Riyatrishane', r: 'CRAVING OPERATIVE', d: '"Trishna" — thirst. What the system produces when it stills a person incompletely and then offers the sedative as the only relief: an operative whose loyalty is chemical. Tamasa’s failure wearing a uniform. If the warm world could complete her interrupted heal, they would turn the Order’s own craving-engine against it.', style: 'Elegant decay: expensive cold-world dress worn thin, frost-blue interface flickering with withdrawal. The face of someone always mid-reach for the next stilling.', kit: 'Deniable wetwork; an intimate knowledge of the clinics from the inside; a dependency the Order exploits as leverage — she works to be stilled again.', root: 'Trishna (craving) — the thirst the cold world manufactures and feeds.' }
    ],
    informants: [
      { n: 'KAALWICK', d: 'Low-level market informant; sells small-time intel, always on the clock.', kit: 'A market stall’s worth of small-time intel, metered and always on the clock; kiosk contacts across the low sectors.' },
      { n: 'ANSHKEEP', d: 'Fragment-keeper trading partial files and severed case-records; the memory-broker.', kit: 'Partial files and severed case-records; can reassemble a fragment the Order meant to lose.' },
      { n: 'AJASHTORN', d: 'Hardened fixer at the border edge — unbending, unafraid, unbought.', kit: 'Border-edge contacts on both sides of the seam, and a standing reputation for staying unbought.' }
    ],
    cxOrgs: [
      { n: 'Sthiti Nexus', s: 'SUPPRESSION MEGACORP', d: 'Publicly a wellness institution; actually a machine for permanent emotional stasis. Runs the stilling clinics.' },
      { n: 'The Nishchal Order', s: 'MONASTIC WING', d: 'The theology that lets ordinary people participate in stilling and call it mercy.' },
      { n: 'Kaalagnikin Systems', s: 'TIME / LOGISTICS', d: 'Runs Kaalnex’s time-control, the airgrid, and the alignment-window scheduling.' },
      { n: 'HalaDyne', s: 'BIOWEAPONS', d: 'Where Sthiti Nexus stills the mind, HalaDyne poisons the body. Manufactures the disease to sell the cure.' }
    ],
    cxTech: [
      { n: 'STHITI BANDHAN', d: 'The indigo geometric cage that locks a wound shut. Compiled from the corrupted Aghora binding-code.' },
      { n: 'TRIKAALVALEX', d: 'Counterfeit three-time sight — surveillance across past, present, and predicted future.' },
      { n: 'VISHVRIKSHKRYPT', d: 'The poison-tree crypt in Sahasragard — sealed bioweapon strains and Halahala samples.' },
      { n: 'KALAKOOTENICS', d: 'Applied poison-science — the churning-poison engineered into deliverable product.' },
      { n: 'PROJECT VISHSPILLS', d: 'Engineered spills only the cold world’s own antidotes can treat.' },
      { n: 'VASVISHANTUM', d: 'The clinical sedative of the stilling clinics. Dulls feeling, freezes the wound, manufactures dependency.' },
      { n: 'GARTARAVAX', d: 'Garala engineered into an inoculant that dulls the third-eye response — sold as protection, used as control.' }
    ],
    cxInfra: [
      { n: 'Pralagard', f: 'The dissolution-city’s fortress keep' },
      { n: 'Nishchalwick Kiosk', f: 'The Order’s street touchpoint' },
      { n: 'Kaalnexium Airgrid', f: 'The cold world’s air-traffic grid' }
    ],
    cxTransit: [
      { n: 'Sthavantum Shuttle', f: 'The capital’s controlled shuttle service' },
      { n: 'Kaalstrata Transit', f: 'The time-and-strata transit backbone' },
      { n: 'Bhairanex Rails & Lift', f: 'Enforcement rail and lift network' },
      { n: 'Pralagard Wings', f: 'The keep’s air wing' },
      { n: 'Bhasma Hollowport', f: 'Ash-freight port — named for the burn-ground myth' }
    ],
    cxCurrency: [
      { n: '◇ SHUNYACRED', d: 'Credit-based, fully surveilled, emotionally weightless. Money for a world that has stilled itself.' }
    ],
    cxSlang: [
      { n: 'STILLED', d: 'Frozen by the Sthiti Bandhan; locked shut instead of healed.' },
      { n: 'STILLED ONES', d: 'Clients of Sthiti Nexus — people who have been through the clinics.' },
      { n: 'KAALBOUND', d: 'Trapped long-term in the cold system; on the clock forever.' },
      { n: 'STRATALOCKED', d: 'Filed so deep in Pralastrata it’s never meant to be revisited.' },
      { n: 'FILED', d: 'Erased into Sahasragard’s records; made to not-exist administratively.' },
      { n: 'ON THE BAND', d: 'Under Trikaalvalex surveillance; watched across all three times.' }
    ]
  },
  border: {
    meta: {
      bg: 'linear-gradient(180deg,#101214,#181b20)', accent: '#aeb6ba', ink: '#dcdee0',
      sub: 'rgba(200,206,210,.6)', border: 'rgba(174,182,186,.35)', glow: 'rgba(174,182,186,.3)',
      cardBg: 'rgba(20,22,26,.8)', num: 'rgba(174,182,186,.1)', faint: 'rgba(174,182,186,.5)',
      title: '#c9ced2', kicker: 'THE BORDER · NEITHER AND BOTH', name: 'VAITARANDOR',
      tag: 'You waited. It counted. Few maps admit this city exists — fewer admit they were drawn here.',
      cur: '☽ SOMAYANA · the only coin both sides quietly accept', crumbBase: 'VAITARANDOR',
      techTitle: 'THE SYSTEM', citiesTitle: 'THE BORDER ZONES', citiesCrumb: 'ZONES',
      charsTitle: 'THE BORDER CAST', cxOrgHead: 'UNDERWORLD CAST NOTES', worldName: 'Vaitarandor', displayName: 'The Border'
    },
    cities: [
      { n: 'Vaitarandor', t: 'CROSSING', type: 'The liminal crossing-city', d: 'Named for the Vaitarani, the river the dead must cross. Both palettes bleed here and cancel into grey — every deal that can’t be made in either world is made here.' },
      { n: 'Marutgate', t: 'CROSSING', type: 'The wind-gate', d: 'The primary controlled crossing-point. Fast, exposed, and watched by both sides.' },
      { n: 'Dandakavak', t: 'HIDDEN', type: 'The exile wilderness', d: 'A lawless border forest where people go to vanish. No signal reaches in; no protocol works cleanly.' },
      { n: 'Rudravantus', t: 'CONTESTED', type: 'The ruined keep', d: 'Once a warm-world stronghold, now half-claimed by the cold. Its name still carries Rudra.' },
      { n: 'Antaryana', t: 'HIDDEN', type: 'The inner passage', d: 'The deep under-route beneath Vaitarandor — the underworld moves people the surface can’t.' },
      { n: 'Mritkhross', t: 'CROSSING', type: 'The death-crossing', d: 'A broken span over the deepest part of the seam. Where the Rudravos is said to have been forged.' }
    ],
    principal: null,
    cast: [
      { n: 'Mohishift', r: 'SOCIAL ENGINEER · SABOTEUR', d: 'Born in the elite cloud-gardens of the upper city and bored of corporate life, she weaponised her privileges. She juices — masquerading as executives, security, or nightclub VIPs — luring high-value targets into false security before a clean data-wipe. To the street she is a ghost; to the corporations, an expensive nightmare.', style: 'Sleek high-end corporate tailoring that transitions seamlessly into fluid mirrored streetwear; shifting geometric subdermal LED tattoos across the face.', kit: 'Military-grade Mohini-Mesh skin camouflage; vocal-synthesiser implants; dual nano-monofilament whips concealed in the wrists — a high-tech nod to Vasuki.', root: 'Mohini, the enchantress-form; Vasuki, the serpent of the churning.' },
      { n: 'Rahout', r: 'ENFORCER', d: 'A tragic product of the Spillover. During a botched heist on an Amrit shipment he suffered a severe Rahu-Glitch — the corporate firewall severed half his digital consciousness, leaving his mind permanently fragmented. He survives on cheap toxic stimulants that push him into a violent Garala state in combat, and he knows he is running on K-Time.', style: 'Gritty, scarred, heavily modified. Left arm entirely industrial cybernetics, unpainted, exposed hydraulic lines; a cracked neon-orange ballistic mask over the top half of the head.', kit: 'Defective, unshielded muscle-booster rigs; a heavy Visha-Mod shock-fist that injects a hardware-bricking cyber-virus on impact; cybernetic eyes with threat-analysis HUDs.', root: 'Rahu, the severed head that swallows light; the eclipse-demon of the churning.' }
    ],
    informants: [],
    cxOrgs: [],
    cxTech: [
      { n: 'RUDRAVOS', d: 'Usable by either side; does whatever the wielder’s intent compiles. Could end the war either way.' }
    ],
    cxInfra: [],
    cxTransit: [],
    cxCurrency: [
      { n: '☽ SOMAYANA', d: 'The border black-market coin — soma, the moon-drink; yana, the vehicle. The only money both sides quietly accept.' }
    ],
    cxSlang: [
      { n: 'CROSSING', d: 'Going between worlds; also a person who does it for a living.' },
      { n: 'GREY-PAID', d: 'Paid in Somayana; a deal neither world will acknowledge.' },
      { n: 'THROATED', d: 'Carrying poison or data internally; holding something that should have killed you.' },
      { n: 'SPILLOVER', d: 'The bleed of one world’s damage into the other; the event that broke Rahout.' },
      { n: 'K-TIME', d: 'Borrowed time; how long a burnout has before neural decay takes them.' }
    ]
  }
};

const OUT_DIR = path.join(__dirname, '../data/worlds');

function withImage(item, prefixes) {
  const img = imgFor(item.n, prefixes);
  return { ...item, slug: slugify(item.n), imageKey: img.imageKey, imageUrl: img.url, thumbUrl: img.thumb };
}

for (const worldKey of Object.keys(WORLDS)) {
  const w = WORLDS[worldKey];
  const dir = path.join(OUT_DIR, worldKey);
  fs.mkdirSync(dir, { recursive: true });

  // meta.json
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(w.meta, null, 2));

  // cities.json
  const cities = w.cities.map((c) => withImage(c, ['city']));
  fs.writeFileSync(path.join(dir, 'cities.json'), JSON.stringify(cities, null, 2));

  // organizations.json
  const organizations = w.cxOrgs.map((o) => withImage(o, ['corp', 'char', 'tech']));
  fs.writeFileSync(path.join(dir, 'organizations.json'), JSON.stringify(organizations, null, 2));

  // characters.json — merges principal + cast + informants with a role discriminator.
  const characters = [];
  if (w.principal) {
    const img = imgFor(w.principal.n, ['char']);
    characters.push({
      ...w.principal, slug: slugify(w.principal.n), role: 'principal',
      style: w.principal.style || '', root: w.principal.root || '',
      imageKey: img.imageKey, imageUrl: img.url, thumbUrl: img.thumb
    });
  }
  w.cast.forEach((c) => {
    const img = imgFor(c.n, ['char']);
    characters.push({
      ...c, slug: slugify(c.n), role: 'cast',
      style: c.style || '', root: c.root || '',
      imageKey: img.imageKey, imageUrl: img.url, thumbUrl: img.thumb
    });
  });
  w.informants.forEach((f) => {
    const img = imgFor(f.n, ['char']);
    characters.push({
      ...f, slug: slugify(f.n), role: 'informant',
      style: f.style || '', root: f.root || '',
      imageKey: img.imageKey, imageUrl: img.url, thumbUrl: img.thumb
    });
  });
  fs.writeFileSync(path.join(dir, 'characters.json'), JSON.stringify(characters, null, 2));

  // tech.json
  const tech = w.cxTech.map((t) => withImage(t, ['tech', 'sub']));
  fs.writeFileSync(path.join(dir, 'tech.json'), JSON.stringify(tech, null, 2));

  // currency.json
  const currency = w.cxCurrency.map((c) => withImage(c, ['cur']));
  fs.writeFileSync(path.join(dir, 'currency.json'), JSON.stringify(currency, null, 2));

  // infrastructure.json — merges cxInfra (kind: "infrastructure") + cxTransit (kind: "transit")
  const infrastructure = [
    ...w.cxInfra.map((i) => ({ ...withImage({ n: i.n, d: i.f }, ['loc', 'cur']), kind: 'infrastructure' })),
    ...w.cxTransit.map((i) => ({ ...withImage({ n: i.n, d: i.f }, ['loc', 'cur']), kind: 'transit' }))
  ];
  fs.writeFileSync(path.join(dir, 'infrastructure.json'), JSON.stringify(infrastructure, null, 2));

  // slang.json
  fs.writeFileSync(path.join(dir, 'slang.json'), JSON.stringify(w.cxSlang.map((s) => ({ ...s, slug: slugify(s.n) })), null, 2));

  console.log('wrote', worldKey);
}
