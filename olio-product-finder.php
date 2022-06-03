<?php
/**
 * Plugin Name: olio-product-finder
 * Plugin URI: a url
 * Description: A react application that allows users to find Olio products
 * Version: 0.1
 * Text Domain: olio-product-finder
 * Author: Matt Guthrie
 * Author URI: https://mattguthrie.co
 */



/**
* This function is where we register our routes for our example endpoint.
*/
function handle_get_all( $data ) {
	global $wpdb;
	$tablename = $wpdb->prefix . 'droplist_data';
	$query = "SELECT id, drop_date, dispensary, license, latitude, longitude, street, city, state, zipcode, product, product_line, category, sub_category 
				FROM $tablename
				WHERE drop_date=(SELECT MAX(drop_date) FROM $tablename)";
	$list = $wpdb->get_results($query);
	return $list;
}

/**
* This function is where we register our routes for our example endpoint.
*/
function prefix_register_example_routes() {
  // register_rest_route() handles more arguments but we are going to stick to the basics for now.
  register_rest_route( 'olio-droplist/v2', '/data', array(
	  // By using this constant we ensure that when the WP_REST_Server changes our readable endpoints will work as intended.
	  'methods'  => WP_REST_Server::READABLE,
	  // Here we register our callback. The callback is fired when this endpoint is matched by the WP_REST_Server class.
	  'callback' => 'handle_get_all',
	  // 'permission_callback' => '__return_true',
  ) );
}
add_action( 'rest_api_init', 'prefix_register_example_routes' );


add_action('wp_enqueue_scripts', 'enq_react');
function enq_react()
{
	wp_enqueue_script(
		'plugin-react',
		plugin_dir_url( __FILE__ ) . '/build/index.js',
		['wp-element'],
		rand(), // Change this to null for production
		true
	);
}

function findershort() { 
    return '<div id="olio-finder-app"></div>';
} 
// register shortcode
add_shortcode('olio-finder-app', 'findershort'); 