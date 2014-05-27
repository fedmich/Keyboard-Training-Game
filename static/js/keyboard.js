console.log('keyboard');


var SCORE_PENALIZE_MOUSE = 5;

var sec = 0;
var sec_ms = 0;
var game_running = false;

var messages =
	{
	stage_1: "Copy this first and last name to the appropriate fields on the left ..."
	, stage_2 : "Now type the following in the comments field:"
	}


var tmr_warning;
var penalized = false;
var current_stage = 0;

var timer_game;
var timer_game2;

function increment_timer(){
	sec += 1;
	
	display_time();
	
	timer_game = setTimeout( increment_timer, 1000 );
}

function increment_timer_ms (){
	sec_ms += 1;
	if( sec_ms > 9){
		sec_ms = 0;
	}
	display_time();

	timer_game2 = setTimeout( increment_timer_ms, 100 );
}

function display_time(){
	$('#score').text( sec + '.' + sec_ms + ' sec' );
}


var box_penalty;
$(function() {
	box_penalty = $('.erro_msg_penalty');
	
	$('.btn_startgame').focus().click(function(){
		//Intro box
		$('.pre-game').hide();
		
		//Show the boxes
		$('.score_box').show();
		$('.game_start').show();
		
		setup_stage( 1 );
	$('.play_next').click(function(){
		$('.stage_completed').hide();

		current_stage += 1;
		setup_stage( current_stage );
	});
});


function hookup_mouse(){
	$('.no_mouse').hover( function (){
		if(! game_running ){
			return false;
		}
		var err_box = $('.error_mouse');
		err_box.addClass('alert-danger').removeClass('alert-warning');
		
		if( tmr_warning ){
			clearTimeout( tmr_warning );
		}
		
		if(! penalized){
			sec = sec + SCORE_PENALIZE_MOUSE;
			
			box_penalty.show();
			display_time();
		}
		penalized = true;
		
		tmr_warning = setTimeout( function (){
			err_box.addClass('alert-warning').removeClass('alert-danger');
			box_penalty.hide();
			
			penalized = false;
			
		}, 4000 );
	}, function (){
		//mouse out!
		
		
	});
}


function setup_stage ( stage_num ){
	current_stage = stage_num;
	$('#stage').text( current_stage );
	
	$('.message').text( messages[ "stage_" + stage_num ] );
	
	$('.stage').hide();
	$('.stage_' + current_stage ).show();

	switch( stage_num ){
	case 1:
		
		hookup_mouse();	//must only be done once!
		
		$('#first, #last').keypress( function ( event ){
			event.preventDefault();
		});
		$('#first, #last').bind("paste", function (){
			
			//set time out so this will trigger 100ms after paste-ing
			setTimeout(function(){
				console.log( $('#first').val() );
				console.log( $('#last').val() );
				
				if(
					$('#first').val() == 'John'
					&& $('#last').val() == 'Smith'
					){
					
					show_complete_stage();
				}
			}, 100);
			
		});
		
		break;
	case 2:
		var correct_answer = $.trim( $('.stage_2').text() );
		var obj_text = $('#comments');
		obj_text.keypress( function ( event ){

			//set time out so this will trigger 100ms after keypress-ing
			setTimeout(function(){

				var user_text = $.trim( obj_text.val() );
				if( user_text == correct_answer ){
					show_complete_stage();
				}

			} , 100);
		});
	}
	
	game_running = true;

	//Start the timer!
	timer_game = setTimeout( increment_timer, 1000 );

	//Start the ms timer!
	timer_game2 = setTimeout( increment_timer_ms, 100 );
}

function show_complete_stage(){
	//STOP the timers
	clearTimeout( timer_game );
	clearTimeout( timer_game2 );
	
	console.log('completed!');
	
	$('.message').text( "Stage " + current_stage + " completed!" ).addClass('alert-success').removeClass('alert-info');

	game_running = false;

	$('.stage').hide();
	$('.stage_completed').show();

	$('.play_next').focus();
}