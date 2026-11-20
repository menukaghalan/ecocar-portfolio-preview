// =====================================================================
//  B-2.3.1 SDV value chain & ecosystem: deck content (v2)
//
//  v2 = v1 text, fact-checked on 13 Oct 2026.
//  v3 = v2 + decision journey (exec summary, shortlist -> targets, dossiers),
//       synced with the team's B-2.3.3 feasibility screening and personas.
//  v4 = v3 + fixes from the 30 Oct 2026 review (see README). Audit date unchanged.
//  v5 = v4 + a redesigned target-dossier slide. Content unchanged, plus a one-line hook per target.
//  v6 = v5 + the value-chain slide rebuilt as a car.
//  v7 = v6 + the 26 Oct company screen, BMCs, personas and how the thinking changed. Round 1 stays on the record.
//  Full findings: ../reports/SDV deck fact check.md
//
//  Citations: write [^id] after a claim, where id is a key in SOURCES.
//  It renders as a numbered marker; hover shows the source, click opens it.
//
//  Logo chips:  "nvidia"              -> logo image only
//               "onstar|OnStar"       -> logo image + text
//               "=Samsara"            -> text-only chip
//               "~OEM data platforms" -> muted italic chip
// =====================================================================

// showOlder: true only when the older version folders are deployed beside this one;
// false hides every link to them so a v7-only upload has no broken links.
window.VERSION = { n: 9, checked: '13 Oct 2026', showOlder: false,
  older: [['v6', '../interactive-v6/index.html'], ['v5', '../interactive-v5/index.html'], ['v4', '../interactive-v4/index.html'], ['v3', '../interactive-v3/index.html'], ['v2', '../interactive-v2/index.html'], ['v1', '../interactive/index.html']] };

window.PALETTE = {
  Lone:   { s: '#4338CA', m: '#6366F1', l: '#A5B4FC' },
  Ltwo:   { s: '#1D4ED8', m: '#3B82F6', l: '#93C5FD' },
  Lthree: { s: '#0E7490', m: '#06B6D4', l: '#67E8F9' },
  Lfour:  { s: '#047857', m: '#10B981', l: '#6EE7B7' },
  Lfive:  { s: '#B45309', m: '#F59E0B', l: '#FCD34D' },
  Lsix:   { s: '#BE123C', m: '#F43F5E', l: '#FDA4AF' },
  Lcyber: { s: '#6D28D9', m: '#8B5CF6', l: '#C4B5FD' },
  Lvv:    { s: '#A21CAF', m: '#D946EF', l: '#F0ABFC' },
  Lslate: { s: '#334155', m: '#64748B', l: '#CBD5E1' },
};

window.COMP_LABEL = { 1: 'OPEN POCKETS', 2: 'CONTESTED', 3: 'CROWDED' };
window.CAPTURE_LABEL = { once: 'Once per vehicle', mixed: 'Per vehicle + upgrades', recurring: 'Every month', spans: 'Spans every layer' };

// ------------------------------------------------------------------ SOURCES
// kind: primary (company/regulator/filing), analyst, survey, press, team
window.SOURCES = {
  mck:        { pub: 'McKinsey Center for Future Mobility', title: 'The automotive software and electronics market through 2035', date: 'c. Jan 2026', kind: 'analyst',
                url: 'https://www.mckinsey.com/features/mckinsey-center-for-future-mobility/our-insights/mapping-the-automotive-software-and-electronics-landscape' },
  nhtsa:      { pub: 'NHTSA', title: '2025 Annual Report: Safety Recalls', date: 'Mar 2026', kind: 'primary',
                url: 'https://www.nhtsa.gov/sites/nhtsa.gov/files/2026-03/2025-annual-recalls-report.pdf' },
  bizzy:      { pub: 'BizzyCar', title: 'Quarterly recall report, Q4 2025 (OTA-eligible share, from NHTSA data)', date: '19 Jan 2026', kind: 'analyst',
                url: 'https://bizzycar.com/blog/automotive-recall-alert-8.6-million-vehicles-recalled-in-q4-2025' },
  abi:        { pub: 'ABI Research', title: 'By 2028, automakers will save US$1.5 billion using OTA updates to fix recalled cars', date: '3 May 2023', kind: 'analyst',
                url: 'https://abiresearch.com/press/by-2028-automakers-will-save-us15-billion-using-over-the-air-updates-to-fix-recalled-cars' },
  'abi-hr':   { pub: 'ABI Research (J. Hodgson) via EE Times Asia', title: 'Analyst commentary on compute headroom for SDV platforms', date: '31 Oct 2024', kind: 'analyst',
                url: 'https://www.eetasia.com/support-from-chip-partners-needed-for-sdv-success/' },
  'gm-q1':    { pub: 'General Motors', title: 'Q1 2026 earnings call (transcript)', date: '28 Apr 2026', kind: 'primary',
                url: 'https://www.fool.com/earnings/call-transcripts/2026/04/28/gm-q1-2026-earnings-call-transcript/' },
  'gm-q4':    { pub: 'General Motors', title: 'Q4 2025 earnings call (transcript)', date: '27 Jan 2026', kind: 'primary',
                url: 'https://www.fool.com/earnings/call-transcripts/2026/01/27/gm-gm-q4-2025-earnings-call-transcript/' },
  'gm-q3l':   { pub: 'General Motors (via Repairer Driven News)', title: 'Q3 2025 shareholder letter: ~70% gross margins on OnStar and Super Cruise', date: '23 Oct 2025', kind: 'primary',
                url: 'https://www.repairerdrivennews.com/2025/10/23/gm-reports-double-digit-revenue-growth-from-onstar-expects-trend-to-continue/' },
  'gm-10q':   { pub: 'General Motors', title: 'Form 10-Q, quarter ended 30 Jun 2026', date: 'Jul 2026', kind: 'primary',
                url: 'https://www.sec.gov/Archives/edgar/data/1467858/000146785826000051/gm-20260630.htm' },
  ftc:        { pub: 'US Federal Trade Commission', title: 'FTC finalizes order settling allegations GM and OnStar collected and sold geolocation data', date: '14 Jan 2026', kind: 'primary',
                url: 'https://www.ftc.gov/news-events/news/press-releases/2026/01/ftc-finalizes-order-settling-allegations-gm-onstar-collected-sold-geolocation-data-without-consumers' },
  rivian:     { pub: 'Rivian (Business Wire)', title: 'Rivian introduces second-generation R1S and R1T', date: '6 Jun 2024', kind: 'primary',
                url: 'https://www.businesswire.com/news/home/20240606335706/en/Rivian-Introduces-Second-Generation-R1S-R1T' },
  'spg-china':{ pub: 'S&P Global Mobility AutoTechInsight', title: 'The real meaning of China speed', date: '14 Jul 2026', kind: 'analyst',
                url: 'https://autotechinsight.spglobal.com/news/5289482/the-real-meaning-of-china-speed' },
  qcom:       { pub: 'Qualcomm', title: 'Third quarter fiscal 2026 results', date: 'Jul 2026', kind: 'primary',
                url: 'https://www.qualcomm.com/news/releases/2026/07/qualcomm-announces-third-quarter-fiscal-2026-results' },
  'qcom-ces': { pub: 'Qualcomm', title: 'CES 2026 release on Snapdragon automotive momentum (75M+ cockpit vehicles as of June 2025)', date: 'Jan 2026', kind: 'primary',
                url: 'https://www.qualcomm.com/news/releases/2026/01/qualcomm-drives-the-future-of-mobility-with-strong-snapdragon-di' },
  'qcom-bmw': { pub: 'Qualcomm', title: 'Qualcomm and BMW Group unveil Snapdragon Ride Pilot', date: '5 Sep 2025', kind: 'primary',
                url: 'https://www.qualcomm.com/news/releases/2025/09/qualcomm-and-bmw-group-unveil-groundbreaking-automated-driving-s' },
  'bmw-reu':  { pub: 'Reuters (via The Star)', title: 'Report on Qualcomm’s long-term compute supply deal with BMW', date: '29 Jul 2026', kind: 'press',
                url: 'https://www.thestar.com.my/tech/tech-news/2026/07/29/qualcomm-wins-bmw-chip-supply-deal-for-future-vehicle-platforms' },
  bb10k:      { pub: 'BlackBerry', title: 'Form 10-K, fiscal year ended 28 Feb 2026 (QNX)', date: 'Apr 2026', kind: 'primary',
                url: 'https://www.sec.gov/Archives/edgar/data/1070235/000107023526000039/bbry-20260228.htm' },
  android:    { pub: 'Ford Authority', title: 'Report on Ford Digital Experience being built with Google', date: 'Nov 2024', kind: 'press',
                url: 'https://fordauthority.com/2024/11/ford-digital-experience-developed-in-partnership-with-google' },
  score:      { pub: 'Automotive World', title: 'Report on the Eclipse S-CORE v0.5 middleware release', date: 'Nov 2025', kind: 'press',
                url: 'https://www.automotiveworld.com/news/eclipse-s-core-releases-version-0-5-alpha-for-vehicle-middleware/' },
  rvtech:     { pub: 'Automotive World', title: 'Report on the launch of the Rivian–Volkswagen software joint venture', date: 'Nov 2024', kind: 'press',
                url: 'https://www.automotiveworld.com/news/faster-leaner-more-efficient-rivian-and-volkswagen-group-announce-the-launch-of-their-joint-venture/' },
  mbly:       { pub: 'Mobileye', title: 'Q1 2026 earnings call (transcript)', date: '23 Apr 2026', kind: 'primary',
                url: 'https://www.fool.com/earnings/call-transcripts/2026/04/23/mobileye-mbly-q1-2026-earnings-transcript/' },
  tsla:       { pub: 'InsideEVs', title: 'Report on Tesla FSD active users and purchase vs subscription split, Q2 2026', date: 'Jul 2026', kind: 'press',
                url: 'https://insideevs.com/news/802547/tesla-fsd-subscription-half/' },
  samsara:    { pub: 'Samsara', title: 'Second quarter fiscal 2027 results', date: '3 Sep 2026', kind: 'primary',
                url: 'https://secure.businesswire.com/news/home/20260903120692/en/Samsara-Reports-Second-Quarter-Fiscal-Year-2027-Financial-Results' },
  'samsara-q4':{ pub: 'Samsara', title: 'Q4 fiscal 2026 results', date: '5 Mar 2026', kind: 'primary',
                url: 'https://www.samsara.com/company/news/press-releases/q4-fiscal-year-2026-results' },
  upstream:   { pub: 'Upstream Security', title: '2026 Global Automotive & Smart Mobility Cybersecurity Report', date: 'Feb 2026', kind: 'analyst',
                url: 'https://en.prnasia.com/releases/global/ransomware-attacks-on-automotive-and-smart-mobility-more-than-doubled-in-2025-according-to-new-research-by-upstream-security-534351.shtml' },
  unece:      { pub: 'UNECE', title: 'UN Regulation No. 155 (cyber security) and No. 156 (software update)', date: '2021; EU all new registrations from Jul 2024', kind: 'primary',
                url: 'https://unece.org/transport/documents/2021/03/standards/un-regulation-no-155-cyber-security-and-cyber-security' },
  'china-gb': { pub: 'TÜV SÜD', title: 'Technical update on China’s GB 44495-2024 vehicle cybersecurity standard', date: '2025', kind: 'analyst',
                url: 'https://www.tuvsud.com/en/knowledge-hub/technical-updates/consumer-products-and-retail-essentials/china-implements-vehicle-cybersecurity-technical-requirements' },
  korea:      { pub: 'Korea Herald', title: 'Report on Korea’s vehicle cybersecurity (CSMS) certification taking effect', date: 'Aug 2025', kind: 'press',
                url: 'https://www.koreaherald.com/article/10660606' },
  india:      { pub: 'Autocar Pro', title: 'Report on India’s draft cybersecurity and software-update rules (AIS-189/190)', date: '27 Jun 2026', kind: 'press',
                url: 'https://www.autocarpro.in/news/india-drafts-mandatory-cybersecurity-software-update-rules-for-connected-and-autonomous-vehicles-133260' },
  bis:        { pub: 'US Department of Commerce (BIS)', title: 'Commerce finalizes rule to secure connected vehicle supply chains', date: '14 Jan 2025', kind: 'primary',
                url: 'https://www.bis.gov/press-release/commerce-finalizes-rule-secure-connected-vehicle-supply-chains-foreign-adversary-threats' },
  iso21434:   { pub: 'ISO / SAE', title: 'ISO/SAE 21434:2021 Road vehicles: cybersecurity engineering (work-product count via secondary sources)', date: '2021', kind: 'primary',
                url: 'https://www.iso.org/standard/70918.html' },
  applied:    { pub: 'Applied Intuition', title: 'Series F at a $15B valuation', date: '17 Jun 2025', kind: 'primary',
                url: 'https://www.appliedintuition.com/news/series-f' },
  'applied-30':{ pub: 'Tech Startups', title: 'Report on investment offers to Applied Intuition at about a $30B valuation', date: '13 Oct 2026', kind: 'press',
                url: 'https://techstartups.com/2026/10/13/applied-intuition-receives-investment-offers-at-30-billion-valuation-doubling-its-15-billion-valuation/' },
  sacra:      { pub: 'Sacra', title: 'Company profile with Applied Intuition revenue estimate', date: '2025', kind: 'analyst',
                url: 'https://sacra.com/c/applied-intuition/' },
  'qnx-survey':{ pub: 'QNX (BlackBerry)', title: 'Under the Hood: The SDV Developer Report (n = 1,100 developers)', date: '14 Oct 2025', kind: 'survey',
                url: 'https://www.nasdaq.com/press-release/qnx-research-reveals-regulatory-pressure-and-development-bottlenecks-are-stalling-sdv' },
  'qnx-dn':   { pub: 'Design News (byline by QNX)', title: 'Why software-defined vehicles are the ultimate test for automakers', date: '5 Jan 2026', kind: 'survey',
                url: 'https://www.designnews.com/automotive-engineering/why-software-defined-vehicles-are-the-ultimate-test-for-automakers' },
  cariad:     { pub: 'InsideEVs', title: 'Report on Cariad operating losses, 2023 and 2024', date: '2025', kind: 'press',
                url: 'https://insideevs.com/news/753673/vw-group-cariad-billions-losses-2024' },
  ford:       { pub: 'Reuters (via Automotive News Europe)', title: 'Report on Ford cancelling its FNV4 electrical architecture', date: '30 Apr 2025', kind: 'press',
                url: 'https://europe.autonews.com/ford/an-ford-kills-electronics-project-0430' },
  karma:      { pub: 'Karma Automotive', title: 'Karma acquires assets and key personnel from Airbiquity', date: '28 Feb 2024', kind: 'primary',
                url: 'https://karmaautomotive.com/news/karma-automotive-acquires-assets-and-key-personnel-from-connected-vehicle-pioneer-airbiquity/' },
  engimarket: { pub: 'EngiMarket (analysis of NHTSA data)', title: 'Analysis of NHTSA recall data, including the software share of 2025 campaigns', date: '2026', kind: 'analyst',
                url: 'https://www.engimarket.com/blog/vehicle-recall-statistics/' },
  excelfore:  { pub: 'Frost & Sullivan', title: 'Award release on Excelfore’s OTA solutions and automaker customers', date: '2024', kind: 'analyst',
                url: 'https://www.frost.com/news/press-releases/excelfore-recognized-with-frost-sullivans-2024-global-enabling-technology-leadership-award-for-its-revolutionary-ota-solutions-for-the-automotive-industry/' },
  'harman-zf':{ pub: 'Brake & Front End', title: 'Report on Harman agreeing to acquire ZF’s ADAS business', date: 'Dec 2025', kind: 'press',
                url: 'https://www.brakeandfrontend.com/harman-to-acquire-zfs-adas-business/' },
  synopsys:   { pub: 'Synopsys', title: 'Synopsys completes acquisition of Ansys', date: '17 Jul 2025', kind: 'primary',
                url: 'https://news.synopsys.com/2025-07-17-Synopsys-Completes-Acquisition-of-Ansys' },
  aumovio:    { pub: 'Elektrobit', title: 'About Elektrobit (part of Aumovio, with PlaxidityX)', date: '2025', kind: 'primary',
                url: 'https://www.elektrobit.com/about/' },
  wards:      { pub: 'WardsAuto / NXP survey', title: 'Article on the NXP survey of OEM SDV and zonal expectations', date: '10 Apr 2024', kind: 'survey',
                url: 'https://www.wardsauto.com/news/tackling-oems-dilemmas-in-software-defined-vehicle-transition/798163/' },
  b133:       { pub: 'B-2.3.3 team draft', title: 'Feasibility screening and engineering personas (scores are a first draft for the team to calibrate)', date: 'Oct 2026', kind: 'team', url: '' },
  personas:   { pub: 'B-2.3.3 team draft', title: 'Personas and stakeholders guide: archetypes built from public research; every pain is a hypothesis', date: 'Oct 2026', kind: 'team', url: '' },
  team:       { pub: 'B-2.3.1 team', title: 'Team assessment: competition ratings, open pockets and matrix placements are hypotheses to test in SME interviews', date: 'Oct 2026', kind: 'team', url: '' },
};

// ------------------------------------------------------------------ LAYERS
window.LAYERS = [
  {
    id: 1, num: '01', colour: 'Lone', icon: 'chip', comp: 3, capture: 'once',
    kicker: 'Value chain · Layer 1 of 6',
    short: 'Compute & E/E', name: 'Compute & E/E',
    tag: 'SoCs, MCUs, zonal controllers',
    scope: 'Central, zonal and domain controllers; SoCs and MCUs',
    callLogos: ['nvidia', 'qualcomm', 'nxp'],
    callStat: '$5B → $17B central compute units, 2030–35[^mck]',
    pocket: { text: 'Zonal ECU migration', star: true, screened: true, label: 'dropped' },
    stat: '$5B → $17B',
    statcap: 'central compute units, 2030–35; zonal units grow $4B → $13B[^mck]',
    logos: ['qualcomm', 'nvidia', 'mobileye', 'nxp', 'infineon', 'renesas', 'bosch|Bosch', 'aptiv'],
    winning: ['Multi-year design wins carried across many OEM platforms',
      'Qualcomm: record $1.59B automotive revenue in fiscal Q3 2026, +61% YoY[^qcom]; Snapdragon Cockpit in 75M+ vehicles (June 2025)[^qcom-ces]'],
    kpis: 'design-win pipeline, content per vehicle, TOPS per watt, ASIL rating, win-to-SOP time',
    moats: ['A design win locks in for the platform’s whole life', 'SDK ecosystems raise switching cost',
      'OEMs now buy compute directly: BMW and Qualcomm co-developed Snapdragon Ride Pilot[^qcom-bmw]'],
    critical: ['Sizing compute headroom: analysts advise 30–50% spare for future OTA features, more in premium cars[^abi-hr]',
      'Central SoCs are intensely contested'],
    critPocket: { text: 'Zonal I/O and power design; legacy ECU migration' },
    pain: ['Hardware is frozen years before the software it must run exists',
      'Thermal and power budgets; memory supply constraints',
      'Partitioning safety-critical and non-critical workloads on one chip'],
  },
  {
    id: 2, num: '02', colour: 'Ltwo', icon: 'layers', comp: 3, capture: 'once',
    kicker: 'Value chain · Layer 2 of 6',
    short: 'Software platforms', name: 'Software platforms',
    tag: 'OS, hypervisor, middleware',
    scope: 'Operating system, hypervisor and middleware',
    callLogos: ['qnx', 'vector', 'android|Android Automotive'],
    callStat: 'Per-unit royalty for a platform’s life; 16.2%/yr growth[^mck]',
    pocket: { text: 'Consolidating: little open space', none: true },
    stat: '275M+',
    statcap: 'vehicles running QNX, across 45+ automakers including the top 10[^bb10k]',
    logos: ['qnx', 'android|Android Automotive', 'vector', 'windriver', '=Elektrobit (Aumovio)', '=RV Tech (Rivian–VW)'],
    winning: ['Be the certified layer everything else runs on',
      'Android Automotive powers Volvo/Polestar, GM, Renault and others; Ford’s system is built with Google[^android]'],
    kpis: 'vehicles deployed, royalty backlog, OEM programs won, safety certifications',
    moats: ['Safety certification is slow and costly to copy',
      'Per-unit royalties run for the vehicle’s whole production life',
      'Growth: OS and middleware ~$3B → ~$13B, 2025–35 (16.2%/yr)[^mck]'],
    critical: ['Hardware abstraction that lets apps move across chips and model years',
      'Merchant vendors are concentrating (QNX, Google, Vector, Applied Intuition), beside OEM-built platforms such as Rivian–VW’s RV Tech[^rvtech]',
      'OEM-backed open source (Eclipse S-CORE, still pre-1.0) is likely to pressure middleware pricing, so there is little open space here[^score]'],
    pain: ['Bridging legacy AUTOSAR Classic ECUs with Linux and Adaptive platforms',
      'Mixed-criticality hypervisors; porting across SoCs', 'Maintaining software over a 15-year vehicle life'],
  },
  {
    id: 3, num: '03', colour: 'Lthree', icon: 'radar', comp: 3, capture: 'mixed',
    kicker: 'Value chain · Layer 3 of 6',
    short: 'ADAS & AD', name: 'ADAS & automated driving',
    tag: 'driver assistance, L2 to L4',
    scope: 'Perception, planning and driver assistance, L2 to L4',
    callLogos: ['mobileye', 'tesla', 'nvidia'],
    callStat: '$9B → $50B in ADAS/AD software, 2025–35[^mck]',
    pocket: { text: 'Safety evidence for ML', star: true, target: 'lead' },
    stat: '$9B → $50B',
    statcap: 'ADAS/AD software, 2025–35: the largest software growth pool, nearly 20%/yr (McKinsey: 19.4%)[^mck]',
    logos: ['mobileye', 'tesla', 'gm|Super Cruise', 'nvidia', 'qualcomm', 'waymo'],
    winning: ['High attach rates at a low per-unit price, plus paid upgrades',
      'Mobileye: ~38M EyeQ units in its 2026 outlook; Surround ADAS at a $100–150 ASP and ~70% gross margin[^mbly]',
      'Tesla: 1.48M active FSD (Supervised) users in Q2 2026, about 45% on subscription[^tsla]'],
    kpis: 'ASP, attach and renewal rate, disengagements, MTBF',
    moats: ['Fleet-data flywheels', 'Accumulated safety-validation evidence',
      'Growth: L2 could be 52% of sales by 2030, L3 16% by 2035[^mck]'],
    critical: ['Proving safety across the long tail of edge cases', 'Very high competition in L2+ software stacks'],
    critPocket: { text: 'W1 · Safety evidence for ML components', star: true },
    pain: ['Sensor calibration and fusion', 'Scenario coverage for validation',
      'Compute and LiDAR cost per vehicle; L3/L4 timelines keep slipping'],
  },
  {
    id: 4, num: '04', colour: 'Lfour', icon: 'ota', comp: 2, capture: 'mixed',
    kicker: 'Value chain · Layer 4 of 6',
    short: 'OTA & lifecycle', name: 'OTA & software lifecycle',
    tag: 'updates, rollback, campaigns',
    scope: 'Over-the-air updates, rollback and campaign management',
    callLogos: ['tesla', 'rivian', 'harman'],
    callStat: 'OTA fixes could save US OEMs $1.5B by 2028[^abi]',
    pocket: { text: 'OTA for commercial & off-highway', star: true, screened: true, label: 'dropped' },
    stat: '~15%',
    statcap: 'of recalled US vehicles since 2022 were eligible for an over-the-air remedy[^bizzy]; 891 recalls covered 29.3M vehicles in 2025[^nhtsa]',
    logos: ['tesla', 'rivian', 'harman', 'excelfore', '=Sibros', '=Elektrobit'],
    winning: ['Full-vehicle updates (every ECU, not just infotainment) with near-zero failed installs',
      'Software-first OEMs such as Tesla and Rivian treat OTA as a core in-house capability; specialists such as Harman, Sibros and Excelfore supply many others[^excelfore]'],
    kpis: 'share of ECUs updatable OTA, success rate, campaign duration, recalls fixed OTA',
    moats: ['Deep bootloader and ECU integration makes vendors sticky', 'UN R156 software-update compliance[^unece]',
      'Growth: recall pressure; OTA fixes could save US OEMs $1.5B by 2028 (ABI forecast, 2023)[^abi]'],
    critical: ['Safe rollback and version dependencies across ECUs', 'Large OEMs increasingly insource'],
    critPocket: { text: 'Full-vehicle OTA for commercial & off-highway' },
    pain: ['Legacy ECUs without dual (A/B) memory',
      'Long flash times take vehicles out of service; cellular data cost',
      'Cross-ECU compatibility testing; most recalls are still hardware, though software is now ~20–25% of campaigns[^engimarket]'],
  },
  {
    id: 5, num: '05', colour: 'Lfive', icon: 'antenna', comp: 3, capture: 'recurring',
    kicker: 'Value chain · Layer 5 of 6',
    short: 'Telematics', name: 'Telematics & connectivity',
    tag: 'connected services, fleets',
    scope: 'Connected services, fleet telematics and cellular',
    callLogos: ['onstar|OnStar', 'motive', 'att'],
    callStat: 'Monthly subscriptions: OnStar ~$3.1B guided for 2026[^gm-q1]',
    pocket: { text: 'Mixed-make fleet data' },
    stat: '$3.1B',
    statcap: 'OnStar revenue GM guides for 2026 (+15%), from ~12M subscribers at ~$20 average monthly revenue each[^gm-q1]',
    logos: ['onstar|OnStar', 'motive', '=Samsara', '=Geotab', 'att', 'verizon'],
    winning: ['A large connected base that pays every month', 'Samsara: $2.1B ARR, +30% YoY (quarter to Aug 2026)[^samsara]'],
    kpis: 'ARR, net revenue retention, ARPU, trial-to-paid conversion',
    moats: ['Installed base and data scale (Samsara: 25T+ data points a year)[^samsara-q4]', 'Workflow lock-in for fleets',
      'Growth: AI safety features; factory-fit telematics replacing aftermarket boxes'],
    critical: ['Access to raw vehicle data from the OEM', 'Aftermarket fleet telematics is crowded'],
    critPocket: { text: 'Normalizing data across mixed-make fleets' },
    pain: ['Each OEM exposes different signals and APIs',
      'Heavy-duty (J1939) and light-duty vehicle buses differ', 'Cellular cost; signal latency and gaps'],
  },
  {
    id: 6, num: '06', colour: 'Lsix', icon: 'database', comp: 2, capture: 'recurring',
    kicker: 'Value chain · Layer 6 of 6',
    short: 'Data & cloud', name: 'Data & cloud services',
    tag: 'data platforms, cloud backend',
    scope: 'Vehicle data platforms, cloud backend and data products',
    callLogos: ['aws', 'azure', 'gcloud'],
    callStat: 'Consent now gates data revenue (FTC, Jan 2026)[^ftc]',
    pocket: { text: 'Edge-side data selection' },
    stat: '20 years',
    statcap: 'of opt-in consent required by the FTC’s final order against GM, 14 Jan 2026[^ftc]',
    logos: ['aws', 'azure', 'gcloud', 'tomtom', '=HERE', '~OEM data platforms'],
    winning: ['Turn consented data into predictive maintenance, insurance and ADAS-training value',
      'Players: hyperscalers, OEM data platforms, fleet software firms'],
    kpis: 'revenue per connected vehicle, consent rate, data cost per vehicle',
    moats: ['Installed base plus consent',
      'The FTC order bars GM from sharing driving data with consumer reporting agencies for 5 years[^ftc]',
      'GM has accrued $0.5B for related investigations and litigation[^gm-10q]'],
    critical: ['Privacy-safe consent now gates monetization', 'Direct resale of driver data looks unattractive'],
    critPocket: { text: 'Edge-side selection of useful data' },
    pain: ['Data volume vs cellular cost', 'Inconsistent signal schemas across OEMs', 'Consent tracking; data quality'],
  },
  {
    id: 7, num: '07', colour: 'Lcyber', icon: 'shield', comp: 2, pillar: true, capture: 'spans',
    kicker: 'Cross-cutting · Spans every layer',
    short: 'Cybersecurity', name: 'Cybersecurity',
    pillarLabel: 'CYBERSECURITY',
    scope: 'The gate to type approval: no compliant cybersecurity management system, no sales',
    callStat: 'gate to type approval (R155/R156)[^unece]',
    pocket: { text: 'SBOM & supply-chain evidence', star: true, screened: true },
    stat: '494',
    statcap: 'public automotive cyber incidents in 2025; 92% remote, 44% ransom-related (Upstream)[^upstream]',
    logos: ['=Upstream', '=VicOne (Trend Micro)', 'plaxidityx', '=Karamba', '~OEM vehicle SOCs'],
    winning: ['Pass type approval and run a vehicle security operations centre (vSOC) at fleet scale',
      'PlaxidityX (formerly Argus Cyber Security) is now part of Aumovio, Continental’s spin-off[^aumovio]'],
    kpis: 'vehicles monitored, time to detect and respond, audit pass rate',
    moats: ['Regulation is the engine: UN R155/R156 mandatory for all new EU registrations since July 2024[^unece]',
      'China (GB 44495, in force Jan 2026)[^china-gb] and Korea (CSMS, Aug 2025)[^korea] enforce aligned rules; India’s AIS-189/190 are still draft[^india]',
      'US Commerce (BIS) bars Chinese/Russian connected-vehicle software from MY2027 and hardware from MY2030[^bis]'],
    critical: ['No compliant cybersecurity management system, no sales', 'Moderate competition among specialists'],
    critPocket: { text: 'SBOM and supply-chain provenance evidence', star: true },
    pain: ['Patching over a 15-year vehicle life; key management', 'SBOMs across many suppliers',
      'Small ECUs that can’t run heavy crypto; 42 ISO/SAE 21434 work products[^iso21434]'],
  },
  {
    id: 8, num: '08', colour: 'Lvv', icon: 'flask', comp: 2, pillar: true, capture: 'spans',
    kicker: 'Cross-cutting · Spans every layer',
    short: 'Integration, V&V', name: 'Integration, V&V & tooling',
    pillarLabel: 'INTEGRATION · V&V',
    scope: 'Simulation, hardware-in-the-loop (HIL) test, virtual ECUs and development toolchains',
    callStat: 'fastest-growing service: 11.4%/yr[^mck]',
    pocket: { text: 'What can leave the bench', star: true, target: 'second' },
    stat: '11.4%/yr',
    statcap: 'integration, verification and validation services: the fastest-growing slice of auto software spend, 2025–35[^mck]',
    logos: ['applied', 'dspace', 'vector', 'synopsys', '~OEM in-house HIL labs'],
    winning: ['Own the test loop that OEMs run every day',
      'Applied Intuition: $15B valuation (June 2025)[^applied], with ~$30B offers reported Oct 2026[^applied-30]; says it serves 18 of the top 20 OEMs; ~$830M ARR (2025 estimate)[^sacra]'],
    kpis: 'ARR, OEM coverage, test-cycle time, rig utilization',
    moats: ['Embedded in OEM CI pipelines and safety evidence, so hard to rip out',
      '52% of engineering VPs name integration complexity as a top SDV challenge[^qnx-dn]',
      'Synopsys now includes Ansys simulation (deal closed July 2025)[^synopsys]'],
    critical: ['In QNX’s 2025 survey, developers cite long cycles (37%) and debugging and testing (36%)[^qnx-survey]',
      'The tool market is fragmented below the leaders'],
    critPocket: { text: 'W2 · What can leave the bench (SIL vs HIL)', star: true },
    pain: ['HIL benches are expensive and scarce', 'Virtual ECUs lack timing and I/O fidelity',
      'Embedded CI is hard because code depends on hardware; ISO 26262/21434 traceability'],
  },
];

// ------------------------------------------------------------------ ECOSYSTEM
// x, y = centre of each capsule on the 1600 x 900 stage.
window.ACTORS = [
  { id: 'semis', side: 'L', x: 300, y: 236, colour: 'Lone', icon: 'chip', title: 'Chipmakers', sub: 'SoCs, MCUs, SDKs',
    logos: ['nvidia', 'qualcomm', 'nxp'], layers: [1],
    gives: 'SoCs, MCUs and SDKs, sold to Tier 1s and, increasingly, straight to OEMs.',
    gets: 'Chip price per unit plus multi-year platform deals.',
    sdv: 'OEMs increasingly buy central compute straight from chipmakers: BMW and Qualcomm co-developed Snapdragon Ride Pilot[^qcom-bmw] and signed a long-term compute supply deal in 2026[^bmw-reu].' },
  { id: 'tier1', side: 'L', x: 236, y: 366, colour: 'Lthree', icon: 'cogs', title: 'Tier 1 suppliers', sub: 'controllers, modules, integration',
    logos: ['bosch|Bosch', 'aptiv', 'zf'], layers: [1],
    gives: 'Controllers and modules, plus the integration work that puts them into a vehicle.',
    gets: 'Module price per vehicle.',
    sdv: 'As OEMs buy compute directly, Tier 1s lean toward integration work (the shift is not yet quantified; chipmakers still partner with Bosch and others). Harman agreed to buy ZF’s ADAS business in Dec 2025[^harman-zf]. Zonal ECU migration, our Round 1 target #2, is part of this integration work; we dropped it after the company screen.' },
  { id: 'swp', side: 'L', x: 216, y: 496, colour: 'Ltwo', icon: 'layers', title: 'Software platforms', sub: 'OS, hypervisor, middleware',
    logos: ['qnx', 'vector', 'android'], layers: [2],
    gives: 'The certified operating system, hypervisor and middleware everything else runs on.',
    gets: 'Per-unit royalty that runs for the vehicle’s whole production life.',
    sdv: 'Merchant vendors are concentrating (QNX, Google, Vector, Applied Intuition), OEMs build their own (RV Tech)[^rvtech], and OEM-backed open source pressures price[^score].' },
  { id: 'spec', side: 'L', x: 236, y: 626, colour: 'Lvv', icon: 'tools', title: 'SDV specialists', sub: 'OTA, cybersecurity, V&V tools',
    logos: ['plaxidityx', 'dspace', 'excelfore'], layers: [4, 7, 8], focus: true,
    gives: 'OTA platforms, cybersecurity and V&V tooling: the jobs every OEM must finish before launch.',
    gets: 'Licences and SaaS subscriptions.',
    sdv: 'Our focus area sits here: integration, verification and validation (V&V), and specifically whether a model, a test or an update can be trusted. All three wedges are V&V work, with dSPACE and Applied Intuition as the routes in. OTA and SBOM evidence were dropped.' },
  { id: 'cloud', side: 'L', x: 300, y: 756, colour: 'Lsix', icon: 'cloud', title: 'Cloud & connectivity', sub: 'backend, cellular, compute',
    logos: ['aws', 'azure', 'verizon'], layers: [5, 6],
    gives: 'Cloud backend, cellular connectivity and compute.',
    gets: 'Usage fees.',
    sdv: 'Every connected feature adds backend and cellular load; data volume vs cellular cost is a standing pain point.' },
  { id: 'dealers', side: 'R', x: 1318, y: 270, colour: 'Lslate', icon: 'store', title: 'Dealers & service', sub: 'sales, delivery, repair',
    logos: ['~franchise dealers', '~repair shops'], layers: [4],
    gives: 'Sales, delivery and repair to consumers.',
    gets: 'Buy vehicles at wholesale; earn on sales and service.',
    sdv: 'Dealers lose software-fix visits as updates move over the air, though in ABI’s analysis nearly half of software-recall vehicles still needed a dealer visit[^abi].' },
  { id: 'consumers', side: 'R', x: 1362, y: 422, colour: 'Lfour', icon: 'person', title: 'Consumers', sub: 'keep paying for services after the sale',
    logos: ['onstar|OnStar', 'gm|Super Cruise'], layers: [5],
    gives: 'Usage data back to the OEM, and monthly payments for features and subscriptions such as OnStar and Super Cruise (GM services shown as examples).',
    gets: 'Features and subscriptions delivered after the sale.',
    sdv: 'Drivers keep paying after the sale: GM guides ~$3.1B of OnStar revenue for 2026[^gm-q1]. About 30–40% of Super Cruise owners keep paying after the 3 included years[^gm-q4].' },
  { id: 'fleets', side: 'R', x: 1362, y: 574, colour: 'Lfive', icon: 'truck', title: 'Fleet operators', sub: 'rental, ride-hail and robotaxi fleets',
    logos: ['hertz', 'uber', 'waymo'], layers: [4, 5],
    gives: 'Fleet data back to the OEM, and fleet contracts.',
    gets: 'Vehicles and APIs.',
    sdv: 'Fleets buy on uptime and total cost of ownership, and often run third-party telematics beside the OEM’s own.' },
  { id: 'partners', side: 'R', x: 1318, y: 726, colour: 'Lsix', icon: 'handshake', title: 'Data partners', sub: 'telematics, maps, location data',
    logos: ['=Samsara', 'tomtom', '=HERE'], layers: [5, 6],
    gives: 'Telematics, map and location products built on vehicle data.',
    gets: 'Consented vehicle data, under a data licence.',
    sdv: 'The FTC’s final order against GM (14 Jan 2026) makes opt-in consent the gate for data revenue[^ftc].' },
];

window.HUB = {
  x: 800, y: 496, r: 150,
  oems: ['gm', 'ford', 'toyota', 'vw', 'bmw', 'hyundai', 'tesla-t', 'honda', 'nio', 'byd'],
  title: 'Automakers (OEMs)',
  gives: 'Vehicles, features and subscriptions; consented data to partners.',
  gets: 'Vehicle margin plus recurring software revenue.',
  getsBefore: 'Vehicle margin, paid once at the sale.',
  sdv: 'The OEM is still the hub, but SDVs add a second revenue loop after the sale. The bet is risky: VW’s Cariad lost €2.4B in 2023 and again in 2024[^cariad], and Ford scrapped its FNV4 architecture in 2025[^ford].',
};

window.REGULATORS = {
  title: 'Regulators & standards', sub: 'set the rules for everyone',
  list: ['NHTSA', 'UNECE R155/R156', 'US Commerce (BIS)', 'FTC', 'ISO 26262 / 21434'],
  detail: 'Rules, type approval and recalls. UN R155/R156 has been mandatory for all new EU registrations since July 2024[^unece]; the BIS rule bars Chinese/Russian connected-vehicle software from MY2027 and hardware from MY2030[^bis]; the FTC’s Jan 2026 order makes opt-in consent the gate for data revenue[^ftc]. ISO 26262 and ISO/SAE 21434 are voluntary standards that approvals lean on.',
};

// type: goods | data | rules. shift: 1-4 marks a flow SDVs change.
// isNew: the flow does not exist in the pre-SDV picture (hidden in "Before SDV").
window.FLOWS = [
  { id: 'semis',    from: 'semis', to: 'hub', type: 'goods', shift: 1, isNew: true, label: 'design wins', money: 'platform deals', t: .44 },
  { id: 'tier1',    from: 'tier1', to: 'hub', type: 'goods', label: 'controllers', money: 'module price', t: .5 },
  { id: 'swp',      from: 'swp',   to: 'hub', type: 'goods', label: 'OS, middleware', money: 'royalty', t: .5 },
  { id: 'spec',     from: 'spec',  to: 'hub', type: 'goods', label: 'OTA, cyber, V&V', money: 'licences, SaaS', t: .5 },
  { id: 'cloud',    from: 'cloud', to: 'hub', type: 'goods', label: 'backend, cellular', money: 'usage fees', t: .44 },
  { id: 'soc',      from: { x: 236, y: 287 }, to: { x: 236, y: 316 }, type: 'goods', label: 'SoCs', money: 'chip price', inline: true, a: ['semis', 'tier1'] },
  { id: 'dealers',  from: 'hub', to: 'dealers', type: 'goods', shift: 3, label: 'vehicles', money: 'wholesale', shiftNote: 'fixes go OTA', t: .6 },
  { id: 'cons',     from: 'hub', to: 'consumers', type: 'goods', shift: 2, isNew: true, label: 'features, subs', money: 'monthly', back: 'usage data', t: .52, dy: -14, ang: 16 },
  { id: 'consData', from: 'consumers', to: 'hub', type: 'data', isNew: true, ang: 6, dy: 18, hidden: true },
  { id: 'fleet',    from: 'hub', to: 'fleets', type: 'goods', label: 'vehicles, APIs', money: 'fleet contracts', back: 'fleet data', t: .5, dy: -14, ang: -10 },
  { id: 'fleetData',from: 'fleets', to: 'hub', type: 'data', isNew: true, ang: -20, dy: 18, hidden: true },
  { id: 'partners', from: 'hub', to: 'partners', type: 'data', isNew: true, label: 'consented data', money: 'data licence', t: .5 },
  { id: 'sales',    from: { x: 1272, y: 320 }, to: { x: 1272, y: 372 }, type: 'goods', label: 'sales, service', inline: true, a: ['dealers', 'consumers'] },
  { id: 'telem',    from: { x: 1272, y: 676 }, to: { x: 1272, y: 624 }, type: 'goods', shift: 4, isNew: true, label: '3rd-party telematics', inline: true, a: ['partners', 'fleets'] },
  { id: 'rules',    from: { x: 1000, y: 132 }, to: 'hub', type: 'rules', label: 'rules, type approval, recalls', t: .5, curve: true },
];

window.ERA_TEXT = {
  before: { title: 'Before SDVs', text: 'One revenue loop: suppliers sell through Tier 1s, the OEM sells the car once through dealers, and a software fix means a dealer visit.' },
};

window.SHIFTS = [
  { n: 1, title: 'Chips go direct', flows: ['semis', 'soc'], actors: ['semis', 'tier1'],
    text: 'OEMs increasingly buy central compute straight from chipmakers (BMW–Qualcomm, 2025–26)[^bmw-reu], pushing Tier 1s toward integration work.' },
  { n: 2, title: 'Paying after sale', flows: ['cons', 'consData'], actors: ['consumers'],
    text: 'Drivers and fleets keep paying the OEM after the sale. GM guides ~$3.1B of OnStar revenue for 2026[^gm-q1] and targets ~70% gross margins on OnStar and Super Cruise[^gm-q3l].' },
  { n: 3, title: 'Fixes go OTA', flows: ['dealers', 'sales'], actors: ['dealers'],
    text: 'Dealers lose software-fix visits as updates move over the air. About 15% of recalled US vehicles since 2022 were eligible for an OTA remedy[^bizzy].' },
  { n: 4, title: '3rd-party telematics', flows: ['telem', 'fleet', 'fleetData'], actors: ['fleets', 'partners'],
    text: 'Fleets buy on uptime and total cost of ownership, and often run third-party telematics beside the OEM’s own.' },
];

// ------------------------------------------------------------------ GROWTH POOLS ($B)
// cagr: McKinsey's stated rate where given; computed = derived from the rounded endpoints.
window.POOLS = [
  { name: 'ADAS / AD software', layer: 3, from: 9, to: 50, years: '2025–35', cagr: 19.4, colour: 'Lthree' },
  { name: 'Central compute units', layer: 1, from: 5, to: 17, years: '2030–35', cagr: 27.7, computed: true, colour: 'Lone' },
  { name: 'Zonal units', layer: 1, from: 4, to: 13, years: '2030–35', cagr: 26.6, computed: true, colour: 'Lone' },
  { name: 'OS & middleware', layer: 2, from: 3, to: 13, years: '2025–35', cagr: 16.2, colour: 'Ltwo', approx: true },
];

// ------------------------------------------------------------------ WHITESPACE
// x = competitive intensity (0 low .. 1 high), y = criticality to launch (0 .. 1). Team assessments.
// cand = the shortlisted candidate's number, which is its final B-2.3.3 rank (4 = SBOM, screened out).
window.DOTS = [
  { label: 'Zonal ECU migration', x: .06, y: .835, colour: 'Lone', cand: 2, layer: 1 },
  { label: 'HIL & virtual-ECU validation', x: .15, y: .74, colour: 'Lvv', cand: 1, layer: 8 },
  { label: 'OTA for commercial vehicles', x: .06, y: .645, colour: 'Lfour', cand: 3, layer: 4 },
  { label: 'SBOM & cyber evidence', x: .14, y: .555, colour: 'Lcyber', cand: 4, layer: 7 },
  { label: 'Central SoCs', x: .9, y: .835, colour: 'Lone', layer: 1, left: true },
  { label: 'L2+ ADAS stacks', x: .82, y: .74, colour: 'Lthree', layer: 3, left: true },
  { label: 'Vehicle OS', x: .75, y: .645, colour: 'Ltwo', layer: 2, left: true },
  { label: 'Edge-side data selection', x: .32, y: .39, colour: 'Lsix', layer: 6 },
  { label: 'Aftermarket fleet telematics', x: .87, y: .31, colour: 'Lfive', layer: 5, left: true },
  { label: 'Driver-data resale', x: .1, y: .16, colour: 'Lsix', layer: 6 },
  { label: 'Infotainment apps', x: .92, y: .16, colour: 'Ltwo', layer: 2, left: true },
];

// The four shortlisted in B-2.3.1, numbered by their Round 1 rank (B-2.3.3 first draft). This is the
// record of Round 1; "now" says where each one went after the company screen. id matches SCREEN.positions and DOSSIERS.
window.CANDIDATES = [
  { n: 1, id: 'hil', target: 1, title: 'HIL and virtual-ECU validation', layer: 8, tag: 'Integration, V&V', colour: 'Lvv',
    text: '52% of engineering VPs name integration complexity as a top SDV challenge[^qnx-dn], and HIL benches are costly and scarce.',
    personas: 'V&V leads, test-bench engineers', now: 'Now narrowed to W2, What can leave the bench' },
  { n: 2, id: 'zonal', target: 2, title: 'Zonal migration of legacy ECUs', layer: 1, tag: 'Compute & E/E', colour: 'Lone',
    text: 'McKinsey expects 77% of architectures to be zonal or central by 2035, up from under 30% today[^mck], so legacy ECU software must be split, ported and re-validated over years of mixed fleets.',
    personas: 'E/E architects, systems integration engineers', now: 'Now dropped: best company score 13 of 25', out: true },
  { n: 3, id: 'ota', target: 3, title: 'OTA for commercial & off-highway', layer: 4, tag: 'OTA & lifecycle', colour: 'Lfour',
    text: 'Large OEMs insource OTA; smaller and specialty makers still need full-vehicle updates on mixed hardware.',
    personas: 'embedded leads, fleet maintenance managers', now: 'Now dropped: best company score 11 of 25', out: true },
  { n: 4, id: 'sbom', screened: true, title: 'SBOM & cyber lifecycle evidence', layer: 7, tag: 'Cybersecurity', colour: 'Lcyber',
    text: 'UN R155 type approval[^unece] and the US Commerce rule’s compliance declarations[^bis] turn supplier provenance and patching into gates.',
    personas: 'product cybersecurity engineers, supplier quality', now: 'Still out: best company score 10 of 25', out: true },
];

// ------------------------------------------------------------------ FACT-CHECK LEDGER
// status: verified | corrected | forecast | estimate | hypothesis
// v1 = what the first version said (for corrected items).
window.CLAIMS = [
  { slide: 'Why SDVs', status: 'corrected', src: 'mck', claim: '$519B automotive software & electronics market by 2035; 4.5%/yr vs ~1% for vehicles', pending: 'McKinsey PDF blocked to automated fetch: confirm the January 2026 publication month', v1: 'labelled the “SDV” software & electronics market' },
  { slide: 'Why SDVs', status: 'verified', src: 'gm-q1', claim: 'GM guides ~$3.1B of OnStar revenue for 2026 (+15%)' },
  { slide: 'Why SDVs', status: 'corrected', src: 'gm-q3l', claim: 'GM targets ~70% gross margins on OnStar and Super Cruise', pending: 'GM shareholder letter blocked: wording read via press coverage', v1: '“software keeps about 70¢ of each dollar”' },
  { slide: 'Why SDVs', status: 'verified', src: 'rivian', claim: 'Rivian’s Gen 2 R1 cut ECUs from 17 to 7' },
  { slide: 'Why SDVs', status: 'corrected', src: 'nhtsa', claim: '891 US vehicle recalls covered 29.3M vehicles in 2025', pending: 'NHTSA PDF returned 403: figures read via a page quoting it', v1: '“about 900 recalls, 29.2M vehicles”' },
  { slide: 'Why SDVs', status: 'forecast', src: 'abi', claim: 'OTA recall fixes could save US OEMs $1.5B by 2028', v1: 'now labelled as a 2023 forecast' },
  { slide: 'Why SDVs', status: 'corrected', src: 'spg-china', claim: 'Chinese OEMs target 18–24-month development cycles, about half the Western norm', v1: '“already run” 18–24-month cycles' },
  { slide: 'Ecosystem', status: 'verified', src: 'bmw-reu', claim: 'BMW buys compute directly from Qualcomm (Ride Pilot 2025; supply deal 2026)', v1: 'the Tier 1 “squeeze” is now framed as unquantified' },
  { slide: 'Ecosystem', status: 'corrected', src: 'gm-q4', claim: 'About 30–40% of Super Cruise owners keep paying after the 3 included years', v1: '“only ~40% renew after the trial”' },
  { slide: 'Ecosystem', status: 'verified', src: 'ftc', claim: 'FTC final order vs GM, 14 Jan 2026: 20-year opt-in consent; 5-year ban on sharing with consumer reporting agencies' },
  { slide: 'Ecosystem', status: 'verified', src: 'cariad', claim: 'VW’s Cariad lost €2.4B in 2023 (and €2.4B again in 2024)' },
  { slide: 'Ecosystem', status: 'corrected', src: 'ford', claim: 'Ford scrapped its FNV4 zonal architecture in 2025', v1: '“scaled back” its centralized architecture' },
  { slide: 'Ecosystem', status: 'corrected', src: 'harman-zf', claim: 'Harman moved out of “SDV specialists” (Samsung-owned Tier 1, buying ZF ADAS); Excelfore shown instead', v1: 'Harman listed as an SDV specialist' },
  { slide: 'Ecosystem', status: 'corrected', src: 'team', claim: '“Consumers” now shows OnStar and Super Cruise as services they pay for; data partners no longer repeat Motive, and “insurance” was dropped', v1: 'GM products shown as consumers' },
  { slide: 'Value chain · 01', status: 'verified', src: 'mck', claim: 'Central compute units $5B → $17B and zonal units $4B → $13B, 2030–35' },
  { slide: 'Value chain · 01', status: 'verified', src: 'qcom', claim: 'Qualcomm record $1.59B automotive quarter (fiscal Q3 2026), +61% YoY', pending: 'Release body did not load: figures from consistent secondary coverage' },
  { slide: 'Value chain · 01', status: 'estimate', src: 'abi-hr', claim: '30–50% compute headroom for future OTA features is one analyst’s guidance', v1: 'stated as a requirement' },
  { slide: 'Value chain · 02', status: 'verified', src: 'bb10k', claim: 'QNX in 275M+ vehicles across 45+ automakers, including the top 10' },
  { slide: 'Value chain · 02', status: 'corrected', src: 'android', claim: 'Android Automotive: Volvo/Polestar, GM, Renault; Ford’s system is “built with Google”', v1: 'listed Ford and Renault-Nissan as AAOS users' },
  { slide: 'Value chain · 02', status: 'verified', src: 'mck', claim: 'OS & middleware ~$3B → ~$13B, 2025–35 (16.2%/yr)' },
  { slide: 'Value chain · 02', status: 'corrected', src: 'rvtech', claim: 'RV Tech is a captive Rivian–VW joint venture, not a merchant platform vendor', v1: 'listed as a direct competitor' },
  { slide: 'Value chain · 03', status: 'verified', src: 'mck', claim: 'ADAS/AD software ~$9B → ~$50B, 2025–35 (19.4%/yr; rounded endpoints give 18.7%)' },
  { slide: 'Value chain · 03', status: 'verified', src: 'mbly', claim: 'Mobileye ~38M EyeQ units in 2026 outlook; Surround ADAS $100–150 ASP, ~70% gross margin' },
  { slide: 'Value chain · 03', status: 'corrected', src: 'tsla', claim: 'Tesla: 1.48M active FSD (Supervised) users in Q2 2026, ~45% on subscription', pending: 'Purchase/subscription split from secondary sources, not Tesla’s update PDF', v1: '“1.48M active FSD subscriptions”' },
  { slide: 'Value chain · 03', status: 'verified', src: 'mck', claim: 'L2 could be 52% of sales by 2030; L3 16% by 2035', pending: 'One write-up says 52% by 2035: check McKinsey Exhibit 1' },
  { slide: 'Value chain · 04', status: 'corrected', src: 'bizzy', claim: '~15% of recalled US vehicles since 2022 were eligible for an OTA remedy', v1: '“~16% fixed over the air (Q3 2025)”' },
  { slide: 'Value chain · 04', status: 'corrected', src: 'karma', claim: 'Airbiquity removed from OTA players (assets bought by Karma, Feb 2024)', v1: 'Airbiquity listed as an OTA supplier' },
  { slide: 'Value chain · 04', status: 'estimate', src: 'engimarket', claim: 'Software is ~20–25% of US recall campaigns; most are still hardware' },
  { slide: 'Value chain · 05', status: 'corrected', src: 'gm-q1', claim: 'OnStar: ~12M subscribers (target 13M by end-2026), ~$20 average monthly revenue each', v1: '“~13M subscribers paying ~$20 a month”' },
  { slide: 'Value chain · 05', status: 'verified', src: 'samsara', claim: 'Samsara $2.1B ARR, +30% YoY' },
  { slide: 'Value chain · 06', status: 'corrected', src: 'gm-10q', claim: 'GM has accrued $0.5B for driver-data investigations and litigation', pending: 'Accrual wording came from filing excerpts: confirm in the 10-Q', v1: '“$300M”' },
  { slide: 'Value chain · 07', status: 'verified', src: 'upstream', claim: '494 public automotive cyber incidents in 2025; 92% remote; 44% ransom-related' },
  { slide: 'Value chain · 07', status: 'verified', src: 'unece', claim: 'UN R155/R156 mandatory for all new EU registrations since July 2024' },
  { slide: 'Value chain · 07', status: 'corrected', src: 'china-gb', claim: 'China (Jan 2026) and Korea (Aug 2025) enforce R155-aligned rules; India’s are still draft', pending: 'Confirm China amendment dates and whether India has finalised its rules', v1: '“China, India and Korea have aligned drafts”' },
  { slide: 'Value chain · 07', status: 'verified', src: 'bis', claim: 'BIS rule: Chinese/Russian connected-vehicle software banned from MY2027, hardware from MY2030' },
  { slide: 'Value chain · 07', status: 'verified', src: 'iso21434', claim: 'ISO/SAE 21434 defines 42 work products (two secondary sources; the standard is paywalled)', pending: 'Standard is paywalled: confirm the count against ISO/SAE 21434' },
  { slide: 'Value chain · 08', status: 'verified', src: 'mck', claim: 'Integration, V&V services: fastest-growing slice of auto software spend, 11.4%/yr' },
  { slide: 'Value chain · 08', status: 'corrected', src: 'applied-30', claim: 'Applied Intuition: $15B valuation (June 2025), ~$30B offers reported Oct 2026', v1: '$15B shown as current' },
  { slide: 'Value chain · 08', status: 'estimate', src: 'sacra', claim: 'Applied Intuition ~$830M ARR is a Sacra estimate, not a company figure' },
  { slide: 'Value chain · 08', status: 'corrected', src: 'qnx-dn', claim: '52% of engineering VPs name integration complexity as a top challenge (QNX)', pending: 'VP sample size not published in the QNX release', v1: '“the top challenge”, credited to McKinsey' },
  { slide: 'Value chain · 08', status: 'estimate', src: 'qnx-survey', claim: 'Developers cite long cycles (37%) and debugging/testing (36%); QNX 2025 vendor survey, n = 1,100' },
  { slide: 'Whitespace', status: 'corrected', src: 'mck', claim: '77% of E/E architectures zonal or central by 2035, up from under 30% today', v1: 'unsourced “90%+ of OEMs committed to zonal”' },
  { slide: 'Whitespace', status: 'hypothesis', src: 'team', claim: 'Competition ratings, open pockets and matrix placements are team hypotheses' },
];

window.STATUS = {
  verified:   { label: 'Verified', desc: 'Correct as stated, against the source' },
  corrected:  { label: 'Corrected in v2', desc: 'Wording, figure or credit fixed since v1' },
  forecast:   { label: 'Forecast', desc: 'A projection, labelled as one' },
  estimate:   { label: 'Estimate or survey', desc: 'Third-party estimate or vendor survey' },
  hypothesis: { label: 'Team hypothesis', desc: 'To be tested in SME interviews' },
};


// =====================================================================
//  v3 ADDITIONS: the decision journey
//  Everything below is drawn from the team's own work:
//  B-2.3.3 "Feasibility Screening & Engineering Personas" (first draft)
//  and "Personas & Stakeholders – Detailed Guide". Facts inside are the
//  corrected (audited) versions. Scores and confidence are team drafts.
// =====================================================================

// ------------------------------------------------------------------ TEAM IDENTITY
// Fill these in and they appear on the cover, chrome and page title.
// Leave a field empty ('') to hide it.
window.TEAM = {
  name: '',          // e.g. 'Team Volt'
  university: 'Western Michigan University',
  track: 'Product Innovation Track',
  program: 'EcoCAR Innovation Challenge',
  deliverable: 'B-2.3.1 Value Chain Definition & Ecosystem Diagram',
  asOf: '13 Oct 2026',   // date of the market-claims audit
  updated: '10 Nov 2026',
};

// ------------------------------------------------------------------ EXECUTIVE SUMMARY
window.EXEC = {
  thesis: 'Where an engineering team can win in the software-defined vehicle',
  sub: 'We mapped nine actor groups and eight value-chain layers, audited 43 market claims, screened seven open pockets, then tested the leaders against three real companies. Three candidate wedges go into customer discovery.',
  bottomLine: 'Software-defined vehicles move a car’s value to a few central computers and their software, and let automakers keep earning after the sale. The largest pools belong to well-funded incumbents, so our opening is the engineering work every OEM must finish before launch. Testing our first targets (HIL, zonal, OTA) against real companies narrowed our focus area to integration, verification and validation (V&V): can a model, a test or an update be trusted? It is the fastest-growing slice of auto software spend, and it gates every release.',
  facts: [
    { v: '$519B', t: 'automotive software & electronics by 2035, 4.5%/yr vs ~1% for vehicles[^mck]' },
    { v: '11.4%/yr', t: 'integration, verification & validation services: the fastest-growing slice of auto software spend[^mck]' },
    { v: '77%', t: 'of E/E architectures expected to be zonal or central by 2035, up from under 30%[^mck]' },
    { v: '~15%', t: 'of recalled US vehicles since 2022 were eligible for an over-the-air fix[^bizzy]' },
  ],
  tests: [
    'W1: Safety engineers have had evidence for an ML component challenged in ways sampled testing cannot answer.',
    'W2: HIL leads have kept or delayed tests because no measured data showed what a virtual ECU would miss.',
    'W3: Teams that retrain perception models re-test far more than a change needs, or cut scope on judgment they struggle to defend.',
  ],
};

// ------------------------------------------------------------------ FUNNEL (map -> targets)
// B-2.3.3 re-scored all seven open pockets, not only the four shortlisted, so the
// shortlist could be overturned. Three of the four came out on top.
window.FUNNEL = [
  { n: 8,  label: 'value-chain layers mapped', note: 'Six stacked layers plus two cross-cutting (cybersecurity; integration & V&V)', stage: 'B-2.3.1' },
  { n: 7,  label: 'open pockets found', note: 'One critical, not-yet-crowded pocket per layer; none in software platforms', stage: 'B-2.3.1' },
  { n: 4,  label: 'shortlisted', note: 'Pockets in the critical-and-fragmented quadrant of the 11-area matrix', stage: 'B-2.3.1' },
  { n: 3,  label: 'Round 1 targets', note: 'All 7 pockets re-scored for team feasibility; 3 of the 4 shortlisted won, SBOM fell to #5', stage: 'B-2.3.3' },
  { n: 2, label: 'after the company screen', note: 'Round 2 tested these against real companies. They became W1 and W2; W3 was added after the screen (B-2.3.4)', stage: 'B-2.3.3' },
];

// ------------------------------------------------------------------ FEASIBILITY SCREENING (B-2.3.3 draft)
// Each criterion scored 1–5. Team feasibility = weighted mean. Priority = feasibility × market attractiveness.
window.SCREEN = {
  criteria: [
    { id: 'skill',  label: 'Skill fit',          w: 25, five: 'The core engineering work matches what we already do every week' },
    { id: 'assets', label: 'Asset leverage',     w: 20, five: 'Our HIL bench or test vehicle gives us an advantage others don’t have' },
    { id: 'proto',  label: 'Prototype Yr 1–2',   w: 20, five: 'A credible demo is possible on a student budget, with no certification or capital barrier' },
    { id: 'access', label: 'Stakeholder access', w: 15, five: 'We can reach the users and buyers for interviews and feedback' },
    { id: 'edge',   label: 'Defensible edge',    w: 20, five: 'Our expertise could beat incumbents in a specific niche' },
  ],
  // market (1–5) is one team judgement from the B-2.3.1 map: criticality to launch or approval,
  // combined with competitive openness. crit / comp record those two drivers (from the matrix
  // placements and layer ratings) so the number is explained. The calibration session should
  // score the two drivers separately.
  positions: [
    { id: 'hil',    short: 'HIL', name: 'HIL & virtual-ECU validation', layer: 8, s: { skill: 5, assets: 5, proto: 5, access: 5, edge: 4 }, market: 4.4,
      crit: ['High', 'Validation evidence gates every software release (ISO 26262)'],
      comp: ['Low', 'Tool market is fragmented below the leaders (Applied Intuition, dSPACE, Vector)'] },
    { id: 'zonal',  short: 'Zonal', name: 'Zonal migration of legacy ECUs', layer: 1, s: { skill: 5, assets: 5, proto: 4, access: 4, edge: 4 }, market: 4.5,
      crit: ['High', 'Every zonal platform must port and re-validate legacy functions before SOP'],
      comp: ['Low', 'An open pocket in a crowded layer: SoC vendors fight over central compute, few serve migration'] },
    { id: 'ota',    short: 'OTA', name: 'OTA for commercial & off-highway', layer: 4, s: { skill: 4, assets: 3, proto: 3, access: 4, edge: 3 }, market: 4.2,
      crit: ['High', 'UN R156 software-update management is required for EU type approval'],
      comp: ['Low', 'Large OEMs insource; Sibros, Excelfore and Harman serve only parts of this market'] },
    { id: 'adas',   short: 'ADAS evidence', name: 'Validation evidence, mid-size OEMs', layer: 3, s: { skill: 4, assets: 4, proto: 3, access: 3, edge: 3 }, market: 3.5,
      crit: ['High', 'Safety evidence is needed for every ADAS release'],
      comp: ['High', 'Sits in the crowded ADAS layer, next to well-funded L2+ stacks'] },
    { id: 'sbom',   short: 'SBOM', name: 'SBOM & cyber lifecycle evidence', layer: 7, s: { skill: 3, assets: 2, proto: 4, access: 3, edge: 2 }, market: 4.0,
      crit: ['High', 'UN R155 type approval and the US Commerce rule make provenance a gate'],
      comp: ['Moderate', 'Specialists (Upstream, VicOne, PlaxidityX) and SBOM vendors already compete'] },
    { id: 'fleet',  short: 'Fleet data', name: 'Mixed-make fleet data', layer: 5, s: { skill: 4, assets: 3, proto: 4, access: 4, edge: 2 }, market: 3.0,
      crit: ['Medium', 'Fleets need it for uptime and cost, but no launch or approval depends on it'],
      comp: ['High', 'Crowded by telematics incumbents (Samsara, Motive, Geotab)'] },
    { id: 'edgeds', short: 'Edge data', name: 'Edge-side data selection', layer: 6, s: { skill: 4, assets: 4, proto: 4, access: 3, edge: 3 }, market: 2.6,
      crit: ['Low', 'Cuts data cost, but no launch or approval depends on it'],
      comp: ['Low', 'Few vendors, because the market is still unproven'] },
  ],
  marketNote: 'Market attractiveness (1–5) is the team’s judgement from the B-2.3.1 map: criticality to launch or approval, combined with how open the competition is.',
  capabilities: 'Skills: controls & HIL testing (model-based design); embedded & ECU software (C/C++, CAN, AUTOSAR); CAV/ADAS & perception; cybersecurity, cloud & data. Assets: HIL bench & test lab; test vehicle with E/E network access; sponsor & mentor contacts; fleet & commercial-vehicle contacts.',
  note: 'Draft scores for the team to calibrate in a 30-minute scoring session, and to re-check after Studio 1 interviews[^b133].',
};

// ------------------------------------------------------------------ TARGET DOSSIERS
// Confidence rubric: High = confirmed by external interviews and primary data; Medium = strong
// secondary evidence plus team experience; Low = mixed evidence or a key assumption untested.
// No target can be High until Studio 1 interviews are done.
window.DOSSIERS = [
  {
    id: 'ml', focus: true, rank: 1, role: 'W1, first to test', layer: 3, colour: 'Lthree', title: 'Safety evidence for ML components', short: 'Evidence beyond sampled testing, drawing on our faculty research.',
    hook: 'Testing shows the sampled inputs pass. It says little about the inputs never sampled.',
    r2: [['dSPACE', 20, 'pass', 'Pass'], ['Applied Intuition', 19, 'cond', 'If we find a contact'], ['Mobileye', 16, 'near', 'Near-miss']],
    problem: 'All three companies validate ML components with simulation, scenarios and statistics, which show that the tested inputs pass. They say nothing about the inputs never sampled. Applied’s safety roles ask for ISO/PAS 8800, UL 4600 and “safety of ML systems”, and dSPACE takes part in ISO/PAS 8800[^b133v2].',
    edge: 'Our team has access to verification research through our faculty advisor. We are keeping the method private for now. Our edge would be turning that research into evidence a safety team can use, shown with sponsor tools[^b133v2].',
    users: 'Safety and validation engineers signing off small ML components in ADAS and automated driving software (closest personas: AI-1, dS-3)', budget: 'Still to find. First guesses: a tool product manager (dS-1) or a V&V methods lead (AI-2)',
    gate: 'AI-1 Applied system safety engineer (veto over evidence types); dS-2 dSPACE applications engineer (access)', influence: 'ISO/PAS 8800 contributors; ME-1 Mobileye safety assurance expert (near-miss)',
    workaround: 'Scenario sweeps, perturbation tests and statistics; MIL/SIL/PIL simulation',
    yes: '“It fits the certified flow we already run, and its evidence maps to our safety-standard work products.”', no: 'It adds a non-qualifiable step to a certified chain, or is too limited for production use.',
    forE: [
      'All three companies publicly rely on simulation, scenarios and statistics for ML components[^b133v2]',
      'dSPACE’s public materials describe MIL/SIL/PIL simulation checks for its neural-network workflow[^b133v2]',
      'Applied’s safety postings ask for ISO/PAS 8800, UL 4600 and ML-safety skills[^b133v2]',
      'dSPACE sponsors the 2026 challenge and has a US office in Wixom, MI[^b133v2]',
    ],
    against: [
      'Absent is not the same as wanted: no source shows anyone asking for this. Need scores only 3 of 5[^b133v2]',
      'Related analysis tools are becoming widely available, which lowers everyone’s build cost[^b133v2]',
      'It will not cover a full camera-to-control stack, and our approach is not qualified under ISO 26262-8[^b133v2]',
      'Absence in public sources is not proof that nothing exists internally[^b133v2]',
    ],
    confidence: { level: 'Low', why: 'The key assumption, that safety engineers want this, is untested. Public sources only so far.' },
    first: 'Interview the dSPACE applications engineer, then the product manager: What do customers ask you about verifying ML components on the bench, if anything? When customers ask how a generated network is verified, what do you show them today? What other verification methods have customers or your team tried?',
    kill: ['Fewer than 3 of 6 safety or V&V interviewees describe a recent case where ML evidence was challenged', 'By end of Feb 2027, the prototype cannot handle a realistic network within the per-build time budget', 'dSPACE product management declines a second meeting after the demo'],
    biz: ['A feature inside the dSPACE toolchain, or a stand-alone evidence service?', 'Who pays: the tool vendor’s product team or the OEM’s safety team?', 'Early TAM and SAM proxies are on the Wedge hypotheses slide.'],
  },
  {
    id: 'silhil', focus: true, rank: 2, role: 'W2, conditional', layer: 8, colour: 'Lvv', title: 'What can leave the bench', short: 'One controller, three ways: virtual ECU, HIL and vehicle.',
    hook: 'What must stay on a scarce HIL bench, and what can safely go virtual?',
    r2: [['dSPACE', 17, 'cond', 'Conditional, deferred'], ['Applied Intuition', 15, 'fail', 'Fail'], ['Mobileye', 10, 'fail', 'Fail']],
    problem: 'Moving tests from HIL to virtual ECUs saves bench time, but dSPACE’s own SIL lead writes that timing and interrupt effects often appear only at HIL or vehicle level. We think small teams and mid-size customers lack public data for deciding what must stay on the bench[^b133v2].',
    edge: 'Our only distinct asset is independent real-vehicle data. We would run one EcoCAR controller function on a virtual ECU, on HIL and in the vehicle, measure CAN timing, I/O and fault-response differences, and publish a “what must stay on HIL” checklist. This is a weak advantage, so we pursue it only alongside W1[^b133v2].',
    users: 'HIL and virtual-validation leads (dS-3); zonal HIL engineers', budget: 'Still to find: a Studio 2 question',
    gate: 'dS-2 dSPACE applications engineer (access); EcoCAR sponsor liaison (licences)', influence: 'dSPACE Team Lead SIL E-Mobility; dSPACE V-ECU Task Force',
    workaround: 'Keeping tests on HIL by judgment (untested); vendor SIL–HIL co-simulation and virtual-ECU services',
    yes: '“Here are real numbers on what has to stay on the bench.”', no: 'One vehicle and one controller is too narrow to change any customer decision.',
    forE: [
      'Our skills match dSPACE’s US HIL applications-engineer role, and EcoCAR teams have used dSPACE HIL[^b133v2]',
      'It is core to dSPACE: SIL–HIL co-simulation launched in Jun 2026[^b133v2]',
      'The same bench could support our W1 work[^b133v2]',
    ],
    against: [
      'dSPACE already sells entry HIL and virtual-ECU services, so Differentiation scores 2 of 5[^b133v2]',
      'The pain evidence is mostly dSPACE-authored, and no source shows demand for independent fidelity data[^b133v2]',
      'At 17 of 25 it sits exactly on the threshold: any lost point fails it[^b133v2]',
    ],
    confidence: { level: 'Low', why: 'Access is unconfirmed, and the pain evidence comes mainly from the vendor.' },
    first: 'Interview the dSPACE applications engineer and an OEM validation lead: When did a customer last find a problem on HIL that SIL had missed? Walk me through the last time you moved a test from HIL to SIL. What made you trust it?',
    kill: ['Fewer than 2 of 4 HIL interviewees report a recent decision where fidelity data was missing', 'The dSPACE engineer or OEM lead says the result would not change any customer decision', 'No licence or bench access confirmed by 15 Dec 2026'],
    biz: ['A public checklist that builds credibility, or a paid study?', 'Does it stand alone, or only support W1 with dSPACE?', 'Early TAM and SAM proxies are on the Wedge hypotheses slide.'],
  },
  {
    id: 'hil', rank: 1, layer: 8, colour: 'Lvv', title: 'HIL & virtual-ECU validation', short: 'We run HIL benches ourselves.',
    was: { status: 'Narrowed', text: 'dSPACE already owns HIL and virtual ECUs, and Applied’s HIL Sim runs on benches customers already own. Best score 17 of 25, exactly at the threshold. We narrowed this to W2, What can leave the bench.', reopen: '' },
    hook: 'Bench time is scarce, and virtual ECUs aren’t yet trusted as evidence.',
    problem: 'The most trusted tests run on HIL benches, which are expensive, scarce and slow to set up, so teams queue for bench time. Virtual ECUs could run tests faster, but engineers and safety assessors often don’t trust their timing and I/O fidelity.',
    edge: 'We run HIL benches ourselves, can prototype tooling without safety certification, and have sponsors in the test-tool world. The niche: make scarce bench time go further and judge when a virtual-ECU result can be trusted, not replace dSPACE or Applied Intuition.',
    users: 'Test-Bench Engineer; Embedded CI Engineer', budget: 'HIL Test Lead; Director of Validation',
    gate: 'Functional-safety assessor (will virtual results count as evidence?); purchasing and tool approval', influence: 'dSPACE, Vector, Applied Intuition',
    workaround: 'Spreadsheets for bench scheduling; homemade test scripts; HIL suites from dSPACE or Vector',
    yes: '“This cuts bench queue time by X% without weakening our safety evidence.”', no: 'Adds audit risk, or needs a rip-and-replace of the existing dSPACE or Vector setup.',
    forE: [
      'Integration and V&V services are the fastest-growing slice of auto software spend: 11.4%/yr to 2035[^mck]',
      'Developers cite long cycles (37%) and debugging and testing (36%) as top problems (QNX 2025 vendor survey, n = 1,100)[^qnx-survey]',
      'Our own HIL engineers live this bottleneck: useful empathy, not proof of the market[^personas]',
    ],
    against: [
      'Well-funded incumbents: Applied Intuition was valued at $15B in 2025 and says it serves 18 of the top 20 OEMs[^applied]; Synopsys now includes Ansys simulation[^synopsys]',
      'The 52% engineering-VP figure is a vendor byline with no published sample size[^qnx-dn]',
      'Many OEMs run in-house HIL labs, and a safety assessor can veto virtual evidence (untested)[^personas]',
    ],
    confidence: { level: 'Medium', why: 'Survey and market evidence plus first-hand experience; no external interviews yet.' },
    first: 'Interview a HIL test lead and a test-bench engineer: How long do teams wait for a bench? Out of the last ten failed tests, how many were real software bugs?',
    kill: ['Benches aren’t actually a bottleneck: teams have plenty of capacity', 'Virtual ECUs are already trusted and widely used in their organisation'],
    biz: ['Would they buy software, a managed validation service, or more bench capacity?', 'Who owns the budget: the validation director or the software platform team?', 'What does one week of bench queue cost a vehicle program?'],
  },
  {
    id: 'zonal', rank: 2, layer: 1, colour: 'Lone', title: 'Zonal migration of legacy ECUs', short: 'Our test vehicle and HIL bench let us migrate and re-validate a real function.',
    was: { status: 'Dropped', text: 'Migration lives inside OEM programs and needs AUTOSAR, ISO 26262 and freedom-from-interference evidence. dSPACE already tests zonal ECUs and Mobileye is absent. Best score 13 of 25.', reopen: 'Reopens with AUTOSAR and ISO 26262 training plus a Tier 1 sponsor.' },
    hook: 'Splitting, porting and re-validating legacy functions is costly and poorly tooled.',
    problem: 'Moving to zonal architecture means splitting, porting and re-validating dozens of legacy functions onto new zonal controllers and central computers: remapping signals, re-checking timing, separating safety-critical from non-critical functions, and retesting.',
    edge: 'Our test vehicle’s E/E network plus our HIL bench lets us migrate one real legacy function onto a zonal-style controller and re-validate it end to end, a demo few startups can show. A full migration is bigger than a student project.',
    users: 'Systems Integration Engineer; Tier 1 Zonal Software Lead', budget: 'E/E Architect; vehicle chief engineer',
    gate: 'Functional safety (ISO 26262); program timing (the SOP date)', influence: 'Tier 1s (Bosch, Aptiv); SoC vendors (NVIDIA, Qualcomm)',
    workaround: 'E/E architecture tools, DBC/ARXML signal databases, Simulink and spreadsheets for effort estimates',
    yes: '“This tells you, before you start, exactly what a legacy function depends on and how hard it will be to migrate.”', no: 'Adds risk to the SOP date, or doesn’t integrate with their architecture tools.',
    forE: [
      'McKinsey expects 77% of E/E architectures to be zonal or central by 2035, up from under 30% today[^mck]',
      'Zone control units grow from $4B to $13B over 2030–35[^mck]',
      'Consolidation is real: Rivian’s Gen 2 R1 cut ECUs from 17 to 7[^rivian]',
    ],
    against: [
      'Timing is uncertain: in an NXP survey only about a third of OEM respondents expect body-zonal to be the main production architecture by 2030[^wards]',
      'Programs can stall: Ford scrapped its FNV4 zonal architecture in 2025[^ford]',
      'Tier 1s already do much of the migration work, and OEMs may rewrite rather than port (untested)[^personas]',
    ],
    confidence: { level: 'Medium', why: 'Strong long-run direction, but adoption timing and port-versus-rewrite are open questions.' },
    first: 'Interview an E/E architect and a Tier 1 zonal lead: How do you estimate the effort to move one legacy function? On your last program, how much was ported versus written new?',
    kill: ['Migration is mostly greenfield: new software, not ported', 'Effort estimation is already reliable, or porting is largely automated or cheaply outsourced'],
    biz: ['Is the buyer the OEM architecture team or the Tier 1 doing the port?', 'A dependency-analysis tool, or an engineering service per migration?', 'Is demand a burst per vehicle program, or recurring across model years?'],
  },
  {
    id: 'ota', rank: 3, layer: 4, colour: 'Lfour', title: 'OTA for commercial & off-highway', short: 'Our fleet and commercial-vehicle contacts.',
    was: { status: 'Dropped', text: 'Applied sells OTA inside Vehicle OS deals, open-source updaters exist, and we lack PKI, secure-boot and R156 experience. Best score 11 of 25. Round 1’s Low confidence proved right.', reopen: 'Reopens with a specialty-OEM design partner and a certified update partner, or folded into the HIL work as OTA validation.' },
    hook: 'Smaller makers lack the scale for their own OTA, so a fix often means a technician visit.',
    problem: 'Large passenger-car OEMs build their own OTA. Commercial, specialty and off-highway makers usually lack the scale: their vehicles carry ECUs from many suppliers, often without A/B memory, on J1939 networks, so an update often means a technician or dealer visit.',
    edge: 'Embedded and cloud skills plus direct fleet and commercial-vehicle contacts for interviews and pilots. Limitation: no commercial test vehicle yet, which is why this ranks #3.',
    users: 'CV Embedded Lead; Fleet Maintenance Manager', budget: 'Engineering director at the CV maker; fleet operations director',
    gate: 'Homologation (UN R156); cybersecurity (UN R155)', influence: 'Telematics providers (Motive, Samsara), Harman; dealers',
    workaround: 'Supplier-specific flashing tools, dealer service tools, spreadsheets that track software versions',
    yes: '“Update every ECU in your fleet remotely and safely, whatever the supplier, and stay R156-compliant.”', no: 'Requires replacing ECUs, or suppliers won’t give access to bootloaders.',
    forE: [
      'UN R156 requires a managed software-update process for EU type approval[^unece]',
      'Only ~15% of recalled US vehicles since 2022 were eligible for an OTA fix, so most still need a physical visit[^bizzy]',
      '891 US recalls covered 29.3M vehicles in 2025[^nhtsa]',
    ],
    against: [
      'Specialists already serve parts of this market: Excelfore reports 20+ automaker customers[^excelfore], alongside Sibros and Harman',
      'Fleet telematics incumbents are already on the vehicle and could add OTA: Samsara runs $2.1B ARR[^samsara]',
      'No commercial test vehicle, and ECU suppliers may refuse bootloader access (untested)[^personas]',
    ],
    confidence: { level: 'Low', why: 'Regulatory pull is clear, but vendors exist and our assets are weakest here.' },
    first: 'Interview a CV embedded lead and a fleet maintenance manager: How does a software fix reach a vehicle already in the field today? How many vehicle-days were lost to updates and recalls last year?',
    kill: ['They already use a vendor OTA solution that works', 'Software-related downtime is negligible compared with mechanical downtime'],
    biz: ['Per-vehicle licence, per-campaign fee, or bundled with telematics?', 'Does fleet demand pull strongly enough to make the CV maker’s business case?', 'Partner with telematics providers as a channel, or compete with them?'],
  },
  {
    id: 'sbom', rank: 5, screened: true, layer: 7, colour: 'Lcyber', title: 'SBOM & cyber lifecycle evidence',
    was: { status: 'Still out', text: 'The company screen reached the same answer. None of the three sells SBOM tooling, so none pulls, and audit-grade evidence needs credibility we lack. Best score 10 of 25.', reopen: 'Reopens only with a cybersecurity faculty partner and a supplier design partner.' },
    hook: 'A real compliance need, but a weak fit for our team.',
    problem: 'UN R155 type approval and the US Commerce connected-vehicle rule turn supplier provenance and patching into approval and compliance gates.',
    edge: 'Screened out as a stand-alone wedge in B-2.3.3: buyers need audit credibility a student team lacks, and compliance incumbents already compete. Cybersecurity stays a built-in requirement of whatever we build.',
    forE: ['R155 is a gate to EU type approval[^unece]', 'The BIS rule bars Chinese/Russian connected-vehicle software from MY2027[^bis]'],
    against: ['Audit credibility matters more than engineering skill here[^b133]', 'Specialists such as Upstream, VicOne and PlaxidityX already compete[^aumovio]'],
    confidence: { level: 'Screened out', why: 'Real need, weak fit: team feasibility 2.80 of 5.' },
  },
];

// ------------------------------------------------------------------ STUDIO 1 RESEARCH PLAN
window.PLAN = {
  order: [
    { who: 'dSPACE applications engineer, Wixom (dS-2)', why: 'Most reachable, via the EcoCAR sponsor contact. Request by 15 Nov' },
    { who: 'dSPACE product manager (dS-1)', why: 'Decision-maker for ML evidence in the toolchain; a warm introduction from the engineer' },
    { who: 'Stellantis HIL or ADAS validation lead (dS-3)', why: 'One OEM interview covers all three ecosystems' },
    { who: 'Applied Intuition safety and V&V leads (AI-1, AI-2)', why: 'No named contact by 15 Dec means this company test fails' },
    { who: 'Perception or ADAS validation leads who retrain models (W3)', why: 'Channels to try: Stellantis, Applied Intuition and WMU alumni. No named contact yet' },
  ],
  aim: 'About 10 people covering 6 W1, 4 W2 and 6 W3 conversations (many speak to two wedges), plus licence and data access confirmed by 15 Dec',
  rules: ['Start with real past cases, then ask where they see it going', 'Don’t pitch', 'Dig into workarounds', 'Quantify', 'Record what disproves us'],
  after: 'After each interview: update the persona card, mark each assumption supported, refuted or unclear in the Hypothesis & Assumptions Registry, and re-score every pair. Surviving candidates update the B-2.3.4 wedge hypotheses.',
};

// ------------------------------------------------------------------ GLOSSARY (from the team's personas guide)
window.GLOSSARY = [
  ['SDV', 'Software-defined vehicle: features are set mainly by software on a few central and zonal computers, so they can change over the air after the sale.'],
  ['ECU', 'Electronic Control Unit: a small computer that controls one function. Older cars have 70–100+.'],
  ['Zonal architecture', 'A few central computers do the thinking; zonal controllers handle nearby sensors and actuators. Fewer ECUs and less wiring.'],
  ['Legacy ECU migration', 'Moving a function from an old dedicated ECU onto zonal or central computers: splitting, porting and re-testing its software.'],
  ['HIL', 'Hardware-in-the-Loop: a real ECU connected to a real-time computer that simulates the rest of the vehicle.'],
  ['SIL', 'Software-in-the-Loop: testing ECU software on an ordinary computer with no real hardware.'],
  ['Virtual ECU', 'A software model of an ECU that can run in SIL or the cloud; often not accurate enough for timing and I/O.'],
  ['V&V', 'Verification and validation: proving software does what it should, and that it is the right thing to build.'],
  ['OTA', 'Over-the-air update: updating vehicle software remotely over cellular instead of at a dealer.'],
  ['A/B memory', 'Two memory banks: new software installs in the inactive one, then the ECU switches over or rolls back safely.'],
  ['Bootloader', 'The small program on an ECU that lets new software be installed. Every supplier may use a different one.'],
  ['J1939', 'The CAN-based network standard used in heavy trucks, buses and off-highway equipment.'],
  ['AUTOSAR Classic / Adaptive', 'Automotive software standards: Classic for small real-time ECUs, Adaptive for powerful Linux-like computers.'],
  ['DBC / ARXML', 'File formats describing vehicle network signals. If they disagree, integration breaks.'],
  ['ISO 26262', 'Functional-safety standard for road-vehicle electronics; requires evidence that safety functions work.'],
  ['ISO/SAE 21434', 'Cybersecurity engineering standard for vehicles.'],
  ['UN R155 / R156', 'UN regulations requiring a certified cybersecurity management system (R155) and software-update management system (R156).'],
  ['SBOM', 'Software bill of materials: a list of every software component and supplier in a product.'],
  ['Homologation', 'Type approval: regulatory sign-off that a vehicle model meets the rules before it can be sold.'],
  ['SOP', 'Start of production: the date a model starts mass production; everything is planned around it.'],
  ['Tier 1', 'A supplier selling complete systems or modules directly to OEMs.'],
  ['CAGR', 'Compound annual growth rate: the steady yearly growth that turns a start value into an end value.'],
  ['ADAS', 'Advanced driver-assistance systems, such as adaptive cruise control and lane centering.'],
  ['CAV', 'Connected and automated vehicle. In EcoCAR, the CAV team builds the perception and driver-assistance features.'],
  ['Perception', 'The software that turns camera, radar and other sensor data into objects the vehicle can act on.'],
  ['ML component', 'A piece of vehicle software whose behaviour is learned from data, such as a neural network, rather than written by hand.'],
  ['MIL / PIL', 'Model-in-the-loop and processor-in-the-loop: testing a control model in simulation, or the compiled code on the target processor, before HIL.'],
  ['Safety case', 'A structured argument, backed by evidence, that a system is safe enough for its intended use.'],
  ['ISO/PAS 8800', 'Guidance on safety for AI and machine-learning components in road vehicles.'],
  ['UL 4600', 'A safety standard for evaluating autonomous products, built around a safety case.'],
  ['Wedge hypothesis', 'A testable guess about a narrow first market: who has a problem, what we would offer, and why they would pay.'],
  ['TAM / SAM', 'Total addressable market (all spend on the problem) and serviceable addressable market (the part a first product could reach).'],
  ['DFV', 'Desirability, feasibility and viability: the fall workshop’s three lenses for scoring and ranking wedges.'],
  ['Persona', 'A fictional archetype of a real job role, used to plan interviews. Not a real person.'],
];

// ------------------------------------------------------------------ AUDIT OPEN ITEMS (need a human to confirm)
window.OPEN_ITEMS = [
  'McKinsey 2035 PDF: publication month; whether L2 hits 52% in 2030 or 2035',
  'NHTSA 2025 recall report PDF: exact 891 / 29.3M wording',
  'QNX developer report: VP sample size behind the 52%',
  'GM shareholder letters: exact ~70% margin wording; 2026 guidance reaffirmed',
  'GM 10-Q: verbatim $0.5B accrual wording',
  'Qualcomm and Tesla primary releases: $1.59B record wording; FSD purchase/subscription split',
  'ISO/SAE 21434: 42 work-product count',
  'China GB 44495 amendment dates; India AIS-189/190 status',
  'Pending deals: Harman–ZF ADAS; Applied Intuition ~$30B round',
];

// ------------------------------------------------------------------ SPEAKER NOTES (by slide id)
window.NOTES = {
  's-cover': 'Lead with the thesis: where can an engineering team win in the SDV value chain? Two maps, eight layers, three wedges after testing our first answer against real companies, and every market figure linked to its source. The Check-In map on the cover shows where B-2.3.1, B-2.3.2 and B-2.3.3 are answered.',
  's-exec': 'The 60-second version: the bottom line and focus area, our three wedges, the earlier targets we dropped and why, and the first claim we test for each wedge. Everything after this slide is the evidence.',
  's-why': 'The market is real: $519B by 2035, growing ~4.5× faster than vehicles. Four OEM motives. The $1.5B recall saving is a 2023 forecast, and we say so.',
  's-eco': 'Toggle Before SDV to show the one-loop model, then With SDV and play the four shifts. Click SDV specialists to show where our focus area and wedges sit, and how dSPACE and Applied Intuition come into the picture.',
  's-vc': 'Every layer sits where it lives in the car: compute in the floor, software on the computer, sensors around the body, the antenna on the roof, the cloud off the car, and the bench before launch. Primary value capture still shifts from per-vehicle economics at the bottom to recurring services at the top. Press Explode to pull the car apart into the same stack as the rows. Lenses: Competition (team ratings), Value capture, and Open pockets, which shows where W1 and W2 sit and what we dropped. Press Tour the car for a guided pass.',
  's-grow': 'One measure: how big each of McKinsey’s four largest pools will be in 2035. All four sit in crowded layers. On the right, integration and V&V services grow 11.4% a year, about 2.5 times the whole market’s 4.5%.',
  's-ws': 'Eleven areas placed by criticality and competition: team hypotheses, not measurements. Four landed in the whitespace. This is Round 1, kept as the record: the numbers on the dots are the Round 1 ranks, and each card says where that position went later. Our current lead was not on this shortlist at all.',
  's-funnel': 'This is Round 1, as scored on 5 Oct. We re-scored all seven open pockets, not just the four we shortlisted, so the shortlist could have been overturned. The top three hold under every single weight change and every single score change we tested. The real close call is #1 vs #2 (21.1 vs 20.0), which Studio 1 interviews should settle. OTA is a clear #3 on priority but has the weakest feasibility and Low confidence. Then set up the next slides: this ranking asks whether a position suits us and the market, not whether we can reach a real buyer.',
  's-bmc': 'Two canvases at different stages of the chain, as the brief asks: dSPACE sells test tools (stage 5); Applied Intuition sells vehicle and autonomy software (stages 3 and 4, plus simulation in 5). Both already hold much of what we had targeted, and each taught us something. Note the half-confirmed NVIDIA point if asked.',
  's-round2': 'Five positions by three companies gives 15 pairs, and three pass. Click 20 for W1, then 17 to show a pass that is only just a pass, then a zonal or OTA cell to show why our Round 1 targets failed. Be upfront that we re-scoped W1 during the screen, and that every score is a hypothesis.',
  's-evolve': 'The key slide. Press Walk through it, or hover a row. For each position: what we thought, what we learned, what we do now. Then the four reasons, what stayed the same, and what we still do not know. Round 1 was not wrong on what we knew; a sharper question and new evidence moved us. Do not compare Round 1 and Round 2 numbers: they use different criteria.',
  's-dossier': 'Where W1 and W2 came from: their company-screen dossiers, first. W3 was added after the screen and lives on the Wedge hypotheses slide. Step through The case, Who decides, Evidence and How we test it. The red strip is what would make us drop it. Below them are the earlier targets, with their original dossiers intact and a gold strip saying what changed. Both are Low confidence on our own rubric, because the key assumption is untested.',
  's-people': 'Six fictional archetypes, ranked by who decides and who we can reach first. Start with Jordan, the first contact, then Morgan, the decision-maker. Click a card for the full persona. The quotes are illustrative, not from interviews.',
  's-next': 'Be candid: no one outside the team has confirmed any of the three pains yet. Walk the four risks, then the interview plan for all three wedges, the 15 Nov and 15 Dec deadlines, and the rules we follow. Results re-score every pair and update the B-2.3.4 wedge hypotheses.',
  's-fc': 'If asked about rigour: 43 market claims audited on 13 Oct; 37 verified or corrected; 6 flagged as forecast, estimate, survey or hypothesis; 9 items still need a manual check. The 26 Oct report and BMCs have their own sources and were not part of this audit.',
};

// =====================================================================
//  v7 ADDITIONS: how the thinking changed
//  Round 1 = B-2.3.3 first draft (5 Oct 2026): market attractiveness × team feasibility.
//  Round 2 = B-2.3.3 report (26 Oct 2026): each position × a real company.
//  Round 1 stays in this file unchanged, as the record. Everything below comes from the
//  team's 26 Oct report, the 30 Oct Business Model Canvases and the persona cards in docs/.
//  Scores are team hypotheses until the Studio 1 interviews are done.
// =====================================================================

// post: true keeps these out of the 13 Oct audit's source count.
Object.assign(window.SOURCES, {
  b133v2: { pub: 'B-2.3.3 team report', title: 'Feasibility Screening & Engineering Personas: Applied Intuition, Mobileye, dSPACE (every score is a hypothesis to test in Studio 1; full report kept within the team)', date: '26 Oct 2026', kind: 'team', post: true },
  'bmc-ai': { pub: 'B-2.3.2 team BMC', title: 'Applied Intuition Business Model Canvas v2', date: '30 Oct 2026', kind: 'team', url: 'docs/bmc/Applied_Intuition_BMC_v2.pdf', post: true },
  'bmc-ds': { pub: 'B-2.3.2 team BMC', title: 'dSPACE Business Model Canvas v2', date: '30 Oct 2026', kind: 'team', url: 'docs/bmc/dSPACE_BMC_v2.pdf', post: true },
  'bmc-me': { pub: 'B-2.3.2 team BMC', title: 'Mobileye Business Model Canvas v2', date: '30 Oct 2026', kind: 'team', url: 'docs/bmc/Mobileye_BMC_v2.pdf', post: true },
});

// ------------------------------------------------------------------ ROUND 2: COMPANY SCREEN
// s = [Expertise fit, Differentiation, Evidence of need, Accessibility, Strategic relevance], each 1–5.
window.ROUND2 = {
  date: '26 Oct 2026',
  criteria: [
    { id: 'fit', label: 'Expertise fit', short: 'Fit' },
    { id: 'diff', label: 'Differentiation', short: 'Diff' },
    { id: 'need', label: 'Evidence of need', short: 'Need' },
    { id: 'access', label: 'Accessibility', short: 'Access' },
    { id: 'strat', label: 'Strategic relevance', short: 'Strat' },
  ],
  rule: 'A pair passes only if Expertise fit and Accessibility are both at least 3 and the total is at least 17 of 25. Differentiation of 2 or less makes it a conditional pass, pursued only alongside a full pass.',
  companies: [
    { id: 'ds', name: 'dSPACE', logo: 'dspace', tag: 'EcoCAR Innovation Challenge sponsor' },
    { id: 'ai', name: 'Applied Intuition', logo: 'applied', tag: 'Not a sponsor; reachable in the US' },
    { id: 'me', name: 'Mobileye', logo: 'mobileye', tag: 'Not a sponsor; R&D mostly in Israel' },
  ],
  positions: [
    { id: 'adas', code: 'P5', short: 'W1', name: 'W1 · Safety evidence for ML', sub: 'Re-scoped from ADAS validation evidence', colour: 'Lthree' },
    { id: 'hil', code: 'P1', short: 'W2', name: 'W2 · What can leave the bench', sub: 'SIL-vs-HIL fidelity, narrowed from HIL & virtual-ECU validation', colour: 'Lvv' },
    { id: 'zonal', code: 'P4', short: 'Zonal', name: 'Zonal I/O & migration', sub: 'Round 1 target #2', colour: 'Lone' },
    { id: 'ota', code: 'P2', short: 'OTA', name: 'OTA, commercial & specialty', sub: 'Round 1 target #3', colour: 'Lfour' },
    { id: 'sbom', code: 'P3', short: 'SBOM', name: 'SBOM & provenance', sub: 'Already screened out in Round 1', colour: 'Lcyber' },
  ],
  pairs: {
    'adas.ds': { s: [5, 4, 3, 4, 4], res: 'pass', label: 'Pass', decide: 'Its public materials describe simulation checks for its neural-network workflow, and dSPACE sponsors the challenge.', margin: 'Three points of margin. Access falls to 3 unless licence scope is confirmed by 15 Dec 2026.',
      why: ['It has a neural-network code-generation workflow; we have Simulink, ML and access to verification research', 'Public materials describe MIL/SIL/PIL simulation checks. Related tools are spreading, so our edge has to be the usable evidence, not the tool', 'dSPACE takes part in ISO/PAS 8800 and frames “auditable AI”. Need for stronger evidence is inferred', 'Sponsor of the 2026 challenge, with a Wixom, MI office. Holds only if licence scope is confirmed', 'SIMPHERA, AURELION and PAS 8800 work; neural-network virtual sensors shown at embedded world 2026'] },
    'adas.ai': { s: [4, 4, 3, 3, 5], res: 'pass', cell: 'Pass, if we find a contact', label: 'Pass, access-dependent', decide: 'Safety roles ask for ML-safety skills, but there is no EcoCAR link. A named contact must agree to talk by 15 Dec 2026.', margin: 'Two points of margin, but Access sits on the floor of 3: losing one point fails it.',
      why: ['ML, CARLA and our research access apply; safety-standard literacy is our gap', 'Public evidence is statistical and scenario-based', 'ISO/PAS 8800, UL 4600 and “safety of ML systems” appear in postings. Specific demand is unverified', 'No EcoCAR link; a CARLA prototype needs no permission; indirect path through Stellantis; US roles', 'Core business: Dana (Jul 2026) adds evaluation and governance; Neural Sim'] },
    'adas.me': { s: [4, 3, 3, 2, 4], res: 'near', cell: 'Near-miss on access', label: 'Near-miss: fails on access', decide: 'Strong method fit, but R&D sits in Israel and Mobileye is not a sponsor.', margin: 'One warm channel would lift Access to 3 and the total to 17. First route: Stellantis engineers.',
      why: ['Open-source RSS library runs in CARLA; its networks are proprietary', 'Perception is validated statistically, but RSS shows a strong in-house safety-methods culture', 'Mobileye says high MTBF is critical but not sufficient. Specific demand is unverified', 'Not a sponsor; safety teams in Jerusalem and Germany; open-source RSS is the only direct touchpoint', 'Safety methodology is central; leads IEEE 2846'] },
    'hil.ds': { s: [4, 2, 3, 4, 4], res: 'cond', cell: 'Conditional, deferred', label: 'Conditional pass, deferred', decide: 'Fits our HIL and CAN skills, but dSPACE already covers it. Our only edge is independent real-vehicle data.', margin: 'Exactly at threshold: any lost point fails it. Runs only if licence and bench access are confirmed by 15 Dec 2026.',
      why: ['The Wixom HIL role asks for Simulink, CAN/LIN and C/Python; EcoCAR teams have used dSPACE HIL', 'dSPACE owns HIL and virtual ECUs; our only edge is independent real-vehicle data', 'Bench scarcity and SIL timing gaps appear mainly in dSPACE-authored material; no source shows demand for independent fidelity data', 'Same sponsor channel; same 15 Dec licence condition', 'Core business: SIL–HIL co-simulation launched Jun 2026'] },
    'hil.ai': { s: [4, 2, 3, 3, 3], res: 'fail', label: 'Fail: total', decide: 'Applied builds on benches customers already own, so a cheaper bench adds nothing it lacks.',
      why: ['HIL postings ask for Simulink, CAN, harness, Python and CarSim', 'HIL Sim already layers over existing benches', 'Running bench fleets is a full-time job; in QNX’s 2026 survey, 44% of developers name debugging and testing a top challenge', 'Not a sponsor; CarSim competition licences unconfirmed for EcoCAR; Stellantis path', '2026 HIL hiring is mostly for its own benches'] },
    'hil.me': { s: [2, 2, 3, 1, 2], res: 'fail', label: 'Fail', decide: 'Its HIL is high-speed camera replay beyond our skills, built in-house, with no channel for us.',
      why: ['A real-time C++ multi-camera replay injector, beyond our skills', 'Built in-house', 'Field engineers debug Mobileye ECUs on customer HIL rigs', 'Not a sponsor; HIL team in Petah Tikva', 'Internal and customer-support work only'] },
    'zonal.ds': { s: [3, 2, 3, 2, 3], res: 'fail', label: 'Fail', decide: 'dSPACE already tests zonal ECUs, and design or migration needs AUTOSAR and production work we lack.',
      why: ['Zonal HIL work uses dSPACE, Simulink, Python and CAN; we lack ISO 26262 and DOORS', 'Vehicle Core configurations and power boards already exist', 'About 100 ECUs and harnesses over 4 km; newest migration content is from 2016', 'A test study is possible; design and migration need work we lack (inference)', 'Tests zonal ECUs; no design or migration tool'] },
    'zonal.ai': { s: [3, 2, 3, 1, 3], res: 'fail', label: 'Fail', decide: 'Migration happens inside multi-year Vehicle OS programs and requires ISO 26262.',
      why: ['Harness, power, CAN and Simulink apply; migration needs AUTOSAR RTE/ARXML, which we lack', 'Applied names the model-to-code gap itself', 'Legacy architectures are a bottleneck; Tier 1 opacity', 'Inside multi-year Vehicle OS programs; ISO 26262 required', 'Zonal migration is core customer work'] },
    'zonal.me': { s: [2, 1, 2, 1, 1], res: 'fail', label: 'Fail', decide: 'Mobileye is absent from zonal work: “zonal” does not appear in its 10-K.',
      why: ['Senior ECU and hardware architect roles', 'No angle for us', 'Legacy migration is never discussed', 'Israel and Germany roles; no channel', '“Zonal” is absent from the 10-K'] },
    'ota.ds': { s: [3, 2, 2, 2, 2], res: 'fail', label: 'Fail', decide: 'dSPACE has no OTA product, and we lack UN R156 and fleet experience.',
      why: ['HIL-based OTA validation uses our HIL and CAN skills', 'An SAE paper already proposes the method', 'No OTA pain on its off-highway page', 'Needs UN R156 and fleet experience we lack (inference)', 'No OTA product; consortium member only'] },
    'ota.ai': { s: [2, 1, 3, 1, 2], res: 'fail', label: 'Fail', decide: 'Applied ships OTA inside Vehicle OS, so we would compete rather than partner. Open-source updaters also exist.',
      why: ['OTA roles need PKI, secure boot and ASIL kept during updates', 'Mender, RAUC and SWUpdate exist; Applied ships OTA in Vehicle OS', 'Multi-ECU orchestration; 15+ year asset life', 'Production, safety-rated; TRATON rollout targets 2028', 'Sold only to very large OEMs'] },
    'ota.me': { s: [2, 1, 2, 1, 1], res: 'fail', label: 'Fail', decide: 'Its OTA is component-level, and OEMs run their own on top.',
      why: ['Same skills gap; component-level OTA', 'OEMs run their own OTA on Mobileye’s base', 'Aftermarket products have no OTA', 'No channel', 'Absent from full-vehicle and off-highway OTA'] },
    'sbom.ds': { s: [2, 1, 2, 2, 3], res: 'fail', label: 'Fail', decide: 'No SBOM pain in its materials, and audit-grade evidence needs credibility we lack.',
      why: ['Same skills gap', 'No angle for us', 'No SBOM pain in dSPACE materials', 'A channel exists, but a credibility gap; security team in Regensburg', 'A security push, but no SBOM step'] },
    'sbom.ai': { s: [2, 1, 3, 2, 2], res: 'fail', label: 'Fail', decide: 'Dedicated SBOM vendors exist, and our cyber background is coursework only.',
      why: ['Role asks for ISO/SAE 21434, R155/R156 and TARA; our cyber is coursework only', 'Dedicated SBOM vendors exist', 'BIS certification began 17 Mar 2026', 'Audit-grade evidence needs credibility we lack', 'Absent as a vendor'] },
    'sbom.me': { s: [2, 1, 3, 1, 2], res: 'fail', label: 'Fail', decide: 'Mobileye consumes compliance tools rather than selling them, and its cyber teams are out of reach.',
      why: ['Roles demand 21434, R155 and ASPICE', 'No angle for us', 'BIS evidence flows to suppliers', 'Cyber teams in Jerusalem; no channel', 'Compliance consumer, not a tool vendor'] },
  },
  notes: 'Mixed-make fleet data and edge-side data selection were not scored against the companies. The report’s verdicts: fleet data is not reconsidered for now; edge-side selection only as an extension of W1.',
};

// ------------------------------------------------------------------ HOW THE THINKING CHANGED
window.EVOLUTION = {
  timeline: [
    { d: '5 Oct', t: 'Round 1 screen', on: true },
    { d: '13 Oct', t: 'Market claims audited', on: true },
    { d: '26 Oct', t: 'Company screen', on: true },
    { d: '30 Oct', t: 'BMCs v2', on: true },
    { d: '15 Nov', t: 'First interview request' },
    { d: '15 Dec', t: 'Access deadlines' },
    { d: 'End of Studio 1', t: 'Re-score with interviews' },
  ],
  // to = the right-hand column of the trace, in display order
  ends: [
    { id: 'lead', from: 'adas', title: 'Safety evidence for ML components', tag: 'W1, first to test', kind: 'lead' },
    { id: 'second', from: 'hil', title: 'What can leave the bench', tag: 'W2, conditional', kind: 'second' },
    { id: 'ext', from: 'edgeds', title: 'Edge-side data selection', tag: 'Only as a lead extension', kind: 'ext' },
    { id: 'zonal', from: 'zonal', title: 'Zonal migration', tag: 'Dropped', kind: 'out' },
    { id: 'ota', from: 'ota', title: 'OTA for commercial & off-highway', tag: 'Dropped', kind: 'out' },
    { id: 'sbom', from: 'sbom', title: 'SBOM & cyber evidence', tag: 'Still out', kind: 'out' },
    { id: 'fleet', from: 'fleet', title: 'Mixed-make fleet data', tag: 'Not reconsidered', kind: 'out' },
  ],
  stories: {
    adas: {
      thought: 'Validation evidence for mid-size OEMs ranked #4 of 7: critical work, but in the crowded ADAS layer, with middling team fit.',
      learned: 'All three companies publicly rely on simulation, scenarios and statistics for ML components. We also found no stated demand from mid-size OEMs, so the segment did not hold. The specific gap sits at large players.',
      now: 'W1, first to test: safety evidence for ML components, drawing on our faculty research.',
      caveat: 'We redefined this position during the screen, so its pass is not like-for-like with Round 1.',
    },
    hil: {
      thought: 'Our #1: HIL bench time is scarce, virtual ECUs are not yet trusted, and we run benches ourselves.',
      learned: 'dSPACE owns HIL and virtual ECUs, and Applied’s HIL Sim runs on benches customers already own. Being good at HIL gives us empathy, not an advantage. Our only distinct asset is independent real-vehicle data.',
      now: 'Narrowed to one question: what must stay on the bench? This is W2, dSPACE only, 17 of 25 and exactly at the threshold.',
      caveat: 'Starts only if licence and bench access are confirmed by 15 Dec 2026.',
    },
    zonal: {
      thought: 'Our #2 and a close call with HIL: 77% of architectures zonal or central by 2035, and a real function we could migrate on our test vehicle.',
      learned: 'Migration lives inside OEM programs and needs AUTOSAR, ISO 26262 and freedom-from-interference evidence. dSPACE already tests zonal ECUs and Mobileye is absent. Best score: 13 of 25.',
      now: 'Dropped. The market view stands; we are not the team to reach it.',
      caveat: 'Reopens with AUTOSAR and ISO 26262 training plus a Tier 1 sponsor. A test study might reach about 15, still below the bar.',
    },
    ota: {
      thought: 'Our #3, with Low confidence already: regulation pulls hard, but vendors exist and our assets are weakest here.',
      learned: 'Applied sells OTA inside Vehicle OS deals, Mender, RAUC and SWUpdate are open source, and we lack PKI, secure-boot and R156 experience. Best score: 11 of 25.',
      now: 'Dropped. Round 1’s Low confidence proved right.',
      caveat: 'Reopens with a specialty-OEM design partner and a certified update partner, or folded into the HIL work as OTA validation.',
    },
    sbom: {
      thought: 'Shortlisted from the map, then screened out in Round 1: real need, weak team fit.',
      learned: 'The company screen agreed. None of the three sells SBOM tooling, so none pulls, and audit-grade evidence needs credibility we lack. Best score: 10 of 25.',
      now: 'Still out. Two rounds with different questions reached the same answer.',
      caveat: 'Reopens only with a cybersecurity faculty partner and a supplier design partner.',
    },
    fleet: {
      thought: 'Ranked #6: fleets need it, but no launch or approval depends on it, and telematics incumbents crowd the space.',
      learned: 'The dossiers show no link at any of the three companies, and our research edge does not apply. It was not scored in Round 2.',
      now: 'Not reconsidered for now.',
      caveat: 'CAN and J1939 skills alone would not stand out in a crowded telematics market (team hypothesis).',
    },
    edgeds: {
      thought: 'Ranked last of 7: cuts data cost, but no launch or approval depends on it, and the market is unproven.',
      learned: 'Applied and dSPACE both describe long-tail data search as a pain. It could connect to our W1 work (our inference).',
      now: 'Not a position of its own. We test it inside W1’s interviews.',
      caveat: 'It stands or falls with W1.',
    },
  },
  why: [
    { t: 'We asked a sharper question', d: 'Round 1 asked which positions suit our team and the market. Round 2 asked which real company we could reach, and what we could add that it lacks.' },
    { t: 'We found evidence we didn’t have', d: 'Studying three companies showed that incumbents already hold most of the work behind HIL, zonal and OTA, and that all three rely on sampled testing for ML components in public.' },
    { t: 'We counted an asset we had missed', d: 'Round 1’s capability list never named the verification research we can access through our faculty advisor. It became central to the strongest position.' },
    { t: 'We raised the bar', d: 'Round 2 added must-haves: we must be able to do the work and reach the company, and a score of mostly 3s no longer passes.' },
  ],
  stayed: [
    'The market map and the thesis: the opening is pre-launch engineering work',
    'Integration and V&V remains the fastest-growing slice of auto software spend',
    'SBOM stays out, and our HIL skills stay useful',
  ],
  unknown: [
    'Whether anyone wants any of the three: the pains are inferred from public sources, and no one has confirmed them yet',
    'Whether our approach works on a realistic component within a build’s time budget',
    'Whether dSPACE will act as a channel: sponsorship is not product interest',
  ],
  caution: 'Round 1 priority (feasibility × market) and Round 2 totals use different criteria, so the numbers should not be compared directly. Both are team scores, not yet tested in interviews.',
};

// ------------------------------------------------------------------ B-2.3.2 BUSINESS MODELS
window.BMCS = [
  {
    id: 'ds', name: 'dSPACE', logo: 'dspace', colour: '#4fd1c5', layers: 'Integration & V&V', role: 'Sells the test tools',
    what: 'Test and simulation tools that help carmakers validate vehicle software before it reaches the road',
    stats: [['>€460M', 'revenue 2024, +14%'], ['>2,900', 'employees'], ['1988', 'founded, private']],
    money: [['core', 'Test hardware systems (HIL, prototyping)'], ['core', 'Software tool licences'], ['core', 'Engineering services, maintenance and training'], ['growth', 'Cloud validation (SIMPHERA)']],
    moat: 'Benches, models and test cases built on dSPACE get reused for years, so switching is costly (analyst view).',
    watch: 'Privately held, so revenue and staff figures are company-reported rather than from audited filings.',
    lesson: 'It owns HIL, so we should not compete there. Its public materials describe simulation checks for its neural-network workflow, and it sponsors the challenge.',
    result: '20 of 25: lead passes', resKind: 'pass', file: 'docs/bmc/dSPACE_BMC_v2.pdf', src: 'bmc-ds',
  },
  {
    id: 'ai', name: 'Applied Intuition', logo: 'applied', colour: '#f6ad55', layers: 'Integration & V&V, software platforms', role: 'Sells software to everyone',
    what: 'Vehicle software, simulation and autonomy for cars, trucks, mining, construction, agriculture and defense',
    stats: [['$15B', 'valuation, Jun 2025'], ['~$400M', 'ARR end-2024, reported'], ['18 of 20', 'top non-Chinese carmakers']],
    money: [['core', 'Software licences by seat, workload and module (reported)'], ['growth', 'Vehicle OS and autonomy licensing (terms undisclosed)'], ['core', 'Integration and customization services (reported)'], ['growth', 'Government contracts, including a CDAO ceiling of up to $171M']],
    moat: 'Lands with one tool, then expands. Engineers embed with customer teams on multi-year partnerships.',
    watch: 'ARR is press-reported, not company-disclosed. Contract ceilings are not revenue.',
    lesson: 'Its evidence is statistical and scenario-based, while its safety roles ask for ISO/PAS 8800 and UL 4600. No warm way in yet.',
    result: '19 of 25: passes if we find a contact', resKind: 'cond', file: 'docs/bmc/Applied_Intuition_BMC_v2.pdf', src: 'bmc-ai',
  },
  {
    id: 'me', name: 'Mobileye', logo: 'mobileye', colour: '#b794f4', layers: 'ADAS & automated driving, compute', role: 'Sells chips per vehicle',
    what: 'Vision chips and driving software sold per vehicle; robotaxis and robots are early bets',
    stats: [['$1.89B', 'revenue FY2025, +15%'], ['~$48.5', 'average per system, Q2 2026'], ['~4,130', 'employees; Intel owns ~77%']],
    money: [['core', 'EyeQ chip sales through Tier 1s: about 92% of revenue'], ['growth', 'SuperVision and premium ADAS systems, per vehicle'], ['growth', 'Cloud-Enhanced ADAS, with higher profit per unit'], ['future', 'Robotaxi rides (target ~$125k per vehicle a year)']],
    moat: 'Repeat awards from all top-10 customers, locked in at design win, with 250M+ vehicles built with EyeQ.',
    watch: 'The $3.8B goodwill writedown in Q1 2026 is non-cash: it drives the GAAP loss but is not an operating cost.',
    lesson: 'A very different model: hardware margin per car, sold through Tier 1s. Strong safety-methods culture, but no route in for us yet.',
    result: '16 of 25: near-miss on access', resKind: 'near', file: 'docs/bmc/Mobileye_BMC_v2.pdf', src: 'bmc-me',
  },
];
window.BMC_NOTE = 'Two companies at different stages of the value chain, as the brief asks. Data as of 30 Oct 2026. One point is only half confirmed: the dSPACE canvas lists NVIDIA as a partner for AI scene generation. dSPACE confirms the NuRec integration, but no primary source places it in NVIDIA Halos.';

// ------------------------------------------------------------------ B-2.3.3 PERSONAS (26 Oct report)
window.PERSONAS = [
  { code: 'dS-1', name: 'Morgan Hale', ini: 'MH', co: 'ds', title: 'Product Manager, AI code-generation', company: 'dSPACE', tag: 'Decision-maker', prime: true, rank: 2, role: 'Decides whether new ML evidence enters the code-generation workflow.', quote: 'Simulation tells me the code matches the model. It doesn’t tell me the model is safe to rely on.', img: 'docs/personas/dS-1 Morgan Hale@2x.png' },
  { code: 'dS-2', name: 'Jordan Pike', ini: 'JP', co: 'ds', title: 'HIL Applications Engineer', company: 'dSPACE Inc., Wixom', tag: 'Gatekeeper (access)', rank: 1, role: 'Our first contact, reachable through EcoCAR sponsorship. Can route us to product management.', quote: 'Half my week is explaining what has to stay on the bench and what can go virtual.', img: 'docs/personas/dS-2 Jordan Pike@2x.png' },
  { code: 'dS-3', name: 'Taylor Brandt', ini: 'TB', co: 'ds', title: 'HIL / Virtual-Validation Lead', company: 'OEM using dSPACE', tag: 'User / influencer', rank: 3, role: 'The engineer who would actually use our evidence. Reachable via Stellantis, an EcoCAR sponsor.', quote: 'If it plugs into the chain I already run, I’ll try it. If it’s another island, it won’t survive the next budget round.', img: 'docs/personas/dS-3 Taylor Brandt@2x.png' },
  { code: 'AI-1', name: 'Rhea Calloway', ini: 'RC', co: 'ai', title: 'Senior System Safety Engineer', company: 'Applied Intuition', tag: 'Gatekeeper (veto)', rank: 4, role: 'Accepts or blocks new evidence types in the safety case.', quote: 'What I don’t have is a sentence I can defend to an assessor about the inputs we never sampled.', img: 'docs/personas/AI-1 Rhea Calloway@2x.png' },
  { code: 'AI-2', name: 'Daniel Ferreira', ini: 'DF', co: 'ai', title: 'V&V Lead, Autonomy', company: 'Applied Intuition', tag: 'Decision-maker (methods)', rank: 5, role: 'Decides which validation methods get adopted. Cares most about how long a check takes per build.', quote: 'Give me a number I can trace to a claim, and tell me how long it takes per build.', img: 'docs/personas/AI-2 Daniel Ferreira@2x.png' },
  { code: 'ME-1', name: 'Avery Lennox', ini: 'AL', co: 'me', near: true, title: 'Safety Assurance Expert', company: 'Mobileye', tag: 'Influencer (method owner)', rank: 9, role: 'Near-miss persona (16 of 25, fails on access). Kept for when a warm introduction opens.', quote: 'We proved the policy. The open question is how much of the perception argument can be more than statistics.', img: 'docs/personas/ME-1 Avery Lennox@2x.png' },
];
window.PERSONA_INSIGHTS = [
  { t: 'Start with field engineers', d: 'Applications and field engineers are the most reachable US contacts at all three companies.' },
  { t: 'Win the safety gatekeeper', d: 'They hold a veto, so our output must speak in claims, assumptions and evidence.' },
  { t: 'Sell evidence, not a tool', d: 'What gatekeepers need is evidence that fits their safety case.' },
];

// =====================================================================
//  v8 ADDITIONS: B-2.3.4 candidate wedge hypotheses
//  Written in general terms on purpose: this site is public, so methods
//  and product features stay out. Scores use the workshop DFV tool's 14
//  criteria and suggested weights, and are pre-interview desk judgments.
// =====================================================================
Object.assign(window.SOURCES, {
  'w-gm': { pub: 'EcoCAR Innovation Challenge', title: 'Year 1 GM Technical Deliverable Requirements, Rev 0', date: '7 Aug 2026', kind: 'primary', post: true },
  'w-dfv': { pub: 'Growth Innovation Strategy', title: 'DFV Wedge Hypothesis Down-Selection tool (provided at the fall workshop)', date: 'accessed 9 Nov 2026', kind: 'primary', url: 'https://www.growthinnovationstrategy.com/dfv-wedge-hypothesis', post: true },
  'w-mm': { pub: 'MarketsandMarkets via PR Newswire', title: 'Hardware-in-the-loop market to 2030 (method undisclosed)', date: '29 Apr 2025', kind: 'analyst', url: 'https://prnewswire.co.uk/news-releases/hardware-in-the-loop-market-worth-1-784-4-million-by-2030---exclusive-report-by-marketsandmarkets-302440960.html', post: true },
  'w-mq': { pub: 'Marqstats', title: 'Global automotive virtual ECU market, by level', date: '2026', kind: 'analyst', url: 'https://marqstats.com/reports/global-automotive-virtual-ecu-market/', post: true },
  'w-qnx': { pub: 'QNX', title: 'Developer survey of 1,100 automotive software developers (vendor-commissioned)', date: '21 Oct 2026', kind: 'survey', url: 'https://qnx.software/en/press-release/2026/qnx-research-finds-automotive-developers-spend-more-than-a-third-of-their-time-on-software-plumbing', post: true },
  'w-rts': { pub: 'arXiv 2601.08609', title: 'Coverage-Guided Road Selection and Prioritization for Efficient Testing in Autonomous Driving Systems', date: '13 Jan 2026', kind: 'primary', url: 'https://arxiv.org/abs/2601.08609', post: true },
  'w-grva': { pub: 'UNECE GRVA workshop document', title: 'Simulation credibility framework (read as a search excerpt only)', date: 'Mar 2025', kind: 'primary', url: 'https://unece.org/sites/default/files/2025-03/GRVA-WS06-03e_0.pdf', post: true },
});

window.NOTES['s-wedges'] = 'Rev 5 asks us to name the weakest wedge, so say it out loud: W2 is weakest as a business. W1 and W3 test one idea from two sides, with different buyers and jobs. Open a wedge, then The wedge, Market and Studio 2 test. Finish on DFV scoring: all three sit in the middle band, and these are desk scores until interviews happen. We keep the method private, so answer method questions at the level shown here.';

window.WEDGES = {
  intro: 'Every wedge is a hypothesis. No EcoCAR interview has tested any of them yet, so all three are Low confidence and every market number is a proxy.',
  focus: 'Focus area: integration, verification and validation (V&V) for software-defined vehicles, and specifically whether a model, a test or an update can be trusted. It is the fastest-growing slice of auto software spend, it gates every release, and it uses our HIL, CAV and research strengths.',
  list: [
    {
      id: 'w1', code: 'W1', colour: 'Lthree', name: 'Safety evidence for ML components', tag: 'First to test',
      from: 'From the company screen: 20 of 25 with dSPACE',
      origin: 'Where it came from: the company screen re-scoped ADAS validation evidence into this position. It scored 20 of 25 with dSPACE (pass), 19 with Applied Intuition and 16 with Mobileye.',
      hyp: 'We believe safety and validation engineers signing off small ML components have had that evidence challenged in ways sampled testing cannot answer, and would accept stronger evidence delivered inside the toolchain they already run.',
      user: 'Safety and validation engineers signing off small ML components in ADAS and automated driving software',
      pain: 'Simulation and statistics cover only the inputs sampled, so the evidence can still be challenged',
      wedge: 'One small learned component in a CAV perception stack',
      input: 'A small ML component and a description of where it must work',
      output: 'Evidence a safety reviewer can use alongside scenario tests',
      change: 'Reviewers get something sampled testing alone cannot provide',
      fit: 'CAV work, K CAV Perception Simulation Demonstration. Applies if our perception stack includes a small learned component. Uses simulation data only.',
      workaround: 'Scenario sweeps, perturbation tests and statistics; MIL/SIL/PIL simulation',
      owner: 'Still to find. First guesses: a tool product manager (dS-1) or a V&V methods lead (AI-2)',
      weak: 'Demand: stronger evidence is absent today, but nobody has been shown asking for it',
      marketHead: ['2025', '2035'],
      market: [
        ['TAM proxy', 'ADAS/AD software[^mck]', 'about $9B', 'about $50B'],
        ['SAM proxy', 'TAM x 5–10% spent on validation and safety-evidence tooling x 10–20% for ML components in scope', '$45M–$180M', '$250M–$1B'],
      ],
      marketNote: 'All percentages are our assumptions. No named automotive customer turned up for this kind of evidence, so the SAM could be near zero today.',
      assume: [
        'Our approach applies to the type of component we choose. Scope is being confirmed.',
        'Evidence can be produced within a per-build time budget.',
        'It will not cover a full camera-to-control stack.',
        'Standards permit this kind of evidence but do not require it.',
        'Early output is research evidence, not qualified under ISO 26262-8.',
      ],
      plan: [
        ['Gatekeepers see a gap that statistics do not fill', 'Desirability', '6 safety or V&V interviews: “When was evidence for an ML component last challenged, and by whom?”', 'Fewer than 3 of 6 describe a concrete recent case'],
        ['We can do this on a realistic component', 'Feasibility', 'Build a prototype on one small component and log run time', 'Not done by end of Feb 2027 within the stated per-build time, or 1 hour if none is stated'],
        ['A tool vendor could act as a channel', 'Viability', 'Short demo to a product contact after an introduction', 'They decline a second meeting or name qualification as a hard blocker'],
        ['Someone would pay or commit', 'Viability', 'Ask who funded the last new kind of safety evidence, then ask for a next step', 'Nobody names a budget or offers time, reputation or money'],
      ],
      personas: 'dS-1, dS-2, dS-3, AI-1, AI-2',
    },
    {
      id: 'w2', code: 'W2', colour: 'Lvv', name: 'What can leave the bench', tag: 'Weakest today',
      from: 'From the company screen: 17 of 25 with dSPACE, conditional',
      origin: 'Where it came from: the company screen narrowed our Round 1 #1, HIL & virtual-ECU validation, to this question. It scored 17 of 25 with dSPACE, a conditional pass.',
      hyp: 'We believe HIL and virtual-validation leads have recently kept, repeated or delayed a test because no measured data showed what a virtual ECU would miss, and would use independent, measured deviations to decide which tests can move off the bench.',
      user: 'HIL and virtual-validation leads',
      pain: 'Tests move from HIL to virtual ECUs without measured data on what is lost',
      wedge: 'One controller function compared across virtual ECU, HIL and vehicle',
      input: 'The same test cases run in each environment',
      output: 'Measured CAN timing, I/O and fault-response differences, plus a “what must stay on HIL” checklist',
      change: 'Decisions about where a test runs rest on data',
      fit: 'Closest Year 1 link is G-3.2 Vehicle Data Simulation, which compares the virtual model with Blazer data and explains discrepancies. GM Year 1 deliverables do not mention HIL, so bench work would be extra. Vehicle-derived data stays out of innovation-track material.',
      workaround: 'Keeping tests on HIL by judgment (untested); vendor SIL–HIL co-simulation and virtual-ECU services',
      owner: 'Still to find: a Studio 2 question',
      weak: 'Payment: this may be a publication, not a product, and an OEM could run the study itself',
      marketHead: ['2025', '2030'],
      market: [
        ['TAM proxy', 'HIL[^w-mm] $1.10B + virtual-ECU software[^w-mq] $0.95B (the two may overlap)', 'about $2.05B', 'not summed'],
        ['SAM proxy', 'Level 3 and Level 4 virtual-ECU spend[^w-mq]', 'about $398M', 'about $1.09B'],
        ['Wedge', 'SAM x 2–5% attach rate for fidelity assurance', '$8M–$20M', '$22M–$54M'],
      ],
      marketNote: 'The attach rate is our assumption and could be zero if vendors bundle this. Regulators add a second reason to care: UNECE work calls a harmonized simulation-credibility framework “essential”[^w-grva].',
      assume: [
        'One controller function can run in all three environments with comparable test cases.',
        'The differences are large enough to change where a test runs.',
        'One controller on one vehicle generalizes enough to interest anyone else.',
        'Sponsorship terms cover the licences and bench time this needs.',
      ],
      plan: [
        ['Leads lack data on what must stay on HIL', 'Desirability', '4 HIL interviews: “Walk me through the last time you moved a test from HIL to SIL. What made you trust it?”', 'Fewer than 2 of 4 report a recent decision where fidelity data was missing'],
        ['A one-controller study is useful', 'Desirability', 'Show a one-page mock result after the pain questions are finished', 'They say it would not change any customer conversation or decision'],
        ['We can get tools and bench time', 'Feasibility', 'Confirm licence scope and bench access through the sponsor liaison', 'Not confirmed by 15 Dec 2026'],
        ['Someone would pay or commit', 'Viability', 'Ask who funded the last comparable study, then ask for a next step', 'Nobody names a budget or offers time, reputation or money'],
      ],
      personas: 'dS-2, dS-3',
    },
    {
      id: 'w3', code: 'W3', colour: 'Lone', name: 'Model-update re-test scoping', tag: 'Newest',
      from: 'Added after the screen; closest fit to our GM CAV work',
      origin: 'Where it came from: added after the company screen, inside the same V&V focus area, by asking what else must be trusted after a change. It was not scored against companies. It ties most directly to our GM CAV deliverables (K and D).',
      hyp: 'We believe integration and validation leads who retrain perception models either re-run far more testing than a change needs or cut scope on judgment they struggle to defend, and would adopt guidance on what to re-test, with the reasoning recorded.',
      user: 'Integration and validation leads shipping ADAS updates',
      pain: 'Software-defined vehicles keep changing after launch. After a model is retrained, code-based change tools cannot show which behaviors moved',
      wedge: 'Retrained perception models',
      input: 'A new model version and the team’s existing test set',
      output: 'Guidance on what to re-test, with the reasoning recorded',
      change: 'Less wasted re-testing and a recorded reason for the scope chosen',
      fit: 'CAV work, K CAV Perception Simulation Demonstration (teams must iteratively expand, refine and validate perception) and D CAV Toolchain Check (version control process).',
      workaround: 'Re-running everything, or choosing by judgment (inferred; to test)',
      owner: 'Still to find: a validation director or software release lead',
      weak: 'Build vs. buy: teams may already solve this in-house, and safety reviewers may refuse any reduced test scope',
      marketHead: ['2025', '2035'],
      market: [
        ['TAM proxy', 'ADAS/AD software[^mck] (shared with W1, so never add the two)', 'about $9B', 'about $50B'],
        ['SAM proxy', 'TAM x 5–10% spent on validation tooling x 20–40% spent re-testing after changes', '$90M–$360M', '$500M–$2B'],
      ],
      marketNote: 'All percentages are our assumptions. A separate bottom-up view: 30–60 ADAS programs at $100k–$300k a year gives $3M–$18M a year. In QNX’s 2026 vendor-commissioned survey of 1,100 developers, 44% named debugging and testing their top challenge (36% in its 2025 survey)[^w-qnx].',
      assume: [
        'A model change can be analysed well enough to guide re-testing.',
        'It must beat simple baselines. Published selection methods have cut ADAS road-test suites by 89% while keeping 79% of failures[^w-rts].',
        'Simulation is a fair first stand-in for real release data.',
        'Ranking is useful even if safety rules prevent skipping any test.',
      ],
      plan: [
        ['Scoping re-tests is a costly problem', 'Desirability', '6 interviews: “When one function last changed, how did you decide what to re-test?”', 'Fewer than 3 of 6 describe a costly or disputed case from the past 12 months'],
        ['Current tools do not settle it', 'Desirability', '“What have you tried, bought or built in the past year to deal with that?”', '4 of 6 say existing tools or in-house methods already solve it'],
        ['It finds problems with less testing', 'Feasibility', 'Simulation benchmark with known faults, compared with running everything, random selection and a published method', 'By end of Feb 2027, cannot catch at least 90% within half of the tests'],
        ['Reviewers accept a documented scope', 'Desirability', '“When was a test last left out of a re-run, and who agreed?”', 'No sign-off role has accepted a reduced scope with written reasoning'],
        ['Someone would pay or commit', 'Viability', 'Ask who funds re-test work today, then ask for a next step', 'Nobody names a budget or offers time, reputation or money'],
      ],
      personas: 'AI-2, dS-3 and the validation engineers on our stakeholder maps',
    },
  ],
  // [group, criterion, weight, W1, W2, W3, basis]
  dfv: [
    ['D', 'Market growth', 1, 4, 4, 4, 'ADAS/AD software about 19% a year; virtual ECU about 18%, HIL about 10%'],
    ['D', 'Market scale', 0.75, 3, 3, 3, 'Many validation teams, concentrated in large programs'],
    ['D', 'Dissatisfaction with current state', 0.75, 3, 3, 3, 'Pain is documented but inconsistently stated; W2’s is mostly vendor-written'],
    ['D', 'Importance to end user', 0.8, 4, 3, 3, 'W1 ties to a release gate; W2 and W3 mainly affect schedule and cost'],
    ['D', 'Evidence of workaround', 0.95, 3, 3, 3, 'Recurring workarounds are visible; W3’s is inferred'],
    ['F', 'Strategic assets', 0.8, 3, 3, 3, 'Research access, bench and simulation all apply, but each has open conditions'],
    ['F', 'Key activities', 0.8, 3, 2, 2, 'W1’s process is not yet built; W2 is replicable; W3 has published methods to beat'],
    ['F', 'Strategic network', 0.7, 3, 4, 3, 'dSPACE sponsorship is closest to W2; no contact has engaged yet'],
    ['V', 'Strategic priority', 1, 4, 3, 4, 'Auditable AI and software-update management are stated priorities; dSPACE already ships SIL–HIL co-simulation'],
    ['V', 'Ownership and governance', 0.9, 2, 2, 2, 'A likely user exists, but no budget owner is known'],
    ['V', 'Long-term optionality', 0.85, 4, 2, 4, 'W1 and W3 could share reusable capability; W2 is closer to a single study'],
    ['V', 'Low cost base', 0.65, 3, 2, 3, 'Software with per-customer setup; W2 needs bench and vehicle time'],
    ['V', 'Willingness to pay', 0.7, 2, 2, 2, 'No source shows anyone paying for any of these'],
    ['V', 'Payback', 0.5, 2, 2, 2, 'Depends on adoption we cannot yet show'],
  ],
  dfvNote: 'Pre-interview desk scores from 1 to 5, using the fall-workshop DFV tool’s 14 criteria and suggested weights[^w-dfv]. All three land in its Middle band, so the scores do not yet pick a winner. W1 and W3 are close enough that two one-point changes would erase the gap. Dissatisfaction, workaround, ownership, willingness to pay and payback need interview evidence.',
  weakest: 'W2 feels weakest as a business today. W1 and W3 test one idea from two sides, with different buyers and jobs, so a weak approach would hurt both. W3 must therefore beat a simple baseline on its own.',
};

// =====================================================================
//  v9 ADDITIONS: wedge risks replace the four market-risk cards
// =====================================================================
window.RISK_HEAD = 'no one outside the team has confirmed any of the three pains yet.';
window.RISKS = [
  { k: 'Demand', n: '0 of 3', t: 'wedge pains confirmed outside the team. Studio 2 interviews decide which survive.' },
  { k: 'Fit with our vehicle', n: 'W1', t: 'counts only if our CAV perception stack has a small learned component. Checking with the CAV team.' },
  { k: 'Access', n: '15 Dec', t: 'dSPACE licence scope and a named Applied contact, or W2 and one W1 pair fail.' },
  { k: 'Build', n: 'Feb 2027', t: 'W1 and W3 prototypes must work on a realistic component in simulation, or we drop them.' },
];

// =====================================================================
//  v10 ADDITIONS: aligned to the Studio 1 Check-In scorecard
//  Problem statements, persona pains, weakest technical assumptions,
//  missing market pieces, evidence sources for each test, where our
//  skills fit on the value chain, the outreach pipeline, innovation in
//  society, and our gaps with an action for each. General terms only.
// =====================================================================
window.VERSION.n = 11;

// Where our skills fit, layer by layer (scorecard: pain points + where skills fit)
window.LAYER_FIT = {
  1: 'Partial. Embedded and CAN skills plus our test vehicle help with zonal I/O work, but migration needs AUTOSAR and ISO 26262 depth we lack. Dropped after the company screen.',
  2: 'Weak. Certified operating systems and middleware are beyond a student team; we use these platforms rather than build them.',
  3: 'Strong for W1 and W3: CAV, ADAS and perception skills, simulation, and verification research through our faculty advisor. Not a fit for building an L2+ driving stack.',
  4: 'Weak. Embedded and cloud skills, but no PKI, secure-boot or UN R156 experience. Dropped after the company screen.',
  5: 'Partial. CAN and J1939 skills, but on their own they would not stand out in a crowded telematics market.',
  6: 'Partial. Cloud and data skills; edge-side data selection only as an extension of W1.',
  7: 'Weak. Our cybersecurity background is coursework, and audit-grade evidence needs credibility we lack.',
  8: 'Strong for W2: we run HIL benches and have controls and model-based design skills. Against dSPACE this gives us empathy, not an advantage.',
};

window.BMCS.forEach((b) => { b.nsrc = { ds: 33, ai: 35, me: 25 }[b.id]; });

(function () {
  const W = Object.fromEntries(window.WEDGES.list.map((w) => [w.id, w]));
  Object.assign(W.w1, {
    problem: 'A safety or validation engineer who must sign off a small ML component in an ADAS release can only show that the tested inputs passed, so the sign-off can be challenged. Better: evidence a reviewer accepts alongside scenario tests.',
    weakTech: 'That useful evidence can be produced for a realistic component within a per-build time budget. If it only works on very small components, W1 fails. We test this with a prototype and a run-time log by the end of February 2027.',
    missing: [
      'No bottom-up estimate yet: we do not know how many programs would pay, or how much.',
      'The 5–10% and 10–20% shares in the SAM are our assumptions, not sourced figures.',
      'No buyer or budget line has been named by anyone outside the team.',
    ],
    pains: [
      ['AI-1', 'No sentence to defend to an assessor about the inputs that were never sampled', 'Evidence that speaks to more than the sampled inputs, stated in safety-case terms'],
      ['dS-1', 'Simulation shows the code matches the model, not that the model is safe; customers must show auditable AI under ISO/PAS 8800', 'Evidence that fits the tool flow customers already run'],
      ['AI-2', 'Wants a number that traces to a claim, and to know how long it takes per build', 'Each result tied to a stated claim, with run time logged'],
      ['dS-3', 'Will not adopt another tool island outside the chain already in use', 'Delivered inside the existing toolchain'],
    ],
    plan: [
      ['Gatekeepers see a gap that statistics do not fill', 'Desirability', '6 safety or V&V interviews: “When was evidence for an ML component last challenged, and by whom?”', 'Fewer than 3 of 6 describe a concrete recent case', 'Interview notes, coded supported, refuted or unclear in the Registry'],
      ['We can do this on a realistic component', 'Feasibility', 'Build a prototype on one small component and log run time', 'Not done by end of Feb 2027 within the stated per-build time, or 1 hour if none is stated', 'Prototype run-time log on a public simulation component'],
      ['A tool vendor could act as a channel', 'Viability', 'Short demo to a product contact after an introduction', 'They decline a second meeting or name qualification as a hard blocker', 'Meeting notes and follow-up emails'],
      ['Someone would pay or commit', 'Viability', 'Ask who funded the last new kind of safety evidence, then ask for a next step', 'Nobody names a budget or offers time, reputation or money', 'Interview notes: a named budget owner or a written next step'],
    ],
  });
  Object.assign(W.w2, {
    problem: 'A HIL or virtual-validation lead deciding whether a test can move from a scarce HIL bench to a virtual ECU has no measured data on what the virtual run misses. Better: a data-backed rule for which tests must stay on the bench.',
    weakTech: 'That the differences between virtual ECU, HIL and vehicle are large and repeatable enough to change where a test runs. If they are small or random, the study changes no decision. We test this by running one controller function three ways once licences are confirmed.',
    missing: [
      'The 2–5% attach rate is our assumption.',
      'The virtual-ECU figures come from one low-transparency source; its “levels” describe how closely a virtual ECU matches the real one, not driving automation.',
      'The HIL and virtual-ECU market figures may overlap, so we do not add them for 2030.',
    ],
    pains: [
      ['dS-2', 'Spends half the week explaining what has to stay on the bench and what can go virtual', 'Measured differences to point to'],
      ['dS-3', 'Will not adopt another tool island outside the chain already in use', 'Results from the same test cases and tools the team already uses'],
    ],
    plan: [
      ['Leads lack data on what must stay on HIL', 'Desirability', '4 HIL interviews: “Walk me through the last time you moved a test from HIL to SIL. What made you trust it?”', 'Fewer than 2 of 4 report a recent decision where fidelity data was missing', 'Interview notes, coded in the Registry'],
      ['A one-controller study is useful', 'Desirability', 'Show a one-page mock result after the pain questions are finished', 'They say it would not change any customer conversation or decision', 'Reactions to the mock result, in interview notes'],
      ['We can get tools and bench time', 'Feasibility', 'Confirm licence scope and bench access through the sponsor liaison', 'Not confirmed by 15 Dec 2026', 'Written confirmation from the sponsor liaison'],
      ['Someone would pay or commit', 'Viability', 'Ask who funded the last comparable study, then ask for a next step', 'Nobody names a budget or offers time, reputation or money', 'Interview notes: a named budget owner or a written next step'],
    ],
  });
  W.w2.market[1][1] = 'Virtual-ECU spend at fidelity levels 3 and 4[^w-mq]';
  Object.assign(W.w3, {
    problem: 'An integration or validation lead releasing a retrained perception model must decide what to re-test, and either re-runs nearly everything or cuts scope on judgment. Better: a smaller re-test scope that comes with recorded reasons a reviewer accepts.',
    weakTech: 'That a retrained model’s change can be analysed well enough to beat simple baselines: re-running everything, random selection and a published method. If it cannot, W3 adds nothing. We test this with a simulation benchmark with known faults.',
    missing: [
      'The top-down SAM ($90M–$360M) and the bottom-up view ($3M–$18M a year) differ by 5 to 100 times. We trust the bottom-up more for a first product, because the share of validation spend that goes to re-testing is our assumption.',
      'No price point has been tested.',
      'No buyer or budget line has been named by anyone outside the team.',
    ],
    pains: [
      ['AI-2', 'Wants to know how long checks take per build', 'A smaller, reasoned re-test scope for each model update'],
      ['dS-3', 'Budget pressure on anything outside the chain already in use', 'Fewer re-runs inside the existing toolchain'],
      ['Gap', 'No persona yet for a perception-model release lead, the likely main user', 'We will draft one from public job postings (see Our gaps)'],
    ],
    plan: [
      ['Scoping re-tests is a costly problem', 'Desirability', '6 interviews: “When one function last changed, how did you decide what to re-test?”', 'Fewer than 3 of 6 describe a costly or disputed case from the past 12 months', 'Interview notes, coded in the Registry'],
      ['Current tools do not settle it', 'Desirability', '“What have you tried, bought or built in the past year to deal with that?”', '4 of 6 say existing tools or in-house methods already solve it', 'Interview notes; named tools checked against public product pages'],
      ['Reviewers accept a documented scope', 'Desirability', '“When was a test last left out of a re-run, and who agreed?”', 'No sign-off role has accepted a reduced scope with written reasoning', 'Interview notes from safety and sign-off roles'],
      ['It finds problems with less testing', 'Feasibility', 'Simulation benchmark with known faults, compared with running everything, random selection and a published method', 'By end of Feb 2027, cannot catch at least 90% within half of the tests', 'Benchmark results on a public simulation dataset'],
      ['Someone would pay or commit', 'Viability', 'Ask who funds re-test work today, then ask for a next step', 'Nobody names a budget or offers time, reputation or money', 'Interview notes: a named budget owner or a written next step'],
    ],
  });
})();

// Outreach pipeline (B-1.3.3). Names stay in the private tracker.
window.PIPELINE = {
  rows: [
    { p: 'dS-2', who: 'HIL applications engineer, dSPACE Inc. (Wixom, MI)', w: 'W2, W1', ch: 'EcoCAR sponsor contact', kind: 'Sponsor', n: 'In progress', next: 'First request by 15 Nov' },
    { p: 'dS-1', who: 'Product manager, AI code generation, dSPACE', w: 'W1', ch: 'Warm introduction from dS-2', kind: 'Sponsor', n: 'In progress', next: 'After the first dSPACE call' },
    { p: 'dS-3', who: 'HIL or virtual-validation lead at an OEM using dSPACE, such as Stellantis', w: 'W2, W3, W1', ch: 'Stellantis sponsor contact; WMU alumni', kind: 'Both', n: 'In progress', next: 'Finish the LinkedIn and alumni search' },
    { p: 'AI-1', who: 'Senior system safety engineer, Applied Intuition', w: 'W1', ch: 'WMU alumni; LinkedIn message; conference talks', kind: 'Independent', n: 'In progress', next: 'Named contact needed by 15 Dec' },
    { p: 'AI-2', who: 'V&V lead, autonomy, Applied Intuition', w: 'W1, W3', ch: 'WMU alumni; LinkedIn message', kind: 'Independent', n: 'In progress', next: 'Named contact needed by 15 Dec' },
    { p: 'ME-1', who: 'Safety assurance expert, Mobileye', w: 'W1', ch: 'Warm introduction only, through Stellantis engineers', kind: 'Independent', n: 'Parked', next: 'Waits for a warm channel' },
    { p: 'New', who: 'Perception or ADAS validation lead who retrains models, at an OEM or Tier 1', w: 'W3', ch: 'WMU alumni; LinkedIn; SAE and IEEE events', kind: 'Independent', n: 'Not started', next: 'Draft the persona, then search' },
  ],
  note: 'Names and contact details stay in our private tracker, not on this public site. Five of the seven rows use an independent channel, so at least half of our interviews can come from independent outreach, as Studio 2 requires.',
  rules: ['Ask for 20–30 minutes about their work', 'Say who we are and why we are asking', 'Ask before taking notes; never record without permission', 'Never ask for confidential OEM or supplier information', 'At most two polite follow-ups', 'Offer our summary back'],
};

// Innovation in society (safety, security, privacy, fairness, environment)
window.SOCIETY = {
  rows: [
    ['Safety', 'Over-claiming: a reviewer could read our evidence as proof that an ML component is safe, or a smaller re-test scope (W3) could skip a test that mattered.', 'Every output states its scope and limits. W3 ranks tests rather than removing them unless a sign-off role agrees. Nothing we build is qualified under ISO 26262, and we say so.', 'How safety assessors want limits stated: a question for our safety interviews.'],
    ['Security', 'Customers would share models, test sets and tool settings that are valuable IP, and a new tool could become a way into a build pipeline.', 'Year 1 uses only public or simulation models. Anything a sponsor shares stays under its agreements. Any later design keeps customer models in the customer’s environment.', 'What security review a tool vendor requires before a pilot.'],
    ['Privacy', 'Vehicle and driving data can identify people, as the FTC order against GM shows.', 'W1 and W3 use simulation data only. W2 uses controller timing and I/O signals, not driver data. Vehicle-derived data stays out of innovation-track material.', 'Interview notes contain names: kept in a private tracker and shared only with consent.'],
    ['Fairness', 'Perception can work less well for some people and conditions, such as children, wheelchair users, night or rain. Evidence or test scoping that ignores them gives false comfort.', 'Include under-represented people and conditions in what W1 checks and in W3’s benchmarks, and report results by condition, not only as an average.', 'We have not yet chosen a public dataset with this coverage.'],
    ['Environment', 'Simulation and re-testing use computing energy; benches and test drives use hardware and energy.', 'W2 and W3 aim to cut bench time and re-runs that are not needed. We will log computing time per run so the trade-off is visible.', 'No energy estimate yet.'],
  ],
  note: 'Every market claim is sourced and labelled in the evidence audit. Public sources only: Rev 5 does not permit OEM data in this deliverable. Personas are fictional, and their quotes are imagined.',
};

// Our gaps, an action for each, and what we want help with
window.GAPS = [
  ['Desirability', 'No interviews yet, so every pain is inferred from public sources', 'Send the first request to the dSPACE applications engineer; hold 2–3 exploratory interviews before Studio 1 closes', '15 Nov'],
  ['Fit', 'W1 counts as vehicle work only if our perception stack has a small learned component', 'Get a yes or no from our CAV lead', 'Before Check-In'],
  ['Outreach', 'No named contacts yet at Applied Intuition or for W3', 'Finish the persona-matched search and log channel and status for each person', '15 Dec'],
  ['Personas', 'No persona yet for W3’s likely user, a perception-model release lead', 'Draft one from public job postings, like the other six', '30 Nov'],
  ['Evidence', 'Some W1 evidence cites a team report we keep private', 'Cite the public job postings and company pages directly', '30 Nov'],
  ['Market', 'W1 and W2 have only top-down proxies, and W3’s two estimates disagree', 'Build bottom-up counts of programs and prices, and ask about price in interviews', 'Studio 2'],
  ['Sources', 'Nine market facts still need checking against the original source', 'Check each one by hand and update the audit', '30 Nov'],
  ['Process', 'No Hypothesis & Assumptions Registry yet', 'Move each wedge’s assumptions and tests into the registry template', '30 Nov'],
  ['Feasibility', 'Nothing built yet for W1 or W3', 'Prototype both on public simulation components and log run time', 'Feb 2027'],
];
window.ASKS = [
  'Does W1 count as “closely related to vehicle development” if it applies to one learned perception component?',
  'Could you introduce us to dSPACE product management, and to GM ADAS or safety engineers?',
  'Which wedge would you test first, and what evidence would convince you to drop one?',
  'Is a top-down market proxy enough at this stage, or should every wedge have a bottom-up estimate?',
  'How do sponsor IP agreements apply when a wedge builds on faculty research?',
];

// Reviewer guide: where each Check-In question is answered
window.GUIDE = {
  groups: [
    { cat: 'Desirability', rows: [
      { q: 'The problem, who has it, and what would be better', where: [['s-wedges', 'Problem on each wedge'], ['s-exec']] },
      { q: 'Ecosystem diagram and value chain map', where: [['s-eco'], ['s-vc']] },
      { q: 'Specific personas, and each wedge tied to a persona’s pain', where: [['s-people'], ['s-wedges', 'Personas tab']] },
    ] },
    { cat: 'Feasibility', rows: [
      { q: 'The weakest technical assumption behind each wedge', where: [['s-wedges', 'Market & assumptions tab']] },
      { q: 'Engineering pain points on the value chain, and where our skills fit', where: [['s-vc', 'click any layer']] },
    ] },
    { cat: 'Viability', rows: [
      { q: 'Sourced practice canvases at different stages of the chain', where: [['s-bmc']] },
      { q: 'Early market logic, and the missing pieces', where: [['s-wedges', 'Market & assumptions tab']] },
    ] },
    { cat: 'Innovation process quality', rows: [
      { q: 'Why these wedges, which is weakest, and our gaps with an action each', where: [['s-evolve'], ['s-wedges', 'DFV scoring'], ['s-gaps']] },
      { q: 'Next tests, desirability first, with evidence sources', where: [['s-wedges', 'Studio 2 test tab']] },
      { q: 'An outreach pipeline matched to the personas', where: [['s-pipeline'], ['s-next']] },
    ] },
    { cat: 'Innovation in society', rows: [
      { q: 'Safety, security, privacy, fairness and environment', where: [['s-society']] },
      { q: 'Sourced claims, labelled assumptions, respectful outreach, no OEM data', where: [['s-fc'], ['s-pipeline', 'outreach rules']] },
    ] },
    { cat: 'Communication', rows: [
      { q: 'Can a reviewer follow the logic without us?', where: [['s-exec'], ['s-evolve']] },
      { q: 'Our 30-minute walkthrough', where: [['s-gaps', 'questions for you']] },
    ] },
  ],
  walk: 'Our 30 minutes: about 10 minutes walking through the summary, value chain, canvases, how our thinking changed, the wedges and the pipeline; about 15 minutes on the questions we want your help with; 5 minutes to agree next steps.',
};

Object.assign(window.NOTES, {
  's-guide': 'Use this if a reviewer wants to jump around. Each row is a Check-In question, and the buttons go to where we answer it. Then state the 30-minute plan: 10 minutes of walkthrough, 15 on our questions, 5 on next steps.',
  's-pipeline': 'Who we will interview, matched to the personas, and how we reach each one. Point out that five of seven channels are independent, that names stay private, and the outreach rules at the bottom.',
  's-society': 'Walk the five rows quickly. The two to stress: safety (we never claim more than the evidence shows) and fairness (we check how results differ across people and conditions, not only the average).',
  's-gaps': 'Name the gaps before they do, each with an action and a date. Then spend most of the coaching time on the questions on the right.',
});

// =====================================================================
//  v12 ADDITIONS: a calmer, self-guided structure
//  Five chapters that follow the Studio 1 brief (B-2.3.1 to B-2.3.4),
//  then next steps (Check-In B-1.3.3) and an appendix. Shorter summary,
//  risks and gaps merged, outreach plan merged, one closing slide of asks.
// =====================================================================
window.VERSION.n = 12;
window.TEAM.updated = '11 Nov 2026';

window.CHAPTERS = [
  { id: 'intro', n: '', name: 'Overview', code: '', q: '' },
  { id: 'market', n: 1, name: 'The market', code: 'B-2.3.1', q: 'How is value moving in the software-defined vehicle, and who captures it?' },
  { id: 'incumbents', n: 2, name: 'How incumbents make money', short: 'Incumbents', code: 'B-2.3.2', q: 'How do companies at different stages of the chain capture value today?' },
  { id: 'fit', n: 3, name: 'Where we fit', code: 'B-2.3.3', q: 'Where could our skills give us an edge, and who are the engineers involved?' },
  { id: 'wedges', n: 4, name: 'Our wedges', code: 'B-2.3.4', q: 'What exactly will we test, and what would make us drop it?' },
  { id: 'next', n: 5, name: 'Next steps', code: 'Check-In B-1.3.3', q: 'How we reach real engineers in Studio 2, and what we still need' },
  { id: 'appx', n: 'A', name: 'Appendix', code: '', q: 'Detail behind the main story' },
];
window.CHECKIN = [
  { code: 'B-1.3.1', t: 'Value chain analysis and business model canvases', ch: ['market', 'incumbents'] },
  { code: 'B-1.3.2', t: 'Wedge hypotheses and rationale, with the weakest named', ch: ['fit', 'wedges'] },
  { code: 'B-1.3.3', t: 'Outreach pipeline, matched to our personas', ch: ['next'] },
];

window.EXEC.sub = 'Our Studio 1 business portfolio: how value moves in the software-defined vehicle, how incumbents make money, and three wedges we will test with real engineers in Studio 2.';
window.EXEC.bottomLine = 'Software-defined vehicles move a car’s value to a few central computers and their software, and let automakers keep earning after the sale. The biggest pools belong to well-funded incumbents, so our opening is the work every OEM must finish before launch: integration, verification and validation (V&V). It is the fastest-growing slice of auto software spend, and it gates every release.';
window.EXEC.path = [
  { n: '8', t: 'value-chain layers mapped', go: 's-vc' },
  { n: '3', t: 'incumbent business models', go: 's-bmc' },
  { n: '15', t: 'position-and-company pairs tested', go: 's-round2' },
  { n: '3', t: 'wedges to test in Studio 2', go: 's-wedges' },
];
window.EXEC.risk = 'No one outside the team has confirmed any of these pains yet. Interviews start in November, and we drop any wedge whose pain is not confirmed.';

(function () {
  const W = Object.fromEntries(window.WEDGES.list.map((w) => [w.id, w]));
  W.w1.short = 'Safety engineers can only show that the inputs they tested passed, so sign-off on an ML component can be challenged.';
  W.w2.short = 'HIL leads move tests to virtual ECUs with no measured data on what the virtual run misses.';
  W.w3.short = 'After a perception model is retrained, teams re-test almost everything or cut scope on judgment.';
})();

// Risks that could end a wedge, each with what we do about it (merges the v10 risk cards and gaps)
window.RISKS = [
  { k: 'Demand', n: '0 of 3', t: 'wedge pains confirmed by anyone outside the team', act: 'First interview request to the dSPACE applications engineer; 2–3 exploratory interviews before Studio 1 closes', by: '15 Nov' },
  { k: 'Fit with our vehicle', n: 'W1', t: 'counts as vehicle work only if our CAV perception stack has a small learned component', act: 'Get a yes or no from our CAV lead', by: 'Check-In' },
  { k: 'Access', n: '15 Dec', t: 'deadline for dSPACE licence scope and a named Applied Intuition contact, or W2 and one W1 pair fail', act: 'Finish the persona-matched search and log channel and status for each person', by: '15 Dec' },
  { k: 'Build', n: 'Feb 2027', t: 'W1 and W3 prototypes must work on a realistic component in simulation, or we drop them', act: 'Prototype both on public simulation components and log run time', by: 'Feb 2027' },
];
// Remaining gaps (the four above are not repeated)
window.GAPS = [
  ['Personas', 'No persona yet for W3’s likely user, a perception-model release lead', 'Draft one from public job postings, like the other six', '30 Nov'],
  ['Evidence', 'Some W1 evidence cites a team report we keep private', 'Cite the public job postings and company pages directly', '30 Nov'],
  ['Market', 'W1 and W2 have only top-down proxies, and W3’s two estimates disagree', 'Build bottom-up counts of programs and prices; ask about price in interviews', 'Studio 2'],
  ['Sources', 'Nine market facts still need checking against the original source', 'Check each one by hand and update the audit', '30 Nov'],
  ['Process', 'No Hypothesis & Assumptions Registry yet', 'Move each wedge’s assumptions and tests into the registry template', '30 Nov'],
];

// Innovation in society, shortened for the slide (the meaning is unchanged)
window.SOCIETY.rows = [
  ['Safety', 'Our evidence is read as proof that an ML component is safe, or W3 skips a test that mattered.', 'Every output states its scope and limits. W3 ranks tests and never drops one without sign-off. Nothing we build is qualified under ISO 26262, and we say so.', 'How safety assessors want limits stated'],
  ['Security', 'Customer models and test sets are valuable IP, and a new tool could open a way into a build pipeline.', 'Year 1 uses only public or simulation models. Any later design keeps customer models in the customer’s environment.', 'What security review a vendor needs before a pilot'],
  ['Privacy', 'Driving data can identify people, as the FTC order against GM shows.', 'W1 and W3 use simulation data only. W2 uses controller signals, not driver data.', 'Interview notes hold names: private tracker, shared only with consent'],
  ['Fairness', 'Perception can work worse for children, wheelchair users, at night or in rain. Averages hide this.', 'Include these people and conditions in W1’s checks and W3’s benchmarks, and report results by condition.', 'No public dataset with this coverage chosen yet'],
  ['Environment', 'Simulation and re-testing use computing energy; benches and test drives use hardware.', 'W2 and W3 aim to cut bench time and re-runs that are not needed. We log computing time per run.', 'No energy estimate yet'],
];

// Outreach: interview order merged into the pipeline
window.PIPELINE.aim = 'About 10 people, covering 6 W1, 4 W2 and 6 W3 conversations (many speak to two wedges), with licence and data access confirmed by 15 Dec.';

// Reviewer guide: kept as a scorecard map behind a button on the contents slide
window.GUIDE.groups.forEach((g) => g.rows.forEach((r) => {
  r.where = r.where.map(([id, x]) => [id === 's-next' ? 's-pipeline' : id, x]);
}));
(function () {
  const g = (cat) => window.GUIDE.groups.find((x) => x.cat === cat);
  g('Innovation process quality').rows[0].where = [['s-evolve'], ['s-wedges', 'DFV scoring'], ['s-gaps']];
  g('Innovation process quality').rows[2].where = [['s-pipeline'], ['s-people']];
  g('Communication').rows[0].where = [['s-exec'], ['s-map']];
  g('Communication').rows[1].where = [['s-asks']];
})();

Object.assign(window.NOTES, {
  's-cover': 'Lead with the question: where can an engineering team win in the software-defined vehicle? The portfolio has five chapters that follow the Studio 1 brief. Every slide states its point in the title, so a reviewer can follow it alone.',
  's-exec': 'The 60-second version: the bottom line and our focus area, how we got here in four steps, the three wedges, and the biggest risk. Everything after this slide is the evidence.',
  's-map': 'How the portfolio is organized: five chapters, then an appendix. The Check-In row shows where B-1.3.1, B-1.3.2 and B-1.3.3 are answered. The scorecard map lists every scorecard question with a link to where we answer it.',
  's-bmc': 'Two companies at different stages of the organizers’ chain, as the brief asks. dSPACE sells test tools (stage 5); Applied Intuition sells vehicle OS and autonomy software (stages 3 and 4), plus simulation tools in stage 5. Why these two: both are where our wedges would sell or plug in. dSPACE sponsors the challenge and Applied Intuition does not, so it tests whether we can reach a company on our own. Each card’s Sources link opens that canvas’s source list and PDF; the Mobileye canvas we also drafted is linked there. Note the half-confirmed NVIDIA point if asked.',
  's-ws': 'Round 1, kept on the record: eleven areas placed by criticality and competition, four in the whitespace. Each card says where that position went later. The full Round 1 scoring is in the appendix.',
  's-people': 'Six fictional archetypes, ranked by who decides and who we can reach first. Start with Jordan, the first contact, then Morgan, the decision-maker. Click a card for the full persona.',
  's-wedges': 'Rev 5 asks us to name the weakest wedge: W2 is weakest as a business. Each wedge opens on an overview with the problem, who has it, what we would offer and the test that could kill it. The other tabs hold the personas, the market and assumptions, and the full Studio 2 test plan. DFV scoring puts all three in the middle band; these are desk scores until interviews happen.',
  's-pipeline': 'Who we interview first, matched to the personas, and how we reach each one. Five of seven channels are independent of sponsors. Names stay in our private tracker.',
  's-society': 'Five areas. The two to stress: safety (we never claim more than the evidence shows) and fairness (we report results by condition, not only the average).',
  's-gaps': 'Name the risks before they do. Four could each end a wedge, and each has an action and a date. The smaller gaps are listed underneath.',
  's-asks': 'Spend most of the coaching time here. These are the questions where advice would change what we do next.',
  's-funnel': 'Appendix. Round 1 as scored on 5 Oct: all seven open pockets re-scored, so the shortlist could have been overturned. Drag the weights to stress-test it.',
  's-dossier': 'Appendix. The company-screen dossiers for W1 and W2, and the earlier targets with what changed.',
});

// v12: one-line versions of the four reasons, for the evolution slide (full text in the reading view)
window.EVOLUTION.whyShort = [
  'From “does it suit us?” to “which real company could we reach, and what could we add?”',
  'Incumbents already hold most of the HIL, zonal and OTA work.',
  'Verification research we can reach through our faculty advisor.',
  'Doing the work and reaching the company became must-haves.',
];

// v12: the wedge slide's tabs were renamed, so the scorecard map points at the new names
window.GUIDE.groups.forEach((g) => g.rows.forEach((r) => {
  r.where = r.where.map(([id, x]) => [id, ({ 'Problem on each wedge': 'Overview tab', 'Personas tab': '“Who has it” tab', 'Studio 2 test tab': '“Full test plan” tab' })[x] || x]);
}));

// v12 review fixes: W3's origin stated where the wedges are, outreach counts read correctly,
// chapter 5 no longer carries the B-1.3.3 tag on every slide, and a short key-terms line
window.WEDGES.intro = 'W1 and W2 came out of the company screen. W3 was added after it, in the same focus area, and has not been scored against companies yet. No interview has tested any of the three, so all are low confidence.';
window.PIPELINE.aimShort = 'people to interview. Many speak to two wedges, giving about 6 W1, 4 W2 and 6 W3 conversations, with licence and data access confirmed by 15 Dec.';
window.CHAPTERS.find((c) => c.id === 'next').code = '';
window.KEY_TERMS = [
  ['OEM', 'automaker'], ['Tier 1', 'supplier selling systems to OEMs'], ['ECU', 'a small computer controlling one function'],
  ['HIL', 'test bench with a real ECU and a simulated car'], ['OTA', 'over-the-air software update'], ['ADAS', 'driver assistance'],
  ['V&V', 'verification and validation'], ['Pocket', 'a critical, not-yet-crowded spot in the chain'], ['Wedge', 'a narrow first market we can test'],
];

// =====================================================================
//  v13 ADDITIONS
//  The organizers' seven-stage value-chain format filled with our research,
//  why each Round 1 pick was dropped, where every score comes from, and a
//  one-screen wedge canvas organised by desirability, feasibility, viability.
// =====================================================================
window.VERSION.n = 13;
window.TEAM.updated = '11 Nov 2026';

// --- The organizers' value-chain format (7 stages; rows Does / Handoff / Challenge / Stable / In motion),
//     filled with our research. zone: the organizers' shading. ours: our layer numbers.
window.CHAIN = {
  rows: [['does', 'Does'], ['handoff', 'Handoff'], ['challenge', 'Example challenge'], ['stable', 'Stable'], ['motion', 'In motion'], ['us', 'Where we sit']],
  zones: { covered: 'GM / Stellantis have it covered: understand, don’t rebuild', adjacent: 'Adjacent: work within the OEM’s platform', discovery: 'EcoCAR discovery zone: build expertise here' },
  stages: [
    { n: 1, name: 'Compute & sensing', sub: 'Chips, sensors, central computer', zone: 'covered', ours: [1, 3],
      does: 'Turns the road into data and runs it: sensors, chips and central computers.',
      handoff: 'Raw sensor signals and the compute headroom every later stage depends on.',
      challenge: 'Hardware is frozen years before the software it must run exists.',
      stable: 'A chip design win locks in for the platform’s whole life.',
      motion: 'OEMs now buy compute directly from chipmakers.',
      us: 'Not a target: chipmakers such as Qualcomm, NVIDIA and Mobileye dominate.' },
    { n: 2, name: 'E/E architecture', sub: 'Zonal wiring, power, networks', zone: 'covered', ours: [1],
      does: 'Wires computers, power and controllers into zones around a central backbone.',
      handoff: 'Reliable, on-time data transfer to the controls.',
      challenge: 'Splitting, porting and re-testing old controller software over years of mixed fleets.',
      stable: 'Zonal-plus-central layouts are where architectures are heading[^mck].',
      motion: 'Moving functions off legacy controllers, model year by model year.',
      us: 'Dropped: zonal ECU migration. The work lives inside OEM programs.', drop: ['zonal'] },
    { n: 3, name: 'Vehicle OS & middleware', sub: 'OS, OTA updates, cybersecurity', zone: 'adjacent', ours: [2, 4, 7],
      does: 'The car’s operating system: installs, isolates, secures and updates all software.',
      handoff: 'A certified platform that lets software above it ship once, on many chips.',
      challenge: 'Bridging old AUTOSAR Classic controllers with Linux-based platforms, and patching for a 15-year vehicle life.',
      stable: 'Certified platforms (QNX, Android Automotive, Vector); cybersecurity rules are mandatory for EU sales[^unece].',
      motion: 'Large OEMs bringing OTA in-house; the US connected-vehicle software rule[^bis].',
      us: 'Dropped: OTA for commercial vehicles, and SBOM & cyber evidence.', drop: ['ota', 'sbom'] },
    { n: 4, name: 'Control & autonomy stack', sub: 'Perceive, predict, plan, control', zone: 'discovery', ours: [3],
      does: 'Perceives, predicts and plans the drive, from driver assistance to automated driving.',
      handoff: 'Turns trusted sensor data into safe motion.',
      challenge: 'Proving safety across rare edge cases, especially for learned (ML) components.',
      stable: 'Hands-free highway driver assistance is deployed at scale (Super Cruise, Mobileye, Tesla).',
      motion: 'New safety guidance for AI components (ISO/PAS 8800); automated-driving timelines keep slipping.',
      us: 'W1 and W3 start here: evidence for a learned perception component.', w: ['w1', 'w3'] },
    { n: 5, name: 'Data, simulation & validation', sub: 'Digital twins, HIL bench, V&V', zone: 'discovery', ours: [8],
      does: 'Proves the vehicle works: simulation, HIL benches, virtual ECUs and test toolchains.',
      handoff: 'Turns requirements into evidence that regulators and buyers accept.',
      challenge: 'HIL benches are scarce, and virtual ECUs miss timing and I/O detail.',
      stable: 'Model-, software- and hardware-in-the-loop test pipelines are standard practice.',
      motion: 'The fastest-growing slice of auto software spend[^mck]; testing ML-based features.',
      us: 'W2 sits here, and W1 and W3 deliver their evidence here.', w: ['w2', 'w1', 'w3'] },
    { n: 6, name: 'In-cabin AI & HMI', sub: 'Assistants, trust cues, personalization', zone: 'discovery', ours: [],
      does: 'Makes automation understandable and trustworthy for the person in the seat.',
      handoff: 'Turns machine confidence into human trust.',
      challenge: 'Handing control back to a driver who has stopped paying attention.',
      stable: 'Infotainment platforms and driver-monitoring cameras ship today.',
      motion: 'Conversational AI assistants in the car.',
      us: 'Not mapped in depth in Studio 1. Infotainment apps sat in our commodity quadrant.' },
    { n: 7, name: 'Monetization & lifecycle', sub: 'Subscriptions, fleet ops, data', zone: 'covered', ours: [5, 6],
      does: 'Keeps the car earning after the sale: subscriptions, fleet services and data products.',
      handoff: 'Turns everything upstream into recurring revenue.',
      challenge: 'Every OEM exposes different signals, and consent now gates data revenue[^ftc].',
      stable: 'Paid connected services (OnStar) and fleet telematics (Samsara, Motive).',
      motion: 'Factory-fit telematics replacing aftermarket boxes; stricter consent for driving data.',
      us: 'Not taken forward: mixed-make fleet data; edge-side data selection only as an extension of W1.' },
  ],
};

// --- What happened to each Round 1 pick, in one line (from the company screen and EVOLUTION)
window.CAND_FATE = {
  hil: { k: 'narrowed', tag: 'Narrowed → W2', why: 'dSPACE already owns HIL tools, so we kept one question: what can leave the bench. 17 of 25, a conditional pass.' },
  zonal: { k: 'dropped', tag: 'Dropped', why: 'The work lives inside OEM programs and needs AUTOSAR and ISO 26262 depth we lack. Best company score 13 of 25.' },
  ota: { k: 'dropped', tag: 'Dropped', why: 'Large OEMs insource it, Applied Intuition bundles it, and open-source tools exist. Best company score 11 of 25.' },
  sbom: { k: 'dropped', tag: 'Dropped twice', why: 'Buyers need audit credibility a student team lacks, and specialists already compete (team fit 2.8 of 5). None of the three companies sells SBOM tools: best score 10 of 25.' },
};
window.SBOM_WHY = {
  title: 'Why we dropped SBOM & cyber evidence',
  need: 'The need is real: cybersecurity rules gate EU type approval[^unece], and the US connected-vehicle rule needs supplier declarations[^bis].',
  steps: [
    ['Round 1 · 5 Oct', 'Team fit too low', 'Scored 2.8 of 5 for feasibility, ranking #5 of 7. Buyers need audit credibility a student team lacks, and specialists such as Upstream, VicOne and PlaxidityX already compete.'],
    ['Round 2 · 26 Oct', 'No company pull', 'None of dSPACE, Applied Intuition or Mobileye sells SBOM tooling, so none would pull our work. Best score 10 of 25, well below the 17 needed.'],
  ],
  keep: 'Cybersecurity stays a built-in requirement of whatever we build. It reopens only with a cybersecurity faculty partner and a supplier design partner.',
};

// --- Where the scores come from
window.SCORE_HOW = {
  round2: {
    head: 'How to read a score',
    intro: 'Our team scored each pair 1 to 5 on five questions, using public evidence (company pages, job postings, product documents) in our 26 Oct screening report. Five questions × 5 points = 25.',
    q: [['Fit', 'Can we do the work?'], ['Differentiation', 'Can we add what they lack?'], ['Need', 'Is there public evidence they need it?'], ['Access', 'Can we reach the people?'], ['Strategic', 'Does it match where they are heading?']],
  },
  round1: 'Where these numbers come from. Team feasibility (0–5) is a weighted average of five criteria that the team scored 1–5 in its 5 Oct draft; the weights are the team’s draft weights, and you can drag them. Market attractiveness (1–5) is the team’s judgement of how critical the work is to launch and how open the competition is, from the value-chain map. Priority = feasibility × market, so 25 is the maximum. All are draft judgements, which is why we stress-tested them below.',
  dfv: 'Where these numbers come from. The fall workshop’s DFV tool lists 14 criteria with suggested weights. Our team scored each wedge 1–5 per criterion from desk research, before any interview. Each bar is the weighted score as a share of the maximum; the percentage is the tool’s position-in-range (the average of desirability and of feasibility-plus-viability).',
};

// --- Wedge canvas: which D/F/V column holds the weakest link
window.WEDGES.list.forEach((w) => { w.weakCol = { w1: 'Desirability', w2: 'Viability', w3: 'Desirability' }[w.id]; });

// --- Each incumbent's position on the organizers' seven stages (for the canvas cards)
window.BMC_STAGES = { ds: [5], ai: [3, 4, 5], me: [1, 4] };

Object.assign(window.NOTES, {
  's-chain': 'This is the organizers’ value-chain format, filled in with our research. Our eight layers map onto their seven stages, shown under each stage name. Click a row name to focus on it. The point to make: all three of our wedges sit inside the organizers’ EcoCAR discovery zone, and all three positions we dropped sat outside it.',
  's-ws': 'Round 1, kept on the record so reviewers can see what changed. Each dot and card now shows what happened to it: HIL narrowed into W2; zonal, OTA and SBOM dropped. W1 and W3 grew from a narrow evidence niche in the crowded ADAS layer. The SBOM panel explains why it was dropped twice.',
  's-round2': 'Five Round 1 positions against three companies, 15 pairs. Explain the scoring strip first: five questions, 1 to 5 each, scored by our team from public evidence. Then click 20 for W1, 17 for W2, and an OTA or zonal cell to show why they failed.',
});

// v13: the reading view's Round 1 cards show what happened to each pick
window.CANDIDATES.forEach((c) => { const f = window.CAND_FATE[c.id]; if (f) c.now = `${f.tag}: ${f.why}`; });

// v13 tightening after render
window.CHAIN.stages[1].us = 'Zonal ECU migration. The work lives inside OEM programs.';
window.CHAIN.stages[2].us = 'OTA for commercial vehicles, and SBOM & cyber evidence.';
window.SBOM_WHY.steps = [
  ['Round 1 · 5 Oct', 'Team fit too low', 'Feasibility 2.8 of 5, #5 of 7. Buyers need audit credibility we lack, and specialists already compete.'],
  ['Round 2 · 26 Oct', 'No company pull', 'None of the three companies sells SBOM tooling, so none would pull our work. Best score 10 of 25.'],
];
window.SBOM_WHY.keep = 'Cybersecurity stays a requirement of whatever we build. Reopens only with a cybersecurity faculty partner and a supplier partner.';
window.SCORE_HOW.round1 = 'Where these numbers come from. Feasibility (0–5) is a weighted average of five criteria the team scored 1–5 in its 5 Oct draft, using the team’s draft weights (drag them to test). Market (1–5) is the team’s judgement of how critical the work is to launch and how open the competition is, from the value-chain map. Priority = feasibility × market, so 25 is the maximum. All are draft judgements, which is why we stress-tested them above.';

// =====================================================================
//  v14 ADDITIONS
//  Short wording for the late slides, so each reads as a picture first and
//  text second. Every line below is condensed from the fuller data above.
// =====================================================================
window.VERSION.n = 14;

// --- Wedge canvas: one short line per box (full text stays in the tabs and the reading view)
window.WEDGE_CV = {
  w1: {
    who: 'Safety and V&V engineers who sign off small ML components',
    pain: 'Sampled tests cover only the inputs tried, so a sign-off can be challenged',
    offer: 'Extra evidence a safety reviewer accepts, inside the toolchain they already run',
    start: 'Start: one small learned component in a CAV perception stack',
    D: ['Gatekeepers see a gap that statistics do not fill', '6 safety or V&V interviews', 'Fewer than 3 of 6 recall a recent challenge'],
    F: ['It works on a realistic component', 'Prototype on one small component, log run time', 'Not working by end of Feb 2027 within the time budget'],
    V: ['A tool vendor could be our channel', 'Short demo to a product contact', 'No second meeting, or qualification is a hard blocker'],
  },
  w2: {
    who: 'HIL and virtual-validation leads',
    pain: 'Tests leave the HIL bench with no measured data on what is lost',
    offer: 'Measured virtual-vs-HIL differences and a “must stay on HIL” checklist',
    start: 'Start: one controller function on virtual ECU, HIL and vehicle',
    D: ['Leads lack data on what must stay on HIL', '4 HIL interviews on the last test moved off the bench', 'Fewer than 2 of 4 recall a recent call made without data'],
    F: ['We can get tools and bench time', 'Confirm licence and bench access with the sponsor', 'Not confirmed by 15 Dec 2026'],
    V: ['Someone would pay or commit', 'Ask who funded the last comparable study', 'Nobody names a budget or a next step'],
  },
  w3: {
    who: 'Integration and validation leads shipping ADAS updates',
    pain: 'After a model is retrained, nobody can show which behaviors moved',
    offer: 'Guidance on what to re-test, with the reasoning recorded',
    start: 'Start: retrained perception models',
    D: ['Scoping re-tests is a costly problem', '6 interviews on the last re-test decision', 'Fewer than 3 of 6 describe a costly case in 12 months'],
    F: ['It finds faults with less testing', 'Benchmark with known faults on public simulation data', 'Under 90% of faults caught with half the tests, by Feb 2027'],
    V: ['Someone would pay or commit', 'Ask who funds re-test work today', 'Nobody names a budget or a next step'],
  },
};

// --- Outreach: conversations per wedge, from PIPELINE.aim
window.PIPELINE.convs = [['w1', 6], ['w2', 4], ['w3', 6]];

// --- Innovation in society: one risk line, short guardrails, one open question
window.SOCIETY.cards = [
  { k: 'Safety', icon: 'shield', risk: 'Our evidence is read as proof of safety, or W3 skips a test that mattered',
    guard: ['Every output states its scope and limits', 'W3 never drops a test without sign-off', 'We claim no ISO 26262 qualification'], open: 'How safety assessors want limits stated' },
  { k: 'Security', icon: 'lock', risk: 'Customer models are valuable IP, and a new tool could open a way into a build pipeline',
    guard: ['Year 1 uses only public or simulation models', 'Later designs keep customer models in the customer’s environment'], open: 'What security review a vendor needs before a pilot' },
  { k: 'Privacy', icon: 'eye', risk: 'Driving data can identify people, as the FTC order against GM shows',
    guard: ['W1 and W3 use simulation data only', 'W2 uses controller signals, not driver data'], open: 'Interview notes hold names: private tracker, shared only with consent' },
  { k: 'Fairness', icon: 'people', risk: 'Perception can work worse for children, wheelchair users, at night or in rain; averages hide it',
    guard: ['Include these people and conditions in W1 checks and W3 benchmarks', 'Report results by condition'], open: 'No public dataset with this coverage chosen yet' },
  { k: 'Environment', icon: 'leaf', risk: 'Simulation and re-testing use computing energy; benches and test drives use hardware',
    guard: ['W2 and W3 aim to cut unneeded bench time and re-runs', 'Log computing time per run'], open: 'No energy estimate yet' },
];

// --- Risks & gaps on one timeline. Stops are in date order, not to scale.
//     r: index into RISKS for the four big risks; g: index into GAPS for the smaller fixes.
window.GAP_TIMELINE = [
  { when: 'Before Check-In', r: [1], g: [] },
  { when: '15 Nov', r: [0], g: [] },
  { when: '30 Nov', r: [], g: [0, 1, 3, 4] },
  { when: '15 Dec', r: [2], g: [] },
  { when: 'Feb 2027', r: [3], g: [] },
  { when: 'Studio 2', r: [], g: [2] },
];

// --- Questions for reviewers: what each one is about, and where the evidence is
window.ASK_TAGS = [['Fit', 's-wedges'], ['Access', 's-pipeline'], ['Priority', 's-wedges'], ['Market size', 's-wedges'], ['IP', 's-dossier']];

Object.assign(window.NOTES, {
  's-wedges': 'One wedge per screen. Read the hypothesis, then left to right: who has the pain, the pain, what we offer, and the market direction. Below, desirability, feasibility and viability each show the assumption, the Studio 2 test and the result that would make us drop it. The red badge marks the riskiest column. Desk scores are explained under “How we scored”.',
  's-pipeline': 'Seven personas in the order we contact them. Each card shows the wedges they speak to, the channel and its type, and the next step. Below: about 10 interviews, the channel mix (5 of 7 independent), and our outreach rules behind a button.',
  's-society': 'Five areas. For each: what could go wrong, our guardrails, and what is still open.',
  's-gaps': 'Four risks that could each end a wedge, then one timeline with every action we have committed to, including the smaller fixes due on 30 Nov.',
});

// =====================================================================
//  v15 ADDITIONS (12 Nov 2026)
//  Review fixes: one as-of date, hand-checked audit items, one vocabulary
//  (pocket, wedge, company test), counts that agree, personas merged into
//  the interview plan, and shorter slide wording. General terms only.
// =====================================================================
window.VERSION.n = 15;
window.TEAM.updated = '12 Nov 2026';
window.TEAM.submission = 'Check-In 1 · Studio 1 business portfolio';

// --- One title everywhere (a reviewer felt the old one was missing a word)
window.EXEC.thesis = 'Where an engineering team can win in the software-defined vehicle market';
window.EXEC.sub = 'Our Studio 1 business portfolio: how value moves in software-defined vehicles, how incumbents make money, and three wedges we will test with real engineers in Studio 2.';
window.EXEC.bottomLine = 'The biggest money in software-defined vehicles sits with well-funded incumbents. Our opening is the evidence work every automaker must finish before launch: integration, verification and validation (V&V), the fastest-growing slice of auto software spend.';
window.EXEC.howToRead = 'How to read this: public sources only, no OEM data. Every score is a team judgement until Studio 2 interviews. Personas are fictional archetypes of real jobs.';
window.EXEC.risk = 'No one outside the team has confirmed any of the three pains yet. We drop any wedge whose pain Studio 2 interviews do not confirm.';

// --- Vocabulary: pocket (a gap in the market), wedge (what we will test),
//     company test (one idea scored against one company)
window.KEY_TERMS = [
  ['OEM', 'automaker'], ['Tier 1', 'supplier selling systems to OEMs'], ['ECU', 'a small computer controlling one function'],
  ['E/E', 'electrical/electronic architecture: how a car’s computers and wiring are laid out'],
  ['HIL', 'test bench with a real ECU and a simulated car'], ['OTA', 'over-the-air software update'], ['ADAS', 'driver assistance'],
  ['V&V', 'verification and validation'], ['Pocket', 'a critical, not-yet-crowded gap in the chain'],
  ['Company test', 'one idea scored against one real company'], ['Wedge', 'a narrow first market we will test'],
];
window.GLOSSARY.splice(1, 0,
  ['E/E architecture', 'Electrical/electronic architecture: how a vehicle’s computers, controllers and wiring are organized.'],
  ['Pocket', 'A critical, not-yet-crowded gap in the value chain. We found seven, one per layer except software platforms.'],
  ['Company test', 'One idea scored against one real company on five questions (fit, differentiation, need, access, strategic relevance), 25 points in all. Five ideas × three companies = 15 company tests.'],
  ['Archetype', 'A persona built from public job postings: a realistic job role, not a real person.'],
);

// --- The evidence audit: 43 claims; 37 verified or corrected, 6 labelled as forecasts,
//     estimates or hypotheses. 9 points needed a person to open the source; a teammate checked them on 10–11 Nov.
window.STATUS.corrected.label = 'Corrected';
window.STATUS.corrected.desc = 'Wording, figure or credit fixed after checking the source';
(function () {
  const C = window.CLAIMS;
  const find = (src, start) => C.find((c) => c.src === src && c.claim.startsWith(start));
  const hand = (src, start, note) => { const c = find(src, start); if (!c) throw new Error('claim ' + src); c.hand = note; delete c.pending; };
  hand('mck', '$519B', 'Checked by hand: published January 2026');
  hand('gm-q3l', 'GM targets', 'Checked by hand: “gross margins of approximately 70%” (GM shareholder letter)');
  hand('nhtsa', '891', 'Checked by hand: NHTSA’s 2025 table shows 891 recalls covering 29.3M vehicles');
  hand('gm-10q', 'GM has accrued', 'Checked by hand: “we had accrued $0.5 billion” (10-Q, 30 Jun 2026)');
  hand('qcom', 'Qualcomm', 'Checked by hand: $1.59B fiscal Q3 automotive revenue, +61% year over year');
  hand('tsla', 'Tesla', 'Checked by hand: 55% bought FSD outright, 45% subscribe');
  hand('mck', 'L2 could be', 'Checked by hand: 52% in 2030, holding at 52% in 2035');
  hand('qnx-dn', '52%', 'Checked by hand: the release and its PDF give no sample size for the VP figure');
  hand('applied-30', 'Applied Intuition', 'Checked by hand: still in talks to raise $1.5B at a ~$30B valuation (Bloomberg via Investing.com)');
  hand('harman-zf', 'Harman moved', 'Checked by hand: the deal is cleared in the EU and still in China’s review, so not yet closed');
  hand('iso21434', 'ISO/SAE 21434', 'Could not check by hand: the standard is paywalled, so the count rests on two secondary sources');
  hand('china-gb', 'China', 'Checked by hand: China’s GB 44495-2024 was released 23 Aug 2024; India’s AIS-189 and AIS-190 are listed as published by ARAI');
  C.forEach((c) => { delete c.v1; delete c.pending; });
})();
window.HAND_CHECKS = {
  date: '10–11 Nov 2026',
  done: 8, total: 9,
  open: 'ISO/SAE 21434 work-product count (paywalled standard)',
  links: 'All 15 source links that blocked our automated checker were opened by hand in a browser on 11 Nov; all 15 load.',
};

// --- Value chain map rows: who plays and how crowded, no market sizes (those live on Where value grows)
(function () {
  const L = (id) => window.LAYERS.find((l) => l.id === id);
  L(1).callStat = 'Chip design wins lock in a supplier for the platform’s life';
  L(2).callStat = 'A per-unit royalty for the platform’s life';
  L(3).callStat = 'Per-vehicle software, plus paid upgrades';
  L(4).callStat = 'Fixes and features shipped after the sale';
  L(5).callStat = 'Monthly subscriptions after the sale';
  L(8).callStat = 'Fragmented: tool vendors, test services and in-house teams';
})();

// --- The organizers' value chain: spell out E/E, and keep three rows on the main slide
window.CHAIN.stages[1].name = 'E/E (electrical/electronic) architecture';
window.CHAIN.mainRows = ['does', 'challenge', 'us'];

// --- Where value grows: what the 11.4% measures
window.GROW_CALLOUT = {
  big: '11.4%', unit: 'a year',
  head: 'Spending on integration and V&V services grows 11.4% a year, 2025–2035',
  body: 'The fastest-growing slice of automotive software spending, in McKinsey’s split by activity rather than by layer. All three of our wedges are validation work in this slice.',
};

// --- Business models: three revenue lines each, one line on what protects it
(function () {
  const B = Object.fromEntries(window.BMCS.map((b) => [b.id, b]));
  B.ds.money = B.ds.money.slice(0, 3);
  B.ai.money = B.ai.money.slice(0, 3);
  B.me.money = B.me.money.slice(0, 3);
  B.ds.moat = 'Benches, models and test cases built on dSPACE get reused for years, so switching is costly.';
  B.ai.moat = 'It lands with one tool, then expands, with engineers embedded in customer teams.';
  B.me.moat = 'Repeat design wins with all top-10 customers, and 250M+ vehicles built with EyeQ.';
})();

// --- Personas: archetypes, one numbering (the order we contact them), no office addresses
(function () {
  const P = Object.fromEntries(window.PERSONAS.map((p) => [p.code, p]));
  P['dS-2'].company = 'dSPACE';
  ['dS-2', 'dS-1', 'dS-3', 'AI-1', 'AI-2', 'ME-1'].forEach((c, i) => { P[c].rank = i + 1; });
})();

// --- Who we will interview: the outreach plan, updated with the 11 Nov persona-matching search.
//     Counts only: names, titles and links stay in the team's private tracker.
window.PIPELINE.rows = [
  { p: 'dS-2', who: 'HIL applications engineer, dSPACE', w: 'W2, W1', ch: 'EcoCAR sponsor contact; one match is a former EcoCAR member', kind: 'Sponsor', n: '2 matches found', next: 'First request by 15 Nov', found: 2 },
  { p: 'dS-1', who: 'Product manager, AI code generation, dSPACE', w: 'W1', ch: 'Introduction from dS-2 or the EcoCAR sponsor', kind: 'Sponsor', n: '1 match found', next: 'After the first dSPACE call', found: 1 },
  { p: 'dS-3', who: 'HIL or virtual-validation lead at an OEM that uses dSPACE', w: 'W2, W3, W1', ch: 'Stellantis sponsor contact; WMU alumni', kind: 'Both', n: '2 matches found', next: 'Both matches are WMU alumni: plan the first message', found: 2 },
  { p: 'AI-1', who: 'Senior system safety engineer, Applied Intuition', w: 'W1', ch: 'LinkedIn message; WMU alumni; conference talks', kind: 'Independent', n: '2 matches found', next: 'First message by 15 Dec', found: 2 },
  { p: 'AI-2', who: 'V&V lead, autonomy, Applied Intuition', w: 'W1, W3', ch: 'WMU alumni; LinkedIn message', kind: 'Independent', n: 'Searching', next: 'Named match needed by 15 Dec', found: 0 },
  { p: 'New', who: 'Perception or ADAS validation lead who retrains models, at an OEM or Tier 1', w: 'W3', ch: 'WMU alumni; LinkedIn; SAE and IEEE events', kind: 'Independent', n: 'Not started', next: 'Draft the persona by 30 Nov, then search', found: 0 },
  { p: 'ME-1', who: 'Safety assurance expert, Mobileye', w: 'W1', ch: 'Warm introduction only, through Stellantis engineers', kind: 'Independent', n: 'Parked', next: 'Waits for a warm introduction', found: 0 },
];
window.PIPELINE.found = { people: 7, personas: 4, of: 6, date: '11 Nov 2026' };
window.PIPELINE.note = 'Names and contact details stay in our private tracker, not on this public site. We have not contacted anyone yet.';

// --- Wedges: the short view shows all three side by side
(function () {
  const W = Object.fromEntries(window.WEDGES.list.map((w) => [w.id, w]));
  W.w1.vp = 'For safety engineers signing off an ML component, evidence about the inputs testing never sampled, which scenario tests and statistics cannot give.';
  W.w2.vp = 'For HIL leads moving tests to virtual ECUs, measured data on what the virtual run misses, instead of judgment calls.';
  W.w3.vp = 'For teams retraining perception models, a recorded reason for what to re-test, instead of re-running everything.';
  W.w1.payer = 'Still to find. To test: a tool vendor’s licence add-on, or a paid pilot.';
  W.w2.payer = 'Still to find. To test: a paid study, which may be a publication rather than a product.';
  W.w3.payer = 'Still to find. To test: a yearly licence per ADAS program.';
  W.w1.vehicle = 'Starts on a learned component in our own CAV perception stack, if it has one (our CAV lead confirms).';
  W.w2.vehicle = 'Closest to our vehicle-data simulation deliverable; bench work would be extra.';
  W.w3.vehicle = 'Ties to our CAV perception and toolchain deliverables.';
  W.w1.promise = 'Promise to test by Feb 2027: evidence for one small component within 1 hour per build.';
  W.w1.ask = '“When was evidence for an ML component last challenged, and by whom?”';
  W.w2.ask = '“The last time you moved a test from HIL to SIL, what made you trust it?”';
  W.w3.ask = '“When one function last changed, how did you decide what to re-test?”';
  W.w1.bottomUp = 'Bottom-up, in Studio 2: programs × learned components per program × price per evidence package, with price asked in interviews.';
  W.w1.weakCol = W.w3.weakCol = 'Desirability';
  W.w2.weakCol = 'Viability';
})();
window.WEDGES.weakestShort = 'W2 is our weakest wedge: dSPACE already sells most of the tooling, nobody has been shown paying for this kind of study, and an OEM could run it alone.';
window.WEDGES.intro = 'W1 and W2 came out of the company screen; W3 was added after it. No interview has tested any of them, so all three are low confidence.';

// --- Company screen: does the sponsor tilt the result?
window.ROUND2.sponsorCheck = 'Sponsor check: dSPACE is a sponsor, which helps on Access. Without that, W1 still passes with Applied Intuition, which is not a sponsor (19 of 25).';

// --- How we narrowed: the one funnel used everywhere
window.NARROW = {
  steps: [
    { n: '8', t: 'value-chain layers mapped' },
    { n: '7', t: 'pockets found, one per layer but one' },
    { n: '4', t: 'shortlisted; 3 kept as targets, SBOM cut at scoring' },
    { n: '15', t: 'company tests: 5 ideas × 3 companies' },
    { n: '3', t: 'wedges for Studio 2' },
  ],
};
window.EVOLUTION.timeline = [
  { d: '5 Oct', t: 'Round 1 shortlist', on: true },
  { d: '13 Oct', t: 'Market claims audited', on: true },
  { d: '26 Oct', t: 'Company screen', on: true },
  { d: '30 Oct', t: 'Business models v2', on: true },
  { d: '11 Nov', t: 'Hand checks; 7 people matched', on: true },
  { d: '15 Nov', t: 'First interview request' },
  { d: '15 Dec', t: 'Access deadline' },
  { d: 'Studio 2', t: 'Re-score with interviews' },
];
window.SCREEN.note = 'Draft scores for the team to calibrate in a 30-minute scoring session, and to re-check after Studio 2 interviews[^b133].';

// --- Risks: each with its dated action; progress since 10 Nov
window.RISKS = [
  { k: 'Demand', n: '0 of 3', t: 'wedge pains confirmed by anyone outside the team', act: 'First interview request to the dSPACE applications engineer; 2–3 exploratory interviews before Studio 1 closes', by: '15 Nov' },
  { k: 'Fit with our vehicle', n: 'W1', t: 'counts as vehicle work only if our CAV perception stack has a small learned component', act: 'Get a yes or no from our CAV lead, and ask the organizers in writing', by: 'Check-In' },
  { k: 'Access', n: '15 Dec', t: 'deadline for dSPACE licence scope and a named Applied Intuition contact, or W2 and one W1 test fail', act: '7 matching people found for 4 of 6 personas on 11 Nov; still searching for AI-2', by: '15 Dec' },
  { k: 'Build', n: 'Feb 2027', t: 'W1 and W3 prototypes must work on a realistic component in simulation, or we drop them', act: 'Prototype both on public simulation components and log run time', by: 'Feb 2027' },
];
window.GAPS = [
  ['Personas', 'No persona yet for W3’s likely user, a perception-model release lead', 'Draft one from public job postings, like the other six', '30 Nov'],
  ['Evidence', 'Some W1 evidence cites a team report we keep private', 'Cite the public job postings and company pages directly', '30 Nov'],
  ['Market', 'W1 and W2 have only top-down proxies, and W3’s two estimates disagree', 'Build bottom-up counts of programs and prices; ask about price in interviews', 'Studio 2'],
  ['Process', 'No Hypothesis & Assumptions Registry yet', 'Move each wedge’s assumptions and tests into the registry template', '30 Nov'],
];
window.DONE = [
  ['Sources', '8 of 9 open audit points checked by hand; the ninth (ISO/SAE 21434) is paywalled', '11 Nov'],
  ['Links', 'All 15 source links our checker could not open load in a browser', '11 Nov'],
  ['Outreach', '7 real people matched to 4 of our 6 personas (names kept private)', '11 Nov'],
];

// --- Innovation in society: plain wording, no internal rule numbers
window.SOCIETY.note = 'Across all five: public sources only, no OEM data, and personas are fictional archetypes.';
window.SOCIETY.summary = 'Every area has a guardrail; for example, we never claim more than the evidence shows (safety), and we report results by condition, not only on average (fairness).';

// --- Chapters and the Check-In map
window.CHAPTERS.find((c) => c.id === 'fit').q = 'Where could our skills give us an edge, tested against real companies?';
window.CHAPTERS.find((c) => c.id === 'next').q = 'Who we interview first, what could go wrong, and what we still need';
window.CHECKIN = [
  { code: 'B-1.3.1', t: 'Value chain and business model canvases', ch: ['market', 'incumbents'] },
  { code: 'B-1.3.2', t: 'Wedge hypotheses, with the weakest named', ch: ['fit', 'wedges'] },
  { code: 'B-1.3.3', t: 'Outreach matched to our personas', ch: ['next'] },
];
window.ASK_TAGS = [['Fit', 's-wedges'], ['Access', 's-pipeline'], ['Priority', 's-wedges'], ['Market size', 's-wedges'], ['IP', 's-dossier']];
window.GUIDE.groups.forEach((g) => g.rows.forEach((r) => {
  r.where = r.where.map(([id, x]) => [id === 's-people' ? 's-pipeline' : id, x]).filter(([id], i, a) => a.findIndex(([j]) => j === id) === i);
}));

// --- W1 against today's tools (general terms; the method stays private)
window.ALTERNATIVES = [
  ['Scenario sweeps', 'Show the scenarios you listed pass', 'Say nothing about scenarios nobody listed'],
  ['Perturbation tests and statistics', 'Estimate how often the component fails', 'Cannot rule out inputs that were never sampled'],
  ['MIL/SIL/PIL simulation', 'Show the code matches the model', 'Do not show the model is safe to rely on'],
];
window.ALT_ADDS = 'W1 aims to add evidence about inputs that were never sampled, delivered inside the toolchain the team already runs.';

Object.assign(window.NOTES, {
  's-cover': 'Lead with the question: where can an engineering team win in the software-defined vehicle market? Five chapters follow the Studio 1 brief, and every slide states its point in the title.',
  's-exec': 'The 60-second version: the bottom line, the three wedges (W2 is weakest), and the biggest risk. Everything after this slide is the evidence.',
  's-evolve': 'Round 1 on the left, where each idea ended up on the right. Three survive in some form: W1 grew from ADAS validation evidence, W2 is narrowed HIL, and edge data selection rides inside W1. The four reasons sit underneath.',
  's-round2': 'Five ideas against three companies, 15 company tests. The legend explains the five bars. W1 passes with dSPACE (20) and, without sponsor help, with Applied Intuition (19).',
  's-wedges': 'All three wedges side by side. Read each column top to bottom: who, the pain, what we offer, the interview question, the result that drops it, and the desk scores. W2 is weakest, and the title says so. Click a column for the full plan.',
  's-pipeline': 'Seven personas in contact order. Four now have real matching people (names private); none contacted yet. Four of seven can be reached without a sponsor. Click a card for the full persona.',
  's-chainx': 'Appendix. The organizers’ format with all six rows, and which of our eight layers sits under each stage.',
  's-ws': 'Appendix. Round 1 as placed on 5 Oct: the four picks in the critical-and-fragmented corner, and what happened to each.',
});

// --- One funnel, used on the cover and in the appendix
window.FUNNEL = [
  { n: 8, label: 'value-chain layers mapped', note: 'Six stacked layers plus two that run through all of them (cybersecurity; integration & V&V)', stage: 'B-2.3.1' },
  { n: 7, label: 'pockets found', note: 'One critical, not-yet-crowded pocket per layer; none in software platforms', stage: 'B-2.3.1' },
  { n: 4, label: 'shortlisted', note: 'The four in the critical-and-fragmented corner. Scoring kept three as Round 1 targets and cut SBOM.', stage: 'B-2.3.1' },
  { n: 15, label: 'company tests', note: 'Five ideas scored against dSPACE, Applied Intuition and Mobileye on 26 Oct', stage: 'B-2.3.3' },
  { n: 3, label: 'wedges for Studio 2', note: 'W1 and W2 came out of the company screen; W3 was added after it', stage: 'B-2.3.4' },
];

// v15: risks now carry their own dated actions, so the separate timeline is retired
window.GAP_TIMELINE = [];

// --- v15 fact checks (12 Nov 2026): what the 11.4% measures, China and India dates, S-CORE backers
(function () {
  const C = window.CLAIMS;
  const f = (src, start) => C.find((c) => c.src === src && c.claim.startsWith(start));
  f('mck', 'Integration, V&V').claim = 'Integration, V&V services: the fastest-growing of McKinsey’s top-level auto software segments, 11.4%/yr through 2035 (split by function, ADAS software grows faster)';
  const cn = f('china-gb', 'China');
  cn.claim = 'China (new vehicle types from Jan 2026, all from Jan 2028) and Korea (Aug 2025) enforce R155-aligned rules; India has published AIS-189/190, but the rule making them mandatory is still a draft (June 2026)';
  cn.hand = 'Checked by hand: GB 44495-2024 released 23 Aug 2024; ARAI lists AIS-189 and AIS-190 as published. Correction: India’s mandate is a June 2026 draft, and China’s second date is 2028';
  f('applied-30', 'Applied Intuition').hand = 'Checked by hand: offers at ~$30B reported 13 Oct; Bloomberg (11 Nov) says it is still in talks to raise $1.5B at that value';
  const L = (id) => window.LAYERS.find((l) => l.id === id);
  L(8).callStat = 'Fragmented: tool vendors, test services and in-house teams';
  L(8).statcap = 'integration, verification and validation services: the fastest-growing of McKinsey’s top-level auto software segments, through 2035[^mck]';
  window.EXEC.facts[1].t = 'integration, verification & validation services: the fastest-growing of McKinsey’s top-level auto software segments[^mck]';
  window.EVOLUTION.stayed[1] = 'Integration and V&V remains the fastest-growing of McKinsey’s auto software segments';
  window.CHAIN.stages.forEach((st) => { if (st.motion && /fastest-growing slice/.test(st.motion)) st.motion = st.motion.replace('The fastest-growing slice of auto software spend', 'McKinsey’s fastest-growing software segment'); });
  window.WEDGES.focus = window.WEDGES.focus.replace('It is the fastest-growing slice of auto software spend', 'It is the fastest-growing of McKinsey’s auto software segments');
  window.SOURCES['score-eclipse'] = { pub: 'Eclipse Foundation', title: 'Eclipse S-CORE launch, backed by BMW Group, Mercedes-Benz, Bosch, ETAS, QNX, Qorix and Accenture', date: '12 Jun 2025', kind: 'primary', url: 'https://newsroom.eclipse.org/node/42222' };
  const two = L(2);
  ['moats', 'critical', 'pain', 'winning'].forEach((k) => {
    if (Array.isArray(two[k])) two[k] = two[k].map((t) => t.replace('OEM-backed open source (Eclipse S-CORE, still pre-1.0)', 'OEM-backed open source (Eclipse S-CORE, backed by BMW, Mercedes-Benz, Bosch, ETAS and QNX at launch[^score-eclipse], still pre-1.0)'));
  });
})();
window.EXEC.bottomLine = 'The biggest money in software-defined vehicles sits with well-funded incumbents. Our opening is the evidence work every automaker must finish before launch: integration, verification and validation (V&V), the fastest-growing segment in McKinsey’s split of auto software.';
window.GROW_CALLOUT = {
  big: '11.4%', unit: 'a year',
  head: 'Integration and V&V services grow 11.4% a year through 2035',
  body: 'The fastest of McKinsey’s top-level auto software segments. Split by function instead, ADAS software grows faster (left), but that layer is crowded. All three of our wedges are validation work.',
};

// v15 vocabulary: company test, not pair
window.ROUND2.rule = window.ROUND2.rule.replace('A pair passes', 'A company test passes');
window.NOTES['s-round2'] = 'Five ideas against three companies gives 15 company tests, and three pass. Click 20 for W1, then 17 to show a pass that only just passes. The sponsor check under the matrix shows W1 also passes with Applied Intuition, which is not a sponsor.';

// --- v15 review round 2 (independent check, 12 Nov)
(function () {
  // ME-1's only route is a warm introduction through Stellantis engineers, a sponsor route
  const me = window.PIPELINE.rows.find((r) => r.p === 'ME-1');
  me.kind = 'Sponsor';
  window.PIPELINE.note = 'Names and contact details stay in our private tracker, not on this public site. We have not contacted anyone yet. Four of the seven personas can be reached without a sponsor, so at least half of our interviews can come from independent outreach, as Studio 2 requires.';
  // one numbering: the order of the interview cards (the unwritten W3 persona is 6th)
  window.PERSONAS.find((p) => p.code === 'ME-1').rank = 7;
  // Mobileye with W1 fails on the total (16 of 25, one short), and access is the weakest score
  const m = window.ROUND2.pairs['adas.me'];
  m.cell = 'Near-miss: 1 short'; m.label = 'Near-miss: 16 of 25, one point short; access is the weak score';
  // one name per idea, everywhere
  const P = Object.fromEntries(window.ROUND2.positions.map((p) => [p.id, p]));
  P.zonal.name = 'Zonal migration of legacy ECUs';
  P.ota.name = 'OTA for commercial & off-highway';
  P.sbom.name = 'SBOM & cyber lifecycle evidence';
  window.CHAIN.stages[1].us = 'Zonal migration of legacy ECUs. The work lives inside OEM programs.';
  window.CHAIN.stages[2].us = 'OTA for commercial & off-highway, and SBOM & cyber lifecycle evidence.';
  window.STATUS.hypothesis.desc = 'To be tested in Studio 2 interviews';
  window.SCORE_HOW.round1 = window.SCORE_HOW.round1.replace('Feasibility (0–5)', 'Feasibility (1–5)').replace('Team feasibility (0–5)', 'Team feasibility (1–5)');
  window.RISKS[1].by = 'our Check-In session';
  window.RISKS[2].act = '7 real people matched to 4 of 6 personas on 11 Nov; still searching for AI-2';
})();

window.LAYERS.find((l) => l.id === 7).pocket.text = 'SBOM & cyber lifecycle evidence';

// =====================================================================
//  v16 ADDITIONS (13 Nov 2026)
//  Readability pass from the team's slide-by-slide notes: bigger type,
//  less text per slide, plain-language wedge names used everywhere, the
//  company-score grid, Round 1 scoring and the crosswalk slides retired,
//  two business model canvases instead of three. General terms only.
// =====================================================================
window.VERSION.n = 16;
window.TEAM.updated = '13 Nov 2026';
(function () {
  // one plain-language name and one plain sentence per wedge, used on every slide
  const PLAIN = {
    w1: { name: 'Stronger safety evidence for AI parts', who: 'Safety engineers who sign off an AI part of the car',
      plain: 'Tests only show that the cases someone tried were safe. Safety engineers need evidence that also covers the cases nobody tried.' },
    w2: { name: 'What can leave the test bench', who: 'Test leads moving tests from hardware benches to simulation',
      plain: 'Teams are moving tests off costly hardware benches into simulation, with no measured data on what the simulation misses.' },
    w3: { name: 'What to re-test after an AI update', who: 'Validation leads shipping driver-assist updates',
      plain: 'When a perception model is retrained, teams either re-test everything or cut tests on gut feel. They need a reasoned way to choose.' },
  };
  window.WEDGES.list.forEach((w) => Object.assign(w, PLAIN[w.id]));
  window.WEDGE_PLAIN = PLAIN;
  const L3 = window.LAYERS.find((l) => l.id === 3);
  if (L3 && L3.critPocket) L3.critPocket.text = 'W1 · ' + PLAIN.w1.name;
  (window.DOSSIERS || []).forEach((d) => {
    if (d.title === 'Safety evidence for ML components') d.title = PLAIN.w1.name;
    if (d.title === 'What can leave the bench') d.title = PLAIN.w2.name;
  });
  (window.EVOLUTION.ends || []).forEach((e) => { if (e.id === 'lead') e.title = PLAIN.w1.name; if (e.id === 'second') e.title = PLAIN.w2.name; });
  window.LAYERS.forEach((l) => { if (l.pocket && l.pocket.text === 'What can leave the bench') l.pocket.text = PLAIN.w2.name; });
})();

// v16:intro start
// Executive summary, contents, scorecard map and the opening notes: short plain lines, no scores
window.EXEC.bottomShort = 'The biggest money sits with well-funded incumbents. Our opening is the verification and validation (V&V) evidence every automaker must finish before launch.';
window.EXEC.statLine = 'growth of integration and V&V services, the fastest-growing segment in McKinsey’s split of auto software';
window.EXEC.risk = 'No one outside the team has confirmed any of the three pains yet. We drop any wedge whose pain Studio 2 interviews do not confirm.';
window.EXEC.howToRead = 'How to read this: public sources only, no automaker data. Our ratings are team judgements until Studio 2 interviews. Personas are fictional archetypes of real jobs.';
window.CHAPTERS.find((c) => c.id === 'fit').q = 'Where could our skills give us an edge, and which ideas survived a real-company check?';
// the scorecard map never points at a retired slide
(function () {
  const RETIRED = { 's-round2': 's-evolve', 's-funnel': 's-evolve', 's-chainx': 's-chain' };
  window.GUIDE.groups.forEach((g) => g.rows.forEach((r) => {
    r.where = r.where.map(([id, x]) => [RETIRED[id] || id, x]).filter(([id], i, a) => a.findIndex(([j]) => j === id) === i);
  }));
  const g = (cat) => window.GUIDE.groups.find((x) => x.cat === cat);
  const vc = g('Desirability') && g('Desirability').rows[1];
  if (vc && vc.where.every(([id]) => id !== 's-chain')) vc.where.splice(1, 0, ['s-chain']);
})();
Object.assign(window.NOTES, {
  's-exec': 'The 60-second version. Bottom line first: the big money sits with incumbents, so our opening is the evidence work before launch. Then the three wedges in plain words; W2 is the weakest, and the card says so. End on the biggest risk: nobody outside the team has confirmed the pains yet. Everything after this slide is the evidence.',
  's-map': 'How the portfolio is organized: five chapters that follow the Studio 1 brief, then an appendix. Each card shows its brief and Check-In code. Click any slide name to jump there. The scorecard map lists every scorecard question with a link to where we answer it.',
  's-why': 'The market is real: $519B by 2035, growing about 4.5 times faster than vehicles. Then the four automaker motives, one per card. The $1.5B recall saving is a 2023 forecast, and we say so.',
});
// ecosystem: three actor subtitles shortened so they fit at the larger type
(function () {
  const sub = { spec: 'OTA, cyber and V&V tools', consumers: 'pay for services after the sale', fleets: 'rental, ride-hail, robotaxi fleets' };
  window.ACTORS.forEach((a) => { if (sub[a.id]) a.sub = sub[a.id]; });
})();
// v16:intro end
// v16:vc start
// Value chain slide: every layer gets a competition rating (V&V had none on the slide), the
// lowest level gets a plain name, and the row lines are cut so they can be set large.
(function () {
  const L = (id) => window.LAYERS.find((l) => l.id === id);
  // 1 = the lowest level. Integration, V&V is fragmented: tool vendors, test services and
  // in-house teams, with no clear leader (the HIL position's competition is rated Low).
  window.COMP_LABEL[1] = 'FRAGMENTED';
  L(8).comp = 1;
  // Cybersecurity stays contested: specialists (Upstream, VicOne, PlaxidityX) and SBOM vendors compete.
  L(7).comp = 2;
  // what each level means, in plain words (shown as an always-visible legend on the slide)
  window.COMP_PLAIN = { 3: 'Many big players already compete', 2: 'A few strong players fight for it', 1: 'No clear leader yet: room to enter' };
  // who plays, for the two layers that wrap around the car
  L(7).callLogos = ['=Upstream', 'plaxidityx', '=VicOne'];
  L(8).callLogos = ['applied', 'dspace', 'vector'];
  // one short line per row: how value is captured
  L(1).callStat = 'A design win locks in the chip supplier';
  L(6).callStat = 'Data revenue now needs driver consent[^ftc]';
  L(7).callStat = 'Required for type approval (UN R155/R156)[^unece]';
  L(8).callStat = 'Tool vendors, test services, in-house teams';
  // the W1 pocket uses the plain wedge name, like every other slide
  if (window.WEDGE_PLAIN) {
    L(3).pocket.text = window.WEDGE_PLAIN.w1.name;
    if (L(8).critPocket) L(8).critPocket.text = 'W2 · ' + window.WEDGE_PLAIN.w2.name;   // the layer deep dive
  }
})();
// v16:vc end
// v16:chain start
// The organizers' value chain as one clean slide: short wording for the two rows on the
// slide (all six rows open in a panel per stage), plain zone labels, and the note.
(function () {
  const SHORT = [
    { hd: 'Compute & sensing', does: 'Sensors, chips, computers', us: 'Not a target' },
    { hd: 'E/E architecture', does: 'Electrical wiring, power, networks', us: 'Zonal migration' },
    { hd: 'OS & middleware', does: 'The car’s operating system', us: 'OTA and SBOM' },
    { hd: 'Control & autonomy stack', does: 'Perceives, plans, drives', us: 'W1 and W3 start here' },
    { hd: 'Data, simulation & validation', does: 'Simulation and test benches', us: 'Evidence for all three' },
    { hd: 'In-cabin AI & HMI', does: 'Makes automation trustworthy', us: 'Not mapped yet' },
    { hd: 'Monetization & lifecycle', does: 'Earns after the sale', us: 'Not taken forward' },
  ];
  window.CHAIN.stages.forEach((st, i) => { st.short = SHORT[i]; });
  // plain English in the full rows (the stage panel and the reading view)
  const PLAINER = [
    [/Every OEM/g, 'Every automaker'], [/OEMs/g, 'automakers'], [/OEM programs/g, 'automaker programs'],
    [/^Large automakers bringing OTA in-house/, 'Large automakers bringing over-the-air (OTA) updates in-house'],
    [/simulation, HIL benches, virtual ECUs/, 'simulation, hardware test (HIL) benches, virtual controllers'],
    [/^HIL benches are scarce, and virtual ECUs/, 'Hardware test (HIL) benches are scarce, and virtual controllers'],
    [/learned \(ML\) components/, 'machine-learning components'], [/testing ML-based features/, 'testing machine-learning features'],
    [/old controller software/, 'old controller (ECU) software'], [/^OTA for commercial/, 'Over-the-air (OTA) updates for commercial'], [/SBOM & cyber lifecycle/, 'SBOM (software bill of materials) & cyber lifecycle'], [/legacy ECUs\./, 'legacy controllers (ECUs).'],
  ];
  window.CHAIN.stages.forEach((st) => ['does', 'handoff', 'challenge', 'stable', 'motion', 'us'].forEach((k) => {
    if (typeof st[k] === 'string') PLAINER.forEach(([re, t]) => { st[k] = st[k].replace(re, t); });
  }));
  window.CHAIN.stages[0].motion = window.CHAIN.stages[0].motion.replace(/^automakers/, 'Automakers');
  window.CHAIN.zones.adjacent = 'Adjacent: work within the automaker’s platform';
  window.CHAIN.zoneShort = { covered: 'Already covered', adjacent: 'Adjacent', discovery: 'EcoCAR discovery zone' };
  window.NOTES['s-chain'] = 'This is the organizers’ seven-stage value chain, filled in with our research. The point to make: all three of our wedges sit inside the organizers’ EcoCAR discovery zone (stages 4 to 6), and the ideas we dropped (zonal migration, OTA, SBOM) sat outside it. Click any stage to open all six of the organizers’ rows for it (does, handoff, example challenge, stable, in motion, where we sit) and which of our eight layers it covers; the arrow keys step through the stages and Escape closes the panel.';
})();
// v16:chain end
// v16:grow start
// Where value grows: one measure (2035 size) on the left; on the right, integration and V&V growth
// against the whole software & electronics market (both McKinsey, the same figures as the Why SDVs slide)
window.GROW_CALLOUT = {
  kicker: 'Fastest-growing segment',
  big: 11.4, unit: 'a year',
  head: 'Integration and V&V services',
  bars: [
    { label: 'Integration & V&V', v: 11.4, hi: true },
    { label: 'Whole software & electronics market', v: 4.5 },
  ],
  punch: 'About 2.5× the market’s pace. All three of our wedges are validation work here.',
  foot: 'Rates a year to 2035. ADAS software alone grows faster, in a crowded layer.',
};
window.GROW_CHART = {
  kicker: 'Market size in 2035, $ billions',
  head: 'McKinsey’s four biggest pools',
  key: '= many big players already compete',
  src: 'Source: McKinsey, 2026',
  hint: 'Click a pool for its deep dive',
};
window.NOTES['s-grow'] = 'The left chart shows one thing: how big each of McKinsey’s four largest pools will be in 2035. ADAS software is the biggest at about $50B. All four sit in layers we rate crowded, meaning many big players already compete there. On the right, integration and V&V services grow 11.4% a year, about 2.5 times the 4.5% of the whole software and electronics market. That is where all three of our wedges sit. Hovering a bar shows where it starts; clicking opens the layer deep dive.';
// v16:grow end
// v16:bmc start
// Business models: two canvases at different stages of the chain (dSPACE, Applied Intuition).
// Mobileye stays in BMCS only so its drafted canvas can be linked as "also drafted".
window.BMC_PICK = ['ds', 'ai'];
window.BMC_V16 = {
  title: 'Two incumbents at different stages, two lessons on where we fit',
  sub: 'Why these two: different stages of the chain, and both are where our wedges would sell or plug in',
  stripLabel: 'Where each one sells on the organizers’ value chain',
  stageShort: { 2: 'Electrical architecture (E/E)' },
  legend: [['now', 'Main income today'], ['grow', 'Newer, growing']],
  asOf: 'Data as of 30 Oct 2026',
  also: { lead: 'We also drafted a Mobileye canvas (chips, a third stage):', label: 'PDF', file: 'docs/bmc/Mobileye_BMC_v2.pdf' },
  // lanes on the strip: [from stage, to stage, label, secondary?]
  lanes: {
    ds: [[5, 5, 'dSPACE · test tools']],
    ai: [[3, 4, 'Applied Intuition · vehicle OS + autonomy'], [5, 5, '+ simulation tools', true]],
  },
  cards: {
    ds: {
      head: 'Sells the test tools',
      stats: [{ to: 460, pre: '>€', suf: 'M', t: 'revenue in 2024, up 14%' }, { to: 2900, pre: '>', suf: '', t: 'employees' }, { to: 1988, pre: '', suf: '', t: 'founded; privately held', still: true }],
      money: [['now', 'Hardware test benches (HIL) and prototyping'], ['now', 'Software licences, services and training'], ['grow', 'Cloud validation (SIMPHERA)']],
      moat: 'Tests built on dSPACE get reused for years, so switching is costly.',
      lesson: 'It owns the test bench, so we should not compete there. As a sponsor, it is our easiest door.',
      caveat: 'Privately held, so revenue and staff figures are company-reported, not audited. One point is only half confirmed: the canvas lists NVIDIA as a partner for AI scene generation; dSPACE confirms the NuRec integration, but no primary source places it in NVIDIA Halos.',
    },
    ai: {
      head: 'Sells vehicle OS and autonomy',
      stats: [{ to: 15, pre: '$', suf: 'B', t: 'valuation, June 2025' }, { to: 400, pre: '~$', suf: 'M', t: 'recurring revenue, end-2024 (press)' }, { to: 18, pre: '', suf: ' of 20', t: 'top non-Chinese carmakers' }],
      money: [['now', 'Software licences by seat, workload and module'], ['now', 'Integration and customization services'], ['grow', 'Vehicle OS and autonomy licensing']],
      moat: 'It lands with one tool, then expands, with engineers inside customer teams.',
      lesson: 'Not a sponsor, and no warm way in yet: it tests whether we can reach a company alone.',
      caveat: 'Recurring revenue is press-reported, not company-disclosed, and the valuation is from the June 2025 funding round.',
    },
  },
};
// Each canvas's source list, as printed on page 2 of its PDF: [publisher, title, date, url]
window.BMC_SOURCES = {
  ds: [
    ["dSPACE", "Cooperating partner AWS", "retrieved 2026-10-25", "https://dspace.com/en/pub/home/company/cooperations/cooperating_partners/aws.cfm"],
    ["OEM Off-Highway", "dSPACE Offering Development Tools on Microsoft Cloud Computing Platform Azure", "2020-12-16", "https://www.oemoffhighway.com/engineering-manufacturing/software/press-release/21206956/dspace-dspace-offering-development-tools-on-microsoft-cloud-computing-platform-azure"],
    ["Temcom", "Dspace Integrates Nvidia Halos Safe and Omniverse NuRec into Its Automotive Simulation Tools", "2026-10-23", "https://www.temcom.com/dspace-integrates-nvidia-halos-safe-and-omniverse-nurec-into-its-automotive-simulation-tools/"],
    ["eeNews Europe", "dSPACE and NXP intensify radar sensor partnership", "2022-09-27", "https://www.eenewseurope.com/en/dspace-and-nxp-intensify-radar-sensor-partnership/"],
    ["Automotive World", "dSPACE integrates Hesai lidar models into AURELION", "2024-03-21", "https://www.automotiveworld.com/news/dspace-integrates-hesai-lidar-models-into-the-aurelion-sensor-simulation-solution-accelerating-the-development-of-autonomous-driving-applications/"],
    ["dSPACE press release", "Accelerating the Development of AD Applications (OMNIVISION)", "2025-11-11", "https://dspace.com/en/pub/home/news/dspace_pressroom/press/dspace-omnivision-2025.cfm"],
    ["Business Wire", "FEV and dSPACE cooperate in worldwide integration of power HIL test benches", "2023-09-12", "https://www.businesswire.com/news/home/20230912906294/en"],
    ["dSPACE", "Cooperating partner Elektrobit Automotive GmbH", "retrieved 2026-10-25", "https://www.dspace.com/en/ltd/home/company/cooperations/cooperating_partners/elektrobit_automotive-.cfm"],
    ["ASAM", "Members Profile: dSPACE", "retrieved 2026-10-25", "https://www.asam.net/members/detail/dspace/"],
    ["Business Wire", "dSPACE at CES 2025 / Indy Autonomous Challenge", "2024-12-16", "https://www.businesswire.com/news/home/20241216181016/en"],
    ["Business Wire", "dSPACE Introduces New Radar Solution for End of Line and PTI Tests", "2025-11-18", "https://www.businesswire.com/news/home/20251118919192/en"],
    ["Business Wire", "CES 2026: dSPACE (SDV test and AI solutions) [Spanish version]", "2025-12-16", "https://www.businesswire.com/news/home/20251216186377/es"],
    ["dSPACE press release", "dSPACE Grows and Plans Expansion of Production in the Almepark", "2024-02-26", "https://dspace.com/en/ltd/home/news/dspace_pressroom/press/expansion-of-production-in-the.cfm"],
    ["dSPACE", "Engineering Services", "retrieved 2026-10-25", "https://www.dspace.com/en/ltd/home/products/engserv.cfm"],
    ["PwC", "Deal Announcement 11/25: Service Industries (dSPACE/dissecto)", "2025-11-30", "https://www.pwc.de/en/branchen-und-markte/tombstones/deal-announcement-11-25-service-industries.html"],
    ["Wikipedia", "dSPACE GmbH", "retrieved 2026-10-25", "https://en.wikipedia.org/wiki/DSPACE_GmbH"],
    ["dSPACE press release", "dSPACE Strengthens AI Expertise by Acquiring understand.ai", "2019-07-16", "https://dspace.com/en/inc/home/news/dspace_pressroom/press/201907003.cfm"],
    ["eeNews Europe", "dSPACE strengthens data-driven development through Intempora acquisition", "2020-07-10", "https://cdn.eenewseurope.com/en/dspace-strengthens-data-driven-development-through-intempora-acquisition/"],
    ["Radio Hochstift", "Spatenstich für dSPACE-Neubau an der Paderborner Ahornallee", "2025-12-13", "https://www.radiohochstift.de/nachrichten/paderborn-hoexter/spatenstich-fuer-dspace-neubau-an-der-paderborner-ahornallee.html"],
    ["dSPACE press release", "BMW Group's Upcoming Vehicle Generation Exclusively Validated by dSPACE Simulators", "2021-09-21", "https://dspace.com/en/pub/home/news/dspace_pressroom/press/bmw_relies_on_dspace.cfm"],
    ["OEM Off-Highway", "dSPACE SIMPHERA Simulation and Validation for Autonomous Vehicles", "2021-10-05, mod. 2024-08-02", "https://www.oemoffhighway.com/engineering-manufacturing/software/product/21759316/dspace-dspace-simphera-simulation-and-validation-for-autonomous-vehicles"],
    ["dSPACE", "Using TargetLink 5.0 to Develop Safety-Relevant Systems According to ISO 26262:2018", "undated (retrieved 2026-10-25)", "https://dspace.com/en/ltd/home/news/targetlink-50-iso-26262201.cfm"],
    ["Electronics Industry Monthly", "dSPACE Brings AI Agents Into Automotive Validation", "2026-08-05", "https://www.electronicsindustrymonthly.com/dspace-brings-ai-agents-into-automotive-validation/"],
    ["Stellantis press release", "Stellantis Partners with dSPACE to Accelerate Cloud-based Development of Vehicles", "2025-01-07", "https://www.stellantis.com/en/news/press-releases/2025/january/stellantis-partners-with-dspace-to-accelerate-cloud-based-development-of-vehicles"],
    ["dSPACE", "dSPACE User Conference USA 2026 (Novi, MI)", "retrieved 2026-10-25", "https://www.dspace.com/en/pub/home/company/events/dspace_events/duc-usa-2026.cfm"],
    ["dSPACE", "MicroLabBox II: Exclusive Package for Universities & Research Labs", "retrieved 2026-10-25", "https://www.dspace.com/en/ltd/home/learning-center/recordings/dbrief/video_db_mlbx2-academia.cfm"],
    ["Temcom", "Dspace Opens a Subsidiary in Turin", "2026-10-01", "https://www.temcom.com/dspace-opens-a-subsidiary-in-turin/"],
    ["Auto Connected Car News", "Connected Car News: dSPACE, SDVerse…", "2026-03-01", "https://www.autoconnectedcar.com/2026/03/connected-car-news-dspace-sdverse-renesas-toyota-denso-uber-spothero-idemia-hyundai-microsoft-honda-panasonic-nissan-qualcomm/"],
    ["dSPACE", "Agriculture", "retrieved 2026-10-25", "https://www.dspace.com/en/ltd/home/applicationfields/ind-appl/agriculture.cfm"],
    ["dSPACE", "Hyundai MOBIS: All You Can Test", "dSPACE Magazine 1/2016", "https://www.dspace.com/en/inc/home/applicationfields/stories/all-you-can-test.cfm"],
    ["dSPACE", "Why Choose dSPACE for Developing Aerospace Applications?", "retrieved 2026-10-25", "https://dspace.com/en/ltd/home/applicationfields/aerospace.cfm"],
    ["dSPACE press release", "dSPACE Paves the Way for the Future (generation change)", "2025-04-29", "https://dspace.com/en/inc/home/news/dspace_pressroom/press/dspace-generation-change.cfm"],
    ["Westfalen-Blatt", "Paderborner Autozulieferer dSpace meldet Kurzarbeit an", "2026-04-01", "https://www.westfalen-blatt.de/owl/kreis-paderborn/paderborn/autozulieferer-dspace-kurzarbeit-autokrise-3524795"],
  ],
  ai: [
    ["Kyodo News PR Wire / PR Newswire", "Advancing Autonomy: Applied Intuition Collaborates with NVIDIA…", "2026-03-17", "https://kyodonewsprwire.jp/index.php/release/202603185828"],
    ["Applied Intuition", "Applied Intuition and Porsche partnership on automotive software", "2024-03-27", "https://www.appliedintuition.com/press-releases/porsche"],
    ["Applied Intuition", "Honda and Applied Intuition partner on SDV platform", "2026-10-06", "https://www.appliedintuition.com/press-releases/applied-intuition-honda-sdv-partnership"],
    ["Unite.AI", "Applied Intuition Deploys Vehicle OS for Nissan's AI-Defined Vehicles", "2026-10 (deal announced 2026-10-05)", "https://www.unite.ai/applied-intuition-deploys-vehicle-os-for-nissans-ai-defined-vehicles/"],
    ["TRATON", "The TRATON GROUP and Applied Intuition announce Strategic Partnership on Vehicle Software", "2025-03-17", "https://traton.com/en/newsroom/press-releases/the-traton-group-and-applied-intuition-announce-strategic-partnership-on-vehicle-software.html"],
    ["Ocean News & Technology", "HII and Applied Intuition to Advance AI-Defined Warship Capabilities", "2026-04-22", "https://oceannews.com/news/defense/hii-and-applied-intuition-to-advance-ai-defined-warship-capabilities/"],
    ["DefenseScoop", "AV and Applied Intuition team up to bring collaborative autonomy to new Mayhem 10 drone", "2026-07-29", "https://defensescoop.com/2026/07/29/av-applied-intuition-collaborative-autonomy-mayhem-10-drone/"],
    ["Kyodo News PR Wire / PR Newswire", "LG Innotek Accelerates Physical AI Market Entry Through Partnership with Applied Intuition", "2026-03-29", "https://kyodonewsprwire.jp/release/202603306541"],
    ["S&P Global AutoTechInsight", "OpenAI and Applied Intuition team up to advance intelligent vehicles", "2025-06-11", "https://autotechinsight.spglobal.com/news/5282361/openai-and-applied-intuition-team-up-to-advance-intelligent-vehicles"],
    ["Applied Intuition blog", "Building Physical AI at National Scale in Saudi Arabia (HUMAIN)", "2026-08-31", "https://www.appliedintuition.com/blog/applied-intuition-humain-autonomous-trucking-saudi-arabia"],
    ["Latent Space podcast, \"Physical AI that Moves the World", "Qasar Younis & Peter Ludwig\"", "2026-04-27 (year inferred from content)", "https://www.latent.space/p/appliedintuition"],
    ["Applied Intuition blog", "2025 in review: Autonomy at scale", "2025-12-19", "https://www.appliedintuition.com/blog/2025-year-in-review"],
    ["Applied Intuition blog", "Isuzu and Applied Intuition Deploy Second-Generation Autonomous Trucks on a Commercial Logistics Route in Japan", "2026-03-31", "https://www.appliedintuition.com/blog/isuzu-applied-intuition-autonomous-trucks-commercial-logistics-japan"],
    ["Applied Intuition", "Applied Intuition Acquires CarSim… (Mechanical Simulation)", "2022-03-14", "https://www.appliedintuition.com/news/mechanical-simulation-corporation"],
    ["Robotics 24/7", "Applied Intuition to Acquire Embark Technology…", "2023-05-30", "https://www.robotics247.com/article/applied_intuition_acquires_embark_technology_enhancing_autonomous_vehicle_portfolio"],
    ["Defense News", "Applied Intuition acquires AI software firm EpiSci", "2025-02-06", "https://www.defensenews.com/air/2025/02/06/applied-intuition-acquires-ai-software-firm-episci/"],
    ["Applied Intuition homepage", "", "accessed 2026-10-25", "https://www.appliedintuition.com/"],
    ["Applied Intuition", "Applied Intuition Closes Series F at $15 Billion Valuation…", "2025-06-17", "https://appliedintuition.com/news/series-f"],
    ["PR Newswire", "Department of War Selects Applied Intuition to Build Enterprise Autonomy Pipeline", "2026-05-14", "https://www.prnewswire.com/news-releases/department-of-war-selects-applied-intuition-to-build-enterprise-autonomy-pipeline-302771548.html"],
    ["Applied Intuition", "Applied Intuition launches Dana, physical AI platform", "2026-07-21", "https://www.appliedintuition.com/press-releases/applied-intuition-launches-dana"],
    ["Applied Intuition", "Series D announcement", "2021-11-11", "https://appliedintuition.com/news/series-d"],
    ["Just Auto", "Applied Intuition to power next-gen vehicle platforms for Honda and Nissan", "2026-10-07", "https://www.just-auto.com/news/applied-intuition-vehicle-platforms-honda-nissan/"],
    ["Kyodo News PR Wire / PR Newswire", "Applied Intuition and Komatsu Strike Deal to Transform Mining Industry…", "2025-09-09", "https://kyodonewsprwire.jp/release/202509094897"],
    ["Kyodo News PR Wire / PR Newswire", "Applied Intuition Launches Axion and Acuity to Deliver All-Domain Autonomy to the Warfighter", "2025-05-20", "https://kyodonewsprwire.jp/release/202505209193"],
    ["Applied Intuition", "Applied Intuition and Audi partnership on AD validation", "2024-04-23", "https://www.appliedintuition.com/news/audi"],
    ["Applied Intuition", "Applied Intuition Defense Selected To Support CDAO's Autonomy Enterprise Platform", "2025-01-14", "https://www.appliedintuition.com/press-releases/applied-intuition-defense-selected-to-support-cdaos-autonomy-enterprise-platform"],
    ["Applied Intuition", "Applied Intuition Wins U.S. Navy AI Fleet Contract", "2026-10-22", "https://www.appliedintuition.com/press-releases/navy-selects-applied-intuition-field-ai-perception"],
    ["Contrary Research", "Applied Intuition Business Breakdown & Founding Story", "updated 2025-11-20", "https://research.contrary.com/company/applied-intuition"],
    ["Sacra", "Applied Intuition revenue, valuation & funding", "accessed 2026-10-25", "https://sacra.com/c/applied-intuition/"],
    ["The Robot Report", "Applied Intuition lands robotics development contract with Army", "2022 (undated on page)", "https://www.therobotreport.com/applied-intuition-lands-an-up-to-49m-army-contract/"],
    ["Kyodo News PR Wire / PR Newswire", "Applied Intuition and Stellantis Partner to Redefine Intelligent In-Vehicle Infotainment", "2025-10-21", "https://kyodonewsprwire.jp/release/202510217504"],
    ["Applied Intuition", "Using simulation to drive Toyota's automated driving system development process", "undated", "https://appliedintuition.com/case-studies/toyota"],
    ["Breaking Defense", "Navy awards Applied Intuition $25M to deploy AI sensor fusion at sea", "2026-10-22", "https://breakingdefense.com/2026/10/navy-awards-applied-intuition-25m-to-deploy-ai-sensor-fusion-at-sea/"],
    ["TechStartups", "Applied Intuition receives investment offers at $30 billion valuation… (citing The Information)", "2026-10-13", "https://techstartups.com/2026/10/13/applied-intuition-receives-investment-offers-at-30-billion-valuation-doubling-its-15-billion-valuation/"],
    ["Sacra", "Applied Intuition at $830M/year up 2x YoY", "2026-05-04", "https://sacra.com/research/applied-intuition-at-830m-year/"],
  ],
};
// v16:bmc end
// v16:narrow start
// "How we narrowed" and the Round 1 map, in words: no dates, no scores, no ranks. Each idea from the
// value chain map gets one plain reason for its fate (facts from EVOLUTION.stories, ROUND2 and the
// dossiers). Rows are listed survivors first so the trace reads top to bottom without crossings.
window.NARROW = {
  check: [
    { k: 'Team fit', t: 'What we are good at', items: ['HIL test benches · CAV perception work', 'Verification research via our faculty advisor'], lines: true },
    { k: 'Real-company check', t: 'dSPACE · Applied Intuition · Mobileye', items: ['Already doing it?', 'Could we reach them?', 'Would they pull our work?'] },
  ],
  rows: [
    { id: 'adas', name: 'Validation evidence for mid-size automakers', colour: 'Lthree', to: 'w1', fate: 'Reshaped → W1',
      why: 'No demand from mid-size automakers, but the gap is real at large players',
      thought: 'Critical work, but in the crowded driver-assist (ADAS) layer, and only a middling fit for our team.',
      learned: 'All three companies publicly rely on simulation, scenarios and statistics to check AI parts. We found no stated demand from mid-size automakers, so that segment did not hold; the specific gap sits at large players.',
      now: 'Reshaped into W1, our first wedge to test, drawing on verification research we reach through our faculty advisor.',
      more: 'We redefined this idea during the check, so W1 is not the idea we started with.' },
    { id: 'edgeds', name: 'Edge-side data selection', colour: 'Lsix', to: 'w1', soft: true, fate: 'Inside W1',
      why: 'Not a business on its own; we test it inside W1',
      thought: 'It cuts data cost, but no launch or approval depends on it, and the market is unproven.',
      learned: 'Applied Intuition and dSPACE both describe searching for rare driving data as a pain. It could connect to our W1 work (our inference).',
      now: 'Not an idea of its own. We test it inside the W1 interviews.',
      more: 'It stands or falls with W1.' },
    { id: 'hil', name: 'HIL & virtual-ECU validation', colour: 'Lvv', to: 'w2', fate: 'Narrowed → W2',
      why: 'dSPACE already owns HIL tools, so we kept one open question',
      thought: 'Our strongest idea at first: hardware test-bench (HIL) time is scarce, virtual ECUs are not yet trusted, and we run benches ourselves.',
      learned: 'dSPACE already owns HIL and virtual-ECU tools, and Applied Intuition’s HIL tool runs on benches customers already own. Being good at HIL helps us understand the users; it is not an advantage. Our one distinct asset is independent real-vehicle data.',
      now: 'Narrowed to one question, what can leave the test bench: W2. It starts only once licence and bench access are confirmed.',
      more: 'W2 is our weakest wedge as a business.' },
    { id: 'zonal', name: 'Zonal migration of legacy ECUs', colour: 'Lone', fate: 'Dropped',
      why: 'Lives inside automakers’ own programs; needs AUTOSAR skills we lack',
      thought: 'A close second at first: McKinsey expects most vehicle architectures to be zonal or central by 2035, and we could migrate a real function on our test vehicle.',
      learned: 'Migration lives inside automakers’ own multi-year programs and needs AUTOSAR and functional-safety (ISO 26262) skills we lack. dSPACE already tests zonal ECUs, and Mobileye does not work on zonal at all.',
      now: 'Dropped. The market view stands; we are not the team to reach it.',
      more: 'Reopens with AUTOSAR and ISO 26262 training plus a Tier 1 supplier sponsor.' },
    { id: 'ota', name: 'OTA for commercial & off-highway', colour: 'Lfour', fate: 'Dropped',
      why: 'Big automakers build it in-house; Applied Intuition already bundles it',
      thought: 'Rules on software updates pull hard, but vendors already exist and our assets were weakest here, so confidence was low from the start.',
      learned: 'Big automakers build over-the-air (OTA) updates in-house, Applied Intuition sells them inside its vehicle-OS deals, and open-source updaters exist. We lack secure-update and certification experience.',
      now: 'Dropped. Our early low confidence proved right.',
      more: 'Reopens with a specialty-automaker design partner and a certified update partner, or folded into the HIL work as update testing.' },
    { id: 'sbom', name: 'SBOM & cyber lifecycle evidence', colour: 'Lcyber', fate: 'Dropped',
      why: 'Buyers need audit credibility we lack; no company would pull our work',
      thought: 'A real need, since cybersecurity rules gate type approval, but a weak fit for our team, so it was cut in Round 1.',
      learned: 'The company check agreed. None of the three companies sells SBOM tooling, so none would pull our work, and audit-grade evidence needs credibility a student team lacks. Specialists already compete.',
      now: 'Still out: two different checks gave the same answer. Cybersecurity stays a requirement of whatever we build.',
      more: 'Reopens only with a cybersecurity faculty partner and a supplier design partner.' },
    { id: 'fleet', name: 'Mixed-make fleet data', colour: 'Lfive', fate: 'Dropped',
      why: 'Crowded by telematics firms; no link to any of the three companies',
      thought: 'Fleets need it, but no launch or approval depends on it, and telematics firms such as Samsara, Motive and Geotab crowd the space.',
      learned: 'Our company research found no link at any of the three companies, and our research edge does not apply.',
      now: 'Not taken forward.',
      more: 'CAN and J1939 skills alone would not stand out in a crowded telematics market (team hypothesis).' },
  ],
  wedges: [
    { id: 'w1', k: 'W1 · first to test', edge: 'Our edge: verification research through our faculty advisor' },
    { id: 'w2', k: 'W2 · narrowed from HIL', edge: 'Our edge: independent real-vehicle data' },
    { id: 'w3', k: 'W3 · added after', edge: 'Same focus area; not yet checked against companies' },
  ],
  // the tighter "why the answer changed" (reading view; on the slide it is the check band)
  why: [
    ['We asked a sharper question', 'Not just “does it suit us?”, but “which real company could we reach, and what could we add that it lacks?”'],
    ['Incumbents already hold most of the work', 'dSPACE, Applied Intuition and big automakers already cover most of the HIL, zonal and OTA work.'],
    ['We counted an asset we had missed', 'Verification research we reach through our faculty advisor became central to W1.'],
  ],
  steps: [
    'Step 1 of 5 · Seven open pockets from our value chain map',
    'Step 2 of 5 · Each one screened for team fit, then checked against three real companies',
    'Step 3 of 5 · Four dropped: someone already owns the work, or no company would pull ours',
    'Step 4 of 5 · Two survived, reshaped: W1 and W2 (edge-side data rides inside W1)',
    'Step 5 of 5 · W3 was added afterwards, in the same focus area',
  ],
};
// one plain reason per Round 1 pick (same facts as the rows above), without scores or dates
window.CAND_FATE = {
  hil: { k: 'narrowed', tag: 'Narrowed → W2', why: 'dSPACE already owns HIL tools, so we kept one open question: what can leave the test bench.' },
  zonal: { k: 'dropped', tag: 'Dropped', why: 'The work lives inside automakers’ own programs and needs AUTOSAR and safety-standard skills we lack.' },
  ota: { k: 'dropped', tag: 'Dropped', why: 'Big automakers build it in-house, Applied Intuition already bundles it, and open-source tools exist.' },
  sbom: { k: 'dropped', tag: 'Dropped twice', why: 'Buyers need audit credibility a student team lacks, and none of the three companies would pull our work.' },
};
window.CANDIDATES.forEach((c) => { const f = window.CAND_FATE[c.id]; if (f) c.now = `${f.tag}: ${f.why}`; });
window.SBOM_WHY.steps = [
  ['Round 1', 'Team fit too low', 'Buyers need audit credibility we lack, and specialists such as Upstream, VicOne and PlaxidityX already compete.'],
  ['Company check', 'No company pull', 'None of dSPACE, Applied Intuition or Mobileye sells SBOM tooling, so none would pull our work.'],
];
window.EVOLUTION.caution = 'Both checks are team judgements from public evidence, not yet tested in interviews.';
Object.assign(window.NOTES, {
  's-evolve': 'This slide answers B-1.3.3: where our team can add value. Seven open pockets from the value chain map run down the left. Each was screened for team fit (HIL benches, CAV perception, verification research through our faculty advisor), then checked against dSPACE, Applied Intuition and Mobileye: does one already do it, could we reach them, would they pull our work? Four dropped, each with its reason on the row. Two survived, reshaped: W1 and W2. W3 was added afterwards in the same focus area. Click a row for what we thought, what we learned and what we do now. Press Play the story for a step-by-step version.',
  's-ws': 'Appendix. Round 1 kept on the record: eleven areas placed by criticality and competition, four picks in the critical, fragmented corner. HIL narrowed into W2; zonal, OTA and SBOM dropped, each with one reason. W1 and W3 grew later from a narrow evidence niche in the crowded ADAS layer. Hover a card to find it on the map.',
});
// v16:narrow end
// v16:wedges start
// The wedge slide in plain English: one short line each for what we would offer,
// how we test it and when we drop it; the market as rough top-down sizes; and the
// desk scores shown as three plain questions with a Strong / Medium / Weak level.
(function () {
  const W = Object.fromEntries(window.WEDGES.list.map((w) => [w.id, w]));
  const S = {
    w1: {
      offer: 'Extra safety evidence that fits the tools they already use',
      test: '6 interviews with safety engineers',
      drop: 'fewer than 3 of 6 recall a real challenge to their evidence',
      today: 'Scenario tests and statistics, which only cover the cases someone tried',
      bet: 'Useful evidence can be made for a realistic AI part, fast enough to run on every software build',
      market: {
        year: '2025',
        rows: [
          { k: 'Whole market', v: 'about $9B', n: 9000, t: 'All driver-assist and self-driving software[^mck]' },
          { k: 'Part we could serve', v: '$45M–$180M', n: 112, t: 'Share spent on safety evidence for AI parts' },
        ],
        how: 'Top-down: the whole market × 5–10% spent on validation × 10–20% for AI parts. The percentages are our guesses, and no named buyer turned up yet.',
      },
      tests: {
        D: ['Ask 6 safety engineers when their evidence for an AI part was last challenged', 'Fewer than 3 of 6 describe a real, recent case'],
        F: ['Build a prototype on one small AI part and time each run', 'It is not working early in prototyping, or takes over an hour per build'],
        V: ['Show a short demo to a tool company’s product team, then ask who would pay', 'No second meeting, and nobody names a budget or a next step'],
      },
    },
    w2: {
      offer: 'Measured gaps between simulation and the real test bench',
      test: '4 interviews with test-bench leads',
      drop: 'fewer than 2 of 4 recently moved a test without data',
      today: 'Keep tests on the bench by judgment, or buy simulation services from tool vendors',
      bet: 'Simulation, bench and car differ enough, and repeatably enough, to change where a test runs',
      market: {
        year: '2025',
        rows: [
          { k: 'Whole market', v: 'about $2.05B', n: 2050, t: 'Test benches plus simulated controllers (may overlap)[^w-mm][^w-mq]' },
          { k: 'Part we could serve', v: 'about $398M', n: 398, t: 'Simulated controllers that closely match the real one[^w-mq]' },
          { k: 'Our first slice', v: '$8M–$20M', n: 14, t: 'If 2–5% of that buys an independent check' },
        ],
        how: 'The 2–5% is our guess. It could be zero if tool vendors include this for free.',
      },
      tests: {
        D: ['Ask 4 test-bench leads about the last test they moved into simulation', 'Fewer than 2 of 4 made that call without data'],
        F: ['Ask our sponsor for software licences and bench time', 'Not confirmed before Studio 2 begins'],
        V: ['Ask who paid for the last study like this, then ask for a next step', 'Nobody names a budget or a next step'],
      },
    },
    w3: {
      offer: 'A short, reasoned list of what to re-test',
      test: '6 interviews with validation leads',
      drop: 'fewer than 3 of 6 had a costly re-test call this year',
      today: 'Re-run everything, or choose the tests by judgment',
      bet: 'Looking at what changed in a retrained model beats simple choices like re-running everything or picking at random',
      market: {
        year: '2025',
        rows: [
          { k: 'Whole market', v: 'about $9B', n: 9000, t: 'All driver-assist and self-driving software, shared with W1[^mck]' },
          { k: 'Part we could serve', v: '$90M–$360M', n: 225, t: 'Share spent re-testing after software changes' },
        ],
        how: 'Top-down: the whole market × 5–10% on validation × 20–40% on re-testing (our guesses). Counting programs bottom-up gives only $3M–$18M a year.',
      },
      tests: {
        D: ['Ask 6 validation leads how they chose what to re-test after their last update', 'Fewer than 3 of 6 had a costly or disputed case this year'],
        F: ['Test it in simulation on planted faults, against re-running everything and random picks', 'It cannot catch 90% of the faults with half the tests'],
        V: ['Ask who pays for re-testing today, then ask for a next step', 'Nobody names a budget or a next step'],
      },
    },
  };
  window.WEDGES.list.forEach((w) => { w.slide = S[w.id]; });
  // desk-score levels: share of the top possible weighted score in each group
  window.WEDGES.levels = { strong: 65, medium: 50 };
  window.WEDGES.qs = [['D', 'Do engineers want it?'], ['F', 'Can we build it?'], ['V', 'Would someone pay?']];
  window.WEDGES.weakPlain = 'Why W2: dSPACE already sells most of the tools, and nobody has been shown paying for this kind of study.';
  window.WEDGES.howPlain = [
    'We rated each wedge from 1 to 5 on the fall workshop’s 14 criteria, using desk research only[^w-dfv].',
    'The criteria fall under three questions. Each question’s share of the top possible score sets its level: 65% or more is strong, 50–64% medium, under 50% weak.',
    'No interview has tested any of this yet, so all three wedges are still low confidence.',
  ];
  // test plans name the phase, not a calendar date
  const undate = (s) => typeof s !== 'string' ? s : s
    .replace(/^Not done by end of Feb 2027/, 'Not working early in prototyping')
    .replace(/By end of Feb 2027, /, 'Early in prototyping, ')
    .replace(/by end of Feb 2027/g, 'early in prototyping')
    .replace(/by the end of February 2027/g, 'early in prototyping')
    .replace(/Promise to test by Feb 2027/g, 'Promise to test early in prototyping')
    .replace(/by 15 Dec 2026/g, 'before Studio 2 begins');
  window.WEDGES.list.forEach((w) => {
    (w.plan || []).forEach((p) => p.forEach((x, i) => { p[i] = undate(x); }));
    w.weakTech = undate(w.weakTech);
    if (w.promise) w.promise = undate(w.promise);
  });
  Object.values(window.WEDGE_CV).forEach((c) => ['D', 'F', 'V'].forEach((k) => { c[k] = c[k].map(undate); }));
  // the scorecard map points at this slide's new tab names
  const TAB = {
    'Problem on each wedge': '“All three” view', 'Overview tab': '“All three” view',
    'Personas tab': 'a wedge tab, “Full detail”', '“Who has it” tab': 'a wedge tab, “Full detail”',
    'Market & assumptions tab': 'a wedge tab: Market and the biggest technical bet',
    'DFV scoring': '“How we scored them” tab',
    'Studio 2 test tab': 'a wedge tab: How we test it in Studio 2', '“Full test plan” tab': 'a wedge tab: How we test it in Studio 2',
  };
  (window.GUIDE && window.GUIDE.groups || []).forEach((g) => g.rows.forEach((r) => {
    r.where = r.where.map(([id, x]) => [id, id === 's-wedges' && TAB[x] ? TAB[x] : x]);
  }));
  window.NOTES['s-wedges'] = 'Rev 5 asks us to name the weakest wedge: W2, because dSPACE already sells most of the tools and nobody has been shown paying. Each column says who has the problem, what we would offer, and the result that would make us drop it. The dots are desk scores, not interview results. Click a wedge for its market size and Studio 2 test plan; “How we scored them” explains the dots.';
})();
// v16:wedges end
// v16:people start
// Who we will interview: each card names the job (not a person), one route and one
// next step, with no calendar dates. Persona names stay inside the persona documents.
(function () {
  const C = {
    'dS-2': { role: 'HIL test-bench engineer', at: 'at dSPACE', route: 'EcoCAR contact', step: 'Send our first request' },
    'dS-1': { role: 'Product manager', at: 'for AI code generation at dSPACE', route: 'intro from card 1', step: 'Ask for an introduction' },
    'dS-3': { role: 'Virtual-testing lead', at: 'at an automaker that uses dSPACE', route: 'Stellantis, WMU alumni', step: 'Reach out to the alumni' },
    'AI-1': { role: 'System safety engineer', at: 'at Applied Intuition', route: 'LinkedIn, alumni', step: 'Send a LinkedIn message' },
    'AI-2': { role: 'Validation lead, self-driving', at: 'at Applied Intuition', route: 'alumni, LinkedIn', step: 'Find a named person to contact' },
    New: { role: 'Perception validation lead', at: 'at an automaker or supplier that retrains models', route: 'alumni, LinkedIn, events', step: 'Write this persona, then search' },
    'ME-1': { role: 'Safety assurance expert', at: 'at Mobileye', route: 'warm introduction only', step: 'Wait for a warm introduction' },
  };
  window.PIPELINE.rows.forEach((r) => { const c = C[r.p]; if (c) { Object.assign(r, c); r.next = c.step; } });
  window.PIPELINE.channels = ['WMU alumni', 'LinkedIn', 'SAE and IEEE events', 'Sponsor intros'];
  window.PIPELINE.aim = 'About 10 people, covering 6 W1, 4 W2 and 6 W3 conversations (many speak to two wedges), with licence and data access confirmed before the interviews begin.';
  window.PIPELINE.aimShort = 'people to interview. Many speak to two wedges, giving about 6 W1, 4 W2 and 6 W3 conversations.';
  // reading mode: no retired scores in the persona list, no re-scoring step after interviews
  const me = window.PERSONAS.find((p) => p.code === 'ME-1');
  if (me) me.role = 'Hard to reach without a warm introduction, so on hold until one opens.';
  window.PLAN.after = 'After each interview: update the persona card and mark each assumption supported, refuted or unclear in the Hypothesis & Assumptions Registry. What survives updates the B-2.3.4 wedge hypotheses.';
  window.NOTES['s-pipeline'] = 'Seven personas in the order we will contact them: each card is a fictional archetype of a real job, not a person. Real people already match four of the six written personas (7 people, names kept private); no one has been contacted yet. Four of the seven can be reached without a sponsor. Click a card for the full persona.';
})();
// v16:people end
// v16:next start
// Innovation in society, risks and questions: one risk line and one guardrail per
// area, risks without calendar dates, and sharper questions for the Check-In session.
(function () {
  const SO = {
    Safety: { line: 'Our evidence gets read as proof that an AI part is safe', act: 'Every result states what it does not cover', stress: true },
    Security: { line: 'A new tool could leak customer models or open a way in', act: 'Year 1 uses only public or simulation models' },
    Privacy: { line: 'Driving data can identify people', act: 'Simulation data only; no driver data' },
    Fairness: { line: 'Perception can fail more for children, at night or in rain', act: 'Report results by condition, not just the average', stress: true },
    Environment: { line: 'Simulation and re-tests burn computing energy', act: 'Cut needless re-runs; log compute per run' },
  };
  window.SOCIETY.cards.forEach((c) => Object.assign(c, SO[c.k] || {}));
  window.SOCIETY.foot = { all: 'public sources only, no automaker data.', open: 'how safety assessors want limits stated. We ask in our first interviews.' };

  // risks: a short headline instead of a date; `by` is a phase, not a calendar date
  window.RISKS = [
    { k: 'Demand', icon: 'people', n: '0 of 3 pains confirmed', t: 'A pain nobody outside the team confirms ends its wedge', act: 'First interviews before Studio 1 ends', by: 'before Studio 1 ends' },
    { k: 'Fit with our vehicle', icon: 'car', n: 'Does W1 count as vehicle work?', t: 'Only if our car’s perception stack has a learned part', act: 'Our CAV lead confirms; we ask you too (question 2)', by: 'our Check-In session' },
    { k: 'Access', icon: 'key', n: 'Tools and contacts', t: 'No dSPACE licence or Applied Intuition contact stalls W2 and one W1 test', act: '7 people found for 4 of our 6 personas; still searching', by: 'before Studio 2' },
    { k: 'Build', icon: 'tools', n: 'Prototype must work', t: 'If W1 or W3 fails on a realistic part in simulation, we drop it', act: 'Build both early, on public simulation parts', by: 'early in prototyping' },
  ];
  window.GAPS = [
    ['Personas', 'No persona yet for W3’s likely user, a perception-model release lead', 'Draft one from public job postings, like the other six', 'Studio 1', 'A persona for W3’s user'],
    ['Evidence', 'Some W1 evidence cites a team report we keep private', 'Cite the public job postings and company pages directly', 'Studio 1', 'Public sources for all W1 evidence'],
    ['Market', 'W1 and W2 have only top-down proxies, and W3’s two estimates disagree', 'Build bottom-up counts of programs and prices; ask about price in interviews', 'Studio 2', 'Bottom-up market counts'],
    ['Process', 'No Hypothesis & Assumptions Registry yet', 'Move each wedge’s assumptions and tests into the registry template', 'Studio 1', 'An assumptions registry per wedge'],
  ];

  // questions for the Check-In session: each with why we ask and the slide behind it
  window.ASKS = [
    'Which wedge would you cut first, and why?',
    'Does W1 count as “closely related to vehicle development” if it covers one learned perception part?',
    'Who among EcoCAR sponsors, mentors, past teams or faculty signs off AI safety, or moves bench tests to simulation? Could you introduce us?',
    'Before Studio 2, what would convince you a pain is real: how many interviews, with which roles?',
    'Is a top-down market estimate enough for now, or do you expect bottom-up counts?',
  ];
  window.ASK_WHY = [
    'We think W2: dSPACE already sells most of it. Your pick steers our interviews.',
    'If not, we re-scope W1 before Studio 2.',
    'No pain is confirmed yet. Warm introductions get us real interviews.',
    'That becomes our interview target and drop rule for Studio 2.',
    'If bottom-up, we add price questions to every interview now.',
  ];
  window.ASK_TAGS = [['Priority', 's-wedges'], ['Fit', 's-gaps'], ['Introductions', 's-pipeline'], ['Evidence bar', 's-wedges'], ['Market size', 's-wedges']];

  Object.assign(window.NOTES, {
    's-society': 'Five areas, each with one risk and the one guardrail we build in. Stress two: safety (every result states what it does not cover) and fairness (results by condition, not only the average). The one open item: how safety assessors want limits stated.',
    's-gaps': 'Name the risks before they do. Four could each end a wedge; read each card top to bottom: the risk, then what we do. The strip underneath lists the smaller gaps we are closing.',
    's-asks': 'Spend most of the coaching time here. Each question shows why we ask and what the answer changes. If time is short, ask 1 (which wedge to cut) and 3 (introductions) first.',
  });
})();
// v16:next end
// v16:appx start
// Appendix dossiers as a four-step story (the pain, today's tools, our edge, when we drop it),
// with no company scores; earlier targets as one plain line each. General terms only.
(function () {
  const D = Object.fromEntries((window.DOSSIERS || []).map((d) => [d.id, d]));
  const P = window.WEDGE_PLAIN || {};
  if (D.ml) D.ml.story = {
    wedge: 'w1',
    pain: (P.w1 && P.w1.plain) || 'Tests only show that the cases someone tried were safe. Safety engineers need evidence that also covers the cases nobody tried.',
    today: [
      ['Scenario sweeps', 'The scenarios on the list pass', 'Scenarios nobody listed'],
      ['Input-noise tests and statistics', 'How often the part fails', 'Inputs that were never sampled'],
      ['Model and code simulation', 'The code matches the model', 'Whether the model is safe to rely on'],
    ],
    edge: 'Verification research through our faculty advisor, turned into evidence a safety team can use inside the tools it already runs.',
    drop: ['Fewer than 3 of 6 safety engineers recall AI evidence being challenged', 'Early in prototyping, it cannot handle a realistic network'],
  };
  if (D.silhil) D.silhil.story = {
    wedge: 'w2',
    pain: (P.w2 && P.w2.plain) || 'Teams are moving tests off costly hardware benches into simulation, with no measured data on what the simulation misses.',
    today: [
      ['Engineer judgment', 'Keeps risky tests on the bench', 'Measured data behind the call'],
      ['Software copies of a controller', 'Fast tests with no hardware', 'Timing effects that show only on the bench'],
      ['Vendor bench-plus-simulation tools', 'One test run both ways', 'Independent data from a real vehicle'],
    ],
    edge: 'Data from a real vehicle: one EcoCAR controller compared in simulation, on the bench and in the car. A weak edge, so only alongside W1.',
    drop: ['Fewer than 2 of 4 test-bench engineers recall a decision that lacked this data', 'No bench or licence access confirmed in time for Studio 2'],
  };
  const OLD = {
    hil: ['Narrowed into W2', 'Testing on hardware benches and their software copies. dSPACE already sells both, so we kept one open question: W2.'],
    zonal: ['Dropped', 'Moving old controller software onto new zone computers. The work sits inside automaker programs, beyond a student team.'],
    ota: ['Dropped', 'Over-the-air updates for trucks and off-road machines. Vendors already sell it, and we lack the security experience.'],
    sbom: ['Still out', 'A record of every software part, for cyber rules. Buyers need audit credibility a student team lacks.'],
  };
  Object.keys(OLD).forEach((id) => { if (D[id]) D[id].record = { tag: OLD[id][0], line: OLD[id][1] }; });
  window.DOSSIER_INTRO = {
    sub: 'The pain, today’s tools, our edge, and when we drop it. All are low confidence until Studio 2 interviews.',
    old: 'Our first four targets, kept on the record. Studying real companies moved us to W1 and W2.',
  };
  // the company-score grid is retired, so its glossary entry goes too
  window.GLOSSARY = window.GLOSSARY.filter(([t]) => t !== 'Company test');
  Object.assign(window.NOTES, {
    's-dossier': 'Appendix. Each wedge as a four-step story: the pain, what teams use today and what it misses, our edge in general terms, and what would make us drop it. Pick W1 or W2 at the top; the earlier targets are kept on the record with one line each. All are low confidence until Studio 2 interviews.',
    's-fc': 'If asked about rigour: 43 market claims, each checked against its source. 37 are verified or corrected, and 6 are clearly labelled as forecasts, estimates or team hypotheses. Filter by status on the left; Sources and Glossary are in the tabs.',
  });
})();
// v16:appx end
// v16:integration start
// the company-score grid is retired: where each wedge came from, in words (reading mode)
(function () {
  const W = Object.fromEntries(window.WEDGES.list.map((w) => [w.id, w]));
  W.w1.from = 'Reshaped from validation evidence after the real-company check';
  W.w1.origin = 'Where it came from: the real-company check showed no demand from mid-size automakers, but a real gap at large players, so we reshaped validation evidence into this wedge.';
  W.w2.from = 'Narrowed from HIL & virtual-ECU validation';
  W.w2.origin = 'Where it came from: dSPACE already owns HIL tools, so the real-company check narrowed HIL & virtual-ECU validation to one open question: which tests can safely leave the bench.';
})();
// v16:integration end
// v17:dive start
// Layer deep dive: only what we can defend. One line on how money is made with one cited proof
// point, two engineering pains, and our honest fit.
window.LAYER_DIVE = {
  1: { scope: 'The car’s computers: central, zonal and domain controllers',
    money: 'A chip design win locks in the supplier for the platform’s whole life',
    proof: 'Qualcomm: record $1.59B automotive revenue in one quarter (fiscal Q3 2026), up 61%[^qcom]',
    pains: ['Hardware is frozen years before the software it must run exists', 'Safety-critical and everyday software must share one chip'],
    fit: ['Partial', 'Our embedded and CAN skills help, but this work needs AUTOSAR and ISO 26262 depth we lack.'] },
  2: { scope: 'Operating system, hypervisor and middleware',
    money: 'A per-unit royalty for the platform’s whole production life',
    proof: 'Android Automotive powers Volvo/Polestar, GM and Renault; Ford’s system is built with Google[^android]',
    pains: ['Linking old AUTOSAR Classic ECUs with Linux and newer platforms', 'Keeping software alive over a 15-year vehicle life'],
    fit: ['Weak', 'Certified operating systems are beyond a student team. We use these platforms; we don’t build them.'] },
  3: { scope: 'Perception, planning and driver assistance, L2 to L4',
    cap: 'ADAS and self-driving software, 2025–35: the largest software growth pool (McKinsey)[^mck]',
    money: 'Per-vehicle software, plus paid upgrades',
    proof: 'Tesla: 1.48M active FSD (Supervised) users in Q2 2026, about 45% on subscription[^tsla]',
    pains: ['Proving safety across rare edge cases that no test tried', 'Scenario coverage and sensor fusion keep validation slow'],
    fit: ['Strong', 'CAV and perception work, simulation, and verification research through our faculty advisor. W1 and W3 sit here. Not a fit for building a driving stack.'] },
  4: { scope: 'Over-the-air updates, rollback and update campaigns',
    cap: 'of recalled US vehicles since 2022 were eligible for an over-the-air fix[^bizzy]',
    money: 'Fixes and features shipped after the sale',
    proof: 'Tesla and Rivian build it in-house; Harman, Sibros and Excelfore supply many others[^excelfore]',
    pains: ['Older ECUs lack the spare memory for a safe update', 'Version clashes between ECUs; long installs take cars off the road'],
    fit: ['Weak', 'No secure-boot or UN R156 experience, and big automakers build this in-house.'] },
  5: { scope: 'Connected services, fleet telematics and cellular',
    cap: 'OnStar revenue GM guides for 2026, up 15%[^gm-q1]',
    money: 'Monthly subscriptions after the sale',
    proof: 'Samsara: $2.1B annual recurring revenue, up 30% a year[^samsara]',
    pains: ['Each automaker exposes different signals and APIs', 'Truck (J1939) and car networks differ'],
    fit: ['Partial', 'CAN and J1939 skills, but not enough to stand out in a crowded market.'], tag: 'dropped' },
  6: { scope: 'Vehicle data platforms, cloud backend and data products',
    cap: 'of opt-in consent required by the FTC’s order against GM (Jan 2026)[^ftc]',
    money: 'Consented data turned into maintenance, insurance and training value',
    proof: 'GM has set aside $0.5B for data-sharing investigations and lawsuits[^gm-10q]',
    pains: ['Data volume versus cellular cost', 'Each automaker names its signals differently'],
    fit: ['Partial', 'Cloud and data skills. Choosing which data to keep is part of W1, not a business of its own.'], tag: 'inside W1' },
  7: { scope: 'The gate to type approval: no compliant cybersecurity system, no sales',
    cap: 'public automotive cyber incidents in 2025, 92% of them remote (Upstream)[^upstream]',
    money: 'Compliance tools and fleet security monitoring that automakers must have to pass type approval',
    proof: 'UN R155/R156 are mandatory for every new EU registration since July 2024[^unece]',
    pains: ['Patching and key management over a 15-year vehicle life', 'Tracking software parts (SBOMs) across many suppliers'],
    fit: ['Weak', 'Our cybersecurity background is coursework; audit-grade evidence needs credibility we lack.'], tag: 'dropped' },
  8: { scope: 'Simulation, hardware test benches (HIL), virtual ECUs and test tools',
    cap: 'growth in integration and V&V services, 2025–35: the fastest of McKinsey’s software segments[^mck]',
    money: 'Test tools, test services and in-house test teams; no clear leader',
    proof: 'Applied Intuition: valued at $15B in 2025, and says it serves 18 of the top 20 automakers[^applied]',
    pains: ['Hardware test benches (HIL) are expensive and scarce', 'Virtual ECUs miss real timing and input/output behaviour'],
    fit: ['Strong', 'We run HIL benches and do model-based design: W2 sits here. Against dSPACE, that gives us empathy, not an advantage.'] },
};
// v17:dive end
// v17:w3 start
// W3 covers any AI model in driver-assist software that gets retrained. Perception is where we
// start (our CAV work), and which model type hurts most is something the interviews must find out.
(function () {
  const W3 = window.WEDGES.list.find((w) => w.id === 'w3');
  W3.plain = 'When a driver-assist AI model is retrained, teams re-test everything or cut tests on gut feel. They need a reasoned way to choose.';
  if (window.WEDGE_PLAIN) window.WEDGE_PLAIN.w3.plain = W3.plain;
  W3.hyp = 'We believe validation leads who retrain AI models in driver-assist software (perception first, possibly prediction or planning) either re-run far more testing than a change needs or cut scope on judgment they struggle to defend, and would adopt guidance on what to re-test, with the reasoning recorded.';
  W3.wedge = 'Retrained AI models in driver-assist software, starting with perception';
  W3.scopeNote = 'Any retrained AI model is in scope. We start with perception because our CAV team works on it and it is easy to test in simulation; the interviews tell us which model type hurts most.';
  if (W3.slide) {
    W3.slide.tests.D = ['Ask 6 validation leads which AI models they retrain most, and how they chose what to re-test last time', 'Fewer than 3 of 6 had a costly or disputed case this year'];
    W3.slide.bet = 'Looking at what changed in a retrained model beats simple choices like re-running everything. We try perception first.';
  }
  const SWAP = [
    ['After a perception model is retrained', 'After an AI model is retrained'],
    ['For teams retraining perception models', 'For teams retraining driver-assist AI models'],
    ['Teams that retrain perception models', 'Teams that retrain driver-assist AI models'],
    ['releasing a retrained perception model', 'releasing a retrained AI model'],
    ['Start: retrained perception models', 'Start: retrained driver-assist AI models, perception first'],
    ['a perception-model release lead', 'a release lead for retrained AI models'],
    ['Perception or ADAS validation leads who retrain models', 'Validation leads who retrain driver-assist AI models'],
    ['Perception or ADAS validation lead who retrains models', 'Validation lead who retrains driver-assist AI models'],
    ['W1 and W3 start here: evidence for a learned perception component.', 'W1 and W3 start here: AI parts such as perception models.'],
  ];
  const seen = new Set();
  const walk = (o) => {
    if (!o || typeof o !== 'object' || seen.has(o)) return;
    seen.add(o);
    for (const k of Object.keys(o)) {
      const v = o[k];
      if (typeof v === 'string') { let s = v; SWAP.forEach(([a, b]) => { s = s.split(a).join(b); }); if (s !== v) o[k] = s; }
      else walk(v);
    }
  };
  Object.keys(window).filter((k) => /^[A-Z][A-Z0-9_]+$/.test(k)).forEach((k) => walk(window[k]));
  const nw = window.PIPELINE.rows.find((r) => r.p === 'New');
  if (nw) Object.assign(nw, { role: 'AI model validation lead', at: 'at an automaker or supplier that retrains driver-assist models' });
})();
// v17:w3 end
// v17:people start
// Persona details for the click-through: only what we can defend. No names, scores, imagined
// weeks or tool lists; pains are the evidence-backed ones from the full persona cards.
window.PERSONA_DETAIL = {
  'dS-2': { av: 'bench', role: 'Opens the door',
    cares: ['Customer benches running and projects on time', 'Demos that turn into sales'],
    hurts: ['Benches are shared and booked, so downtime hurts', 'Software-only tests miss timing problems until late'],
    wins: ['A sharp, well-scoped question', 'Respect for their time: 30 minutes, clear agenda'],
    loses: ['An ask that is really free technical support', 'Anything that could embarrass dSPACE in front of a customer'],
    ask: 'Which tests do your customers keep on the bench, and why?',
    reach: 'EcoCAR sponsor contact: dSPACE sponsors the Innovation Challenge' },
  'dS-1': { av: 'product', role: 'Decides',
    cares: ['Customers adopt each new release', 'Keeping ISO 26262 credibility as AI features arrive'],
    hurts: ['AI parts are checked mainly in simulation', 'Customers must now show auditable AI (ISO/PAS 8800)'],
    wins: ['Fits the certified tool flow without friction', 'A working demo on real vehicle data'],
    loses: ['A step that cannot be qualified for safety use', 'Unclear IP, or support that ends when students graduate'],
    ask: 'When did a customer last ask for more evidence on an AI part, and what did you tell them?',
    reach: 'Introduction from the test-bench engineer (card 1) or our EcoCAR sponsor liaison' },
  'dS-3': { av: 'sim', role: 'Uses it',
    cares: ['Moving tests from hardware benches into simulation', 'Lower cost per validated software release'],
    hurts: ['Hardware test benches are scarce and shared', 'Bench testing and simulation are owned by different teams'],
    wins: ['Works inside the tool chain they already own', 'A clear time or cost saving per release'],
    loses: ['Another tool to qualify', 'Evidence that cannot be traced to requirements'],
    ask: 'What was the last test you moved off the bench, and how did you decide it was safe?',
    reach: 'Stellantis engineers through the EcoCAR sponsorship, and WMU alumni' },
  'AI-1': { av: 'shield', role: 'Can veto',
    cares: ['A defensible safety case at every release gate', 'No open, un-argued AI hazards'],
    hurts: ['Tools give statistics and scenarios; the standards want an argument', 'Coverage is hard to argue beyond the scenarios run'],
    wins: ['Evidence an assessor will accept', 'Assumptions stated openly'],
    loses: ['No path to tool qualification under ISO 26262', 'An evidence scope that looks arbitrary'],
    ask: 'When was the safety evidence for an AI part last challenged, and by whom?',
    reach: 'LinkedIn and WMU alumni; a warm path through Stellantis engineers' },
  'AI-2': { av: 'car', role: 'Decides on methods',
    cares: ['Less time from a software drop to the release call', 'Fewer defects escaping to track and road'],
    hurts: ['Finding the right events in thousands of hours of logs', 'Replaying scenarios does not scale to whole driving stacks'],
    wins: ['Runs in their nightly build pipeline at full scale', 'Cuts sampling or triage effort'],
    loses: ['Too slow for nightly runs', 'Needs their private data shared outside'],
    ask: 'After your last model update, how did you choose what to re-test?',
    reach: 'WMU alumni and LinkedIn; our faculty advisor’s V&V network' },
  New: { av: 'model', role: 'Owns the re-test call', draft: true,
    cares: ['Shipping model updates on schedule', 'A re-test scope reviewers will sign'],
    hurts: ['After a retrain, nobody can show which behaviours moved', 'Re-running every test is slow; cutting tests by gut feel is risky'],
    ask: 'Which AI models do you retrain most, and how did you choose what to re-test last time?',
    reach: 'WMU alumni, LinkedIn, and SAE and IEEE events' },
  'ME-1': { av: 'badge', role: 'Shapes the method', hold: true,
    cares: ['Showing camera and radar or lidar channels fail independently', 'Regulators and customers accepting the method'],
    hurts: ['A long time between failures is needed but not enough, by Mobileye’s own account', 'Proving very rare misses needs huge amounts of data'],
    wins: ['Rigour that matches Mobileye’s published safety model', 'Results worth publishing'],
    loses: ['Needs their private networks or data', 'No existing relationship: Mobileye is not an EcoCAR sponsor'],
    ask: 'How much of a perception safety argument can go beyond statistics today?',
    reach: 'A warm introduction only, so on hold until one opens' },
};
// v17:people end
// v17:version start
window.VERSION.n = 30;
// v17:version end
// v18:content start
// Round 3 notes (13 Nov): W1 takes the faculty advisor's sharper hypothesis (failures in easy,
// everyday cases after statistical tests pass); W2 names the part of simulation we think falls
// short; risks are broader; the questions slide becomes roadblocks and asks; fuller bottom line.
(function () {
  const W = Object.fromEntries(window.WEDGES.list.map((w) => [w.id, w]));
  const P = window.WEDGE_PLAIN || {};
  // W1: the "what if it fails in an easy case" worry
  W.w1.plain = 'Statistical tests passed, yet engineers still worry: what if the AI part fails in an easy, everyday case nobody sampled?';
  W.w1.hyp = 'We believe safety and validation engineers who sign off AI parts still worry, after statistical sampling passes, about failures in easy, everyday conditions that no sample happened to hit, and would accept added evidence for those cases inside the tools they already run.';
  W.w1.pain = 'Sampling-based tests pass, but failures can still hide in easy, everyday conditions nobody sampled';
  if (W.w1.slide) {
    W.w1.slide.today = 'Scenario tests and statistics, which only cover the cases someone sampled';
    W.w1.slide.drop = 'fewer than 3 of 6 still worry after statistical tests pass';
    W.w1.slide.tests.D = ['Ask 6 safety engineers: after statistical tests passed, what failure in an easy, everyday case still worried you?', 'Fewer than 3 of 6 name a real worry like this'];
  }
  // W2: which part of simulation falls short (our guess: ECU timing and signals)
  W.w2.plain = 'Teams move tests off hardware benches into simulation without knowing where simulation falls short. We think it is mostly ECU timing and signals.';
  W.w2.hyp = 'We believe test leads moving tests from hardware benches to simulation cannot say which part of the simulation causes misses (ECU timing, signals and buses, sensor models or the vehicle model), that one cause (we expect ECU timing and signals) explains most of them, and that a measured map of it would tell them which tests can safely leave the bench.';
  W.w2.pain = 'Tests leave the bench without knowing which part of the simulation falls short';
  if (W.w2.slide) {
    W.w2.slide.offer = 'A measured map of where simulation falls short';
    W.w2.slide.drop = 'fewer than 2 of 4 can name a simulation miss and its cause';
    W.w2.slide.bet = 'One cause, we think ECU timing and signals, explains most misses between simulation and the bench';
    W.w2.slide.tests.D = ['Ask 4 test-bench leads about the last test that passed in simulation but failed on the bench: was it timing, signals and buses, sensor models or the vehicle model?', 'Fewer than 2 of 4 have such a case, or no single cause stands out'];
  }
  if (P.w1) P.w1.plain = W.w1.plain;
  if (P.w2) P.w2.plain = W.w2.plain;
  // appendix dossiers carry the same pains
  const DS = Object.fromEntries((window.DOSSIERS || []).map((d) => [d.id, d]));
  if (DS.ml && DS.ml.story) {
    DS.ml.story.pain = W.w1.plain;
    DS.ml.story.drop[0] = 'Fewer than 3 of 6 safety engineers still worry about easy-case failures after statistical tests pass';
  }
  if (DS.silhil && DS.silhil.story) {
    DS.silhil.story.pain = W.w2.plain;
    DS.silhil.story.drop[0] = 'Fewer than 2 of 4 test-bench leads can name a simulation miss, or no single cause stands out';
  }

  // risks: any AI part on our car, contacts beyond two companies, and we build the prototype
  window.RISKS = [
    { k: 'Demand', icon: 'people', n: '0 of 3 pains confirmed', t: 'A pain nobody outside the team confirms ends its wedge', act: 'First interviews before Studio 1 ends', by: 'before Studio 1 ends' },
    { k: 'Fit with our vehicle', icon: 'car', n: 'Does W1 count as vehicle work?', t: 'Only if it checks an AI part a vehicle team really uses', act: 'Use an AI part on our EcoCAR car; if none fits, a public driving model', by: 'Studio 1' },
    { k: 'Access', icon: 'key', n: 'Tools and contacts', t: 'Without tool licences or industry contacts, W2 and one W1 test stall', act: 'Go beyond dSPACE and Applied Intuition: other sponsors, automakers, suppliers, WMU alumni', by: 'before Studio 2' },
    { k: 'Build', icon: 'tools', n: 'We build the prototype', t: 'If our own W1 or W3 prototype fails on a realistic AI part, we drop that wedge', act: 'Our team builds both early, with our faculty advisor, on public simulation models', by: 'early in prototyping' },
  ];
  window.GAPS[0] = ['Personas', 'The W3 persona (AI model validation lead) is still a draft', 'Finish it from public job postings, like the other six', 'Studio 1', 'Finish the W3 persona'];

  // the last slide: roadblocks we hit, and how the organizers could help
  window.ROADBLOCKS = [
    { icon: 'people', k: 'Interviews', hit: 'The engineers we most need sign off AI safety or run test benches. 3 of our 7 personas are reachable only through a sponsor introduction.',
      ask: 'Introduce us to people in these roles among EcoCAR sponsors, mentors or past teams.', go: 's-pipeline' },
    { icon: 'key', k: 'Tools', hit: 'Our simulation and test-bench licences come through EcoCAR for the vehicle build. We are not sure they cover a business study.',
      ask: 'Point us to whoever can confirm what sponsor licences allow for this work.', go: 's-gaps' },
    { icon: 'trend', k: 'Market data', hit: 'Reports that split out validation spending are paywalled, so our market sizes are top-down estimates.',
      ask: 'Help us reach industry reports through the program, or a mentor who has sized an engineering-tools market.', go: 's-wedges' },
    { icon: 'flask', k: 'Interview plan', hit: 'Our interview questions and drop rules are drafted, but nobody outside the team has reviewed them.',
      ask: 'Review our interview guide, and tell us how many interviews would convince you a pain is real.', go: 's-wedges' },
  ];

  // executive summary: the fuller bottom line the team preferred
  window.EXEC.bottomLine = 'Software-defined vehicles move a car’s value into a few central computers and their software, and let automakers keep earning after the sale. The largest pools belong to well-funded incumbents, so our opening is the engineering work every automaker must finish before launch. Checking our first targets (HIL, zonal, OTA) against real companies narrowed our focus to integration, verification and validation (V&V): can a model, a test or an update be trusted? It is the fastest-growing of McKinsey’s auto software segments, and it gates every release.';
  window.EXEC.bottomShort = window.EXEC.bottomLine;

  Object.assign(window.NOTES, {
    's-asks': 'Our asks. Four roadblocks we have hit, each with the one thing that would unblock it. If time is short, start with introductions (1) and the interview-guide review (4).',
    's-gaps': 'Four risks that could each end a wedge, each with what we do. W1 needs an AI part a vehicle team really uses, ideally on our own EcoCAR car. We build the prototypes ourselves, with our faculty advisor, on public simulation models.',
  });
})();
// v18:content end
// v19:asks start
// Final edits (13 Nov): every persona can be reached by our own outreach (a sponsor contact is
// only the faster first route), and the asks are about training and guidance, not introductions.
(function () {
  const R = Object.fromEntries((window.ROADBLOCKS || []).map((r) => [r.k, r]));
  if (R.Interviews) Object.assign(R.Interviews, {
    hit: 'The engineers we most need sign off AI safety or run test benches. They are busy, and cold messages from a student team are easy to ignore.',
    ask: 'Point us to EcoCAR events, sponsor sessions or networks where we can meet engineers in these roles.',
  });
  if (R['Market data']) R['Market data'].ask = 'Train us on how to find and use industry reports, or pair us with a mentor who has sized an engineering-tools market.';
  if (R['Interview plan']) Object.assign(R['Interview plan'], {
    hit: 'We are drafting our interview questions and drop rules with our industry mentor, but we have no standard method to follow.',
    ask: 'Share an EcoCAR standard, guide or training on contacting people and running interviews, so we test our hypotheses well.',
  });
  // personas: the route on each card is the first one we try, not the only one
  const me = window.PIPELINE.rows.find((r) => r.p === 'ME-1');
  if (me) Object.assign(me, { route: 'warm introduction or our own outreach', step: 'On hold until we have a public result', next: 'On hold until we have a public result' });
  if (window.PERSONA_DETAIL && window.PERSONA_DETAIL['ME-1']) window.PERSONA_DETAIL['ME-1'].reach = 'On hold: we reach out ourselves once we have a public result to show, or through a warm introduction';
  const reach = 'We can reach every persona through our own outreach; a sponsor contact is a faster first route for three of them.';
  window.PIPELINE.note = 'Names and contact details stay in our private tracker, not on this public site. We have not contacted anyone yet. ' + reach;
  Object.assign(window.NOTES, {
    's-pipeline': 'Seven personas in the order we will contact them: each card is a fictional archetype of a real job, not a person. Real people already match four of the six written personas (7 people, names kept private); no one has been contacted yet. ' + reach + ' Click a card for the full persona.',
    's-asks': 'Our asks. Four roadblocks we have hit, each with what would unblock it. If time is short, start with where to meet engineers (1) and an interview guide or training (4).',
  });
})();
// v19:asks end

// v26: one-line questions for the wedge cards (plain restatements of WEDGE_PLAIN)
window.WEDGE_HOOK = {
  w1: 'Statistical tests passed. But what if the AI part fails in an easy, everyday case nobody sampled?',
  w2: 'Which tests can safely leave the hardware bench for simulation, and where does simulation fall short?',
  w3: 'After a driver-assist AI model is retrained, what really needs re-testing?',
};

// v28: a dossier for W3, built only from the W3 wedge record (WEDGES.list w3). W3 was added after
// the real-company check, so it is marked as not yet checked against companies.
(() => {
  const w = window.WEDGES.list.find((x) => x.id === 'w3');
  if (!w || window.DOSSIERS.some((x) => x.id === 'retest')) return;
  const at = window.DOSSIERS.findIndex((x) => !x.focus);
  window.DOSSIERS.splice(at < 0 ? window.DOSSIERS.length : at, 0, {
    id: 'retest', focus: true, role: 'W3, newest', layer: 3, colour: w.colour, title: w.name,
    short: w.short,
    problem: w.problem,
    edge: 'Our CAV team works on perception and its toolchain, so we can benchmark re-test choices in simulation on planted faults, against re-running everything and random picks. Not yet checked against the three companies.',
    users: `${w.user} (closest personas: ${w.personas})`,
    budget: w.owner,
    gate: 'Still to find: a safety or sign-off role that would accept a reduced re-test scope with written reasons',
    influence: 'To map in the first interviews',
    workaround: w.workaround,
    forE: [
      'Software-defined vehicles keep changing after launch, so re-testing after each model update keeps coming back',
      'In QNX’s 2026 vendor-commissioned survey of 1,100 developers, 44% named debugging and testing their top challenge (36% in 2025)[^w-qnx]',
      'Published selection methods have cut ADAS road-test suites by 89% while keeping 79% of failures, so choosing tests can work[^w-rts]',
      'It ties directly to our CAV perception and toolchain deliverables',
    ],
    against: [
      'Build vs. buy: teams may already solve this in-house',
      'Safety reviewers may refuse any reduced test scope',
      'Our top-down ($90M–$360M) and bottom-up ($3M–$18M a year) market views differ by 5 to 100 times',
      'No price point tested and no buyer or budget named by anyone outside the team',
      'Not yet checked against dSPACE, Applied Intuition or Mobileye',
    ],
    confidence: { level: 'Low', why: 'Added after the real-company check and not yet scored against companies. Public sources and team inference only.' },
    first: `Interview validation leads first: ${w.ask} Then: what have you tried, bought or built in the past year to deal with that?`,
    kill: w.plan.map((p) => p[3]),
    biz: [
      'Who pays: a validation director or a software release lead?',
      'A yearly licence per ADAS program? (to test)',
      'Early TAM and SAM proxies are on the Wedge hypotheses slide.',
    ],
    story: {
      wedge: 'w3',
      pain: w.plain,
      today: [
        ['Re-run everything', 'Catches what the full test set catches', 'Time and compute spent on what did not change'],
        ['Choose tests by judgment', 'A smaller, faster re-test', 'A recorded reason a reviewer accepts'],
        ['Code-based change tools', 'Which code changed', 'Which behaviors of a retrained model moved'],
      ],
      todayNote: 'Inferred from public material; to test in interviews',
      edge: 'Our CAV team works on perception, so we can benchmark re-test choices in simulation on planted faults. Not yet checked against companies.',
      drop: [
        'Fewer than 3 of 6 validation leads had a costly or disputed re-test call in the past 12 months',
        'Early in prototyping, it cannot catch at least 90% of planted faults with half of the tests',
      ],
    },
  });
})();
