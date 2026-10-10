<?php
// Importe pays.json : met à jour chaque fiche pays (repérée par son code ISO). Relançable sans risque.
$data = json_decode(file_get_contents(__DIR__ . '/pays.json'), true);
$n = 0;
foreach ($data as $p) {
    $found = get_posts(['post_type' => 'pays', 'post_status' => 'any', 'numberposts' => 1,
        'meta_key' => 'code_iso', 'meta_value' => $p['iso']]);
    $nom = $p['titres']['fr'] ?? $p['nom'];
    if ($found) { $id = $found[0]->ID; }
    else { $id = wp_insert_post(['post_type' => 'pays', 'post_status' => 'publish', 'post_title' => $p['nom']]); update_post_meta($id, 'code_iso', $p['iso']); }
    update_post_meta($id, 'certificat', $p['cert'] ?? '');
    update_post_meta($id, 'certificat_nom', $p['cert_nom'] ?? '');
    update_post_meta($id, 'valide_par_ibesc', 1);
    foreach (['fr', 'en', 'nl'] as $l) {
        if (!empty($p['titres'][$l]) && $l !== 'fr') update_post_meta($id, "titre_$l", $p['titres'][$l]);
        foreach (($p['lang'][$l] ?? []) as $s => $lines) update_post_meta($id, "{$s}_$l", implode("\n", $lines));
    }
    $n++;
}
echo "Import terminé : $n pays.\n";
