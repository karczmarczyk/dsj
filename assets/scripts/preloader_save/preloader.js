var PreloaderSave = null;

(function($) {

PreloaderSave = {	
	show : function() {
		$('#preloader-save').show();
	},
	
	hide : function() {
		$('#preloader-save').hide();
		$('#preloader-text').text('Wczytywanie danych. ProszÄ czekaÄ');
	},
	
	add : function(selector) {
		var html = 
		'<div class="dialog-preloader-save">'+
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