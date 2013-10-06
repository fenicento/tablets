angular.module('inter', ['ngSanitize'])
.controller('zoneCtrl', function ($scope, $http, $rootScope) {

$scope.safeApply = function(fn) {
  var phase = this.$root.$$phase;
  if(phase == '$apply' || phase == '$digest') {
    if(fn && (typeof(fn) === 'function')) {
      fn();
    }
  } else {
    this.$apply(fn);
  }
};

$http.get('countries-data.json')
   .then(function(res){
      $scope.zones = res.data;    
	  $scope.zones.sort(function(a,b){
	   if(a.in+a.out > b.in+b.out){ return -1}
	    if(a.in+a.out < b.in+b.out){ return 1}
	      return 0;
	});
	  $.each($scope.zones,function(i,v){
	  	console.log(v)
	  v.countries.sort(function(a,b){
	   if(a.in+a.out > b.in+b.out){ return -1}
	    if(a.in+a.out < b.in+b.out){ return 1}
	      return 0;
	});		
	  }); 

    });



$scope.inc=true;
$scope.outc=true;
$scope.filt="filt-both";

$scope.language="en";

	$scope.info = {
		it : "<p>L'applicazione esplora il fenomeno dell'internazionalizzazione che interessa il Politecnico di Milano, attraverso i dati relativi ai programmi scambio internazionale. I dati utilizzati, provenienti dall'International Exchange Office, sono relativi agli ultimi due anni accademici e sono stati suddivisi tra studenti di università straniere in entrata e studenti del Politecnico in uscita verso altre università.</p><p>Nella visualizzazione principale gli studenti sono stati rappresentati attraverso dei prismi collocati su una mappa geografica in corrispondenza delle nazioni interessate. La loro altezza indica il numero totale di studenti coinvolti in uno scambio internazionale e la distribuzione del gradiente mostra la proporzione di studenti in entrata e in uscita.</p><h4>TABLET</h4><p>Attraverso il tablet è possibile interagire con la visualizzazione principale, sia filtrando gli studenti in entrata e in uscita, sia selezionando i paesi o i continenti da visualizzare. Le frecce poste sopra il cerchio centrale permettono di filtrare gli studenti in entrata (a sinistra) e in uscita (a destra). È possibile accendere e spegnere entrambi i pulsanti insieme o alternativamente.</p><p>Dal pannello a sinistra si possono trascinare sia paesi che interi continenti all'interno del cerchio bianco centrale per ottenere un filtraggio sulla visualizzazione principale</p>.Ogni elemento inserito all’interno del cerchio può essere eliminato trascinandolo verso il basso.",
		en : "<p>The application explores the phenomenon of internationalization within Politecnico di Milano through the data on international exchange programs.</p><p>The data, coming from the International Exchange Office, are referred to the last two academic years and have been split into incoming students, from other universities, and outgoing students from Politecnico di Milano.</p><p>In the main screen the students have been represented through prisms placed on a geographical map corresponding to the countries involved. The prisms height indicates the total number of students involved in an international exchange program and the gradient distribution shows the proportion of incoming and outgoing students.</p><h4>TABLET</h4><p>The tablet allows to interact with the main display, both by filtering incoming and outgoing students and by selecting continents or specific countries to be visualized.</p><p>The arrows placed above the circle at the centre allow to filter incoming (on the right) and outgoing students (on the left). Both buttons can be turned on and off together or alternately. From the left panel you can drag both countries and entire continents into the central white circle in order to get a visual filtering on the main display.</p><p>Each element inserted into the circle can be deleted by dragging it downward.</p>"
	}

	$scope.translate = {

		it : {
			titolo : "L'Internazionalizzazione",
			SPAIN : "Spagna",
			FRANCE : "Francia",
			PORTUGAL : "Portogallo",
			GERMANY : "Germania",
			SWEDEN : "Svezia",
			BELGIUM : "Belgio",
			"UNITED KINGDOM" : "Gran Bretagna",
			POLAND : "Polonia",
			NETHERLANDS : "Olanda",
			FINLAND : "Finlandia",
			DENMARK : "Danimarca",
			SWITZERLAND : "Svizzera",
			AUSTRIA : "Austria",
			NORWAY : "Norvegia",
			"CZECH REPUBLIC" : "Repubblica Ceca",
			GREECE : "Grecia",
			LATVIA : "Lettonia",
			MALTA : "Malta",
			HUNGARY : "Ungheria",
			IRELAND : "Irlanda",
			CYPRUS : "Cipro",
			ESTONIA : "Estonia",
			LITHUANIA : "Lituania",
			SLOVENIA : "Slovenia",
			BRAZIL : "Brasile",
			"UNITED STATES" : "Stati Uniti",
			COLOMBIA : "Colombia",
			MEXICO : "Messico",
			CHILE : "Cile",
			CANADA : "Canada",
			ARGENTINA : "Argentina",
			ECUADOR : "Ecuador",
			NICARAGUA : "Nicaragua",
			CHINA : "Cina",
			TURKEY : "Turchia",
			JAPAN : "Giappone",
			RUSSIA : "Russia",
			ISRAEL : "Israele",
			"SOUTH KOREA" : "Sud Corea",
			INDIA : "India",
			SINGAPORE : "Singapore",
			LEBANON : "Libano",
			AUSTRALIA : "Australia",
			"SOUTH AFRICA" : "Sudafrica"
		},

		en : {
			titolo : "Internationalization",
			SPAIN : "Spain",
			FRANCE : "France",
			PORTUGAL : "Portugal",
			GERMANY : "Germany",
			SWEDEN : "Sweden",
			BELGIUM : "Belgium",
			"UNITED KINGDOM" : "United Kingdom",
			POLAND : "Poland",
			NETHERLANDS : "Netherlands",
			FINLAND : "Finland",
			DENMARK : "Denmark",
			SWITZERLAND : "Switzerland",
			AUSTRIA : "Austria",
			NORWAY : "Norway",
			"CZECH REPUBLIC" : "Czech Republic",
			GREECE : "Greece",
			LATVIA : "Latvia",
			MALTA : "Malta",
			HUNGARY : "Hungary",
			IRELAND : "Ireland",
			CYPRUS : "Cyprus",
			ESTONIA : "Estonia",
			LITHUANIA : "Lithuania",
			SLOVENIA : "Slovenia",
			BRAZIL : "Brazil",
			"UNITED STATES" : "United States",
			COLOMBIA : "Colombia",
			MEXICO : "Mexico",
			CHILE : "Chile",
			CANADA : "Canada",
			ARGENTINA : "Argentina",
			ECUADOR : "Ecuador",
			NICARAGUA : "Nicaragua",
			CHINA : "China",
			TURKEY : "Turkey",
			JAPAN : "Japan",
			RUSSIA : "Russia",
			ISRAEL : "Israel",
			"SOUTH KOREA" : "South Korea",
			INDIA : "India",
			SINGAPORE : "Singapore",
			LEBANON : "Lebanon",
			AUSTRALIA : "Australia",
			"SOUTH AFRICA" : "South Africa"
		}
	}

// funzione che cambia lingua globalmente
    $scope.setLanguage = function (language){
    	$scope.language = language; 
    }

$scope.toggleIn=function() {
	console.log($scope.inc)
	$scope.inc=!$scope.inc
	//if($scope.inc) osc.send('/filter',["in",1],ok,ko);
	//else osc.send('/filter',["in",0],ok,ko);
	if(!$scope.inc && !$scope.outc) $scope.filt="filt-none";
	else if($scope.inc && !$scope.outc) $scope.filt="filt-in";
	else if(!$scope.inc && $scope.outc) $scope.filt="filt-out";
	else $scope.filt="filt-both";

	$scope.safeApply();
	
}

$scope.toggleOut=function() {
	console.log($scope.outc)
	$scope.outc=!$scope.outc
	//if($scope.outc) osc.send('/filter',["out",1],ok,ko);
	//else osc.send('/filter',["out",0],ok,ko);
		if(!$scope.inc && !$scope.outc) $scope.filt="filt-none";
	else if($scope.inc && !$scope.outc) $scope.filt="filt-in";
	else if(!$scope.inc && $scope.outc) $scope.filt="filt-out";
	else $scope.filt="filt-both"

	$scope.safeApply();
}

})

.directive('draggable', function($rootScope) {
    return {
        // A = attribute, E = Element, C = Class and M = HTML Comment
        restrict:'A',
        link: function(scope, element, attrs) {

        	$rootScope.$on('deleted', function(e) {
			scope.checkSel();
			scope.$apply();
			//scope.checkSel();
			});
		     $rootScope.$on('added', function(e) {
			scope.checkSel();
			scope.$apply();
		     });

            element.draggable({
                revert:'invalid',
                helper:'clone',
                appendTo: 'body',
                start: function(event, ui) {
                	ui.helper.data('dropped', false);
                	if(scope.country) {
                		scope.country.sel=true
                		console.log()
                		//$(ui.helper).attr("ng-model","country");
                		scope.$apply();
                	}
                	else if(scope.zone) {
                		scope.zone.sel=true
                		$.each(scope.zone.countries,function(i,v){
                			v.sel=true
                		});
                		//$(ui.helper).attr("ng-model","zone");
                		scope.$apply();
                	}
                	$(ui.helper).addClass("helper");

                },
                stop: function(event, ui) {
                	//console.log(scope)
                	if(!ui.helper.data('dropped')){
                		if(scope.country) {
                		scope.country.sel=false
                		scope.$apply();
                	}
                	else if(scope.zone) {
                		scope.zone.sel=false
                		$.each(scope.zone.countries,function(i,v){
                			v.sel=false
                		});
                		scope.$apply();
                	}
                	}
                }
            });

			scope.checkSel=function() {
				if(scope.country) {
				scope.$watch("country",function(newVal,oldVal) {
					//console.log(newVal)
		        	if(!newVal.sel) {
		        		element.draggable('enable')
		        		
		        	}
		        	else {
		        		element.draggable('disable')

		        		
		        	}
		        });
			}
			else if(scope.zone) {
		     	scope.$watch("zone",function(newVal) {
				//console.log(newVal)
		        	
		        	if(!newVal.sel) element.draggable('enable')
		        	else {
		        		element.draggable('disable')
		        	}
		        });
	     }	
			}

			
	     

	    }

    }
})
.directive('droppable', function($compile) {
    return {
        // A = attribute, E = Element, C = Class and M = HTML Comment
        restrict:'A',
        link: function(scope, element, attrs) {
            element.droppable(
			{
				accept: ".country , .continent",
			    drop: function(event, ui)
			    {
			        ui.helper.data('dropped', true);
			        ui.draggable.draggable('disable')

			        var ne = $(ui.draggable);

			        //check if continent, remove countries
			        if($(ui.helper).hasClass('continent')) {
			        	
						for (e=0; e<ne.scope().zone.countries.length; e++) {
			        			if (ne.scope().zone.countries[e].sel) {
			        			//osc.send('/addCountry',ne.scope().zone.countries[e].name,ok,ko)
			        		}
			        			//console.log(ne.scope().zone.countries[e]);
			        	}

			        	$.each($('.token'),function(c,v){
		
			        		inds=$(v).attr('indexes').split("-");
			        		if(inds[1]==ne.scope().$index) {
			        				
			        			$(v).hide('scale',{done:function(){$(v).remove();}},200);
			        			
			        		}
			        	});
			        }

			        else {

			        	if (ne.scope().country.sel) {
			        			//osc.send('/addCountry',ne.scope().country.name,ok,ko)
			        		}


			        }

			        //moprh draggable
			        var newDiv = $(ui.helper).clone(true)
	               .removeClass('ui-draggable-dragging')
	               .removeClass('helper')
	               .removeClass('country')
	               .removeClass('continent')
	               .addClass('token')
	               .attr('indexes',ne.scope().$index+"-"+ne.scope().$parent.$index)
	               .attr('trashable','')
	               .attr('styleclass','filt')
	               .attr('data','zones')
	               .removeAttr('draggable')
	               .css({position:'absolute',color:'#000'})

	               //add binding
	               var el=$compile(newDiv)(scope);
	           	   $(this).append(el);
	           	   scope.$emit('added')
	           	   scope.$apply()
	           	   
	           	   
			    }
			});
        }
    }
})
.directive('trashable', function() {
    return {
        // A = attribute, E = Element, C = Class and M = HTML Comment
        restrict:'A',
        transclude:true,
        template: "<div ng-class=\"color\">{{struct.name.toLowerCase()}}</div>",
        replace:true,
        scope:{color:'=styleclass',zones: '=data'},
        link: function(scope, element, attrs,ngModel) {
        	indexes=element.attr('indexes')
        	var ind=indexes.split("-")
               	if(ind[1]=='undefined') {
        		scope.struct=scope.zones[ind[0]]
        		element.addClass('cont')
        	}
        	else {
        		scope.struct=scope.zones[ind[1]].countries[ind[0]]
        		}

            element.draggable({
                revert:'invalid',
                appendTo: 'body',

                start: function(event, ui) {
                	$('#del').show()
                },
                stop: function(event, ui) {
                	$('#del').hide()	
                }
            });
        }
    }
})
.directive('bin', function($rootScope) {
    return {
        // A = attribute, E = Element, C = Class and M = HTML Comment
        restrict:'A',
        link: function(scope, element, attrs) {
            element.droppable(
			{
				accept: ".token",
			    drop: function(event, ui)
			    {
			       s=$(ui.draggable).scope()
			       $(ui.draggable).hide('scale',{done:function(){$(ui.draggable).remove();}},200)
			       s.struct.sel=false;
			       //osc.send('/removeCountry',s.struct.name,ok,ko)
			       if(s.struct.countries) {
			       	for(c in s.struct.countries) {
			       		
			       		//osc.send('/removeCountry',s.struct.countries[c].name,ok,ko)
			       		s.struct.countries[c].sel=false;
			       	}
			       }
			       s.$emit('deleted')
			       s.$apply()
			    }
			});
        }
    }
})
