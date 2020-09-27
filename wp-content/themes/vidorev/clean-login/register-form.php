<?php
	if ( ! defined( 'ABSPATH' ) ) exit; 
	
	if(get_option('users_can_register')){
?>

		<div class="cleanlogin-container cleanlogin-full-width">
            <form class="cleanlogin-form" method="post" action="#">
                <fieldset>
        
                    <?php do_action("cleanlogin_before_register_form"); ?>
                    <?php /*check if 'Name and surname' is checked */ if ( get_option( 'cl_nameandsurname' ) == 'on' ) : ?>
                        <div class="cleanlogin-field">
                            <input class="cleanlogin-field-name" type="text" name="first_name" value="" placeholder="<?php echo esc_attr__( 'First name', 'vidorev' ); ?>">
                        </div>
                        <div class="cleanlogin-field">
                            <input class="cleanlogin-field-surname" type="text" name="last_name" value="" placeholder="<?php echo esc_attr__( 'Last name', 'vidorev' ); ?>">
                        </div>
                    <?php endif; ?>
                    
                    <?php /*check if email as username is checked */ if ( get_option( 'cl_email_username' ) != 'on' ) : ?>
                        <div class="cleanlogin-field">
                            <input class="cleanlogin-field-username" type="text" name="username" value="" placeholder="<?php echo esc_attr__( 'Username', 'vidorev' ); ?>">
                        </div>
                    <?php endif; ?>
                    
                    <div class="cleanlogin-field">
                        <input class="cleanlogin-field-email" type="email" name="email" value="" placeholder="<?php echo esc_attr__( 'E-mail', 'vidorev' ); ?>">
                    </div>
        
                    <div class="cleanlogin-field-website">
                        <label for='website'>Website</label>
                        <input type='text' name='website' value=".">
                    </div>
        
                    <div class="cleanlogin-field">
                        <input class="cleanlogin-field-password" type="password" name="pass1" value="" autocomplete="off" placeholder="<?php echo esc_attr__( 'New password', 'vidorev' ); ?>">
                    </div>
        
                    <?php /*check if single password is checked */ if ( get_option( 'cl_single_password' ) != 'on' ) : ?>
                        <div class="cleanlogin-field">
                            <input class="cleanlogin-field-password" type="password" name="pass2" value="" autocomplete="off" placeholder="<?php echo esc_attr__( 'Confirm password', 'vidorev' ); ?>">
                        </div>
                    <?php endif; ?>
        
                    <?php /*check if captcha is checked */ if ( get_option( 'cl_antispam' ) == 'on') : ?>
                        <div class="cleanlogin-field">
                            <img src="<?php echo CLEAN_LOGIN_CAPTCHA_URL; ?>"/>
                            <input class="cleanlogin-field-spam" type="text" name="captcha" value="" autocomplete="off" placeholder="<?php echo esc_attr__( 'Type the text above', 'vidorev' ); ?>">
                        </div>
                    <?php endif; ?>
                    <?php /*check if captcha is checked */ if ( get_option( 'cl_gcaptcha' ) == 'on') : ?>
                        <?php gcaptcha_script(); ?>
                        <div class="cleanlogin-field">
                            <div class="g-recaptcha" data-sitekey="<?php echo get_option( 'cl_gcaptcha_sitekey' ) ?>"></div>
                        </div>
                    <?php endif; ?>
                    <?php /*check if custom roles is checked */ if ( get_option( 'cl_chooserole' ) == 'on' ) : ?>
                        <?php if ($param['role']) : ?>
                        <input type="text" name="role" value="<?php echo esc_attr($param['role']); ?>" hidden >
                        <?php else : ?>
                        <div class="cleanlogin-field cleanlogin-field-role" <?php if ( get_option( 'cl_antispam' ) == 'on' || get_option( 'cl_gcaptcha' ) == 'on' ) echo 'style="margin-top: 46px;"'; ?> >
                            <span><?php echo esc_html__( 'Choose your role:', 'vidorev' ); ?></span>
                            <select name="role" id="role">
                                <?php
                                $newuserroles = get_option ( 'cl_newuserroles' );
                                global $wp_roles;
                                foreach($newuserroles as $role){
                                    echo '<option value="'.$role.'">'. translate_user_role( $wp_roles->roles[ $role ]['name'] ) .'</option>';
                                }
                                ?>
                            </select>
                        </div>
                        <?php endif; ?>
                    <?php endif; ?>
        
                    <?php /*check if termsconditions is checked */ if ( get_option( 'cl_termsconditions' ) == 'on' ) : ?>
                        <div class="cleanlogin-field">
                            <label class="cleanlogin-terms">
                                <input name="termsconditions" type="checkbox" id="termsconditions">
                                <a href="<?php echo clean_login_get_translated_option_page( 'cl_termsconditionsURL' ); ?>" target="_blank"><?php echo get_option( 'cl_termsconditionsMSG' ); ?></a>
                            </label>
                        </div>
                    <?php endif; ?>
        
                    <input type="hidden" name="clean_login_wpnonce" value="<?php echo wp_create_nonce( 'clean_login_wpnonce' ); ?>">
        
                    <?php do_action("cleanlogin_after_register_form"); ?>
                </fieldset>
        
                <div>
                    <input type="submit" value="<?php echo esc_attr__( 'Register', 'vidorev' ); ?>" name="btn-submit" onclick="this.form.submit(); this.disabled = true;">
                    <input type="hidden" name="action" value="register">
                </div>
        
            </form>
        </div>
<?php
	}else{
		?>
		<div class="cleanlogin-notification error"><p><?php echo esc_html__('User registration is currently not allowed.', 'vidorev')?></p></div>
		<?php
	}
?>	