var Preloader = null;

(function($) {

Preloader = {	
	show : function() {
		$('#preloader').show('fade');
	},
	
	hide : function() {
		$('#preloader').hide(fade);
		$('#preloader-text').text('Wczytywanie danych. ProszÄ czekaÄ');
	},
	
	add : function(selector) {
		var html = 
		'<div class="dialog-preloader">'+
			'<div class="back"></div>'+
			'<div class="label">'+
				'<img src="/images/preloader-32.gif"/>'+
				'<span>ProszÄ czekaÄ...</span>'+
			'</div>'+
		'</div>';
	
		var preloader = $(html);
		selector.append(preloader);	
		preloader.show();
		
		return preloader;		
	},
	
	setText : function(type) {
		
		var text = 'Wczytywanie danych. ProszÄ czekaÄ';
		
		switch(type){
			case 'pdf': 
				text = 'Trwa generowanie PDF. MoĹźe to potrwaÄ okoĹo jednej minuty.';
				break;
		}
		
		$('#preloader-text').text(text);
	}
}

})(jQuery);

$(window).bind('beforeunload',function(){

	setTimeout(function(){Preloader.show()}, 100);
});

/* automatyczne zgaszenie preloadera dla buttonĂłw pobierajÄcych pliki*/
$(document).ready(function(){
    $(document).on("click", ".btn-auto-hide-preloader" , function() {
		
        if($(this).hasClass('btn-preloader-pdf')){

                Preloader.setText('pdf');
        }else{

                Preloader.setText(null);
        }

        setTimeout(function(){Preloader.hide()}, 7000);
    });
    
    $(document).on("click", ".btn-auto-hide-preloader-2000" , function() {
        setTimeout(function(){Preloader.hide()}, 2000);
    });    
});