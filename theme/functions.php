<?php
/** ATOS Clientes Locais. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function atos_setup() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'wp-block-styles' );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'editor-styles' );
    add_editor_style( 'style.css' );
    load_theme_textdomain( 'atos-clientes-locais', get_template_directory() . '/languages' );
}
add_action( 'after_setup_theme', 'atos_setup' );

function atos_assets() {
    $version = wp_get_theme()->get( 'Version' );
    wp_enqueue_style( 'atos-theme', get_stylesheet_uri(), array(), $version );
    wp_enqueue_script( 'atos-site', get_theme_file_uri( 'assets/site.js' ), array(), $version, true );
}
add_action( 'wp_enqueue_scripts', 'atos_assets' );

function atos_options() {
    $saved = get_option( 'atos_options', array() );
    return wp_parse_args( is_array( $saved ) ? $saved : array(), array(
        'whatsapp' => '5511957314749',
        'message' => 'Olá, Leandro! Quero conhecer o ATOS Clientes Locais para divulgar minha empresa.',
        'portrait_id' => 0,
        'logo_id' => 0,
    ) );
}

function atos_sanitize_options( $input ) {
    $old = atos_options();
    if ( ! is_array( $input ) ) { return $old; }
    $phone = preg_replace( '/\D/', '', (string) ( $input['whatsapp'] ?? '' ) );
    if ( ! preg_match( '/^[1-9][0-9]{9,14}$/', $phone ) ) {
        add_settings_error( 'atos_options', 'atos_phone', 'Informe o telefone com código do país e DDD. Exemplo: 5511957314749.' );
        $phone = $old['whatsapp'];
    }
    $message = sanitize_text_field( $input['message'] ?? $old['message'] );
    $clean = array( 'whatsapp' => $phone, 'message' => $message );
    foreach ( array( 'portrait_id', 'logo_id' ) as $key ) {
        $id = absint( $input[ $key ] ?? 0 );
        $clean[ $key ] = $id && wp_attachment_is_image( $id ) ? $id : 0;
    }
    return $clean;
}

function atos_settings_init() {
    register_setting( 'atos_settings', 'atos_options', array(
        'type' => 'array', 'sanitize_callback' => 'atos_sanitize_options', 'default' => array(),
    ) );
}
add_action( 'admin_init', 'atos_settings_init' );

function atos_admin_menu() {
    add_theme_page( 'Configurar ATOS', 'Configurar ATOS', 'manage_options', 'atos-settings', 'atos_settings_page' );
}
add_action( 'admin_menu', 'atos_admin_menu' );

function atos_admin_assets( $hook ) {
    if ( 'appearance_page_atos-settings' !== $hook ) { return; }
    wp_enqueue_media();
    wp_enqueue_script( 'atos-admin', get_theme_file_uri( 'assets/admin.js' ), array( 'media-views' ), wp_get_theme()->get( 'Version' ), true );
}
add_action( 'admin_enqueue_scripts', 'atos_admin_assets' );

function atos_settings_page() {
    if ( ! current_user_can( 'manage_options' ) ) { return; }
    $o = atos_options();
    ?>
    <div class="wrap">
      <h1>Configurar ATOS</h1>
      <p>O contato e as imagens abaixo são utilizados em toda a página. Para editar os textos, use Aparência → Editor → Modelos → Página inicial.</p>
      <?php settings_errors( 'atos_options' ); ?>
      <form method="post" action="options.php">
        <?php settings_fields( 'atos_settings' ); ?>
        <table class="form-table" role="presentation">
          <tr><th scope="row"><label for="atos-whatsapp">WhatsApp</label></th><td>
            <input class="regular-text" id="atos-whatsapp" name="atos_options[whatsapp]" inputmode="tel" type="text" value="<?php echo esc_attr( $o['whatsapp'] ); ?>" required>
            <p class="description">Inclua país e DDD, apenas números. Contato atual: 55 11 95731-4749.</p>
          </td></tr>
          <tr><th scope="row"><label for="atos-message">Mensagem inicial</label></th><td>
            <input class="large-text" id="atos-message" name="atos_options[message]" type="text" value="<?php echo esc_attr( $o['message'] ); ?>">
          </td></tr>
          <?php foreach ( array( 'portrait_id' => 'Foto de Leandro', 'logo_id' => 'Logomarca para fundo escuro' ) as $key => $label ) : ?>
          <tr><th scope="row"><?php echo esc_html( $label ); ?></th><td>
            <input type="hidden" id="atos-<?php echo esc_attr( $key ); ?>" name="atos_options[<?php echo esc_attr( $key ); ?>]" value="<?php echo esc_attr( $o[ $key ] ); ?>">
            <div id="preview-<?php echo esc_attr( $key ); ?>" style="max-width:240px;margin-bottom:12px">
              <?php if ( $o[ $key ] ) { echo wp_get_attachment_image( $o[ $key ], 'medium', false, array( 'style' => 'max-width:100%;height:auto' ) ); } ?>
            </div>
            <button class="button atos-select-image" type="button" data-field="<?php echo esc_attr( $key ); ?>">Escolher imagem</button>
            <button class="button atos-clear-image" type="button" data-field="<?php echo esc_attr( $key ); ?>">Usar padrão</button>
            <p class="description"><?php echo 'portrait_id' === $key ? 'Prefira uma foto vertical, com o rosto centralizado. Sem foto cadastrada, aparece uma composição gráfica ATOS.' : 'Sem imagem cadastrada, será utilizada a logomarca ATOS incluída no tema.'; ?></p>
          </td></tr>
          <?php endforeach; ?>
        </table>
        <?php submit_button( 'Salvar configurações' ); ?>
      </form>
      <p><a class="button" href="<?php echo esc_url( home_url( '/' ) ); ?>" target="_blank" rel="noopener">Ver a página inicial</a></p>
    </div>
    <?php
}

function atos_cta_shortcode( $attributes ) {
    $a = shortcode_atts( array( 'label' => 'Conversar com Leandro', 'style' => '', 'small' => '' ), $attributes, 'atos_cta' );
    $o = atos_options();
    $phone = preg_replace( '/\D/', '', $o['whatsapp'] );
    $url = 'https://wa.me/' . $phone . '?text=' . rawurlencode( $o['message'] );
    $style = in_array( $a['style'], array( 'dark', 'outline' ), true ) ? $a['style'] : '';
    $class = 'atos-button ' . $style . ( $a['small'] ? ' small' : '' );
    return '<div class="atos-cta-wrap"><a class="' . esc_attr( trim( $class ) ) . '" href="' . esc_url( $url ) . '" target="_blank" rel="noopener noreferrer" data-atos-cta="' . esc_attr( $a['label'] ) . '">' . esc_html( $a['label'] ) . '<span class="screen-reader-text"> (abre o WhatsApp em outra aba)</span></a></div>';
}
add_shortcode( 'atos_cta', 'atos_cta_shortcode' );

function atos_portrait_shortcode( $attributes ) {
    $a = shortcode_atts( array( 'priority' => '' ), $attributes, 'atos_portrait' );
    $o = atos_options();
    if ( $o['portrait_id'] && wp_attachment_is_image( $o['portrait_id'] ) ) {
        $props = array( 'alt' => 'Leandro Gomes, fundador da ATOS Gestão de Tráfego', 'decoding' => 'async', 'loading' => $a['priority'] ? 'eager' : 'lazy' );
        if ( $a['priority'] ) { $props['fetchpriority'] = 'high'; }
        return '<figure class="atos-portrait">' . wp_get_attachment_image( $o['portrait_id'], 'large', false, $props ) . '</figure>';
    }
    return '<div class="portrait-placeholder" role="img" aria-label="Composição gráfica ATOS"><span class="orbit" aria-hidden="true"></span><span class="monogram" aria-hidden="true">A</span></div>';
}
add_shortcode( 'atos_portrait', 'atos_portrait_shortcode' );

function atos_brand_shortcode() {
    $o = atos_options();
    $img = $o['logo_id'] ? wp_get_attachment_image( $o['logo_id'], 'medium', false, array( 'alt' => 'ATOS Gestão de Tráfego', 'loading' => 'eager' ) ) : '';
    if ( ! $img ) {
        $img = '<img src="' . esc_url( get_theme_file_uri( 'assets/atos-logo-escuro.png' ) ) . '" width="2048" height="819" alt="ATOS Gestão de Tráfego" decoding="async">';
    }
    return '<a class="atos-brand" href="' . esc_url( home_url( '/' ) ) . '" aria-label="ATOS — página inicial">' . $img . '</a>';
}
add_shortcode( 'atos_brand', 'atos_brand_shortcode' );

function atos_nav_shortcode() {
    $links = array( 'entregas' => 'O que você recebe', 'metodo' => 'Método ATOS', 'sobre' => 'Sobre', 'investimento' => 'Investimento' );
    $html = '<nav class="atos-nav-links" aria-label="Navegação principal">';
    foreach ( $links as $anchor => $label ) {
        $html .= '<a href="' . esc_url( home_url( '/#' . $anchor ) ) . '">' . esc_html( $label ) . '</a>';
    }
    return $html . '</nav>';
}
add_shortcode( 'atos_nav', 'atos_nav_shortcode' );

function atos_privacy_shortcode() {
    $url = get_privacy_policy_url();
    return $url ? '<a href="' . esc_url( $url ) . '">Política de privacidade</a>' : '';
}
add_shortcode( 'atos_privacy', 'atos_privacy_shortcode' );

function atos_skip_link() {
    echo '<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>';
}
add_action( 'wp_body_open', 'atos_skip_link' );

function atos_meta_description() {
    if ( ! is_front_page() ) { return; }
    // Evita duplicação com plugins de SEO conhecidos.
    if ( defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' ) || defined( 'AIOSEO_VERSION' ) || defined( 'SEOPRESS_VERSION' ) ) { return; }
    echo '<meta name="description" content="Tráfego pago e conteúdo para negócios locais. Conheça o ATOS Clientes Locais: planejamento, gestão de anúncios e oito conteúdos mensais.">' . "\n";
}
add_action( 'wp_head', 'atos_meta_description', 2 );
