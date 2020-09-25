<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'fedwordpress_db' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', '' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'u|>HT79}A4sd),-qU]$thWVLdB/bI^5k=,NeA2Mu0P-&_7`Ln.E<BiD38e3ESaLe' );
define( 'SECURE_AUTH_KEY',  'WdcL6Ql_O3g/}^%5JQH j$N+LvNMHdo@6OC[Q#xr^aq(T/vL@V0kY}8<nHfZU_]:' );
define( 'LOGGED_IN_KEY',    'Ii5p#^~?&uw/4y>^0s_``m[~o<wjyYn3VifQkB_QH0`ImozcTez,@&z/z9%_KI1J' );
define( 'NONCE_KEY',        '`LiP%vsV!Qt+N{||;s@!{}rS Bw;pw[zxh*nXe8?o1b] m;Fc>r1^bx_5&cu*tn)' );
define( 'AUTH_SALT',        'sCcDX?^P3TzwoJF33>Q-@.yCl;ZOkYRK-AN$oNEv-|fXs4:%$6{JH~$?;F;[T#E$' );
define( 'SECURE_AUTH_SALT', 'dr&@[|IA?25P=g|_Bdlm_|q#W_M:lvg:i@cI=5{,W:H=LbN-$uu,g:q2kHpV4:E^' );
define( 'LOGGED_IN_SALT',   'uYa8Q_J>_YfO@&w|f^~%7EQmCe_~bD[:`Tg*R-./?fNO_J/*$rC]hPiR6MY.[2^b' );
define( 'NONCE_SALT',       '.,.=&~@vr0bA2HMjPL9l Zo)D}r=cw;!Y?EM!~%@ArTMOuRSPU:k`o9`Y1:dm2-?' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
