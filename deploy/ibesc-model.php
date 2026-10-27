<?php
/** Plugin Name: IBESC content model */
const IBESC_FRONT = 'https://ibesc.cloud';
const IBESC_LANGS = ['fr' => 'Français', 'en' => 'English', 'nl' => 'Nederlands'];
const IBESC_SECTIONS = [
    'intro'     => ['Introduction', 'Un paragraphe par ligne.'],
    'ports'     => ['Ports', 'Un port par ligne.'],
    'docs'      => ['Documents requis', 'Un document par ligne.'],
    'infos'     => ['Informations complémentaires', 'Un point par ligne.'],
    'procedure' => ['Procédure', 'Une étape par ligne.'],
    'delais'    => ['Délais', 'Un point par ligne.'],
    'penalites' => ['Pénalités', 'Un point par ligne.'],
];

add_action('init', function () {
    $types = [
        'pays'       => ['Pays', 'Pays', 'pays'],
        'circulaire' => ['Circulaires', 'Circulaire', 'circulaires'],
        'faq'        => ['FAQ', 'Question', 'faq'],
        'service'    => ['Services', 'Service', 'services'],
    ];
    foreach ($types as $slug => [$plural, $single, $rest]) {
        register_post_type($slug, [
            'labels'       => ['name' => $plural, 'singular_name' => $single],
            'public'       => true,
            'show_in_rest' => true,
            'rest_base'    => $rest,
            'supports'     => ['title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields'],
            'has_archive'  => false,
            'menu_icon'    => 'dashicons-admin-site-alt3',
        ]);
    }
    $meta = ['code_iso' => 'string', 'certificat' => 'string', 'certificat_nom' => 'string',
             'mis_a_jour' => 'string', 'valide_par_ibesc' => 'boolean',
             'documents_requis' => 'string', 'delai' => 'string'];
    foreach (IBESC_LANGS as $l => $_) {
        $meta["titre_$l"] = 'string';
        foreach (IBESC_SECTIONS as $s => $__) $meta["{$s}_$l"] = 'string';
    }
    foreach ($meta as $k => $t) {
        register_post_meta('pays', $k, [
            'type' => $t, 'single' => true, 'show_in_rest' => true,
            'auth_callback' => function () { return current_user_can('edit_posts'); },
        ]);
    }
    foreach (IBESC_LANGS as $l => $_) {
        register_post_meta('circulaire', "titre_$l", [
            'type' => 'string', 'single' => true, 'show_in_rest' => true,
            'auth_callback' => function () { return current_user_can('edit_posts'); },
        ]);
        register_post_meta('circulaire', "contenu_$l", [
            'type' => 'string', 'single' => true, 'show_in_rest' => true,
            'auth_callback' => function () { return current_user_can('edit_posts'); },
        ]);
    }
});

add_action('add_meta_boxes', function () {
    add_meta_box('ibesc_pays', 'Fiche pays', 'ibesc_pays_box', 'pays', 'normal', 'high');
    add_meta_box('ibesc_circulaire_langues', 'Versions linguistiques de la circulaire', 'ibesc_circulaire_box', 'circulaire', 'normal', 'high');
});

function ibesc_circulaire_box($post) {
    wp_nonce_field('ibesc_circulaire', 'ibesc_circulaire_nonce');
    $g = function ($k) use ($post) { return get_post_meta($post->ID, $k, true); };
    ?>
    <p class="description">Le titre et le contenu français restent ceux de l’éditeur WordPress. Saisissez les versions anglaise et néerlandaise ci-dessous.</p>
    <?php foreach (['en' => 'English', 'nl' => 'Nederlands'] as $l => $label): ?>
    <details style="margin:10px 0;border:1px solid #c3c4c7;padding:8px 12px;background:#fff">
        <summary style="cursor:pointer;font-weight:600;font-size:14px"><?php echo esc_html($label); ?></summary>
        <p><label>Titre<br><input name="titre_<?php echo $l; ?>" type="text" class="large-text" value="<?php echo esc_attr($g("titre_$l")); ?>"></label></p>
        <p><label>Contenu<br><textarea name="contenu_<?php echo $l; ?>" rows="14" class="large-text code"><?php echo esc_textarea($g("contenu_$l")); ?></textarea></label></p>
        <p class="description">Utilisez les mêmes balises HTML que dans l’éditeur principal : &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;ol&gt; et &lt;strong&gt;.</p>
    </details>
    <?php endforeach;
}

function ibesc_pays_box($post) {
    wp_nonce_field('ibesc_pays', 'ibesc_pays_nonce');
    $g = function ($k) use ($post) { return get_post_meta($post->ID, $k, true); };
    ?>
    <table class="form-table" role="presentation">
        <tr><th><label>Code pays (2 lettres)</label></th>
            <td><input name="code_iso" type="text" maxlength="2" size="4" value="<?php echo esc_attr($g('code_iso')); ?>"> <span class="description">Exemple : SN</span></td></tr>
        <tr><th><label>Certificat</label></th>
            <td><input name="certificat" type="text" size="10" value="<?php echo esc_attr($g('certificat')); ?>">
                <input name="certificat_nom" type="text" class="regular-text" placeholder="Nom complet" value="<?php echo esc_attr($g('certificat_nom')); ?>"></td></tr>
        <tr><th><label>Dernière vérification</label></th>
            <td><input name="mis_a_jour" type="date" value="<?php echo esc_attr($g('mis_a_jour')); ?>"></td></tr>
        <tr><th>Validation</th>
            <td><label><input name="valide_par_ibesc" type="checkbox" value="1" <?php checked((bool) $g('valide_par_ibesc')); ?>> Informations validées par IBESC</label></td></tr>
    </table>
    <?php foreach (IBESC_LANGS as $l => $label): ?>
    <details style="margin:10px 0;border:1px solid #c3c4c7;padding:8px 12px;background:#fff" <?php echo $l === 'fr' ? 'open' : ''; ?>>
        <summary style="cursor:pointer;font-weight:600;font-size:14px"><?php echo esc_html($label); ?></summary>
        <?php if ($l !== 'fr'): ?>
        <p><label>Nom du pays (<?php echo esc_html($l); ?>)<br>
        <input name="titre_<?php echo $l; ?>" type="text" class="regular-text" value="<?php echo esc_attr($g("titre_$l")); ?>"></label></p>
        <?php endif; ?>
        <?php foreach (IBESC_SECTIONS as $s => [$sl, $hint]): ?>
        <p><label><strong><?php echo esc_html($sl); ?></strong> <span class="description">— <?php echo esc_html($hint); ?></span><br>
        <textarea name="<?php echo "{$s}_$l"; ?>" rows="<?php echo $s === 'intro' ? 6 : 4; ?>" class="large-text"><?php echo esc_textarea($g("{$s}_$l")); ?></textarea></label></p>
        <?php endforeach; ?>
    </details>
    <?php endforeach;
}

add_action('save_post_pays', function ($id) {
    if (!isset($_POST['ibesc_pays_nonce']) || !wp_verify_nonce($_POST['ibesc_pays_nonce'], 'ibesc_pays')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $id)) return;
    $in = function ($k) { return wp_unslash($_POST[$k] ?? ''); };
    foreach (['certificat', 'certificat_nom', 'mis_a_jour'] as $k) update_post_meta($id, $k, sanitize_text_field($in($k)));
    update_post_meta($id, 'code_iso', strtoupper(substr(sanitize_text_field($in('code_iso')), 0, 2)));
    update_post_meta($id, 'valide_par_ibesc', !empty($_POST['valide_par_ibesc']) ? 1 : 0);
    foreach (IBESC_LANGS as $l => $_) {
        if ($l !== 'fr') update_post_meta($id, "titre_$l", sanitize_text_field($in("titre_$l")));
        foreach (IBESC_SECTIONS as $s => $__) update_post_meta($id, "{$s}_$l", sanitize_textarea_field($in("{$s}_$l")));
    }
});

add_action('save_post_circulaire', function ($id) {
    if (!isset($_POST['ibesc_circulaire_nonce']) || !wp_verify_nonce($_POST['ibesc_circulaire_nonce'], 'ibesc_circulaire')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $id)) return;
    foreach (['en', 'nl'] as $l) {
        update_post_meta($id, "titre_$l", sanitize_text_field(wp_unslash($_POST["titre_$l"] ?? '')));
        update_post_meta($id, "contenu_$l", wp_kses_post(wp_unslash($_POST["contenu_$l"] ?? '')));
    }
});

// Façade du CMS : les visiteurs non connectés sont renvoyés vers le vrai site.
add_action('template_redirect', function () {
    if (is_user_logged_in()) return;
    wp_redirect(IBESC_FRONT, 302);
    exit;
});
