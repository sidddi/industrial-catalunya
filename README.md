# Notes de tall a Catalunya
Eina web (en català) per comparar la teva nota d'admissió amb les notes de tall de tots els graus de les universitats catalanes.

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

Explora només inclou ofertes amb `w`, sense `revisio`, i amb tall de 2026. Mostra les que igualen o superen aquell tall, sense garantir l’admissió ni comprovar PAP o altres requisits. La branca de batxillerat només ordena les famílies afins; no canvia notes ni restringeix graus. `explore.js` agrupa editorialment per paraules del nom: no és una classificació oficial. Un doble grau pot sortir en diverses famílies; les combinacions es mostren primer per facilitar descobertes.
