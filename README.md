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
- 15 no tenen fila pròpia al PDF i només es compara amb la nota d'accés (simultaneïtats de la UB, i alguns graus nous o sense equivalent clar). Per afegir una equivalència, afegeix-la a `data/alies.json` i executa `python3 scripts/build-data.py`.
