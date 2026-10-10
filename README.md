# Notes de tall a Catalunya
Eina web (en català) per comparar la teva nota d'admissió amb les notes de tall de les ofertes de la preinscripció universitària de Catalunya (universitats públiques, UVic-UCC i centres adscrits).

Dades: notes de tall de [Dades obertes de la Generalitat](https://analisi.transparenciacatalunya.cat/Educaci-/Notes-de-tall-d-acc-s-als-estudis-universitaris-co/usyn-hngc) (1a assignació, juny 2023-2026) i ponderacions oficials 2027 del [Canal Universitats](https://universitats.gencat.cat/ca/preinscripcions/ponderacions/) (PDF a `data/`). Regenerar: `python3 scripts/parse-ponderacions.py && python3 scripts/build-data.py`.
Regenerar `data.json`: `python3 scripts/build-data.py`. Lloc estàtic: serveix l'arrel (p. ex. `python3 -m http.server`).
La versió anterior només d'enginyeria industrial és a la branca `industrial-v0`.

## Cobertura de les ponderacions
De 640 graus amb nota de tall, 625 tenen ponderació:
- 576 coincideixen pel nom (universitat + nom normalitzat).
- 32 s'assignen per equivalència segura (`data/alies.json`, nivell 1): el mateix grau amb un nom o centre escrit diferent al PDF (p. ex. centres adscrits, agrupacions, graus interuniversitaris).
- 17 s'assignen de forma probable (nivell 2): el grau sembla haver canviat de nom o d'adscripció al PDF de 2027. A la web s'hi mostra un avís perquè es comprovi.
- 15 ofertes històriques sense càlcul 2027: 9 sense nou accés confirmat, 4 amb pla/oferta renovada i fitxa actual separada, i 2 sense ponderació pública verificada (ADE/Matemàtiques UB i Disseny per als Sistemes Alimentaris). No trobar fila no vol dir que només compti la nota d'accés. No es mostra semàfor ni es compara una nota incompleta.

La revisió per oferta, els successors i les fonts oficials són a `data/revisio-2027.json` (verificació: 10/10/2026). Les notes històriques no es fusionen amb els graus nous ni se'ls assignen automàticament les ponderacions dels successors.

## Mode Explora
Dos modes comparteixen les notes i els filtres d’universitat/municipi: `Ho tinc clar` (cerca per nom) i `Explora` (descoberta per famílies). Es pot introduir directament la nota d’accés sobre 10 o calcular-la amb batxillerat i PAU; les matèries específiques sempre es ponderen per grau. Una matèria repetida només compta una vegada (la millor nota).

Explora inclou ofertes amb tall de 2026, sense demanar nota. El filtre opcional per nota només inclou ofertes amb ponderació verificada que igualen o superen aquell tall, sense garantir l’admissió ni comprovar PAP o altres requisits. El batxillerat és el primer pas: mostra matèries i famílies afins per defecte, amb controls explícits per veure-les totes. No és una restricció legal d’accés. Les notes i matèries ja triades no es perden en canviar de modalitat. `explore.js` agrupa editorialment per paraules del nom: no és una classificació oficial. Un doble grau pot sortir en diverses famílies; les combinacions es mostren primer per facilitar descobertes.

## Fitxes, costos i províncies (10/10/2026)
`data/fitxes.json` conserva fonts per oferta, tipus de tarifa (pública o privada/pròpia), centre, objectius i sortides de Canal Universitats. 557 fitxes per a totes les ofertes amb tall de 2026. 546 tenen descripció; 545, àmbits o sortides. Algunes combinacions fan servir extractes dels graus components, amb avís i fonts. Els textos són extractes abreujats, no resums inventats. Les fitxes sense contingut ho indiquen.

466 imports verificats: 17,69 €/ECTS públic (decret 96/2026, 2026-2027), i preus propis verificats d'UVic, Tecnocampus i CITM. 60 ECTS no sempre equivalen al primer curs d'un doble grau. Les taxes, beques, preus especials i data de tarifa s'expliquen a cada fitxa. Medicina UVic no té import assignat: el preu anunciat és una bonificació condicionada que no presentem com una tarifa general. Centres adscrits privats a universitats públiques no hereten tarifa pública. Altres imports estan pendents de verificar. No inclou tota l'oferta privada sense preinscripció centralitzada.

`data/provincies.json`: correspondència dels municipis del catàleg amb la província a partir del codi municipal oficial de https://universitats.gencat.cat/shared/json/quaire/municipis.json (prefixos 08, 17, 25, 43). Una oferta multicampus coincideix amb qualsevol de les seves províncies. Es mantenen els filtres per municipi i universitat.

Matèries lliures: https://universitats.gencat.cat/ca/pau/que-qui/ . Els itineraris científic/tecnològic i social/humanístic són orientatius, no modalitats oficials separades.
