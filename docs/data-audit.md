# Data audit · 07/10/2026
Sources retrieved from links actually present on Canal Universitats. PDF title confirms first assignment June 2026, 10/07/26. Use only PAU/CFGS column (source groups both routes; calculator supports Bachillerat+PAU only). Do not use other quota columns.

| Code | Option | 2026 first cutoff | Cutoff page | weights 2026 page | weights 2027 page |
|---|---|---:|---:|---:|---:|
|31115|UPC Barcelona ETSEIB PARS|10.724|5|14|15|
|31114|UPC Terrassa ESEIAAT PARS|10.120|5|14|15|
|81088|UdG Girona industrial PARS|8.666|5|14|15|
|31027|UPC EEBE Mechanics|9.954|5|15|16|
|81022|UdG Mechanics|8.022|5|15|16|
|71040|URV Tarragona Mechanics|7.949|5|16|16|

Math and physics coefficients: 0.2 on every selected row in both years, individually extracted by header coordinates and code. No global assumption. Program identity/type and centre/city read from linked university pages in data/programs.json; admission identity and cities also corroborated in cutoff PDF. URV university label is used instead of inventing a specific school acronym. Not an exhaustive Catalan catalogue.

Original exact URLs in sources/manifest.json and datum provenance. Official programme pages saved as readable evidence in sources/program-pages.txt and sources/mec-pages.txt. Verification date is real 07/10/2026. Stored files are evidence snapshots, not authority for later updates.

Discrepancies:
- Readable notes index showed second assignment 23/07/2025 for June 2026. Raw live index correctly showed 23/07/2026 and further rounds. First-round PDF chosen, date confirmed inside original. No reliance on discrepant second-round text.
- 2027 weighting PDF has heading 2027, is linked under 2027, filename 2027_v2; at least one footer says “Ponderacions 2028”. Preserved, not silently rewritten. Data is assigned to 2027 on heading/index evidence. Recheck with source owner if preparing production release.
- Some degree pages have 2025 cutoffs or unrelated boilerplate. None used for numeric cutoffs; Gencat exact code is authoritative.

Normative rounding: consolidated RD 534/2024 arts 14.2, 15.1, 22.3: three decimals, nearest thousandth, ties upwards. Integer thousandth/tenth-thousandth arithmetic prevents binary floating-point boundaries. Mandatory modality may be considered from the access phase under art 22.2. UI intentionally only models two chosen subjects, does not claim global best admission score. Exams assumed same year as selected admission year; no old-exam validity computation.

Importer: python3 scripts/import-data.py; optionally --download. Generates import-candidates.json for review, never overwrites accepted datasets. Compare changes, confirm row/headers/title/quota visually, then manually update verifiedAt. No automated publication.
