# Notes de tall a Catalunya
Eina web (en català) per comparar la teva nota d'admissió amb les notes de tall de tots els graus de les universitats catalanes.

Dades: notes de tall de [Dades obertes de la Generalitat](https://analisi.transparenciacatalunya.cat/Educaci-/Notes-de-tall-d-acc-s-als-estudis-universitaris-co/usyn-hngc) (1a assignació, juny 2023-2026) i ponderacions oficials 2027 del [Canal Universitats](https://universitats.gencat.cat/ca/preinscripcions/ponderacions/) (PDF a `data/`). Regenerar: `python3 scripts/parse-ponderacions.py && python3 scripts/build-data.py`.
Regenerar `data.json`: `python3 scripts/build-data.py`. Lloc estàtic: serveix l'arrel (p. ex. `python3 -m http.server`).
La versió anterior només d'enginyeria industrial és a la branca `industrial-v0`.
