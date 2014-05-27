console.log('keyboard');


var SCORE_PENALIZE_MOUSE = 5;

var sec = 0;
var game_running = false;

var messages =
	{
	stage_1: "Copy this first and last name to the appropriate fields on the left ..."
	}


var tmr_warning;
var penalized = false;
var current_stage = 0;

var timer_game;

function increment_timer(){
	sec += 1;
	
	//TODO: dot milisecond display
	$('#score').text( sec + ' sec' );
	
	timer_game = setTimeout( increment_timer, 1000 );
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
			$('#score').text( sec + ' sec' );
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
		
	}
	
	game_running = true;

	//Start the timer!
	timer_game = setTimeout( increment_timer, 1000 );
}

function show_complete_stage(){
	//STOP the timer
	clearTimeout( timer_game );
	
	console.log('completed!');
	
	$('.message').text( "Stage " + current_stage + " completed!" ).addClass('alert-success').removeClass('alert-info');

	game_running = false;
}