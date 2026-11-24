<?php
/** Executado pelo WP-CLI no ambiente de teste do GitHub Actions. */
$fail = function( $message ) { WP_CLI::error( $message ); };
if ( ! wp_is_block_theme() ) { $fail( 'O tema não foi reconhecido como tema de blocos.' ); }
$template = get_block_template( get_stylesheet() . '//front-page', 'wp_template' );
if ( ! $template ) { $fail( 'Modelo de página inicial ausente.' ); }
$html = do_shortcode( do_blocks( $template->content ) );
foreach ( array( 'Sua empresa precisa ser encontrada', 'R$ 2.500', '5511957314749', 'não são atribuídos a uma campanha específica' ) as $text ) {
    if ( false === strpos( $html, $text ) ) { $fail( 'Conteúdo ausente: ' . $text ); }
}
if ( 11 !== substr_count( $html, '<section ' ) ) { $fail( 'Quantidade de seções incorreta.' ); }
if ( 8 !== substr_count( $html, '<details ' ) ) { $fail( 'Quantidade de FAQs incorreta.' ); }
if ( preg_match( '/\[atos_/', $html ) ) { $fail( 'Shortcode sem renderizar.' ); }
foreach ( parse_blocks( $template->content ) as $block ) {
    if ( $block['blockName'] && ! WP_Block_Type_Registry::get_instance()->is_registered( $block['blockName'] ) ) {
        $fail( 'Bloco desconhecido: ' . $block['blockName'] );
    }
}
$options = atos_options();
if ( '5511957314749' !== $options['whatsapp'] ) { $fail( 'Contato padrão incorreto.' ); }
$sanitized = atos_sanitize_options( array( 'whatsapp' => '55 (11) 95731-4749', 'message' => '<script>x</script>Olá', 'portrait_id' => 999999, 'logo_id' => 999999 ) );
if ( '5511957314749' !== $sanitized['whatsapp'] || 0 !== $sanitized['portrait_id'] || str_contains( $sanitized['message'], '<script>' ) ) {
    $fail( 'Sanitização inválida.' );
}
$old = $options;
update_option( 'atos_options', array_merge( $old, array( 'whatsapp' => '5511988887777' ) ) );
if ( false === strpos( do_shortcode( '[atos_cta label="Teste"]' ), '5511988887777' ) ) { $fail( 'Alteração do WhatsApp não aplicada.' ); }
update_option( 'atos_options', $old );
if ( str_contains( do_shortcode( '[atos_cta label="&lt;script&gt;teste&lt;/script&gt;"]' ), '<script>' ) ) { $fail( 'Rótulo não escapado.' ); }
WP_CLI::success( 'Modelo WordPress, shortcodes, contato e sanitização verificados.' );
