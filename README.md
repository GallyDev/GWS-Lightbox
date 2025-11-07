# GWS-Lightbox
Schlankes Script für eine leicht anpassbare Lightbox

# Benutzung
Erstelle ein Element mit dem Attribut gws-lightbox. Zum Beispiel eine DIV:
<div gws-lightbox> … </div>
Alle in dieser DIV gefundenen IMG werden zur Lightbox-Galerie hinzugefügt und anklickbar, ausser sie haben das Attribut gws-lightbox-hide.

Das Attribut gws-lightbox kann auch Optionen annehmen.
- paginated -> Macht ein Band mit Vorschaubildern an den unteren Rand
- arrows -> zeigt links und rechts Pfeile an

<div gws-lightbox="paginated arrows"> … </div> hat das Band mit den Vorschaubildern und Pfeile
<div gws-lightbox="arrows"> … </div> hat nur Pfeile
