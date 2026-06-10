import { platformCatalog } from './platform-catalog.mjs'

const USD_CNY_RATE = 7.2

const CATEGORY_LABELS = {
  WEAPON_CASE: '武器箱',
  STICKER_CAPSULE: '印花胶囊',
  AUTOGRAPH_CAPSULE: '签名胶囊',
  STICKER: '贴纸',
}

const weaponCaseItems = [
  item('dreams-and-nightmares-case', 'Dreams & Nightmares Case', 'WEAPON_CASE', 1.12, 717767),
  item('revolution-case', 'Revolution Case', 'WEAPON_CASE', 0.23, 548482),
  item('glove-case', 'Glove Case', 'WEAPON_CASE', 9.8, 110884),
  item('sealed-dead-hand-terminal', 'Sealed Dead Hand Terminal', 'WEAPON_CASE', 0.83, 316142),
  item('fever-case', 'Fever Case', 'WEAPON_CASE', 0.52, 1391824),
  item('kilowatt-case', 'Kilowatt Case', 'WEAPON_CASE', 0.17, 836177),
  item('sealed-genesis-terminal', 'Sealed Genesis Terminal', 'WEAPON_CASE', 0.08, 418509),
  item('operation-breakout-weapon-case', 'Operation Breakout Weapon Case', 'WEAPON_CASE', 7.09, 93381),
  item('recoil-case', 'Recoil Case', 'WEAPON_CASE', 0.32, 640757),
  item('fracture-case', 'Fracture Case', 'WEAPON_CASE', 0.47, 377762),
  item('cs-go-weapon-case', 'CS:GO Weapon Case', 'WEAPON_CASE', 129.34, 3278),
  item('gallery-case', 'Gallery Case', 'WEAPON_CASE', 0.85, 198374),
  item('snakebite-case', 'Snakebite Case', 'WEAPON_CASE', 0.48, 241612),
  item('operation-riptide-case', 'Operation Riptide Case', 'WEAPON_CASE', 10.36, 19198),
  item('gamma-case', 'Gamma Case', 'WEAPON_CASE', 2.98, 63218),
  item('clutch-case', 'Clutch Case', 'WEAPON_CASE', 0.55, 157250),
  item('danger-zone-case', 'Danger Zone Case', 'WEAPON_CASE', 1.29, 261883),
  item('operation-wildfire-case', 'Operation Wildfire Case', 'WEAPON_CASE', 2.99, 37170),
  item('horizon-case', 'Horizon Case', 'WEAPON_CASE', 1.65, 86751),
  item('spectrum-case', 'Spectrum Case', 'WEAPON_CASE', 3.44, 60583),
  item('chroma-3-case', 'Chroma 3 Case', 'WEAPON_CASE', 3.11, 66622),
  item('prisma-2-case', 'Prisma 2 Case', 'WEAPON_CASE', 1.42, 138775),
  item('chroma-2-case', 'Chroma 2 Case', 'WEAPON_CASE', 3.49, 49300),
  item('spectrum-2-case', 'Spectrum 2 Case', 'WEAPON_CASE', 2.76, 112955),
  item('gamma-2-case', 'Gamma 2 Case', 'WEAPON_CASE', 2.89, 82259),
  item('revolver-case', 'Revolver Case', 'WEAPON_CASE', 2.67, 56353),
  item('operation-hydra-case', 'Operation Hydra Case', 'WEAPON_CASE', 35, 5102),
  item('prisma-case', 'Prisma Case', 'WEAPON_CASE', 1.41, 150505),
  item('cs20-case', 'CS20 Case', 'WEAPON_CASE', 1.14, 87595),
  item('chroma-case', 'Chroma Case', 'WEAPON_CASE', 4.55, 20951),
  item('operation-phoenix-weapon-case', 'Operation Phoenix Weapon Case', 'WEAPON_CASE', 3.68, 55791),
  item('operation-vanguard-weapon-case', 'Operation Vanguard Weapon Case', 'WEAPON_CASE', 5.19, 10735),
  item('esports-2013-winter-case', 'eSports 2013 Winter Case', 'WEAPON_CASE', 24.54, 4507),
  item('shadow-case', 'Shadow Case', 'WEAPON_CASE', 1.63, 46306),
  item('operation-bravo-case', 'Operation Bravo Case', 'WEAPON_CASE', 59.85, 2456),
  item('cs-go-weapon-case-2', 'CS:GO Weapon Case 2', 'WEAPON_CASE', 20.71, 2641),
  item('operation-broken-fang-case', 'Operation Broken Fang Case', 'WEAPON_CASE', 6.36, 34620),
  item('shattered-web-case', 'Shattered Web Case', 'WEAPON_CASE', 5.86, 18633),
  item('winter-offensive-weapon-case', 'Winter Offensive Weapon Case', 'WEAPON_CASE', 10.13, 4696),
  item('huntsman-weapon-case', 'Huntsman Weapon Case', 'WEAPON_CASE', 8.15, 6467),
  item('esports-2013-case', 'eSports 2013 Case', 'WEAPON_CASE', 54.44, 1257),
  item('esports-2014-summer-case', 'eSports 2014 Summer Case', 'WEAPON_CASE', 17.3, 6953),
  item('falchion-case', 'Falchion Case', 'WEAPON_CASE', 1.53, 52078),
  item('x-ray-p250-package', 'X-Ray P250 Package', 'WEAPON_CASE', 1.65, 2040),
  item('cs-go-weapon-case-3', 'CS:GO Weapon Case 3', 'WEAPON_CASE', 12.71, 3679),
]

const stickerCapsuleItems = [
  item('ems-katowice-2014-challengers', 'EMS Katowice 2014 Challengers', 'STICKER_CAPSULE', 23078.43, 20),
  item('ems-katowice-2014-legends', 'EMS Katowice 2014 Legends', 'STICKER_CAPSULE', 22787.16, 28),
  item('esl-one-cologne-2014-legends', 'ESL One Cologne 2014 Legends', 'STICKER_CAPSULE', 64.91, 977),
  item('sticker-capsule-2', 'Sticker Capsule 2', 'STICKER_CAPSULE', 9.88, 9185),
  item('antwerp-2022-legends-sticker-capsule', 'Antwerp 2022 Legends Sticker Capsule', 'STICKER_CAPSULE', 0.42, 46063),
  item('paris-2023-contenders-sticker-capsule', 'Paris 2023 Contenders Sticker Capsule', 'STICKER_CAPSULE', 0.07, 237282),
  item('paris-2023-legends-sticker-capsule', 'Paris 2023 Legends Sticker Capsule', 'STICKER_CAPSULE', 0.09, 203550),
  item('esl-one-katowice-2015-challengers-holo-foil', 'ESL One Katowice 2015 Challengers (Holo-Foil)', 'STICKER_CAPSULE', 390, 371),
  item('10-year-birthday-sticker-capsule', '10 Year Birthday Sticker Capsule', 'STICKER_CAPSULE', 0.57, 25916),
  item('shanghai-2024-legends-sticker-capsule', 'Shanghai 2024 Legends Sticker Capsule', 'STICKER_CAPSULE', 0.9, 21152),
  item('copenhagen-2024-contenders-sticker-capsule', 'Copenhagen 2024 Contenders Sticker Capsule', 'STICKER_CAPSULE', 0.39, 37364),
  item('austin-2025-contenders-sticker-capsule', 'Austin 2025 Contenders Sticker Capsule', 'STICKER_CAPSULE', 0.27, 71877),
  item('budapest-2025-contenders-sticker-capsule', 'Budapest 2025 Contenders Sticker Capsule', 'STICKER_CAPSULE', 0.14, 460490),
  item('esl-one-cologne-2014-challengers', 'ESL One Cologne 2014 Challengers', 'STICKER_CAPSULE', 64.48, 770),
  item('budapest-2025-legends-sticker-capsule', 'Budapest 2025 Legends Sticker Capsule', 'STICKER_CAPSULE', 0.16, 152974),
  item('paris-2023-challengers-sticker-capsule', 'Paris 2023 Challengers Sticker Capsule', 'STICKER_CAPSULE', 0.07, 123649),
  item('sticker-capsule', 'Sticker Capsule', 'STICKER_CAPSULE', 0.55, 5461),
  item('austin-2025-legends-sticker-capsule', 'Austin 2025 Legends Sticker Capsule', 'STICKER_CAPSULE', 0.21, 98430),
  item('antwerp-2022-contenders-sticker-capsule', 'Antwerp 2022 Contenders Sticker Capsule', 'STICKER_CAPSULE', 0.48, 47273),
  item('cs20-sticker-capsule', 'CS20 Sticker Capsule', 'STICKER_CAPSULE', 0.67, 4166),
  item('austin-2025-challengers-sticker-capsule', 'Austin 2025 Challengers Sticker Capsule', 'STICKER_CAPSULE', 0.24, 62778),
  item('mlg-columbus-2016-challengers-holo-foil', 'MLG Columbus 2016 Challengers (Holo-Foil)', 'STICKER_CAPSULE', 38.5, 1524),
  item('cologne-2016-challengers-holo-foil', 'Cologne 2016 Challengers (Holo-Foil)', 'STICKER_CAPSULE', 32.74, 1049),
  item('rio-2022-legends-sticker-capsule', 'Rio 2022 Legends Sticker Capsule', 'STICKER_CAPSULE', 0.23, 22846),
  item('stockholm-2021-legends-sticker-capsule', 'Stockholm 2021 Legends Sticker Capsule', 'STICKER_CAPSULE', 1.35, 26854),
  item('esl-one-katowice-2015-legends-holo-foil', 'ESL One Katowice 2015 Legends (Holo-Foil)', 'STICKER_CAPSULE', 173.06, 354),
  item('rio-2022-contenders-sticker-capsule', 'Rio 2022 Contenders Sticker Capsule', 'STICKER_CAPSULE', 0.32, 34920),
  item('ambush-sticker-capsule', 'Ambush Sticker Capsule', 'STICKER_CAPSULE', 0.64, 9936),
  item('mlg-columbus-2016-legends-holo-foil', 'MLG Columbus 2016 Legends (Holo-Foil)', 'STICKER_CAPSULE', 39.21, 465),
  item('copenhagen-2024-challengers-sticker-capsule', 'Copenhagen 2024 Challengers Sticker Capsule', 'STICKER_CAPSULE', 0.55, 16648),
  item('pinups-capsule', 'Pinups Capsule', 'STICKER_CAPSULE', 0.64, 6959),
  item('2020-rmr-legends', '2020 RMR Legends', 'STICKER_CAPSULE', 0.19, 51256),
  item('budapest-2025-challengers-sticker-capsule', 'Budapest 2025 Challengers Sticker Capsule', 'STICKER_CAPSULE', 0.16, 115366),
  item('rio-2022-challengers-sticker-capsule', 'Rio 2022 Challengers Sticker Capsule', 'STICKER_CAPSULE', 0.2, 26692),
  item('copenhagen-2024-legends-sticker-capsule', 'Copenhagen 2024 Legends Sticker Capsule', 'STICKER_CAPSULE', 0.41, 16168),
  item('katowice-2019-minor-challengers-holo-foil', 'Katowice 2019 Minor Challengers (Holo-Foil)', 'STICKER_CAPSULE', 8.09, 3434),
  item('2020-rmr-challengers', '2020 RMR Challengers', 'STICKER_CAPSULE', 0.19, 35841),
  item('slid3-capsule', 'Slid3 Capsule', 'STICKER_CAPSULE', 0.72, 2046),
  item('atlanta-2017-challengers-holo-foil', 'Atlanta 2017 Challengers (Holo-Foil)', 'STICKER_CAPSULE', 83.91, 245),
  item('london-2018-minor-challengers-holo-foil', 'London 2018 Minor Challengers (Holo-Foil)', 'STICKER_CAPSULE', 14.66, 619),
  item('katowice-2019-legends-holo-foil', 'Katowice 2019 Legends (Holo-Foil)', 'STICKER_CAPSULE', 10.15, 544),
  item('boston-2018-returning-challengers-holo-foil', 'Boston 2018 Returning Challengers (Holo-Foil)', 'STICKER_CAPSULE', 42.92, 285),
  item('community-sticker-capsule-1', 'Community Sticker Capsule 1', 'STICKER_CAPSULE', 2.26, 4033),
  item('dreamhack-2014-legends-holo-foil', 'DreamHack 2014 Legends (Holo-Foil)', 'STICKER_CAPSULE', 286.67, 428),
  item('stockholm-2021-contenders-sticker-capsule', 'Stockholm 2021 Contenders Sticker Capsule', 'STICKER_CAPSULE', 1.96, 20903),
  item('shanghai-2024-contenders-sticker-capsule', 'Shanghai 2024 Contenders Sticker Capsule', 'STICKER_CAPSULE', 0.8, 22398),
  item('espionage-sticker-capsule', 'Espionage Sticker Capsule', 'STICKER_CAPSULE', 0.58, 4236),
  item('the-boardroom-sticker-capsule', 'The Boardroom Sticker Capsule', 'STICKER_CAPSULE', 0.66, 8031),
]

const autographCapsuleItems = [
  item('austin-2025-legends-autograph-capsule', 'Austin 2025 Legends Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.23, 23346),
  item('krakow-2017-challengers-autograph-capsule', 'Krakow 2017 Challengers Autograph Capsule', 'AUTOGRAPH_CAPSULE', 18.5, 2341),
  item('katowice-2019-legends-autograph-capsule', 'Katowice 2019 Legends Autograph Capsule', 'AUTOGRAPH_CAPSULE', 4.65, 2605),
  item('budapest-2025-legends-autograph-capsule', 'Budapest 2025 Legends Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.22, 75559),
  item('austin-2025-challengers-autograph-capsule', 'Austin 2025 Challengers Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.27, 20648),
  item('paris-2023-contenders-autograph-capsule', 'Paris 2023 Contenders Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.08, 70615),
  item('katowice-2019-minor-challengers-autograph-capsule', 'Katowice 2019 Minor Challengers Autograph Capsule', 'AUTOGRAPH_CAPSULE', 5.84, 2059),
  item('antwerp-2022-contenders-autograph-capsule', 'Antwerp 2022 Contenders Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.48, 18902),
  item('copenhagen-2024-legends-autograph-capsule', 'Copenhagen 2024 Legends Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.46, 19403),
  item('shanghai-2024-legends-autograph-capsule', 'Shanghai 2024 Legends Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.21, 30693),
  item('budapest-2025-contenders-autograph-capsule', 'Budapest 2025 Contenders Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.18, 20731),
  item('paris-2023-challengers-autograph-capsule', 'Paris 2023 Challengers Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.09, 62762),
  item('austin-2025-champions-autograph-capsule', 'Austin 2025 Champions Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.25, 9477),
  item('austin-2025-contenders-autograph-capsule', 'Austin 2025 Contenders Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.22, 13772),
  item('krakow-2017-legends-autograph-capsule', 'Krakow 2017 Legends Autograph Capsule', 'AUTOGRAPH_CAPSULE', 19.89, 2201),
  item('boston-2018-minor-challengers-autograph-capsule', 'Boston 2018 Minor Challengers Autograph Capsule', 'AUTOGRAPH_CAPSULE', 185, 18),
  item('boston-2018-returning-challengers-autograph-capsule', 'Boston 2018 Returning Challengers Autograph Capsule', 'AUTOGRAPH_CAPSULE', 10, 1800),
  item('rio-2022-challengers-autograph-capsule', 'Rio 2022 Challengers Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.31, 4440),
  item('shanghai-2024-champions-autograph-capsule', 'Shanghai 2024 Champions Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.33, 23407),
  item('rio-2022-contenders-autograph-capsule', 'Rio 2022 Contenders Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.25, 7367),
  item('copenhagen-2024-champions-autograph-capsule', 'Copenhagen 2024 Champions Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.27, 6636),
  item('copenhagen-2024-contenders-autograph-capsule', 'Copenhagen 2024 Contenders Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.17, 26595),
  item('autograph-capsule-virtus-pro-cluj-napoca-2015', 'Autograph Capsule | Virtus.Pro | Cluj-Napoca 2015', 'AUTOGRAPH_CAPSULE', 6.25, 422),
  item('boston-2018-legends-autograph-capsule', 'Boston 2018 Legends Autograph Capsule', 'AUTOGRAPH_CAPSULE', 83.7, 109),
  item('autograph-capsule-challengers-foil-cologne-2016', 'Autograph Capsule | Challengers (Foil) | Cologne 2016', 'AUTOGRAPH_CAPSULE', 58.71, 133),
  item('boston-2018-attending-legends-autograph-capsule', 'Boston 2018 Attending Legends Autograph Capsule', 'AUTOGRAPH_CAPSULE', 7.64, 1052),
  item('london-2018-legends-autograph-capsule', 'London 2018 Legends Autograph Capsule', 'AUTOGRAPH_CAPSULE', 9.77, 1077),
  item('berlin-2019-legends-autograph-capsule', 'Berlin 2019 Legends Autograph Capsule', 'AUTOGRAPH_CAPSULE', 1.12, 8572),
  item('autograph-capsule-challengers-foil-mlg-columbus-2016', 'Autograph Capsule | Challengers (Foil) | MLG Columbus 2016', 'AUTOGRAPH_CAPSULE', 41.73, 147),
  item('paris-2023-legends-autograph-capsule', 'Paris 2023 Legends Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.12, 30183),
  item('autograph-capsule-team-dignitas-cluj-napoca-2015', 'Autograph Capsule | Team Dignitas | Cluj-Napoca 2015', 'AUTOGRAPH_CAPSULE', 38.39, 76),
  item('stockholm-2021-finalists-autograph-capsule', 'Stockholm 2021 Finalists Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.5, 7239),
  item('london-2018-returning-challengers-autograph-capsule', 'London 2018 Returning Challengers Autograph Capsule', 'AUTOGRAPH_CAPSULE', 7.95, 1582),
  item('paris-2023-champions-autograph-capsule', 'Paris 2023 Champions Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.17, 41218),
  item('antwerp-2022-legends-autograph-capsule', 'Antwerp 2022 Legends Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.24, 12223),
  item('shanghai-2024-challengers-autograph-capsule', 'Shanghai 2024 Challengers Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.28, 6574),
  item('autograph-capsule-faze-clan-cologne-2016', 'Autograph Capsule | FaZe Clan | Cologne 2016', 'AUTOGRAPH_CAPSULE', 19.54, 14),
  item('stockholm-2021-champions-autograph-capsule', 'Stockholm 2021 Champions Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.77, 13826),
  item('budapest-2025-challengers-autograph-capsule', 'Budapest 2025 Challengers Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.21, 30745),
  item('autograph-capsule-legends-foil-cluj-napoca-2015', 'Autograph Capsule | Legends (Foil) | Cluj-Napoca 2015', 'AUTOGRAPH_CAPSULE', 26.21, 312),
  item('shanghai-2024-contenders-autograph-capsule', 'Shanghai 2024 Contenders Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.24, 16145),
  item('budapest-2025-champions-autograph-capsule', 'Budapest 2025 Champions Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.19, 27808),
  item('antwerp-2022-champions-autograph-capsule', 'Antwerp 2022 Champions Autograph Capsule', 'AUTOGRAPH_CAPSULE', 0.28, 8987),
  item('autograph-capsule-titan-cologne-2015', 'Autograph Capsule | Titan | Cologne 2015', 'AUTOGRAPH_CAPSULE', 26.27, 77),
  item('autograph-capsule-team-envyus-cluj-napoca-2015', 'Autograph Capsule | Team EnVyUs | Cluj-Napoca 2015', 'AUTOGRAPH_CAPSULE', 4.55, 808),
  item('autograph-capsule-group-c-foil-cologne-2015', 'Autograph Capsule | Group C (Foil) | Cologne 2015', 'AUTOGRAPH_CAPSULE', 22, 241),
  item('autograph-capsule-group-a-foil-cologne-2015', 'Autograph Capsule | Group A (Foil) | Cologne 2015', 'AUTOGRAPH_CAPSULE', 14.99, 357),
  item('autograph-capsule-cloud9-cluj-napoca-2015', 'Autograph Capsule | Cloud9 | Cluj-Napoca 2015', 'AUTOGRAPH_CAPSULE', 14.18, 43),
]

const stickerItems = [
  item('sticker-titan-holo-katowice-2014', 'Sticker | Titan (Holo) | Katowice 2014', 'STICKER', 70000, 11),
  item('sticker-ibuypower-holo-katowice-2014', 'Sticker | iBUYPOWER (Holo) | Katowice 2014', 'STICKER', 69300, 11),
  item('sticker-big-gold-cologne-2026', 'Sticker | BIG (Gold) | Cologne 2026', 'STICKER', 510, 9),
  item('sticker-thunderdownunder-holo-cologne-2026', 'Sticker | THUNDERdOWNUNDER (Holo) | Cologne 2026', 'STICKER', 21.01, 677),
  item('sticker-donk-gold-cologne-2026', 'Sticker | donk (Gold) | Cologne 2026', 'STICKER', 154.44, 552),
  item('sticker-crown-foil', 'Sticker | Crown (Foil)', 'STICKER', 352.71, 760),
  item('sticker-big-holo-cologne-2026', 'Sticker | BIG (Holo) | Cologne 2026', 'STICKER', 4.47, 387),
  item('sticker-high-heat', 'Sticker | High Heat', 'STICKER', 0.6, 98816),
  item('sticker-donk-holo-cologne-2026', 'Sticker | donk (Holo) | Cologne 2026', 'STICKER', 31.96, 673),
  item('sticker-ruby-wave-lenticular', 'Sticker | Ruby Wave (Lenticular)', 'STICKER', 7.3, 13357),
  item('sticker-kawaii-t-holo', 'Sticker | Kawaii T (Holo)', 'STICKER', 5.39, 1572),
  item('sticker-s1zzi-holo-cologne-2026', 'Sticker | s1zzi (Holo) | Cologne 2026', 'STICKER', 4.51, 182),
  item('sticker-team-dignitas-holo-katowice-2014', 'Sticker | Team Dignitas (Holo) | Katowice 2014', 'STICKER', 23075.96, 14),
  item('sticker-loving-eyes-holo', 'Sticker | Loving Eyes (Holo)', 'STICKER', 4.27, 1878),
  item('sticker-team-spirit-gold-cologne-2026', 'Sticker | Team Spirit (Gold) | Cologne 2026', 'STICKER', 519, 19),
  item('sticker-titan-katowice-2014', 'Sticker | Titan | Katowice 2014', 'STICKER', 3617.19, 24),
  item('sticker-g2-esports-holo-shanghai-2024', 'Sticker | G2 Esports (Holo) | Shanghai 2024', 'STICKER', 64.71, 3419),
  item('sticker-reason-gaming-holo-katowice-2014', 'Sticker | Reason Gaming (Holo) | Katowice 2014', 'STICKER', 73820.35, 14),
  item('sticker-koi-holo-copenhagen-2024', 'Sticker | KOI (Holo) | Copenhagen 2024', 'STICKER', 10.55, 4112),
  item('sticker-rainbow-route-holo', 'Sticker | Rainbow Route (Holo)', 'STICKER', 1.09, 135565),
  item('sticker-ibuypower-dreamhack-2014', 'Sticker | iBUYPOWER | DreamHack 2014', 'STICKER', 224.93, 204),
  item('sticker-gamerlegion-foil-cologne-2026', 'Sticker | GamerLegion (Foil) | Cologne 2026', 'STICKER', 2.89, 55),
  item('sticker-howling-dawn', 'Sticker | Howling Dawn', 'STICKER', 1623.75, 60),
  item('sticker-team-liquid-holo-cologne-2026', 'Sticker | Team Liquid (Holo) | Cologne 2026', 'STICKER', 17.27, 327),
  item('sticker-falcons-holo-cologne-2026', 'Sticker | Falcons (Holo) | Cologne 2026', 'STICKER', 21.58, 192),
  item('sticker-flyquest-holo-cologne-2026', 'Sticker | FlyQuest (Holo) | Cologne 2026', 'STICKER', 8.98, 448),
  item('sticker-lotus-glitter', 'Sticker | Lotus (Glitter)', 'STICKER', 4.76, 2176),
  item('sticker-winding-scorch-foil', 'Sticker | Winding Scorch (Foil)', 'STICKER', 2.38, 22188),
  item('sticker-sharks-esports-holo-cologne-2026', 'Sticker | Sharks Esports (Holo) | Cologne 2026', 'STICKER', 5.56, 220),
  item('sticker-king-on-the-field', 'Sticker | King on the Field', 'STICKER', 929.9, 63),
  item('sticker-kawaii-ct-holo', 'Sticker | Kawaii CT (Holo)', 'STICKER', 3.54, 1674),
  item('sticker-iem-holo-cologne-2026', 'Sticker | IEM (Holo) | Cologne 2026', 'STICKER', 13.69, 121),
  item('sticker-evil-geniuses-holo-stockholm-2021', 'Sticker | Evil Geniuses (Holo) | Stockholm 2021', 'STICKER', 6.15, 11575),
  item('sticker-good-as-new-foil', 'Sticker | Good As New (Foil)', 'STICKER', 4.05, 3023),
  item('sticker-natus-vincere-holo-cologne-2026', 'Sticker | Natus Vincere (Holo) | Cologne 2026', 'STICKER', 21.49, 111),
  item('sticker-gizmy-holo-cologne-2026', 'Sticker | Gizmy (Holo) | Cologne 2026', 'STICKER', 2.71, 93),
  item('sticker-chrome-dome-holo', 'Sticker | Chrome Dome (Holo)', 'STICKER', 3.04, 10643),
  item('sticker-s1mple-holo-stockholm-2021', 'Sticker | s1mple (Holo) | Stockholm 2021', 'STICKER', 2.22, 7817),
  item('sticker-tyloo-holo-cologne-2026', 'Sticker | TYLOO (Holo) | Cologne 2026', 'STICKER', 9.46, 475),
  item('sticker-s1zzi-gold-cologne-2026', 'Sticker | s1zzi (Gold) | Cologne 2026', 'STICKER', 41.42, 21),
  item('sticker-team-dignitas-holo-cologne-2014', 'Sticker | Team Dignitas (Holo) | Cologne 2014', 'STICKER', 824.15, 490),
  item('sticker-movistar-riders-holo-stockholm-2021', 'Sticker | Movistar Riders (Holo) | Stockholm 2021', 'STICKER', 17.2, 1891),
  item('sticker-rox-holo-antwerp-2022', 'Sticker | rox (Holo) | Antwerp 2022', 'STICKER', 85.93, 572),
  item('sticker-scorch-loop', 'Sticker | Scorch Loop', 'STICKER', 0.11, 75211),
  item('sticker-hydro-wave', 'Sticker | Hydro Wave', 'STICKER', 0.14, 59767),
  item('sticker-bolt-strike-foil', 'Sticker | Bolt Strike (Foil)', 'STICKER', 1.42, 22549),
  item('sticker-harp-of-war-holo', 'Sticker | Harp of War (Holo)', 'STICKER', 1500, 24),
  item('sticker-clan-mystik-holo-katowice-2014', 'Sticker | Clan-Mystik (Holo) | Katowice 2014', 'STICKER', 4640, 53),
]

const itemSeeds = [
  ...weaponCaseItems,
  ...stickerCapsuleItems,
  ...autographCapsuleItems,
  ...stickerItems,
]

function item(itemId, name, category, sourcePriceUsd, sourceOfferCount) {
  const basePrice = money(sourcePriceUsd * USD_CNY_RATE)

  return {
    itemId,
    name,
    cnName: `${CATEGORY_LABELS[category]} | ${name}`,
    category,
    targetQuantity: targetQuantityFor(basePrice, sourceOfferCount),
    basePrice,
    sourcePriceUsd,
    sourceOfferCount,
  }
}

function targetQuantityFor(basePrice, sourceOfferCount) {
  const liquidityBoost = sourceOfferCount >= 100000 ? 2 : sourceOfferCount >= 20000 ? 1 : 0
  if (basePrice <= 1) return 16 + liquidityBoost
  if (basePrice <= 5) return 10 + liquidityBoost
  if (basePrice <= 25) return 6
  if (basePrice <= 150) return 3
  return 1
}

const feeProfiles = {
  'official-market': {
    sellerFeeRate: 0.08,
    buyerFeeRate: 0,
    makerFeeRate: 0,
    takerFeeRate: 0.005,
    depositCostRate: 0,
    fxCostRate: 0.004,
  },
  'cash-market': {
    sellerFeeRate: 0.045,
    buyerFeeRate: 0,
    makerFeeRate: 0.002,
    takerFeeRate: 0.004,
    depositCostRate: 0.008,
    fxCostRate: 0.006,
  },
  'p2p-market': {
    sellerFeeRate: 0.025,
    buyerFeeRate: 0,
    makerFeeRate: 0.001,
    takerFeeRate: 0.003,
    depositCostRate: 0.006,
    fxCostRate: 0.006,
  },
  'trade-bot': {
    sellerFeeRate: 0.035,
    buyerFeeRate: 0,
    makerFeeRate: 0.002,
    takerFeeRate: 0.005,
    depositCostRate: 0.007,
    fxCostRate: 0.006,
  },
}

const platformOverrides = {
  steam: { sellerFeeRate: 0.12, depositCostRate: 0, fxCostRate: 0.005 },
  buff163: { sellerFeeRate: 0.025, depositCostRate: 0.006, fxCostRate: 0 },
  csfloat: { sellerFeeRate: 0.02, depositCostRate: 0.004, fxCostRate: 0.005 },
  skinport: { sellerFeeRate: 0.06, depositCostRate: 0.008, fxCostRate: 0.006 },
  dmarket: { sellerFeeRate: 0.07, depositCostRate: 0.009, fxCostRate: 0.007 },
  waxpeer: { sellerFeeRate: 0.025, depositCostRate: 0.006, fxCostRate: 0.006 },
  'market-csgo': { sellerFeeRate: 0.05, depositCostRate: 0.008, fxCostRate: 0.006 },
}

export const items = itemSeeds.map(({ basePrice, ...item }) => item)

export const platforms = platformCatalog.map((platform, index) => {
  const baseFees = feeProfiles[platform.marketType] || feeProfiles['cash-market']
  const overrides = platformOverrides[platform.platformId] || {}
  return {
    platformId: platform.platformId,
    name: platform.name,
    currency: 'CNY',
    healthScore: healthScore(platform),
    quoteSource: 'CATALOG_SAMPLE',
    fees: {
      ...baseFees,
      ...overrides,
      tickSize: 0.01,
      confidence: 'CATALOG_ESTIMATED',
    },
    rankIndex: index,
  }
})

export const inventory = itemSeeds.flatMap((item, itemIndex) =>
  platforms.map((platform, platformIndex) => ({
    platformId: platform.platformId,
    itemId: item.itemId,
    availableQuantity: 1 + ((platformIndex + itemIndex) % 3),
  })),
)

export const balances = platforms.map((platform, index) => ({
  platformId: platform.platformId,
  currency: 'CNY',
  availableAmount: 9000 + ((index * 1379) % 9000),
}))

export const orderBooks = itemSeeds.flatMap((item, itemIndex) =>
  platforms.map((platform, platformIndex) => buildOrderBook(item, itemIndex, platform, platformIndex)),
)

function buildOrderBook(item, itemIndex, platform, platformIndex) {
  const catalog = platformCatalog.find((entry) => entry.platformId === platform.platformId)
  const discount = catalog?.marketStats?.averageDiscountRate || 0.28
  const liquidityBase = liquidityFromCatalog(catalog)
  const noise = centeredNoise(platform.platformId, item.itemId)
  const marketTypeBias = {
    'official-market': 0.055,
    'p2p-market': -0.012,
    'cash-market': 0,
    'trade-bot': 0.018,
  }[catalog?.marketType] || 0
  const priceFactor = 1 + (0.32 - discount) * 0.22 + marketTypeBias + noise * 0.018
  const center = money(item.basePrice * priceFactor)
  const spreadRate = 0.016 + (1 - platform.healthScore) * 0.016 + Math.abs(noise) * 0.01
  const bestBid = money(center * (1 - spreadRate / 2))
  const bestAsk = money(center * (1 + spreadRate / 2))
  const topBidQuantity = Math.max(item.targetQuantity, Math.round(liquidityBase * (1 + ((platformIndex + itemIndex) % 3))))
  const topAskQuantity = Math.max(item.targetQuantity, Math.round(liquidityBase * (1 + ((platformIndex + itemIndex + 1) % 3))))

  return {
    platformId: platform.platformId,
    itemId: item.itemId,
    freshnessMs: 650 + ((platformIndex * 173 + itemIndex * 251) % 4200),
    tradeVelocity: clamp(0.34 + platform.healthScore * 0.42 + liquidityBase * 0.035 + Math.abs(noise) * 0.08),
    bids: priceLevels(bestBid, topBidQuantity, 'bid'),
    asks: priceLevels(bestAsk, topAskQuantity, 'ask'),
  }
}

function priceLevels(bestPrice, topQuantity, side) {
  const direction = side === 'bid' ? -1 : 1
  return [0, 1, 2].map((level) => ({
    price: money(bestPrice * (1 + direction * level * 0.006)),
    quantity: Math.max(1, topQuantity + level),
    orderCount: Math.max(1, Math.ceil((topQuantity + level) / 2)),
  }))
}

function healthScore(platform) {
  const rating = Number(platform.marketStats.rating) || 3.8
  const marketTypeBonus = platform.marketType === 'p2p-market' ? 0.04 : platform.marketType === 'official-market' ? -0.04 : 0
  return clamp(0.55 + rating / 10 + marketTypeBonus, 0.52, 0.96)
}

function liquidityFromCatalog(platform) {
  const offerText = String(platform?.marketStats?.offers || '')
  const numeric = Number(offerText.replace(/[^0-9.]/g, '')) || 1
  const multiplier = offerText.includes('M') ? 1000 : offerText.includes('K') ? 1 : 0.001
  const scaled = numeric * multiplier
  return clamp(Math.log10(Math.max(10, scaled)) - 1.4, 1.1, 5.8)
}

function centeredNoise(platformId, itemId) {
  const text = `${platformId}:${itemId}`
  let hash = 2166136261
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return ((hash >>> 0) % 2001) / 1000 - 1
}

function money(value) {
  return Math.round((Number(value) || 0) * 100) / 100
}

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value))
}
