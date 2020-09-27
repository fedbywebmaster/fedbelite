/*
Plugin Name: VidoRev Extensions
Author: BeeTeam368
Author URI: http://themeforest.net/user/beeteam368
Version: 2.9.9.9.6.6
License: Themeforest Licence
License URI: http://themeforest.net/licenses
*/

var vidorev_builder_control = null;

var imdb 	= {};
imdb.rating = {};	
imdb.rating.run = function(values){
	if(typeof(values)==='object' && typeof(values.resource)==='object' && typeof(vidorev_builder_control)!=="undefined" && vidorev_builder_control!==null){	
		vidorev_builder_control.imdb_rating_html(values.resource);		
	}
}

;(function(factory) {
    if(typeof define === 'function' && define.amd){
        define(['jquery'], factory);
    }else if (typeof exports !== 'undefined'){
        module.exports = factory(require('jquery'));
    }else{
        factory(jQuery);
    }
}(function($){
	'use strict';
	
	var prefix = 'vidorev_plugin';		
	var vidorev_plugin = window.vidorev_plugin || {};
	
  	vidorev_plugin = (function(){
		function vidorev_plugin(el, options){
			var _ = this;
			
			_.defaults = {
									
			}
			
			if(typeof(options)==='object'){
				_.options = $.extend({}, _.defaults, options);
			}else{
				_.options = _.defaults;
			}
			
			_.global_youtube_API_ready = false;
			_.global_live_yt_ready = 1;
			
			_.$el = $(el);
			_.init();
		}	
			
		return vidorev_plugin;
	}());	
		
	/*init function [Core]*/
	vidorev_plugin.prototype.init = function(){
		var _ = this;
		
		_.like_action();
		_.shortcode_slider_calc_width();
		_.shortcode_slider();
		_.filter_tab_responsive();
		_.filter_action();
		_.next_paged_action();
		_.imdb_rating_jsonp();
		_.videoPreview();
		_.youtubePreviewBroadcasts();
		_.youtubeBroadcastsPrevNextRefresh();
		_.youtubeBroadcastsTriggerFirstLoad();
		_.vidorev_video_report();
		_.vidorev_channel_subscribe();
		_.vidorev_cf7_select2();
		_.show_more_videos();
		_.get_playlist_by_user_login();
		_.front_end_edit_post();
		_.front_end_delete_post();
		_.series_dropdown_menu();
		_.document_control();
		_.advance_search();
		_.ads_settings();
		_.tmdb_block_render();
		_.youtube_live_video();
		
		_.window_resize();
		_.window_load();
		
		/*init*/		
		_.$el.trigger(prefix+'init', [_]);/*init*/
	}/*init function [Core]*/
	
	vidorev_plugin.prototype.like_action = function(){
		var _ = this;
		
		_.$el.off('.vpLikeAction').on('click.vpLikeAction', '.like-action-control', function(){
			var $t 				= $(this),
				id 				= $.trim($t.attr('data-id')),
				task_action 	= $.trim($t.attr('data-action')),
				$likeaction		= _.$el.find('.like-action-control');
				
			if($t.find('.login-req').length>0){
				return false;
			}	
			
			var data 		= {
				'action': 		'like_action_query',				
				'post_id': 		id,
				'task_action':	task_action,
				'security':		vidorev_jav_js_object.security,					
			}
			
			$likeaction.addClass('loading-ajax');
			$t.addClass('add-load-icon');
			
			$.ajax({
				type: 		'POST',
				url: 		vidorev_jav_js_object.admin_ajax,
				cache: 		false,
				data: 		data,
				dataType: 	'json',
				success: 	function(data, textStatus, jqXHR){
					if(typeof(data) === 'object'){
						if(data.error == 0){
							$likeaction.removeClass('active-item-sub');
							if(data.has_voted==1){
								$('.like-action-control[data-id="'+(id)+'"][data-action="like"]').addClass('active-item-sub');
							}else if(data.has_voted==-1){
								$('.like-action-control[data-id="'+(id)+'"][data-action="dislike"]').addClass('active-item-sub');
							}
							
							$('.like-count[data-id="'+(id)+'"]').text(data.like_count);	
							$('.dislike-count[data-id="'+(id)+'"]').text(data.dislike_count);
							$('.like-count-full[data-id="'+(id)+'"]').text(data.like_count_full.toLocaleString());	
							$('.dislike-count-full[data-id="'+(id)+'"]').text(data.dislike_count_full.toLocaleString());
							
							var likebar_percent = 0;
							if(parseFloat(data.like_count_full) + parseFloat(data.dislike_count_full) == 0 || parseFloat(data.like_count_full) + parseFloat(data.dislike_count_full) < 0){
								likebar_percent = 0;
							}else{
								likebar_percent = parseFloat(data.like_count_full) / (parseFloat(data.like_count_full) + parseFloat(data.dislike_count_full)) * 100;
							}		
							$('.like-dislike-bar-percent-control').css({'width':(likebar_percent)+'%'});						
						}else{
							$('body').trigger('vidorev_like_dislike_error', [$t, task_action, $likeaction, data]);
						}
						
						$likeaction.removeClass('loading-ajax');
						$t.removeClass('add-load-icon');
					}
				},
				error: function( jqXHR, textStatus, errorThrown ){
				}
			});
		});		
	}
	
	vidorev_plugin.prototype.window_load = function(){
		var _ = this;
		$(window).on('load', function(){
			
			/*action*/
			/*action*/
			
		});
	}
	
	vidorev_plugin.prototype.document_control = function(){
		var _ = this;
		$(document).on('click', function(e){			
			var $target = $(e.target);
			if(!$target.closest('.series-dropdown-control').length && $('.series-dropdown-control').is(":visible")) {
				$('.series-dropdown-control').removeClass('active-item');
			}        
		});
	}
	
	vidorev_plugin.prototype.window_resize = function(){
		var _ 				= this,
			default_width 	= window.innerWidth;
			
		$(window).on('resize', function(){
			if(default_width === window.innerWidth){
				return;
			}
			
			/*action*/
			_.shortcode_slider_calc_width();
			/*action*/
			
			default_width 	= window.innerWidth;
		});
	}
	
	vidorev_plugin.prototype.shortcode_slider_calc_width = function(){
		var _ = this;
		
		var $fs = $('body.main-layout-boxed .page-slider-header.full-width-slider'),		
			wW 	= window.innerWidth,
			w	= $(window).width();
		
		if(wW >= 576 && wW < 768){
			$fs.css({'margin-left':((540-w)/2)+'px', 'margin-right':((540-w)/2)+'px', 'max-width':(w)+'px'});
		}else if(wW >= 768 && wW < 992){
			$fs.css({'margin-left':((720-w)/2)+'px', 'margin-right':((720-w)/2)+'px', 'max-width':(w)+'px'});
		}else if(wW >= 992 && wW < 1200){
			$fs.css({'margin-left':((930-w)/2)+'px', 'margin-right':((930-w)/2)+'px', 'max-width':(w)+'px'});
		}else if(wW>=1200){
			$fs.css({'margin-left':((1140-w)/2)+'px', 'margin-right':((1140-w)/2)+'px', 'max-width':(w)+'px'});
		}else{
			$fs.css({'margin-left':'0', 'margin-right':'0', 'max-width':'none'});
		}
	}
	
	vidorev_plugin.prototype.shortcode_slider = function(){
		var _ = this;
		
		_.$el.find('.is-shortcode-slider:not(.ready-setup)').each(function(index, element){
			var $t 		= $(this),
				p 		= $.parseJSON($t.attr('data-params')),
				$sync 	= $('.'+(p['rnd_class'])).find('.sync-slider-small-control');
			
			$t.addClass('ready-setup');
			
			var options = {
				arrows:false,
				dots: false,
				infinite: true,
				speed: 500,
				slidesToShow: 1,
				adaptiveHeight: true,
				focusOnSelect: false,
				prevArrow: '<button class="slick-prev slick-arrow" aria-label="Previous" type="button"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
				nextArrow: '<button class="slick-next slick-arrow" aria-label="Next" type="button"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
			};
			
			if(p['fade']=='yes'){
				options['fade'] = true;
			}
			
			if(p['arrows']){
				options['arrows'] = true;
			}
			
			if(p['dots']){
				options['dots'] = true;
			}
			
			if(p['autoplay']!=0 && parseFloat(p['autoplay'])>0){
				options['autoplay'] = true;
				options['autoplaySpeed'] = p['autoplay'];
			}
			
			switch(p['layout']){
				case 'slider-1':
					if($t.find('.slide-item').length<2){
						return;
					}					
					break;
				
				case 'slider-2':
					if($t.find('.slide-item').length<2){
						return;
					}	
					break;
					
				case 'slider-3':
					break;	
					
				case 'slider-4':
					options['asNavFor'] = $sync;					
					break;
					
				case 'slider-5':
					options['slidesToShow'] 	= 3;
					options['centerMode'] 		= true;
					options['centerPadding'] 	= '15%';
					options['responsive'] = [
						{
							breakpoint: 2181,
							settings: {
								slidesToShow: 	2,
								centerPadding: '18%',
							}
						},
						{
							breakpoint: 1601,
							settings: {
								slidesToShow: 	2,
								centerPadding: '15%',
							}
						},
						{
							breakpoint: 1025,
							settings: {
								slidesToShow: 	2,
								centerPadding: '80px',
							}
						},
						{
							breakpoint: 992,
							settings: {
								slidesToShow: 	2,
								centerPadding: '60px',
							}
						},
						{
							breakpoint: 768,
							settings: {
								slidesToShow: 	1,
								centerPadding: '40px',
							}
						},
						{
							breakpoint: 481,
							settings: {
								slidesToShow: 	1,
								centerPadding: '15px',
							}
						},
					];
					break;
					
				case 'slider-6':
					options['slidesToShow'] 	= 4;
					options['slidesToScroll'] 	= 4;
					options['responsive'] = [
						{
							breakpoint: 1200,
							settings: {
								slidesToShow: 	3,
								slidesToScroll:	3,								
							}
						},
						{
							breakpoint: 992,
							settings: {
								slidesToShow: 	2,
								slidesToScroll: 2,								
							}
						},
						{
							breakpoint: 576,
							settings: {
								slidesToShow: 	1,
								slidesToScroll: 1,								
							}
						},					
					];
					
					if(_.$el.hasClass('fullwidth-mode-enable')){
						options['slidesToShow'] 	= 6;
						options['slidesToScroll'] 	= 6;
						options['responsive'] = [
							{
								breakpoint: 2000,
								settings: {
									slidesToShow: 	5,
									slidesToScroll:	5,								
								}
							},
							{
								breakpoint: 1580,
								settings: {
									slidesToShow: 	4,
									slidesToScroll:	4,								
								}
							},
							{
								breakpoint: 1200,
								settings: {
									slidesToShow: 	3,
									slidesToScroll:	3,								
								}
							},
							{
								breakpoint: 992,
								settings: {
									slidesToShow: 	2,
									slidesToScroll: 2,								
								}
							},
							{
								breakpoint: 576,
								settings: {
									slidesToShow: 	1,
									slidesToScroll: 1,								
								}
							},					
						];
					}
					break;
					
				case 'slider-7':
					break;
					
				case 'slider-8':
					options['slidesToShow'] 	= 3;
					options['responsive'] = [
						{
							breakpoint: 1200,
							settings: {
								slidesToShow: 	2,							
							}
						},						
						{
							breakpoint: 768,
							settings: {
								slidesToShow: 	1,
								slidesToScroll: 1,								
							}
						},					
					];
					
					if(_.$el.hasClass('fullwidth-mode-enable')){
						options['slidesToShow'] 	= 5;
						options['responsive'] = [
							{
								breakpoint: 2000,
								settings: {
									slidesToShow: 	4,								
								}
							},
							{
								breakpoint: 1580,
								settings: {
									slidesToShow: 	3,								
								}
							},
							{
								breakpoint: 1200,
								settings: {
									slidesToShow: 	2,							
								}
							},						
							{
								breakpoint: 768,
								settings: {
									slidesToShow: 	1,
									slidesToScroll: 1,								
								}
							},					
						];
					}
					break;
				case 'slider-9':
					$t.mCustomScrollbar({			
						axis: 'x',
						alwaysShowScrollbar:0,
						scrollInertia: 120,
					});
					return;	
					break;
					
				case 'slider-10':
					if($t.find('.slide-item').length<2){
						return;
					}					
					break;							
			}
			
			$t.on('init', function(event, slick){
				if(p['layout']==='slider-4'){
					_.$el.on('vidorev_themeside_menu_action', function(e){
						$t.slick('reinit');
						_.$el.off('vidorev_themeside_menu_action');
						console.log('Resize Slider');
					});
				}
			});
			
			$t.find('img.ul-normal-effect').addClass('img-effect-setup img-loaded');
			$t.slick(options);
			
			if($sync.length > 0){
			
				$sync.find('img.ul-normal-effect').addClass('img-effect-setup img-loaded');
				
				var opt_small_sync_slider = {
					slidesToShow: 4,
					slidesToScroll: 1,
					asNavFor: $t,
					arrows:false,
					dots: false,
					focusOnSelect: true,
					responsive:[						
						{
							breakpoint: 1200,
							settings: {
								slidesToShow: 	3,
								slidesToScroll:	1,								
							}
						},
						{
							breakpoint: 992,
							settings: {
								slidesToShow: 	2,
								slidesToScroll: 1,								
							}
						},
						{
							breakpoint: 576,
							settings: {
								slidesToShow: 	1,
								slidesToScroll: 1,
								centerMode: true,								
							}
						},					
					]
				}
				
				if(_.$el.hasClass('fullwidth-mode-enable')){
					opt_small_sync_slider.slidesToShow = 6;
					opt_small_sync_slider.responsive = [
						{
							breakpoint: 2000,
							settings: {
								slidesToShow: 	5,
								slidesToScroll:	1,								
							}
						},
						{
							breakpoint: 1580,
							settings: {
								slidesToShow: 	4,
								slidesToScroll:	1,								
							}
						},
						{
							breakpoint: 1200,
							settings: {
								slidesToShow: 	3,
								slidesToScroll:	1,								
							}
						},
						{
							breakpoint: 992,
							settings: {
								slidesToShow: 	2,
								slidesToScroll: 1,								
							}
						},
						{
							breakpoint: 576,
							settings: {
								slidesToShow: 	1,
								slidesToScroll: 1,
								centerMode: true,								
							}
						},					
					];
				}
				
				$sync.slick(opt_small_sync_slider);
				
			}
		});

	}
	
	vidorev_plugin.prototype.filter_tab_responsive = function(){
		var _ = this;
		
		$('.filter-container-control:not(.ready-setup)').each(function(index, element) {
			var $t 			= $(this),
				elm_index 	= 'priority-wrapper-index-'+index+'rnd'+(Math.floor((Math.random() * 999) + 1)),
				title_width	= 0;

			$t.addClass('ready-setup').attr('id', elm_index);
			
			var $elm_index	= $('#'+(elm_index)),
				css			= '';
				
			$('<style id="css-'+elm_index+'" type="text/css"></style>').appendTo('head');
			
			title_width	= $elm_index.find('.block-title-control').outerWidth(true) + 60;
			css = '#'+elm_index+' .filter-items-control{min-width:calc(100% - '+title_width+'px); min-width:-webkit-calc(100% - '+title_width+'px); min-width:-ms-calc(100% - '+title_width+'px); min-width:-moz-calc(100% - '+title_width+'px);}}';				
			$('#css-'+elm_index).html(css);	
			
			var nav = priorityNav.init({
				mainNavWrapper				: '#'+(elm_index)+' .filter-items-control',
				mainNav						: '.filter-items-wrapper-control',
				navDropdownLabel			: '<span class="responsive-button"></span><span class="responsive-line"></span>',
				navDropdownBreakpointLabel	: '<span class="responsive-button"></span><span class="responsive-line"></span>',
				navDropdownClassName		: 'nav__dropdown',
				navDropdownToggleClassName	: 'nav__dropdown-toggle',	
				breakPoint					: 0,				
			});				

		});
	}
	
	vidorev_plugin.prototype.filter_action = function(){
		var _ = this;
		
		_.$el.off('.filterActionControl').on('click.filterActionControl', '.filter-action-control', function(e){
			var $t 			= $(this),
				$parent		= $t.parents('.sc-blocks-container-control'),
				idParams	= $.trim($parent.attr('data-id')),
				$nextAction = $parent.find('.next-prev-action[data-action="next"]'),
				$prevAction = $parent.find('.next-prev-action[data-action="prev"]'),
				$pnControl	= $parent.find('.bl-page-prev-next-control');
			
			if(idParams!='' && typeof(vidorev_layouts_query_params)!=='undefined' && typeof(vidorev_layouts_query_params[idParams]!=='undefined')){	
				var params = vidorev_layouts_query_params[idParams];	
				
					params['data_ajax'] = 'yes';
					params['filter'] 	= $.trim($t.attr('data-id'));
					params['tax'] 		= $.trim($t.attr('data-taxonomy'));
					params['paged'] 	= 1;
					
				if(params['filter']=='' || params['tax']==''){
					return false;
				}
				
				$parent.addClass('container-loading').find('.filter-action-control').removeClass('active-item');
				$t.addClass('active-item');
				
				if($('.nav__dropdown.show', $parent).length>0 || $('.nav__dropdown-toggle.is-open', $parent).length>0){
					$('.nav__dropdown.show', $parent).removeClass('show');
					$('.nav__dropdown-toggle.is-open', $parent).removeClass('is-open');
				}
				
				if($('.blog-wrapper-control[data-item="'+(params['filter'])+'"]', $parent).length>0){
					setTimeout(function(){
						
						$parent.find('.blog-wrapper-control').removeClass('active-item');
						
						$('.blog-wrapper-control[data-item="'+(params['filter'])+'"].current-paged', $parent).addClass('active-item');
						
						if($('.blog-wrapper-control[data-item="'+(params['filter'])+'"][data-end="yes"]', $parent).length>0 && $('.blog-wrapper-control[data-item="'+(params['filter'])+'"]', $parent).length==1){
							
							$pnControl.hide();
							
						}else{
							
							var $block_active_check = $('.blog-wrapper-control[data-item="'+(params['filter'])+'"].active-item.current-paged', $parent);
							
							if($block_active_check.attr('data-end') == 'yes'){
								
								$nextAction.addClass('disabled-query');
								
							}else{
								
								$nextAction.removeClass('disabled-query');
								
							}
							
							if($block_active_check.attr('data-paged') == '1'){
								
								$prevAction.addClass('disabled-query');
								
							}else{
								
								$prevAction.removeClass('disabled-query');
								
							}
							
							$pnControl.show();
						}
						
						$parent.removeClass('container-loading');
						
					}, 500);
															
					return false;
				}	
				
				var paramsRequest = {
					'params':		params,				
					'action':		'blockajaxaction',
					'security':		vidorev_jav_js_object.security,	
				};
				
				$.ajax({
					url:		vidorev_jav_js_object.admin_ajax,						
					type: 		'POST',
					data:		paramsRequest,
					dataType: 	'html',
					cache:		false,
					success: 	function(data){
						
						$parent.find('.blog-wrapper-control').removeClass('active-item');						
						$parent.find('.block-filter-control').append(data);
						
						var dataEnd = $parent.find('.blog-wrapper-control[data-item="'+(params['filter'])+'"].current-paged').attr('data-end');	
						
						if(typeof(vidorev_builder_control)!=="undefined" && vidorev_builder_control!==null){	
							vidorev_builder_control.imdb_rating_jsonp();		
						}
						
						if(typeof(window.vidorev_visible_image_opacity) !== 'undefined'){
							window.vidorev_visible_image_opacity();
						}
											
						if(dataEnd=='yes' || data==''){
							
							$pnControl.hide();
							
						}else{
							
							$pnControl.show();
							
						}
						
						$parent.find('.next-prev-action[data-action="prev"]').addClass('disabled-query');	
						$parent.find('.next-prev-action[data-action="next"]').removeClass('disabled-query');
											
						$parent.removeClass('container-loading');						
						
					},
					error:		function(){
						
						$parent.removeClass('container-loading');
						
					},
				});
			}
		});
	}
	
	vidorev_plugin.prototype.next_paged_action = function(){
		var _ = this;
		
		_.$el.off('.nextPagedAction').on('click.nextPagedAction', '.next-prev-action', function(e){
			var $t 			= $(this),
				$parent		= $t.parents('.sc-blocks-container-control'),
				idParams	= $.trim($parent.attr('data-id')),
				$nextAction = $parent.find('.next-prev-action[data-action="next"]'),
				$prevAction = $parent.find('.next-prev-action[data-action="prev"]');
			
			if(idParams!='' && typeof(vidorev_layouts_query_params)!=='undefined' && typeof(vidorev_layouts_query_params[idParams]!=='undefined')){	
				var params = vidorev_layouts_query_params[idParams];	
				
					params['data_ajax'] = 'yes';
					params['filter'] 	= $.trim($parent.find('.filter-action-control.active-item').attr('data-id'));
					params['tax'] 		= $.trim($parent.find('.filter-action-control.active-item').attr('data-taxonomy'));
					
				if(params['filter']=='' || params['tax']==''){
					params['filter'] 	= '0';
					params['tax']		= 'all';
				}
				
				$parent.addClass('container-loading');
				
				if($('.nav__dropdown.show', $parent).length>0 || $('.nav__dropdown-toggle.is-open', $parent).length>0){
					$('.nav__dropdown.show', $parent).removeClass('show');
					$('.nav__dropdown-toggle.is-open', $parent).removeClass('is-open');
				}
				
				var current_paged 	= 1;
				var $current_paged 	= $parent.find('.blog-wrapper-control[data-item="'+(params['filter'])+'"].current-paged');
				
				if($current_paged.length>0){
					current_paged = parseFloat($current_paged.attr('data-paged'));
				}
				
				var f_paged = 1;
				
				if($.trim($t.attr('data-action'))=='next'){
					f_paged = current_paged + 1;
				}else{					
					f_paged = current_paged - 1;
				}
				
				var $f_paged 			= $('.blog-wrapper-control[data-item="'+(params['filter'])+'"][data-paged="'+(f_paged)+'"]', $parent);
				var $paged_in_filter 	= $('.blog-wrapper-control[data-item="'+(params['filter'])+'"]', $parent);
				
				if($f_paged.length>0){
					
					setTimeout(function(){
						$paged_in_filter.removeClass('current-paged');
						$f_paged.addClass('active-item current-paged');
						
						if(f_paged==1){
							$prevAction.addClass('disabled-query');
						}else{
							$prevAction.removeClass('disabled-query');
						}
						
						if($f_paged.attr('data-end')=='yes'){
							$nextAction.addClass('disabled-query');
						}else{
							$nextAction.removeClass('disabled-query');
						}
						
						$parent.removeClass('container-loading');
						
					}, 500);	
														
					return false;
				}
				
				params['paged'] = f_paged;
				
				var paramsRequest = {
					'params':		params,				
					'action':		'blockajaxaction',
					'security':		vidorev_jav_js_object.security,	
				};
				
				$.ajax({
					url:		vidorev_jav_js_object.admin_ajax,						
					type: 		'POST',
					data:		paramsRequest,
					dataType: 	'html',
					cache:		false,
					success: 	function(data){
						
						$paged_in_filter.removeClass('current-paged');						
						$parent.find('.block-filter-control').append(data);
						var dataEnd = $parent.find('.blog-wrapper-control[data-item="'+(params['filter'])+'"].active-item.current-paged').attr('data-end');
						
						if(typeof(vidorev_builder_control)!=="undefined" && vidorev_builder_control!==null){	
							vidorev_builder_control.imdb_rating_jsonp();		
						}
						
						if(typeof(window.vidorev_visible_image_opacity) !== 'undefined'){
							window.vidorev_visible_image_opacity();
						}
						
						if(dataEnd=='yes'){
							$nextAction.addClass('disabled-query');
						}
						
						$prevAction.removeClass('disabled-query');					
						
						$parent.removeClass('container-loading');						
						
					},
					error:		function(){
						
						$parent.removeClass('container-loading');
						
					},
				});
			}
		});
	}
	
	vidorev_plugin.prototype.imdb_rating_jsonp = function(){
		var _ = this;
		$('.imdbRatingPlugin-control:not(.imdbRatingPlugin-ready)').each(function(index, element) {
			
			var $t = $(this);
			
			var dataTitle 	= $.trim($t.attr('data-title'));
			var dataUser	= $.trim($t.attr('data-user'));
			var imdbdata	= $.trim($t.attr('data-imdbdata'));
			
			var fill_immdb_data = function(dataTitle, dataUser){
				$.ajax({
					url:		'//p.media-imdb.com/static-content/documents/v1/title/' + dataTitle + '/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json?u=' + dataUser,						
					type: 		'POST',
					dataType: 	'jsonp',
					cache:		false
				});
			}
			
			if(typeof(dataTitle)!=='undefined' && typeof(dataUser)!=='undefined' && dataTitle!='' && dataUser!=''){
				
				$('.imdbRatingPlugin-control[data-title="'+(dataTitle)+'"]').addClass('imdbRatingPlugin-ready');
				
				if(typeof(imdbdata) !== 'undefined' && imdbdata!=''){
					
					try{
						imdbdata = JSON.parse(imdbdata);
					}catch(error){
						fill_immdb_data(dataTitle, dataUser);
					}	
					
					if(typeof(imdbdata.id)!=='undefined' && imdbdata.id!=''){
						_.imdb_rating_html(imdbdata);
					}else{
						fill_immdb_data(dataTitle, dataUser);
					}
				}else{
					fill_immdb_data(dataTitle, dataUser);
				}
				
			}
			
		});
	}
	
	vidorev_plugin.prototype.imdb_rating_html = function(resource){
		var _ 				= this,
			rating 			= typeof(resource.rating)==='number'?resource.rating:'NA',
			imdb_logo_url 	= vidorev_jav_plugin_js_object.imdb_logo_url;
		
		var imdb_logo 		= '<img class="imdb-logo" src="'+(imdb_logo_url)+'.png" sizes="(max-width: 38px) 100vw, 38px" srcset="'+(imdb_logo_url)+'.png 38w, '+(imdb_logo_url)+'_retina_2x.png 54w, '+(imdb_logo_url)+'_retina_3x.png 101w">'
		
		var html 			= 	'<a href="//www.imdb.com'+(resource.id)+'" target="_blank">'
									+(imdb_logo)+
									'<span class="rating">'+
										'<span class="rating-wrap">'+
											'<span class="rt-point h5">'+(rating)+'</span>'+
											'<span class="ofTen font-size-12">&nbsp;/&nbsp;10</span>'+
										'</span>'+
									'</span>'+
									'<i class="fa fa-star star" aria-hidden="true"></i>'+
								'</a>';
				
		$('.imdbRatingPlugin-control[data-title="'+(resource.id.split('/')[2])+'"]').html(html).addClass('imdbRatingStyle2');
	}
	
	vidorev_plugin.prototype.setYoutubeAPIReady = function(vid_id){
		
		var _ = 			this,
			prefix_vid_id = '';
			
		if(typeof(vid_id)!=='undefined'){
			prefix_vid_id = vid_id;
		}	
		
		setTimeout(function(){
			if($('script[src*="youtube.com/iframe_api"]').length>0 || $('script[src*="www-widgetapi.js"]').length>0){			
			
				var triggerInterval = setInterval(function(){					
					if(typeof(YT)!=='undefined' && typeof(YT.Player)!=='undefined'){
						_.global_youtube_API_ready = true;
						$(document).trigger(prefix+'youtubeAPIReadyPreview'+(prefix_vid_id), []);
						clearInterval(triggerInterval);
					}
				},368);			
				
			}else{
				
				var you_API_YTdeferred = $.Deferred();	
				
				window.onYouTubeIframeAPIReady = function(){
					you_API_YTdeferred.resolve(window.YT);
				}
						
				var tag = document.createElement('script');
				tag.src = "https://www.youtube.com/iframe_api";
				var firstScriptTag = document.getElementsByTagName('script')[0];
				firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
			
				you_API_YTdeferred.done(function(YT){
					_.global_youtube_API_ready = true;
					$(document).trigger(prefix+'youtubeAPIReadyPreview'+(prefix_vid_id), []);					
				});
			}
		},368);	
	}
	
	vidorev_plugin.prototype.youtubeBroadcastsPrevNextRefresh = function(){
		var _ = this;
		
		_.$el.off('.broadcastsPageToken').on('click.broadcastsPageToken', '.next-prev-action', function(e){
			var $t 			= $(this),
				$broadcasts	= $t.parents('.youtube-broadcast-control'),
				broadcastsID= $broadcasts.attr('id'),
				action		= $t.attr('data-action'),
				prevToken 	= $.trim($broadcasts.find('input.prev-page-token-control[type="hidden"]').val()),
				nextToken	= $.trim($broadcasts.find('input.next-page-token-control[type="hidden"]').val()),
				pageToken	= '',
				$wrap_data	= $broadcasts.find('.blog-wrapper-control');
				
			if(action == 'prev'){
				if(prevToken == ''){
					return false;
				}
				
				pageToken = prevToken;
				
			}else if(action == 'next'){
				if(nextToken == ''){
					return false;
				}
				
				pageToken = nextToken;
			}
			
			if(pageToken == ''){
				return false;
			}
			
			if(typeof(vidorev_jav_plugin_js_object)==='undefined'){
				return false;
			}
			
			if(typeof(vidorev_jav_plugin_js_object.youtube_broadcasts_params)==='undefined'){
				return false;
			}
			
			if(typeof(vidorev_jav_plugin_js_object.youtube_broadcasts_params[broadcastsID])==='undefined'){
				return false;
			}			
			
			var params = vidorev_jav_plugin_js_object.youtube_broadcasts_params[broadcastsID];
			
			if(typeof(params)!=='object'){
				return false;
			}
			
			$broadcasts.addClass('container-loading');
			
			params['pageToken'] = pageToken;
			params['ajax'] = true;
			
			var newParamsRequest = {
				'action':		'vidorev_request_pagetoken_youtube_broadcasts',
				'params':		params,
				'security':		vidorev_jav_js_object.security,	
			}
			
			$.ajax({
				url: 		vidorev_jav_js_object.admin_ajax,
				type: 		'POST',
				cache: 		false,
				dataType: 	'html',
				data:		newParamsRequest,
				success: 	function(data){
					
					if($.trim(data)==''){
						$broadcasts.find('.next-prev-action[data-action="prev"]').removeClass('disabled-query');
						$broadcasts.find('.next-prev-action[data-action="next"]').addClass('disabled-query');
						
						$broadcasts.removeClass('container-loading cache-load-fist');
						return false;
					}
					
					$wrap_data.html(data);
					
					prevToken 	= $.trim($broadcasts.find('input.prev-page-token-control[type="hidden"]').val());
					nextToken	= $.trim($broadcasts.find('input.next-page-token-control[type="hidden"]').val());
					
					if(typeof(prevToken)!=='undefined' && prevToken!=''){
						$broadcasts.find('.next-prev-action[data-action="prev"]').removeClass('disabled-query');
					}else{
						$broadcasts.find('.next-prev-action[data-action="prev"]').addClass('disabled-query');
					}	
					
					if(typeof(nextToken)!=='undefined' && nextToken!=''){
						$broadcasts.find('.next-prev-action[data-action="next"]').removeClass('disabled-query');
					}else{
						$broadcasts.find('.next-prev-action[data-action="next"]').addClass('disabled-query');					
					}
					
					var currentVideoPlayer = $broadcasts.find('.player-video-control').attr('data-current-player-id');
					if(typeof(currentVideoPlayer)!=='undefined' && currentVideoPlayer!=''){
						$broadcasts.find('.youtube-item-control[data-current-player-id="'+(currentVideoPlayer)+'"]').addClass('is-player-active');	
					}
					
					$broadcasts.removeClass('container-loading cache-load-fist');									
																														
				},
				error: 		function(err){
					$broadcasts.removeClass('container-loading cache-load-fist');					
				}
			});
		});
		
		_.$el.off('.broadcastsRefresh').on('click.broadcastsRefresh', '.refresh-broadcasts-control', function(e){
			var $t 			= $(this),
				$broadcasts	= $t.parents('.youtube-broadcast-control'),
				broadcastsID= $broadcasts.attr('id'),
				$wrap_data	= $broadcasts.find('.blog-wrapper-control');
				
			if(typeof(vidorev_jav_plugin_js_object)==='undefined'){
				return false;
			}
			
			if(typeof(vidorev_jav_plugin_js_object.youtube_broadcasts_params)==='undefined'){
				return false;
			}
			
			if(typeof(vidorev_jav_plugin_js_object.youtube_broadcasts_params[broadcastsID])==='undefined'){
				return false;
			}			
			
			var params = vidorev_jav_plugin_js_object.youtube_broadcasts_params[broadcastsID];
			
			if(typeof(params)!=='object'){
				return false;
			}
			
			$t.find('i.fa-refresh').addClass('fa-spin');
			$broadcasts.addClass('container-loading');
			
			if(typeof(params['pageToken'])!=='undefined' && params['pageToken']!=''){
				delete params['pageToken'];
			}
			params['ajax'] = true;
			
			var newParamsRequest = {
				'action':		'vidorev_request_pagetoken_youtube_broadcasts',
				'params':		params,
				'security':		vidorev_jav_js_object.security,	
			}
			
			$.ajax({
				url: 		vidorev_jav_js_object.admin_ajax,
				type: 		'POST',
				cache: 		false,
				dataType: 	'html',
				data:		newParamsRequest,
				success: 	function(data){
					
					$wrap_data.html(data);
					
					var prevToken 	= $.trim($broadcasts.find('input.prev-page-token-control[type="hidden"]').val());
					var nextToken	= $.trim($broadcasts.find('input.next-page-token-control[type="hidden"]').val());
					
					if(typeof(prevToken)!=='undefined' && prevToken!=''){
						$broadcasts.find('.next-prev-action[data-action="prev"]').removeClass('disabled-query');
					}else{
						$broadcasts.find('.next-prev-action[data-action="prev"]').addClass('disabled-query');
					}	
					
					if(typeof(nextToken)!=='undefined' && nextToken!=''){
						$broadcasts.find('.next-prev-action[data-action="next"]').removeClass('disabled-query');
					}else{
						$broadcasts.find('.next-prev-action[data-action="next"]').addClass('disabled-query');					
					}
					
					var currentVideoPlayer = $broadcasts.find('.player-video-control').attr('data-current-player-id');
					if(typeof(currentVideoPlayer)!=='undefined' && currentVideoPlayer!=''){
						$broadcasts.find('.youtube-item-control[data-current-player-id="'+(currentVideoPlayer)+'"]').addClass('is-player-active');	
					}		
					
					$broadcasts.removeClass('container-loading cache-load-fist');	
					$t.find('i.fa-refresh').removeClass('fa-spin');								
																														
				},
				error: 		function(err){
					$broadcasts.removeClass('container-loading cache-load-fist');
					$t.find('i.fa-refresh').removeClass('fa-spin');						
				}
			});	
			
		});
	}
	
	vidorev_plugin.prototype.youtubeBroadcastsTriggerFirstLoad = function(broadCastID){
		var _ = this;
		
		if(typeof(broadCastID)!=='undefined'){
			
			$('#'+(broadCastID)+' .refresh-broadcasts-control').trigger('click');
			
		}else{
			
			$('.cache-load-fist-control .refresh-broadcasts-control').trigger('click');
			
		}
	}
	
	vidorev_plugin.prototype.check_contains = function(x, y, obj) {
		return (x >= obj.left && x <= obj.right && y >= obj.top && y <= obj.bottom);
	}
	
	vidorev_plugin.prototype.videoPreview = function(){
		var _ = this;
			
		_.$el.off('.actionVideoPreview').on('mouseenter.actionVideoPreview', '.wrap_preview_control', function(e){
			
			var $t 					= $(this),
				$preview_container 	= $t.find('.preview-video-control');
				
			/*
			if($t.hasClass('is-mouseenter')){
				return false;
			}
			*/
			$t.find('a').attr('title', '');
			
			if($preview_container.length == 0){
				$t.addClass('fn-loaded');
				return false;
			}
			
			var imgpreview 		= $preview_container.attr('data-imgpreview');
			var iframepreview 	= $preview_container.attr('data-iframepreview');
			
			if(typeof(imgpreview) === 'undefined' && typeof(iframepreview) === 'undefined'){
				$t.addClass('fn-loaded');
				return false;
			}
			
			$t.addClass('is-mouseenter').find('.video-popup-control').append('<div class="notice-preview font-size-12 meta-font">'+(vidorev_jav_js_object.translate_loading_preview)+'</div>');			
			
			var preview_img_interval = null;
			if(typeof(imgpreview) !== 'undefined' && imgpreview!='' && typeof(vidorev_jav_js_preview) && typeof(vidorev_jav_js_preview[imgpreview]) && Array.isArray(vidorev_jav_js_preview[imgpreview]) && $preview_container.find('div').length == 0){
				var preview_container_id = 'preview_'+(imgpreview);
				$preview_container.html('').attr('id', preview_container_id);
				
				$.each(vidorev_jav_js_preview[imgpreview], function(key, value){
					$preview_container.append('<div>'+(value)+'</div>');
				});
				
				var $all_preview_image 	= $preview_container.find('img');				
				var totalImages 		= $all_preview_image.length;
				var imagesLoaded 		= 0;
				
				$all_preview_image.on('load', function(event) {
					imagesLoaded++;
					if (imagesLoaded == totalImages) {
						if(preview_img_interval!=null){
							clearInterval(preview_img_interval);
						}						
						$('#'+(preview_container_id)+' > div:gt(0)').hide();
						preview_img_interval = setInterval(function() { 
							$('#'+(preview_container_id)+' > div:first').slideUp(568).next().fadeIn(568).end().appendTo('#'+(preview_container_id));
						}, 1368);
						$t.addClass('prevew-image-loaded fn-loaded').find('.notice-preview').remove();
					}
				});	
			}
			
			if(typeof(iframepreview) !== 'undefined' && iframepreview!='' && $t.hasClass('is-mouseenter') && $preview_container.find('iframe').length == 0){
				var iframe = document.createElement('iframe');
				iframe.onload = function() { 
					$t.addClass('prevew-video-loaded').find('.notice-preview').remove();
				}
				iframe.src = iframepreview; 
				
				$preview_container.append('<div class="overlay-video-none"></div>');
				$preview_container.prepend(iframe);
				
				
				var $curr_iframe = $preview_container.find('iframe');
				
				var vidRescale = function(){
					
					var w = $preview_container.width()+3,
						h = $preview_container.height()+3;
					
					if (w/h > 16/9){
						$curr_iframe.css({'width': (w)+'px', 'height': (w/16*9)+'px'});
						$curr_iframe.css({'left': '0px'});
					} else {
						$curr_iframe.css({'width': (h/9*16)+'px', 'height': (h)+'px'});
						$curr_iframe.css({'left': -($curr_iframe.outerWidth()-w)/2});
					}
				}
				
				vidRescale();
			}
	
			$t.off('.actionVideoPreviewLeave').on('mouseleave.actionVideoPreviewLeave', function(e){
				
				/*if(_.check_contains(e.pageX, e.pageY, $t.get(0).getBoundingClientRect())){
					console.log('faild');
					return false;
				}*/
													
				$t.removeClass('is-mouseenter prevew-video-loaded prevew-image-loaded').find('.notice-preview').remove();
				$preview_container.html('');
				if(preview_img_interval!=null){
					clearInterval(preview_img_interval);
				}

			});

		});
	}
	
	vidorev_plugin.prototype.youtubePreviewBroadcasts = function(){
		var _ = this;
		
		_.$el.off('.broadcastsVideoAction').on('click.broadcastsVideoAction', '.open-live-video-control', function(e){
			var $t 						= $(this),
				$wrap 					= $t.parents('.youtube-item-control'),
				youtube_video_id 		= $t.attr('data-video-id'),
				$broadcasts				= $t.parents('.youtube-broadcast-control'),				
				elem_id					= ($broadcasts.attr('id'))+'br-player-'+(youtube_video_id),
				$playerControl			= $broadcasts.find('.player-video-control');
			
			$broadcasts.find('.youtube-item-control').removeClass('is-player-active');		
					
			$wrap.addClass('is-player-active').removeClass('is-mouseenter').find('.preview-video-control').removeClass('active-item').find('#'+(elem_id)).remove();
			
			$('html, body').stop().animate({scrollTop:($broadcasts.offset().top-$('#wpadminbar').height()-50)}, {duration:500}, function(){});
			
			$broadcasts.addClass('is-show-player');
			
			$playerControl.attr('data-current-player-id', youtube_video_id).find('iframe').remove();
			$playerControl.attr('data-current-player-id', youtube_video_id).find('div[id]').remove();
			
			if($playerControl.attr('data-current-player-id') != youtube_video_id){				
				return false;
			}
			
			$playerControl.append('<div id="'+(elem_id)+'"><div>');
			
			var $player = null, 
				options = {
					enablejsapi:	1, 
					html5:			1, 
					wmode:			'transparent', 
					modestbranding:	0, 
					iv_load_policy:	3,
					autoplay:		1,
					playsinline:	1,
					rel:			0,
					showinfo:		0,
					controls:		1,
					mute:			0,
				}
			
			var create_player = function(){
				if($playerControl.attr('data-current-player-id') != youtube_video_id){
					return false;
				}
				
				$player = 	new YT.Player(
					elem_id, 
					{						
						videoId: 		youtube_video_id,
						playerVars: 	options,
						events: {
							'onReady': function(e){
								e.target.unMute();
								
								if($playerControl.attr('data-current-player-id') != youtube_video_id){									
									return false;
								}
								_.$el.on('vidorev_themeopenLightBoxVideoEventTrigger', function(){
									try{
										$player.pauseVideo();
									}catch(error){
										/*no player*/
									}									
								});
							}
						}
					}									
				);
			}
			
			if(!_.global_youtube_API_ready){
				$(document).on(prefix+'youtubeAPIReadyPreview'+(elem_id), function(){
					create_player();
				});				
				_.setYoutubeAPIReady(elem_id);
			}else{
				create_player();
			}	
			
			$broadcasts.off('.broadcastsVideoMin').on('click.broadcastsVideoMin', '.broadcasts-min-control', function(e){
				$broadcasts.find('.youtube-item-control[data-current-player-id="'+(youtube_video_id)+'"]').removeClass('is-player-active');
				$broadcasts.removeClass('is-show-player');				
				$playerControl.attr('data-current-player-id', '').find('iframe').remove();
			});	
		});
		
		_.$el.off('.broadcastsVideoPreview').on('mouseenter.broadcastsVideoPreview', '.youtube-preview-control', function(e){
			var $t 						= $(this),
				$wrap 					= $t.parents('.youtube-item-control'),
				youtube_video_id 		= $t.attr('data-video-id'),
				$broadcasts				= $t.parents('.youtube-broadcast-control'),
				elem_id					= ($broadcasts.attr('id'))+'preview-'+(youtube_video_id),
				$player 				= null,
				$previewVideoControl 	= $t.find('.preview-video-control');
			
			$t.addClass('is-mouseenter');		
				
			if(typeof(youtube_video_id)!=='undefined' && youtube_video_id!=''){
				
				var $player = null, 
					options = {
						enablejsapi:	1, 
						html5:			1, 
						wmode:			'transparent', 
						modestbranding:	0, 
						iv_load_policy:	3,
						autoplay:		0,
						playsinline:	1,
						rel:			0,
						showinfo:		0,
						controls:		0,
						mute:			1,
					}
				
				$previewVideoControl.prepend('<div id="'+(elem_id)+'"><div>');
				
				var create_player = function(){
					$player = 	new YT.Player(
									elem_id, 
									{						
										videoId: 		youtube_video_id,
										playerVars: 	options,
										events: {
											'onReady': function(e){
												e.target.mute();
												setTimeout(function(){
													if($t.hasClass('is-mouseenter') && !$wrap.hasClass('is-player-active')){
														e.target.playVideo();
														$previewVideoControl.addClass('active-item');
													}else{
														$t.removeClass('is-mouseenter');
														
														e.target.destroy();
														$player = null;
														
														$('#'+(elem_id)).remove();
														$previewVideoControl.removeClass('active-item');
													}
												}, 368);
												
											}
										}
									}									
								);
				}
				
				if(!_.global_youtube_API_ready){
					$(document).on(prefix+'youtubeAPIReadyPreview'+(elem_id), function(){
						create_player();
					});				
					_.setYoutubeAPIReady(elem_id);
				}else{
					create_player();
				}				
				
			}else{
				return false;
			}	
			
			$t.off('.broadcastsVideoPreviewLeave').on('mouseleave.broadcastsVideoPreviewLeave', function(e){
				
				$t.removeClass('is-mouseenter');
				
				if($player!=null){
					$player.destroy();
					$player = null;					
				}
				
				$('#'+(elem_id)).remove();
				$previewVideoControl.removeClass('active-item');
			});
		});
		
		/*_.$el.find('.vidorev-youtube-broadcast .youtube-item-control:first-child .open-live-video-control').trigger('click');*/
	}
	
	vidorev_plugin.prototype.vidorev_video_report = function(){
		var _ = this;
		
		_.$el.off('.openReportBox').on('click.openReportBox', '.report-video-btn', function(){
			var $t 		= $(this),
				$wrap 	= $t.parents('.report-block-control');
				
			$wrap.toggleClass('active-report');
			
			if($wrap.hasClass('active-report')){
				$('html, body').stop().animate({scrollTop:($t.offset().top+$t.height()-window.innerHeight/2+100)}, {duration:500}, function(){});
			}
			
			setTimeout(function(){
				if($t.hasClass('complete-action') || $wrap.find('.report-form-control').hasClass('not-login-yet')){
					return false;
				}
				$wrap.find('.report-textarea-control').focus();
			}, 200);
			
			return false;
		});
		
		_.$el.off('.submitReportReasons').on('click.submitReportReasons', '.report-submit-control', function(){
			var $t 		= $(this),
				$wrap 	= $t.parents('.report-block-control');
			
			$wrap.find('.report-info-control').removeClass('active-item');
			
			var val 	= $wrap.find('.report-textarea-control').val(),
				post_id	= $wrap.find('.report-textarea-control').attr('data-id');
			
			if(typeof(val) === 'undefined' || typeof(post_id) === 'undefined' || $.trim(post_id) =='' || $.trim(val) == ''){
				$wrap.find('.report-no-data-control').addClass('active-item');
				return false;
			}
			
			val = $.trim(val);
			
			$wrap.addClass('disable-report');
			$t.blur();
			
			var newParamsRequest = {
				'action':		'vidorev_submit_video_report',
				'post_id':		post_id,
				'reasons':		val,
				'security':		vidorev_jav_js_object.security,
			}
			
			$.ajax({
				url: 		vidorev_jav_js_object.admin_ajax,
				type: 		'POST',
				cache: 		false,
				dataType: 	'json',
				data:		newParamsRequest,
				success: 	function(data){
					
					if(typeof(data)!=='object'){
						$wrap.find('.report-error-control').addClass('active-item');
						$wrap.removeClass('disable-report');
					}else{
						if(typeof(data.error)!=='undefined' && data.error == 'yes'){
							$wrap.find('.report-error-control').addClass('active-item');
							$wrap.removeClass('disable-report');
						}else if(typeof(data.success)!=='undefined' && data.success == 'yes'){							
							$wrap.find('.report-success-control').addClass('active-item');	
							$wrap.find('.report-video-control').addClass('complete-action');
							$wrap.find('.reported-control').text(vidorev_jav_js_object.translate_reported);
							
						}else{
							$wrap.find('.report-error-control').addClass('active-item');
							$wrap.removeClass('disable-report');
						}						
					}
																													
				},
				error: 		function(err){
					$wrap.find('.report-error-control').addClass('active-item');
					$wrap.removeClass('disable-report');				
				}
			});
		});
	}
	
	vidorev_plugin.prototype.isNumber = function(n){
		var _ = this;
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	
	vidorev_plugin.prototype.vidorev_channel_subscribe = function(){
		var _ = this;
		
		_.$el.off('.channelSubscribe').on('click.channelSubscribe', '.subscribe-control', function(){
			var $t 			= $(this),
				channel_id 	= $t.attr('data-channel-id'),
				data_login	= $t.attr('data-login');
				
			if(typeof(data_login)==='undefined' || data_login === 'none'){
				document.location.href= vidorev_jav_js_object.login_url;
				return false;
			}	
			
			if(typeof(channel_id)==='undefined' || !_.isNumber(channel_id)){
				return false;
			}
			
			var $btn_channel_id = $('.subscribe-control[data-channel-id="'+(channel_id)+'"]');
			
			$btn_channel_id.addClass('subscribe-loading');
			
			var newParamsRequest = {
				'action':		'vidorev_submit_channel_subscribe',
				'channel_id':	channel_id,
				'security':		vidorev_jav_js_object.security,
			}
			
			$.ajax({
				url: 		vidorev_jav_js_object.admin_ajax,
				type: 		'POST',
				cache: 		false,
				dataType: 	'json',
				data:		newParamsRequest,
				success: 	function(data){
					
					if(typeof(data)!=='object'){
						
					}else{
						if(typeof(data.success)!=='undefined' && data.success === 'yes'){
							if(data.status_update == 0){
								$btn_channel_id.removeClass('channel-subscribed');
								setTimeout(function(){
									if($t.parents('.subscriptions-archive-control').length > 0){
										$t.parents('.post-item.vid_channel').hide('slow', function(){ $(this).remove(); });
									}									
								}, 300);
							}
							if(data.status_update == 1){
								$btn_channel_id.addClass('channel-subscribed');
							}
							
							$btn_channel_id.find('.subscribed-count-control').text('');
							
							if(data.subscribed_count != 0){								
								$btn_channel_id.find('.subscribed-count-control').text(data.subscribed_count)
							}
						}				
					}
					
					$btn_channel_id.removeClass('subscribe-loading').blur();
																													
				},
				error: 		function(err){
							
				}
			});
		});
	}
	
	vidorev_plugin.prototype.vidorev_cf7_select2 = function(){	
		var _ 	= this;
		var dir = 'ltr';
		
		if(_.$el.css('direction')=='rtl'){
			dir = 'rtl';
		}
		
		if(typeof($.fn.select2)==='undefined'){
			return;
		}
			
		$('.select-multiple-control').select2({
			dir:dir,
		});
		
		$('.select-single-ss-control').select2({
			dir:dir,
			allowClear:true,
		});
		
		$('.ajax-select-playlist-control').select2({
			ajax: 	{
						url: 		vidorev_jav_js_object.admin_ajax,
						data: 		function (params) {
										var queryParameters = {
										 'action': 	'ajaxGetAllPlaylists',
										  'keyword': 	params.term,
										  'security': 	vidorev_jav_js_object.security,
										}									
										return queryParameters;
						},
						delay: 		250,
						dataType: 	'json',
						type: 		'POST',
						cache:		true,
			 		},
			minimumInputLength: 3,
			allowClear:true,
			dir:dir,
		});
		
		$('.ajax-select-channel-control').select2({
			ajax: 	{
						url: 		vidorev_jav_js_object.admin_ajax,
						data: 		function (params) {
										var queryParameters = {
										  'action': 	'ajaxGetAllChannels',
										  'keyword': 	params.term,
										  'security': 	vidorev_jav_js_object.security,
										}									
										return queryParameters;
						},
						delay: 		250,
						dataType: 	'json',
						type: 		'POST',
						cache:		true,
			 		},
			minimumInputLength: 3,
			allowClear:true,
			dir:dir,
		});
		
		_.$el.off('.cf7Submit').on('click.cf7Submit', '.wpcf7-submit', function(){
			$(this).parents('.wpcf7').addClass('form-data-loading');
		});
		
		if($( '.wpcf7' ).length > 0){
			$( '.wpcf7' ).each(function(index, element) {
				var wpcf7Elm = document.querySelector( '#'+($(this).attr('id')) );
				'wpcf7invalid wpcf7spam wpcf7mailfailed wpcf7mailsent'.split(' ').forEach(function(e){
					wpcf7Elm.addEventListener(e, function(event){
						$('#'+(event.detail.unitTag)+'.wpcf7').removeClass('form-data-loading');/*.find('form').trigger('reset');*/
						if(e == 'wpcf7mailsent'){
							$('#'+(event.detail.unitTag)+'.wpcf7').find('.select-multiple-control').val(null).trigger("change");
							$('#'+(event.detail.unitTag)+'.wpcf7').find('.ajax-select-playlist-control').val(null).trigger("change");
							$('#'+(event.detail.unitTag)+'.wpcf7').find('.ajax-select-channel-control').val(null).trigger("change");
						}
					}, false);
				});
			});
		}
	}
	
	vidorev_plugin.prototype.show_more_videos = function(){
		var _ = this;	
		
		var $singleScrollBar = _.$el.find('.show-more-videos-control .blog-wrapper-control');		
		if($singleScrollBar.length > 0){
			$singleScrollBar.mCustomScrollbar({			
				axis: 'x',
				alwaysShowScrollbar:0,
				scrollInertia: 120,
			});
			
			_.$el.off('.moreVideoControl').on('click.moreVideoControl', '.more-videos-control', function(){
				var $t = $(this);
				$t.toggleClass('active-item');			
				_.$el.find('.show-more-videos-control').toggleClass('active-block');
			});	
		}
		
		var $singleSeriesScrollBar = _.$el.find('.grid-style-series-control .blog-wrapper-control');		
		if($singleSeriesScrollBar.length > 0){
			
			$singleSeriesScrollBar.each(function(index, element){
				var $t 		= $(this),
					sPos 	= '';
				if($t.find('#current-playing-series').length>0){					
					sPos = '#current-playing-series';					
				}				
				
				$t.mCustomScrollbar({			
					axis: 'x',
					alwaysShowScrollbar:0,
					scrollInertia: 120,
					callbacks:{
						onInit: function(){
							if(sPos!=''){								
								setTimeout(function(){
									$t.mCustomScrollbar('scrollTo', sPos);
								},368);																
							}		 
						}
					}
				});
				
			});
		}
	}
	
	vidorev_plugin.prototype.get_playlist_by_user_login = function(){
		var _ = this;	
		
		_.$el.off('.addVideoToPlaylistControl').on('click.addVideoToPlaylistControl', '.add-video-to-playlist-control', function(){
			
			var $t = $(this);
			
			var post_id = $t.attr('data-post-id');
			
			if(typeof(post_id) === 'undefined'){
				return false;
			}
			
			_.$el.toggleClass('active-playlist-lightbox');
			
			if($t.hasClass('fn-request')){
				return false;
			}
			
			$t.addClass('fn-request');			
			
			var newParamsRequest = {
				'action':		'get_playlist_by_user_login',
				'post_id':		post_id,
				'security':		vidorev_jav_js_object.security,
			}
			
			$.ajax({
				type: 		'POST',
				url: 		vidorev_jav_js_object.admin_ajax,
				cache: 		false,
				data: 		newParamsRequest,
				dataType: 	'html',
				success: 	function(data, textStatus, jqXHR){
					if(data != ''){
					
						$('.ajax-playlist-list-control').html(data).mCustomScrollbar({
							alwaysShowScrollbar:1,
							scrollInertia: 200,
						});
					
					} else {
												
					}
				
				},
				error: function( jqXHR, textStatus, errorThrown ){	
				}
			});		
		});
		
		_.$el.off('.addVideoToPlaylistPopup').on('click.addVideoToPlaylistPopup', '.playlist-item-add-control', function(){
			
			var $t = $(this);
			
			var post_id 		= $t.attr('data-post-id');
			var playlist_id 	= $t.attr('data-playlist-id');
			
			if(typeof(post_id) === 'undefined' || typeof(playlist_id) === 'undefined'){
				return false;
			}
			
			$t.addClass('loaded-in');
			
			var newParamsRequest = {
				'action':			'add_post_to_playlist_by_user_login',
				'post_id':			post_id,
				'playlist_id':		playlist_id,
				'security':			vidorev_jav_js_object.security,
			}
			
			$.ajax({
				type: 		'POST',
				url: 		vidorev_jav_js_object.admin_ajax,
				cache: 		false,
				data: 		newParamsRequest,
				dataType: 	'json',
				success: 	function(data, textStatus, jqXHR){
					if(typeof(data) === 'object' && typeof(data['success']) !== 'undefined'){
					
						if(data['success']=='in'){
							$t.addClass('ready-in');							
						}else{
							$t.removeClass('ready-in');
						}
						
						$t.removeClass('loaded-in');
					
					} else {
						$t.removeClass('loaded-in');						
					}
				
				},
				error: function( jqXHR, textStatus, errorThrown ){	
					$t.removeClass('loaded-in');
				}
			});		
		});
		
		_.$el.off('.closeVideoToPlaylistLightbox').on('click.closeVideoToPlaylistLightbox', '.playlist-items-control', function(e){
			var $t = $(this);
			_.$el.toggleClass('active-playlist-lightbox');
			return false;
		});	
	}
	
	vidorev_plugin.prototype.front_end_edit_post = function(){
		var _ = this;
		
		_.$el.off('.frontEndEditControl').on('click.frontEndEditControl', '.fe_edit-post-control', function(){
			
			var $t = $(this);
			
			var post_id = $t.attr('data-id');
			
			var newParamsRequest = {
				'action':			'front_end_edit_post_control',
				'post_id':			post_id,
				'security':			vidorev_jav_js_object.security,
			}
			
			_.$el.append('<div class="lightbox-edit-post lightbox-edit-post-control"><span class="video-load-icon"></span></div>');
			
			$.ajax({
				type: 		'POST',
				url: 		vidorev_jav_js_object.admin_ajax,
				cache: 		false,
				data: 		newParamsRequest,
				dataType: 	'json',
				success: 	function(data, textStatus, jqXHR){
					if(typeof(data) === 'object' && typeof(data['form']) !== 'undefined'){
						var html_form = '';
						html_form+='<div class="lightbox-edit-post-content"><div role="form" class="wpcf7" id="vidorev-edit-'+(post_id)+'"><div class="lightbox-edit-close lightbox-edit-close-control"><i class="fa fa-times" aria-hidden="true"></i></div><form method="post" class="wpcf7-form front-end-edit-form-control" enctype="multipart/form-data">';
							
							$.each(data, function(i, values){
								if(typeof(values)==='object'){
									
									$.each(values, function (z, value) {
										
										var check_type = typeof(value[0])!=='undefined' && $.trim(value[0])!='';
										
										if(check_type){
											html_form+='<div class="vidorev-submit-post">';
											html_form+='<h3 class="h5 extra-bold">'+(value[0])+'</h3>';
										}										
										if(typeof(value[1])!=='undefined' && check_type){
											html_form+='<p><span class="wpcf7-form-control-wrap">'+(value[1])+'</span></p>';											
										}else if(typeof(value[1])!=='undefined' && !check_type){
											html_form+=value[1];			
										}										
										if(typeof(value[2])!=='undefined'){
											html_form+='<br><span class="desc-param">'+(value[2])+'</span>';
										}
										
										if(check_type){
											html_form+='</div>';
										}
									});
									
								}
							});
							
							
						html_form+='<div class="vidorev-submit-post"><input type="button" value="SUBMIT" class="vidorev-submit-video-control" id="vidorev-submit-video"><span class="ajax-loader"></span></div class="ajx"><div class="response-err response-err-control"></div></form></div></div>';
						
						$('.lightbox-edit-post-control').html(html_form);
						
						var dir = 'ltr';
						if($('body').css('direction')=='rtl'){
							dir = 'rtl';
						}
						
						if($('.ajax-edit-find-playlist-control').length>0){						
							$('.ajax-edit-find-playlist-control').select2({
								ajax: 	{
											url: 		vidorev_jav_js_object.admin_ajax,
											data: 		function (params) {
															var queryParameters = {
															 'action': 	'ajaxEditGetAllPlaylists',
															  'keyword': params.term,
															  'security': vidorev_jav_js_object.security,
															}									
															return queryParameters;
											},
											delay: 		250,
											dataType: 	'json',
											type: 		'POST',
											cache:		true,
										},
								minimumInputLength: 2,
								allowClear:false,
								dir:dir,
								width: 'resolve'
							});	
						}
						if($('.ajax-edit-find-channel-control').length>0){						
							$('.ajax-edit-find-channel-control').select2({
								ajax: 	{
											url: 		vidorev_jav_js_object.admin_ajax,
											data: 		function (params) {
															var queryParameters = {
															 'action': 	'ajaxEditGetAllChannels',
															  'keyword': params.term,
															  'security': vidorev_jav_js_object.security,
															}									
															return queryParameters;
											},
											delay: 		250,
											dataType: 	'json',
											type: 		'POST',
											cache:		true,
										},
								minimumInputLength: 2,
								allowClear:false,
								dir:dir,
								width: 'resolve'
							});	
						}
					}else{
						$('.lightbox-edit-post-control').remove();
					}
				},
				error: function( jqXHR, textStatus, errorThrown ){
					$('.lightbox-edit-post-control').remove();
				}
			});		
		});
		
		_.$el.off('.lightboxEditCloseControl').on('click.lightboxEditCloseControl', '.lightbox-edit-close-control', function(){
			$('.lightbox-edit-post-control').remove();
		});
		
		_.$el.off('.lightboxEditButtonControl').on('click.lightboxEditButtonControl', '.vidorev-submit-video-control', function(){
			
			if ( typeof window.FormData !== 'function' ) {
				return;
			}
			
			var $t 			= $(this),
				$form 		= $t.parents('.front-end-edit-form-control'),
				$parents 	= $t.parents('.lightbox-edit-post-control');
				
			$parents.addClass('save-data').find('.wpcf7-response-output, .wpcf7-not-valid-tip').remove();
				
			var formData = new FormData( $form.get(0) );
			
			formData.append('action', 'front_end_edit_post_data');
			formData.append('security', vidorev_jav_js_object.security);
			
			$.ajax({
				type: 		'POST',
				url: 		vidorev_jav_js_object.admin_ajax,
				cache: 		false,
				data: 		formData,
				dataType: 	'json',
				processData: false,
				contentType: false,
				success: 	function(data, textStatus, jqXHR){
					if(typeof(data) === 'object' && typeof(data['success'])!=='undefined'){
						location.reload();
					}else{
						$parents.removeClass('save-data');
						if(typeof(data['error'])!=='undefined' && typeof(data['error_content'])==='object'){
							var err_obj = data['error_content'];
							$parents.find('.response-err-control').html('<div class="wpcf7-response-output wpcf7-validation-errors" role="alert">'+(err_obj.err_title)+'</div>');
							$.each(err_obj.err_class, function (zc, val) {
								$parents.find('[name="'+(val)+'"]').after(function() {
									return '<span class="wpcf7-not-valid-tip">'+(err_obj.err_desc)+'</span>';
								});
							});
						}
					}
				},
				error: function( jqXHR, textStatus, errorThrown ){
					$parents.removeClass('save-data');
				}
			});	
		});
	}
	
	vidorev_plugin.prototype.front_end_delete_post = function(){
		var _ = this;
		
		_.$el.off('.frontEndDeleteControl').on('click.frontEndDeleteControl', '.fe_delete-post-control', function(){
			if (!confirm(vidorev_jav_js_object.translate_confirm_delete)) {
               return false;
            }
			
			var $t = $(this);
			
			var post_id = $t.attr('data-id');
			
			var newParamsRequest = {
				'action':			'front_end_delete_post_data',
				'post_id':			post_id,
				'security':			vidorev_jav_js_object.security,
			}
			
			_.$el.append('<div class="lightbox-edit-post lightbox-edit-post-control"><span class="video-load-icon"></span></div>');
			
			$.ajax({
				type: 		'POST',
				url: 		vidorev_jav_js_object.admin_ajax,
				cache: 		false,
				data: 		newParamsRequest,
				dataType: 	'json',
				success: 	function(data, textStatus, jqXHR){
					if(typeof(data) === 'object' && typeof(data['success']) !== 'undefined' && typeof(data['red_url']) !== 'undefined'){
						alert(vidorev_jav_js_object.translate_delete_success);
						document.location.href = data['red_url'];
					}else{
						$('.lightbox-edit-post-control').remove();			
					}
				},
				error: function( jqXHR, textStatus, errorThrown ){
					$('.lightbox-edit-post-control').remove();
				}
			});
		})
	}
	
	vidorev_plugin.prototype.series_dropdown_menu = function(){
		var _ = this;
		
		_.$el.off('.seriesDropdownControl').on('click.seriesDropdownControl', '.series-df-item-control', function(){
			var $t 			= $(this),
				$parents 	= $t.parents('.series-dropdown-control');
			
			if($parents.hasClass('active-item')){				
				$('.series-dropdown-control').removeClass('active-item');
			}else{
				$('.series-dropdown-control').removeClass('active-item');
				$parents.addClass('active-item');
			}
			
		})
	}
	
	vidorev_plugin.prototype.updateQueryStringParameter = function(uri, key, value) {
		var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
		var separator = uri.indexOf('?') !== -1 ? "&" : "?";
		if (uri.match(re)) {
			return uri.replace(re, '$1' + key + "=" + value + '$2');
		}else {
			return uri + separator + key + "=" + value;
		}
	}
	
	vidorev_plugin.prototype.advance_search = function(){
		var _ = this;
		
		_.$el.off('.advanceSearchControl').on('click.advanceSearchControl', '.filter-group-title-control', function(){
			var $t 			= $(this),
				$parents 	= $t.parents('.ft-group-control'),
				$item_block	= $parents.find('.ft-group-items-control');
			
			if($item_block.css('display') == 'none'){
				$parents.removeClass('hide-group-filter').addClass('show-group-filter');
			}else{
				$parents.removeClass('show-group-filter').addClass('hide-group-filter');
			}
		});
		
		_.$el.off('.advanceSearchTopPress').on('keyup.advanceSearchTopPress', '.ft-keyword-control-top', function(e){
			var $t 			= $(this);
			$('.ft-keyword-control-bottom').val($t.val());
			if (e.keyCode == 13) {
				$('.apply-ft-control').trigger('click');
			}
		});
		
		_.$el.off('.advanceSearchBottomPress').on('keyup.advanceSearchBottomPress', '.ft-keyword-control-bottom', function(){
			var $t 			= $(this);
			$('.ft-keyword-control-top').val($t.val());
			if (e.keyCode == 13) {
				$('.apply-ft-control').trigger('click');
			}
		});
		
		_.$el.off('.advanceSearchSubmit').on('click.advanceSearchSubmit', '.apply-ft-control', function(){
			var $t 			= $(this),
				$parents 	= $t.parents('.ft-search-box-control');
			
			if($parents.hasClass('ft-search-box-top')){
				$('.ft-keyword-control-bottom').val($('.ft-keyword-control-top').val());				
			}else{
				$('.ft-keyword-control-top').val($('.ft-keyword-control-bottom').val());
			}
			
			var default_url = $t.attr('data-url');
			var new_url = '';
			
			var keyword = $('.ft-keyword-control-top').val();
			
			new_url = _.updateQueryStringParameter(default_url, 'keyword', encodeURIComponent(keyword));
			
			var tags = $('input[name="tag_item_ft[]"]:checked').map(function(_, el) {
				return $(el).val();
			}).get();
			
			new_url = _.updateQueryStringParameter(new_url, 'tags', encodeURIComponent(tags.join()));
			
			document.location.href = new_url;
		});
	}
	
	vidorev_plugin.prototype.ads_settings = function(){
		var _ = this;
		$('input[name="ads_types"]').on('change', function() {
			var value = $(this).val();
			switch(value){
				case 'google_ima':
					if($('.user-ads-google-ima').length > 0){
						$('html, body').stop().animate({scrollTop:$('.user-ads-google-ima').offset().top-90}, {duration:500}, function(){});
					}
					break;
				
				case 'image':
					if($('.user-ads-image').length > 0){
						$('html, body').stop().animate({scrollTop:$('.user-ads-image').offset().top-90}, {duration:500}, function(){});
					}
					break;
					
				case 'html5_video':
					if($('.user-ads-html5-video').length > 0){
						$('html, body').stop().animate({scrollTop:$('.user-ads-html5-video').offset().top-90}, {duration:500}, function(){});
					}
					break;
					
				case 'google_adsense':
					if($('.user-ads-google-adsense').length > 0){
						$('html, body').stop().animate({scrollTop:$('.user-ads-google-adsense').offset().top-90}, {duration:500}, function(){});
					}
					break;
					
				case 'vast':
					if($('.user-ads-vast').length > 0){
						$('html, body').stop().animate({scrollTop:$('.user-ads-vast').offset().top-90}, {duration:500}, function(){});
					}
					break;				
			}
		});
		
		_.$el.off('.userUpdateAds').on('click.userUpdateAds', '#ads_settings_update', function(){
			
			var $t = $(this);
			
			var ads_types = $('input[name="ads_types"]:checked').val();
			
			var ima_source_desktop 		= $.trim($('input[name="ima_source_desktop"]').val());
			var ima_source_tablet 		= $.trim($('input[name="ima_source_tablet"]').val());
			var ima_source_mobile 		= $.trim($('input[name="ima_source_mobile"]').val());
			
			var image_source 			= $.trim($('input[name="image_source"]').val());
			var image_link_target 		= $.trim($('input[name="image_link_target"]').val());
			var image_time_show_ad 		= $.trim($('input[name="image_time_show_ad"]').val());
			var image_time_skip_ad 		= $.trim($('input[name="image_time_skip_ad"]').val());
			var image_time_hide_ad 		= $.trim($('input[name="image_time_hide_ad"]').val());
			
			var video_source 			= $.trim($('input[name="video_source"]').val());
			var video_link_target 		= $.trim($('input[name="video_link_target"]').val());
			var video_time_show_ad 		= $.trim($('input[name="video_time_show_ad"]').val());
			var video_time_skip_ad 		= $.trim($('input[name="video_time_skip_ad"]').val());
			
			var adsense_client_id 		= $.trim($('input[name="adsense_client_id"]').val());
			var adsense_slot_id 		= $.trim($('input[name="adsense_slot_id"]').val());
			var adsense_time_show_ad 	= $.trim($('input[name="adsense_time_show_ad"]').val());
			var adsense_time_skip_ad 	= $.trim($('input[name="adsense_time_skip_ad"]').val());
			var adsense_time_hide_ad 	= $.trim($('input[name="adsense_time_hide_ad"]').val());
			
			var vast_preroll 			= $.trim($('input[name="vast_preroll"]').val());
			var vast_postroll 			= $.trim($('input[name="vast_postroll"]').val());
			var vast_pauseroll 			= $.trim($('input[name="vast_pauseroll"]').val());
			var vast_midroll 			= $.trim($('input[name="vast_midroll"]').val());
			
			var user_ads_object = {
				"vid_ads_m_video_ads":			"no",
				"vid_ads_m_video_ads_type":		"",
				"vid_ads_m_group_google_ima":	[
					{"vid_ads_m_ima_source": [""], "vid_ads_m_ima_source_tablet": [""], "vid_ads_m_ima_source_mobile": [""]}
				],
				"vid_ads_m_group_image":		[
					{"vid_ads_m_image_source": "", "vid_ads_m_image_link": "", "image_time_show_ad": "", "image_time_skip_ad": "", "image_time_hide_ad": ""}
				],
				"vid_ads_m_group_html5_video":	[
					{"vid_ads_m_video_source": {0: ""}, "vid_ads_m_video_link": "", "video_time_show_ad": "", "video_time_skip_ad": ""}
				],
				"vid_ads_m_group_html":			[
					{"vid_ads_m_html_source": [""], "adsense_client_id": "", "adsense_slot_id": "", "adsense_time_show_ad": "", "adsense_time_skip_ad": "", "adsense_time_hide_ad":""}
				],
				"vid_ads_m_vast_preroll":		[
					{"vid_ads_m_vast_tag_pre": ""}
				],
				"vid_ads_m_vast_postroll":		[
					{"vid_ads_m_vast_tag_post": ""}
				],
				"vid_ads_m_vast_pauseroll":		[
					{"vid_ads_m_vast_tag_pause": ""}
				],
				"vid_ads_m_vast_midroll":		[
					{"vid_ads_m_vast_tag_mid": "", "vid_ads_m_vast_timer_seconds": "10"}
				],
				"vid_ads_m_time_to_show_ads": 0,
				"vid_ads_m_time_skip_ads": 5,
				"vid_ads_m_time_to_hide_ads": 10,
			}
			
			if(ads_types == 'google_ima' || ads_types == 'image' || ads_types == 'html5_video' || ads_types == 'google_adsense' || ads_types == 'vast'){
				user_ads_object.vid_ads_m_video_ads = 'yes';
				user_ads_object.vid_ads_m_video_ads_type = ads_types;
				
				switch(ads_types){
					case 'google_ima':
						break;
						
					case 'image':
						if(image_time_show_ad!=''){
							user_ads_object.vid_ads_m_time_to_show_ads = image_time_show_ad;
						}			
						if(image_time_skip_ad!=''){
							user_ads_object.vid_ads_m_time_skip_ads = image_time_skip_ad;
						}			
						if(image_time_hide_ad!=''){
							user_ads_object.vid_ads_m_time_to_hide_ads = image_time_hide_ad;
						}						
						break;
						
					case 'html5_video':
						if(video_time_show_ad!=''){
							user_ads_object.vid_ads_m_time_to_show_ads = video_time_show_ad;
						}			
						if(video_time_skip_ad!=''){
							user_ads_object.vid_ads_m_time_skip_ads = video_time_skip_ad;
						}
						break;
						
					case 'google_adsense':
						user_ads_object.vid_ads_m_video_ads_type = 'html';
						if(adsense_time_show_ad!=''){
							user_ads_object.vid_ads_m_time_to_show_ads = adsense_time_show_ad;
						}			
						if(adsense_time_skip_ad!=''){
							user_ads_object.vid_ads_m_time_skip_ads = adsense_time_skip_ad;
						}			
						if(adsense_time_hide_ad!=''){
							user_ads_object.vid_ads_m_time_to_hide_ads = adsense_time_hide_ad;
						}
						break;
						
					case 'vast':						
						break;				
				}				
			}
		
			if(ima_source_desktop!=''){
				user_ads_object.vid_ads_m_group_google_ima[0].vid_ads_m_ima_source[0] = ima_source_desktop;
			}
			if(ima_source_tablet!=''){
				user_ads_object.vid_ads_m_group_google_ima[0].vid_ads_m_ima_source_tablet[0] = ima_source_tablet;
			}
			if(ima_source_mobile!=''){
				user_ads_object.vid_ads_m_group_google_ima[0].vid_ads_m_ima_source_mobile[0] = ima_source_mobile;
			}
			
			if(image_source!=''){
				user_ads_object.vid_ads_m_group_image[0].vid_ads_m_image_source = image_source;
			}
			if(image_link_target!=''){
				user_ads_object.vid_ads_m_group_image[0].vid_ads_m_image_link = image_link_target;
			}			
			if(image_time_show_ad!=''){
				user_ads_object.vid_ads_m_group_image[0].image_time_show_ad = image_time_show_ad;
			}			
			if(image_time_skip_ad!=''){
				user_ads_object.vid_ads_m_group_image[0].image_time_skip_ad = image_time_skip_ad;
			}			
			if(image_time_hide_ad!=''){
				user_ads_object.vid_ads_m_group_image[0].image_time_hide_ad = image_time_hide_ad;
			}
			
			if(video_source!=''){
				user_ads_object.vid_ads_m_group_html5_video[0].vid_ads_m_video_source = {"0": video_source};
			}
			if(video_link_target!=''){
				user_ads_object.vid_ads_m_group_html5_video[0].vid_ads_m_video_link = video_link_target;
			}			
			if(video_time_show_ad!=''){
				user_ads_object.vid_ads_m_group_html5_video[0].video_time_show_ad = video_time_show_ad;
			}			
			if(video_time_skip_ad!=''){
				user_ads_object.vid_ads_m_group_html5_video[0].video_time_skip_ad = video_time_skip_ad;
			}
			
			if(adsense_client_id!='' && adsense_slot_id!=''){				
				user_ads_object.vid_ads_m_group_html[0].vid_ads_m_html_source[0] = "<script async src=\"\/\/pagead2.googlesyndication.com\/pagead\/js\/adsbygoogle.js\"><\/script><ins class=\"adsbygoogle\" style=\"display:block\" data-ad-client=\""+(adsense_client_id)+"\" data-ad-slot=\""+(adsense_slot_id)+"\" data-ad-format=\"auto\"><\/ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});<\/script>";
			}
			
			if(adsense_client_id!=''){
				user_ads_object.vid_ads_m_group_html[0].adsense_client_id = adsense_client_id;
			}			
			if(adsense_slot_id!=''){
				user_ads_object.vid_ads_m_group_html[0].adsense_slot_id = adsense_slot_id;
			}			
			if(adsense_time_show_ad!=''){
				user_ads_object.vid_ads_m_group_html[0].adsense_time_show_ad = adsense_time_show_ad;
			}			
			if(adsense_time_skip_ad!=''){
				user_ads_object.vid_ads_m_group_html[0].adsense_time_skip_ad = adsense_time_skip_ad;
			}			
			if(adsense_time_hide_ad!=''){
				user_ads_object.vid_ads_m_group_html[0].adsense_time_hide_ad = adsense_time_hide_ad;
			}
			
			if(vast_preroll!=''){
				user_ads_object.vid_ads_m_vast_preroll[0].vid_ads_m_vast_tag_pre = vast_preroll;
			}
			
			if(vast_postroll!=''){
				user_ads_object.vid_ads_m_vast_postroll[0].vid_ads_m_vast_tag_post = vast_postroll;
			}
			
			if(vast_pauseroll!=''){
				user_ads_object.vid_ads_m_vast_pauseroll[0].vid_ads_m_vast_tag_pause = vast_pauseroll;
			}
			
			if(vast_midroll!=''){
				user_ads_object.vid_ads_m_vast_midroll[0].vid_ads_m_vast_tag_mid = vast_midroll;
				user_ads_object.vid_ads_m_vast_midroll[0].vid_ads_m_vast_timer_seconds = "10";
			}
			
			var newParamsRequest = {
				'action':		'vidorev_update_user_ads_settings',
				'ads':			user_ads_object,
				'security':		vidorev_jav_js_object.security,	
			}
			$t.addClass('loading-submit');
			$('.ads-notice-submit-control').text('').removeClass('error-text');
			
			$.ajax({
				url: 		vidorev_jav_js_object.admin_ajax,
				type: 		'POST',
				cache: 		false,
				dataType: 	'json',
				data:		newParamsRequest,
				success: 	function(data){
					
					if(typeof(data['results'])!=='undefined'){
						$('.ads-notice-submit-control').text(data['results'][1]);
						if(data['results'][0]==='error'){
							$('.ads-notice-submit-control').addClass('error-text');
						}
					}
					
					$t.removeClass('loading-submit');																								
				},
				error: 		function(err){
					$t.removeClass('loading-submit');
					$('.ads-notice-submit-control').text('An error occurred, please try again!');			
				}
			});
			
		});
	}
	
	vidorev_plugin.prototype.tmdb_block_render = function(){
		var _ 					= this;
		
		_.$el.off('.tmdbShowmore').on('click.tmdbShowmore', '.tmdb_showmore_button_control', function(){
			var $t 			= $(this),
				$parent		= $t.parents('.tmdb-section-control');
			
			$parent.toggleClass('show-more-content');
			
			if(!$parent.hasClass('show-more-content')){				
				$('html, body').animate({scrollTop:$parent.offset().top-150}, {duration:500, complete: function(){}});			
			}
		});
	}
	
	vidorev_plugin.prototype.nFormatter = function(num, digits){	
			
		if(isNaN(num)){
			return '0';
		}
		
		var si = [
				{ value: 1E18, symbol: "E" },
				{ value: 1E15, symbol: "P" },
				{ value: 1E12, symbol: "T" },
				{ value: 1E9,  symbol: "G" },
				{ value: 1E6,  symbol: "M" },
				{ value: 1E3,  symbol: "k" }
			],
			rx = /\.0+$|(\.[0-9]*[1-9])0+$/, 
			i;
		for (var i=0; i<si.length;i++) {
			if(num>=si[i].value) {
				return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
			}
		}
		return num.toFixed(digits).replace(rx, "$1");
	}/*big number format*/
	
	vidorev_plugin.prototype.secondsToTime = function (e){
		var h = Math.floor(e / 3600).toString().padStart(2,'0'),
			m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
			s = Math.floor(e % 60).toString().padStart(2,'0');
		
		if(h=='00'){
			return m + ':' + s;
		}else{
			return h + ':' + m + ':' + s;
		}
	}
	
	vidorev_plugin.prototype.youtube_live_video_pros = function(crr_yvt, crr_obj, action){
		var _ = this;
		
		var	live_url 			= crr_obj.live_url,
			upcoming_url 		= crr_obj.upcoming_url,
			completed_url 		= crr_obj.completed_url,
			recent_url 			= crr_obj.recent_url,
			channel_name 		= crr_obj.channel_name,
			live_video_title 	= crr_obj.live_video_title,
			auto_refresh 		= crr_obj.auto_refresh,
			fallback_options 	= crr_obj.fallback_options,
			public_api_key 		= crr_obj.public_api_key,
			lang				= crr_obj.lang,
			timezone			= crr_obj.timezone,
			display_info		= crr_obj.display_info,
			player				= crr_obj.player,
			autoplay			= crr_obj.autoplay;
		
		var $live_bar_control		= crr_yvt.find('.live-bar-control'),
			$live_player_control 	= crr_yvt.find('.live-player-control'),
			$reload_time_control	= crr_yvt.find('.reload-time-control');
			
		var reloadTimeInterval		= null;	
			
			
		var append_html_player = function(video_id, status){	
			
			var def_obj = {
				'membership'								: '',
				'player_library'							: 'vp',
				'plyr_player'								: 'on',
				'poster_background'							: '',
				'prime_video'								: '',
				'single_video_network'						: 'youtube',
				'single_video_source'						: video_id,
				'single_video_streaming'					: '',
				'single_video_suggested'					: '',
				'single_video_url'							: '',
				'single_video_youtube_playlist_id'			: '',
				'vidorev_jav_plugin_video_ads_object_post'	: {'vid_ads_m_video_ads':'no'},
				'vm_video_ratio'							: '16:9',
				'vm_video_ratio_mobile'						: '16:9',
				'woo_membership'							: '',				
					
			}
			
			if(player=='youtube'){
				def_obj.plyr_player = 'off';
			}
			
			var url_details = '://www.googleapis.com/youtube/v3/videos?id='+(video_id)+'&part=snippet,statistics&key='+(public_api_key);
			
			switch(status){
				case 'live':
					url_details = '://www.googleapis.com/youtube/v3/videos?id='+(video_id)+'&part=snippet,statistics,liveStreamingDetails&key='+(public_api_key);
					break;
				case 'scheduled':
					url_details = '://www.googleapis.com/youtube/v3/videos?id='+(video_id)+'&part=snippet,statistics,liveStreamingDetails&key='+(public_api_key);
					break;	
			}
			
			var rnd_url_pl_id = 'cache_'+(Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 15));
			
			$.ajax({
				url: 		_.updateQueryStringParameter('https'+(url_details), 'vid_callback', encodeURIComponent(rnd_url_pl_id)),
				type: 		'GET',
				cache: 		true,
				dataType: 	'jsonp',
				success: 	function(data){
					
					if(typeof(data.items)!=='undefined' || typeof(data.items[0])!=='undefined'){
						
						var rnd_id = 'live-p-'+(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));	
						
						var val_details 		= data.items[0],
							vid_title 			= typeof(val_details.snippet.title)!=='undefined'?val_details.snippet.title:'',
							vid_channel 		= typeof(val_details.snippet.channelId)!=='undefined'?val_details.snippet.channelId:'',
							vid_channel_title	= typeof(val_details.snippet.channelTitle)!=='undefined'?val_details.snippet.channelTitle:'',
							likes_counter 		= (typeof(val_details.statistics)!=='undefined' && typeof(val_details.statistics.likeCount)!=='undefined')?_.nFormatter(parseFloat(val_details.statistics.likeCount), 1):0,
							views_counter 		= 0;
						
						var post_meta 			= '',
							vid_scheduled		= '',
							iframe_chat			= '';
							
						switch(status){
							case 'live':
								views_counter = (typeof(val_details.liveStreamingDetails)!=='undefined' && typeof(val_details.liveStreamingDetails.concurrentViewers)!=='undefined')?_.nFormatter(parseFloat(val_details.liveStreamingDetails.concurrentViewers), 1):0;
								
								post_meta = '<div class="entry-meta post-meta meta-font"><div class="post-meta-wrap"><div class="channel-url"><i class="fa fa-video-camera" aria-hidden="true"></i><a href="https://www.youtube.com/channel/'+(vid_channel)+'" target="_blank">'+(vid_channel_title)+'</a></div><div class="watching-count"><i class="fa fa-circle" aria-hidden="true"></i><span>'+(views_counter)+' Watching</span></div><div class="like-count"><i class="fa fa-thumbs-up" aria-hidden="true"></i><span class="like-count">'+(likes_counter)+'</span></div></div></div>';
								
								iframe_chat = '';
								
								break;
								
							case 'scheduled':
								
								var scheduledStartTime = (typeof(val_details.liveStreamingDetails)!=='undefined' && typeof(val_details.liveStreamingDetails.scheduledStartTime)!=='undefined')?val_details.liveStreamingDetails.scheduledStartTime:0;
								
								var scheduled_options = {
									year: '2-digit', month: '2-digit', day: '2-digit',
									hour: '2-digit', minute: '2-digit', second: '2-digit',
									timeZone: timezone,
									timeZoneName: 'short'
								}
								var formater 			= new Intl.DateTimeFormat(lang, scheduled_options);
								
								var startingDate 		= new Date(scheduledStartTime);
								var currentLocalTime 	= new Date();
								
								var hoursCD 			= Math.abs(startingDate - currentLocalTime) / 36e5;
								
								var time_iterv 			= startingDate.getTime()/1000 - currentLocalTime.getTime()/1000;
															
								var dateInNewTimezone 			= formater.format(startingDate);
								var currentdateInNewTimezone 	= formater.format(currentLocalTime);
								
								post_meta = '<div class="entry-meta post-meta meta-font"><div class="post-meta-wrap"><div class="channel-url"><i class="fa fa-video-camera" aria-hidden="true"></i><a href="https://www.youtube.com/channel/'+(vid_channel)+'" target="_blank">'+(vid_channel_title)+'</a></div><div class="watching-count"><i class="fa fa-circle" aria-hidden="true"></i><span>Scheduled for '+(dateInNewTimezone)+'</span></div><div class="like-count"><i class="fa fa-thumbs-up" aria-hidden="true"></i><span class="like-count">'+(likes_counter)+'</span></div></div></div>';
								
								vid_scheduled = '<div class="absolute-content checking-scheduled dark-background"><span><i class="fa fa-clock-o" aria-hidden="true"></i>&nbsp; <span class="reload-atl-control-'+(rnd_id)+'">'+(_.secondsToTime(time_iterv))+'</span></span><br><span class="scheduled-time-control"><i class="fa fa-podcast" aria-hidden="true"></i>&nbsp; '+(dateInNewTimezone)+'</span></div>';
								
								break;
								
							default:
								views_counter = (typeof(val_details.statistics)!=='undefined' && typeof(val_details.statistics.viewCount)!=='undefined')?_.nFormatter(parseFloat(val_details.statistics.viewCount), 1):0;
								
								post_meta = '<div class="entry-meta post-meta meta-font"><div class="post-meta-wrap"><div class="channel-url"><i class="fa fa-video-camera" aria-hidden="true"></i><a href="https://www.youtube.com/channel/'+(vid_channel)+'" target="_blank">'+(vid_channel_title)+'</a></div><div class="watching-count"><i class="fa fa-circle" aria-hidden="true"></i><span>'+(views_counter)+'</span></div><div class="like-count"><i class="fa fa-thumbs-up" aria-hidden="true"></i><span class="like-count">'+(likes_counter)+'</span></div></div></div>';
									
						}
						
						var post_content = '';						
						if(display_info=='on'){
							post_content = '<div class="vid-content dark-background">\
								<h3 class="h5-mobile post-title">'+(vid_title)+'</h3>\
								'+(post_meta)+'\
							</div>';
						}
								
						var html_player = '<div class="live-player-item live-player-item-control">\
							<div class="video-player-wrap">\
								<div class="video-player-ratio"></div>\
								<div class="video-player-content video-player-control">\
									<div class="player-3rdparty player-3rdparty-control" id="'+(rnd_id)+'-init">\
										<div id="'+(rnd_id)+'" class="player-api">\
										</div>\
										<div class="player-muted player-muted-control"><i class="fa fa-volume-off" aria-hidden="true"></i></div>\
									</div>\
									<div class="video-loading video-loading-control"><span class="video-load-icon"></span></div>\
								</div>\
								'+(vid_scheduled)+'\
							</div>\
							'+(post_content)+'\
							'+(iframe_chat)+'\
						</div>';
						
						$live_player_control.append(html_player);
						
						if(typeof(time_iterv)!=='undefined' && time_iterv>0){
							var time_iterv_action = null,
								crr_sch_time = time_iterv;														
							
							time_iterv_action = setInterval(function(){				
								crr_sch_time--;
								
								if($('.reload-atl-control-'+(rnd_id)).length === 0){
									clearInterval(time_iterv_action);
									return false;
								}
								
								if(crr_sch_time<=0){
									clearInterval(time_iterv_action);
									$('.reload-atl-control-'+(rnd_id)).text('00:00');
									api_load_live_video();
									return false;
								}
								$('.reload-atl-control-'+(rnd_id)).text(_.secondsToTime(crr_sch_time));				
							}, 1000);
						}else{
							if(time_iterv<=0){
								$('.reload-atl-control-'+(rnd_id)).text(vidorev_jav_js_object.translate_live_or_ended);
							}
						}
						
						if(autoplay==='on' && (status==='live' || status==='recent' || status==='completed') && _.global_live_yt_ready === 1){
							def_obj.sc_autoplay_valid = 'on';
							_.global_live_yt_ready++;
						}
						
						if(typeof(window.get_vidorev_build_fnc)!=='undefined' && window.get_vidorev_build_fnc!==null){
							window.get_vidorev_build_fnc.create_single_video_player(rnd_id, def_obj);
						}else{
							_.$el.on('get_vidorev_build_fnc', function(e){
								window.get_vidorev_build_fnc.create_single_video_player(rnd_id, def_obj);
							});
						}
						
						switch(status){
							case 'live':
								if(!crr_yvt.is('.status-live')){
									crr_yvt.addClass('status-live').removeClass('status-check status-offline recent-active scheduled-active completed-active').find('.live-bar-btn-ctrl[data-action="live"]').addClass('active-item');
								}
								break;
							case 'scheduled':
								if(!crr_yvt.is('.status-offline.scheduled-active')){
									crr_yvt.addClass('status-offline scheduled-active').removeClass('status-check status-live recent-active completed-active').find('.live-bar-btn-ctrl[data-action="scheduled"]').addClass('active-item');
								}
								break;
							
							case 'recent':
								if(!crr_yvt.is('.status-offline.recent-active')){
									crr_yvt.addClass('status-offline recent-active').removeClass('status-check status-live scheduled-active completed-active').find('.live-bar-btn-ctrl[data-action="recent"]').addClass('active-item');
								}
								break;
								
							case 'completed':
								if(!crr_yvt.is('.status-offline.completed-active')){
									crr_yvt.addClass('status-offline completed-active').removeClass('status-check status-live scheduled-active recent-active').find('.live-bar-btn-ctrl[data-action="completed"]').addClass('active-item');
								}
								break;		
								
						}						
					}
													
				},
				error: 		function(err){
					return;				
				}
			});
		}
		
		var reload_action = function(){
			
			_.global_live_yt_ready = 1;
			
			if(auto_refresh!='on'){
				return;
			}
			
			if(reloadTimeInterval!==null){
				clearInterval(reloadTimeInterval);
			}
			
			var currentReloadTime = 300;
			reloadTimeInterval = setInterval(function(){				
				currentReloadTime--;
				if(currentReloadTime<=0){
					clearInterval(reloadTimeInterval);
					api_load_live_video();
				}
				$reload_time_control.text(_.secondsToTime(currentReloadTime));				
			}, 1000);
		}
		
		var api_load_live_video = function(){
			
			reload_action();
			
			if(!crr_yvt.is('.sub-check-online.status-live') && !crr_yvt.is('.status-offline.scheduled-active') && !crr_yvt.is('.status-offline.recent-active') && !crr_yvt.is('.status-offline.completed-active') && !crr_yvt.is('.firstly-done')){					
				crr_yvt.addClass('status-check').removeClass('status-offline status-live recent-active scheduled-active completed-active').find('.live-bar-btn-ctrl').removeClass('active-item');
			}
			
			if(crr_yvt.find('.live-bar-btn-ctrl.user-click-item[data-action="live"]').length > 0){
				crr_yvt.addClass('status-check').removeClass('status-offline status-live recent-active scheduled-active completed-active').find('.live-bar-btn-ctrl').removeClass('active-item');
			}
			
			var rnd_url_live_id = 'cache_'+(Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 15));
			
			$.ajax({
				url: 		_.updateQueryStringParameter(live_url, 'vid_callback', encodeURIComponent(rnd_url_live_id)),
				type: 		'GET',
				cache: 		false,
				dataType: 	'jsonp',
				success: 	function(data){
					
					if(typeof(data.items)==='undefined' || typeof(data.items[0])==='undefined'){
						
						crr_yvt.find('.live-bar-btn-ctrl.user-click-item[data-action="live"]').removeClass('user-click-item');
						
						switch(fallback_options){
							case 'scheduled_live_video':
								api_load_scheduled_live_video();
								break;
							
							case 'recent_video':
								api_load_recent_video();
								break;
								
							case 'completed_live_video':
								api_load_completed_live_video();
								break;
						}
						
						crr_yvt.removeClass('sub-check-online');
												
						return;						
					}
										
					if( crr_yvt.is('.sub-check-online.status-live') || (crr_yvt.find('.live-bar-btn-ctrl.user-click-item:not([data-action="live"])').length > 0 && crr_yvt.is('.sub-check-online')) ){
						return;
					}
					
					crr_yvt.find('.live-bar-btn-ctrl').removeClass('active-item');
					crr_yvt.find('.live-bar-btn-ctrl.user-click-item[data-action="live"]').removeClass('user-click-item');
															
					if(!crr_yvt.is('.status-live')){					
						crr_yvt.find('.live-player-item-control').remove();
					}
									
					$.each(data.items, function( index, value ){
						
						if(typeof(value.id)!=='undefined' && typeof(value.id.videoId)!=='undefined'){
							append_html_player(value.id.videoId, 'live');								
						}
						
					});
					
					crr_yvt.addClass('sub-check-online firstly-done');
																							
				},
				error: 		function(err){
					crr_yvt.addClass('status-offline').removeClass('status-check status-live recent-active scheduled-active completed-active').find('.live-player-item-control').remove();
					crr_yvt.removeClass('sub-check-online');
					console.log(err);
					return;				
				}
			});		
		}
		
		var api_load_scheduled_live_video = function(){
			
			reload_action();
			
			if(crr_yvt.is('.status-offline.scheduled-active') || crr_yvt.find('.live-bar-btn-ctrl.user-click-item:not([data-action="scheduled"])').length > 0){					
				return;
			}
			
			crr_yvt.addClass('status-check').removeClass('status-offline status-live recent-active scheduled-active completed-active').find('.live-bar-btn-ctrl').removeClass('active-item');
			
			var rnd_url_scheduled_id = 'cache_'+(Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 15));
			
			$.ajax({
				url: 		_.updateQueryStringParameter(upcoming_url, 'vid_callback', encodeURIComponent(rnd_url_scheduled_id)),
				type: 		'GET',
				cache: 		false,
				dataType: 	'jsonp',
				success: 	function(data){
					
					if(typeof(data.items)==='undefined' || typeof(data.items[0])==='undefined'){
						
						crr_yvt.addClass('status-offline firstly-done').removeClass('status-check status-live recent-active scheduled-active completed-active').find('.live-player-item-control').remove();
						crr_yvt.find('.live-bar-btn-ctrl[data-action="scheduled"]').addClass('active-item');
						
						return;						
					}
					
					if(!crr_yvt.is('.status-offline.scheduled-active')){
						crr_yvt.find('.live-player-item-control').remove();
					}					
									
					$.each(data.items, function( index, value ){
						
						if(typeof(value.id)!=='undefined' && typeof(value.id.videoId)!=='undefined'){
							append_html_player(value.id.videoId, 'scheduled');								
						}
						
					});
					
					crr_yvt.addClass('firstly-done');
													
				},
				error: 		function(err){
					crr_yvt.addClass('status-offline firstly-done').removeClass('status-check status-live recent-active scheduled-active completed-active').find('.live-player-item-control').remove();
					console.log(err);
					return;				
				}
			});		
			
		}
		
		var api_load_recent_video = function(){
			
			reload_action();
			
			if(crr_yvt.is('.status-offline.recent-active') || crr_yvt.find('.live-bar-btn-ctrl.user-click-item:not([data-action="recent"])').length > 0){					
				return;
			}
			
			crr_yvt.addClass('status-check').removeClass('status-offline status-live recent-active scheduled-active completed-active').find('.live-bar-btn-ctrl').removeClass('active-item');
			
			var rnd_url_recent_id = 'cache_'+(Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 15));
			
			$.ajax({
				url: 		_.updateQueryStringParameter(recent_url, 'vid_callback', encodeURIComponent(rnd_url_recent_id)),
				type: 		'GET',
				cache: 		false,
				dataType: 	'jsonp',
				success: 	function(data){
					
					if(typeof(data.items)==='undefined' || typeof(data.items[0])==='undefined'){
						
						crr_yvt.addClass('status-offline firstly-done').removeClass('status-check status-live recent-active scheduled-active completed-active').find('.live-player-item-control').remove();
						crr_yvt.find('.live-bar-btn-ctrl[data-action="recent"]').addClass('active-item');
						
						return;						
					}
					
					if(!crr_yvt.is('.status-offline.recent-active')){
						crr_yvt.find('.live-player-item-control').remove();
					}					
									
					$.each(data.items, function( index, value ){
						
						if(typeof(value.id)!=='undefined' && typeof(value.id.videoId)!=='undefined'){
							append_html_player(value.id.videoId, 'recent');								
						}
						
					});
					
					crr_yvt.addClass('firstly-done');
													
				},
				error: 		function(err){
					crr_yvt.addClass('status-offline firstly-done').removeClass('status-check status-live recent-active scheduled-active completed-active').find('.live-player-item-control').remove();
					console.log(err);
					return;				
				}
			});	
			
		}
		
		var api_load_completed_live_video = function(){
			
			reload_action();
			
			if(crr_yvt.is('.status-offline.completed-active') || crr_yvt.find('.live-bar-btn-ctrl.user-click-item:not([data-action="completed"])').length > 0){					
				return;
			}
			
			crr_yvt.addClass('status-check').removeClass('status-offline status-live recent-active scheduled-active completed-active').find('.live-bar-btn-ctrl').removeClass('active-item');
			
			var rnd_url_completed_id = 'cache_'+(Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 15));
			
			$.ajax({
				url: 		_.updateQueryStringParameter(completed_url, 'vid_callback', encodeURIComponent(rnd_url_completed_id)),
				type: 		'GET',
				cache: 		false,
				dataType: 	'jsonp',
				success: 	function(data){
					
					if(typeof(data.items)==='undefined' || typeof(data.items[0])==='undefined'){
						
						crr_yvt.addClass('status-offline firstly-done').removeClass('status-check status-live recent-active scheduled-active completed-active').find('.live-player-item-control').remove();
						crr_yvt.find('.live-bar-btn-ctrl[data-action="completed"]').addClass('active-item');
						
						return;						
					}
					
					if(!crr_yvt.is('.status-offline.completed-active')){
						crr_yvt.find('.live-player-item-control').remove();
					}					
									
					$.each(data.items, function( index, value ){
						
						if(typeof(value.id)!=='undefined' && typeof(value.id.videoId)!=='undefined'){
							append_html_player(value.id.videoId, 'completed');								
						}
						
					});
					
					crr_yvt.addClass('firstly-done');
													
				},
				error: 		function(err){
					crr_yvt.addClass('status-offline firstly-done').removeClass('status-check status-live recent-active scheduled-active completed-active').find('.live-player-item-control').remove();
					console.log(err);
					return;				
				}
			});
			
		}
		
		switch(action){				
			case 'live':
				api_load_live_video();
				break;
				
			case 'scheduled':
				api_load_scheduled_live_video();
				break;
				
			case 'recent':
				api_load_recent_video();
				break;
				
			case 'completed':
				api_load_completed_live_video();
				break;		
		}
		
		crr_yvt.find('.live-bar-btn-ctrl').on('click', function(){
			var $t 			= $(this),
				d_action 	= $t.attr('data-action');
				
			crr_yvt.find('.live-bar-btn-ctrl').removeClass('user-click-item');	
			
			$t.addClass('user-click-item');
				
			if(typeof(d_action)!=='undefined' && d_action!=''){				
				switch(d_action){
					case 'live':
						api_load_live_video();
						break;
						
					case 'scheduled':
						api_load_scheduled_live_video();
						break;
						
					case 'recent':
						api_load_recent_video();
						break;
						
					case 'completed':
						api_load_completed_live_video();
						break;		
				}
			}
						
			return false;	
		});
	}
	
	vidorev_plugin.prototype.youtube_live_video = function(id){
		var _ 			= this,
			$yvl_wrapper = _.$el.find('.yvl-wrapper-control');
			
		if(typeof(id)!=='undefined' && id!=''){
			$yvl_wrapper = _.$el.find('.yvl-wrapper-control[id="'+(id)+'"]');
			console.log($yvl_wrapper);
		}	
		
		if($yvl_wrapper.length>0){
			$yvl_wrapper.each(function(index, element){
				var crr_yvt 	= $(this),
					crr_id		= crr_yvt.attr('id');
				
				if(typeof(crr_id)!=='undefined' && crr_id!='' && typeof(beeteam368_vid_live_json[crr_id])==='object'){
										
					var crr_obj 			= beeteam368_vid_live_json[crr_id];					
					_.youtube_live_video_pros(crr_yvt, crr_obj, 'live');
						
				}
			});
		}
	}
		
	/*destroy [Core]*/
	vidorev_plugin.prototype.destroy = function(){
		var _ = this;		
	}/*destroy [Core]*/
	
	/*jquery [Core]*/
	$.fn.J_vidorev_plugin = function(){
		var _ 		= this,
			opt 	= arguments[0],
			args 	= Array.prototype.slice.call(arguments, 1),
			l 		= _.length,
			i,
			ret;
		for(i = 0; i < l; i++) {
			if(typeof opt == 'object' || typeof opt == 'undefined'){
				_[i].J_vidorev_plugin = new vidorev_plugin(_[i], opt);
			}else{
				ret = _[i].J_vidorev_plugin[opt].apply(_[i].J_vidorev_plugin, args);
			}
			if (typeof ret != 'undefined'){				
				return ret;
			}
		}
		return _;
	}/*jquery [Core]*/
	
	/*ready [Core]*/
	$(document).ready(function(){
		var $b = $( 'body' ),
			options = { };
			
		$b.on(prefix+'init', function(e, fnc){
			console.log('VidoRev-plugin: library is installed, version 2.9.9.9.6.6');
			vidorev_builder_control = fnc;						
		});
			
		$b.J_vidorev_plugin( options );		
	});/*ready [Core]*/
			
}));