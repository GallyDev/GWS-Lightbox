<?php
	// this file will be included by GWS-Debugian automatically
	define('GWS_LIGHTBOX_VERSION', '1.0.0');

	add_action('wp_enqueue_scripts', 'gws_lightbox_scripts');
	function gws_lightbox_scripts() {
		wp_enqueue_script( 'gws-lightbox-js', plugin_dir_url( __FILE__ ) . 'js/gws-lightbox.js', array(), GWS_LIGHTBOX_VERSION, true );
		wp_enqueue_style( 'gws-lightbox-css', plugin_dir_url( __FILE__ ) . 'css/style.css', array(), GWS_LIGHTBOX_VERSION );
	}
	