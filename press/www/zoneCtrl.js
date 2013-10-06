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

	$http.get('fac-data.json')
	.then(function(res){
		$scope.zones = res.data;    

	});

	$http.get('entities.json')
	.then(function(res){
		$scope.keys = res.data;    

	});

	$scope.rele=[]
	$scope.relorgs=[]
	$scope.relpeople=[]
	$scope.relplaces=[]
	$scope.selected="";
	$scope.key="";
	$scope.y1="";
	$scope.y2="";
	$scope.y="";
	$scope.m="";

	$scope.language="en";

	$scope.info = {
		it : "<p>L'applicazione esplora la presenza del Politecnico di Milano nella stampa nazionale attraverso le entità menzionate negli articoli. I dati utilizzati sono stati ottenuti attraverso una ricerca degli articoli contenenti l'espressione 'Politecnico di Milano' all'interno degli archivi storici online di Corriere della Sera e la Repubblica. La ricerca è stata effettuata per il periodo dal 1992 al 2013 e sono state estratte le entità associate agli articoli, suddivise tra 'organizzazioni', 'persone' e 'luoghi'.</p><p>La visualizzazione principale presenta l'evoluzione temporale, mese per mese, della rete di entità connesse al Politecnico di Milano. Nella parte sottostante è possibile vedere le entità più utilizzate, suddivise per tipologia, nell'intero periodo.</p><h4>TABLET</h4><p>Tramite il tablet è possibile visualizzare periodi temporali specifici, sia selezionando un intervallo sia in modo puntuale, selezionando un singolo mese sulla linea temporale. Il campo di ricerca permette di cercare entità specifiche, se presenti nei dati, per esplorarne l'evoluzione all'interno della visualizzazione principale. Il pannello di sinistra evidenzia sia le famiglie di entità sia le entità più utilizzate che possono essere trascinate nel cerchio centrale per produrre dei filtri visivi sulla visualizzazione principale.Ogni elemento inserito nel cerchio può essere eliminato trascinandolo verso il basso.</p>",
		en : "<p>The application explores the presence of Politecnico di Milano in the Italian press through the entities mentioned within the articles. The data have been extracted by searching the historical online archives of Corriere della Sera and la Repubblica, querying the expression \"Politecnico di Milano\". The search has been performed for the period from 1992 and 2013 and we extracted the entities associated to the articles, split into \"organizations\", \"people\" and \"places\".</p><p>The main display presents the temporal evolution per month of the network of entities related to Politecnico di Milano. In the bottom part you can observe the most frequent entities in the whole period, divided by typology.</p><p><h4>TABLET</h4><p>The interaction with the tablet allows to select specific time frames, by selecting an interval or a single month in the timeline. The search field allows to look for specific entities, if present in the dataset, in order to explore their evolution in the main display. The left panel highlights both the categories and the single top entities which can be dragged into the central white circle in order to produce visual filters on the main display. Each element inserted into the circle can be deleted by dragging it downward.</p>"
	}

	$scope.translate = {

		it : {
			titolo : "La Stampa",
			Ingegneria : "ingegneria",
			Architettura : "architettura",
			Design : "design",
			Organizations : "organizzazioni",
			People : "persone",
			Places : "luoghi"
		},

		en : {
			titolo : "Press",
			Ingegneria : "Engineering",
			Architettura : "Architecture",
			Design : "Design",
			Organizations : "Organizations",
			People : "People",
			Places : "Places"
		}
	}

    // funzione che cambia lingua globalmente
    $scope.setLanguage = function (language){
    	$scope.language = language; 
    }

    $scope.resetKey= function() {
    	$scope.key="";
    	//osc.send('/search','#',ok,ko);
    };

    $rootScope.$on('search', function(e,s) {
    	$scope.key=s;
    	//osc.send('/search',s,ok,ko);
    });

    $scope.addKey= function(s) {
    	$scope.key=s;
    	//osc.send('/search',s,ok,ko);
    };


    $scope.findRel = function(s,t) {

    	rel=[]
    	for(i in $scope.keys) {
    		if($scope.keys[i].t==t) {
    			if($.inArray(s,$scope.keys[i].p)>=0) {
    				console.log(s,$scope.keys[i].p[$.inArray(s,$scope.keys[i].p)])
    				rel.push($scope.keys[i].n);
    			}
    		}
    		if(rel.length>=5) break;
    	}
    	console.log(rel);
    	return rel;
    };
    $scope.findRelInterval = function(s1,s2,t) {

    	rel=[]
    	for(i in $scope.keys) {
    		if($scope.keys[i].t==t) 
    			for(l in $scope.keys[i].p) {
    				if($scope.keys[i].p[l].substr(0,4)>=s1 && $scope.keys[i].p[l].substr(0,4)<=s2) {
    					rel.push($scope.keys[i].n)
    					break;
    				}

    			}
    			if(rel.length>=5) break;
    		}
    		console.log(rel);
    		return rel;
    	};


    	$rootScope.$on('interval', function(e,s) {
    		$scope.y1=s[0];
    		$scope.y2=s[1];
    		$scope.relorgs=$scope.findRelInterval($scope.y1,$scope.y2,1)
    		$scope.relpeople=$scope.findRelInterval($scope.y1,$scope.y2,2)
    		$scope.relplaces=$scope.findRelInterval($scope.y1,$scope.y2,3)
    		$scope.rele=[$scope.relorgs,$scope.relpeople,$scope.relplaces]
    		$scope.$apply();
    	});

    	$rootScope.$on('singleDate', function(e,s) {
    		ssplit=s.split("#");
    		$scope.m=ssplit[1];
    		$scope.y=ssplit[0];
    		$scope.relorgs=$scope.findRel(s,1)
    		$scope.relpeople=$scope.findRel(s,2)
    		$scope.relplaces=$scope.findRel(s,3)
    		$scope.rele=[$scope.relorgs,$scope.relpeople,$scope.relplaces]
    		$scope.$apply();
    	});


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
        			if(scope.school) {
        				scope.school.sel=true
        				console.log($(ui.helper))
                		//$(ui.helper).attr("ng-model","country");
                		scope.$apply();
                	}
                	else if(scope.entity) {
                		scope.entity.sel=true
                		$.each(scope.entity.schools,function(i,v){
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
                		if(scope.school) {
                			scope.school.sel=false
                			scope.$apply();
                		}
                		else if(scope.zone) {
                			scope.school.sel=false
                			$.each(scope.entity.schools,function(i,v){
                				v.sel=false
                			});
                			scope.$apply();
                		}
                	}
                }
            });

scope.checkSel=function() {
	if(scope.school) {
		scope.$watch("school",function(newVal) {
					//console.log(newVal)
					if(!newVal.sel) {
						element.draggable('enable')

					}
					else {
						element.draggable('disable')

					}
				});
	}
	else if(scope.entity) {
		scope.$watch("entity",function(newVal) {
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
        		accept: ".entity,.school,.token",
        		tolerance: "touch",
        		greedy: true,
        		drop: function(event, ui)
        		{
        			if (!$(ui.helper).hasClass('token')) {
        				ui.helper.data('dropped', true);
        				ui.draggable.draggable('disable')

        				var ne = $(ui.draggable);


			        //moprh draggable
			        var newDiv = $(ui.helper).clone(true)
			        .removeClass('ui-draggable-dragging')
			        .removeClass('helper')
			        .removeClass('school')
			        .removeClass('entity')
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
        template: "<div ng-class=\"color\">{{struct.name}}</div>",
        replace:true,
        scope:{color:'=styleclass',zones: '=data'},
        link: function(scope, element, attrs,ngModel) {
        	indexes=element.attr('indexes')
        	var ind=indexes.split("-")
        	if(ind[1]=='undefined') {
        		scope.struct=scope.zones[ind[0]]
        		element.addClass('cont')
        		element.html(scope.struct.label)
        		element.addClass(scope.struct.name)
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
			       ////osc.send('/removeToken',s.struct.name,ok,ko)
			       if(s.struct.schools) {
			       	for(c in s.struct.schools) {
			       		
			       		////osc.send('/removeToken',s.struct.schools[c].name,ok,ko)
			       		s.struct.schools[c].sel=false;
			       	}
			       }
			       s.$emit('deleted')
			       s.$apply()
			   }
			});
        }
    }
})
.directive('autoComplete', function($timeout) {
	return function(scope, iElement, iAttrs) {
		console.log(iAttrs)
		iElement.autocomplete({
			source: function(request, response) {

				arr=$.map(scope[iAttrs.uiItems], function( n, i ) {
					return n.n;
				});
				var results = $.ui.autocomplete.filter(arr, request.term);
				console.log(request,response)
        //console.log(scope)
        //console.log(iAttrs.uiItems)
        response(results.slice(0, 2));
    },
    focus: function( event, ui ) {
    	console.log("here")
    	console.log(ui)
    	return false;
    },
    position:{ of:"input"},
    appendTo: "#top-side",
    select: function() {
    	$timeout(function() {
    		iElement.trigger('input');
    		console.log($('input').val())
    		scope.$emit('search',$('input').val());
    		$('input').val('')

    	}, 0);
    }
});
	};
})
.directive('timeline', function($rootScope) {
	
	
	return {
		template: "<div id='timeline'></div>",
		restrict:"A", 
		replace:'true',
		link: function(scope, iElement, iAttrs) {

    	//Build timeline
    	var format = d3.time.format("%Y-%m-%d");
    	var interval = d3.time.month
    	var intm=interval.range( format.parse("1992-01-01"),format.parse("2013-09-01"));
    	year=0;

		//cycle months
		for(n in intm) {
			console.log();
			cury=intm[n].getFullYear();
			curm=intm[n].getMonth();

		//new year
		if (cury!=year) {
			iElement.append("<div year=\""+cury+"\" id=\""+cury+"\" class='year'><div class='year-pad'></div><div class='month-cont'></div></div>")
			year=cury;
			if(cury % 5==0) $("#"+year).prepend("<div class='y-label'> "+year+"</div>")
		}
	//add months
	$("#"+year+" .month-cont").append("<div month=\""+curm+"\" class='month "+(curm+1)+"'></div>");
}
	//slide toggle
	$(".year-pad").on('click', function(v) {
		v.preventDefault();
		$(v.target).siblings().toggle();
	});

	//bind touchmove
	var yearArr=[];

	function highlightHoveredObject(x, y) {
		$('.year-pad').each(function() {
      // check if is inside boundaries
      if (!(
      	x <= $(this).offset().left || x >= $(this).offset().left + $(this).outerWidth() ||
      	y <= $(this).offset().top-300  || y >= $(this).offset().top + $(this).outerHeight()+300
      	)) {
      	var par=$(this).parent();
      if($.inArray(yearArr,par.attr("id"))<0) yearArr.push(par.attr('id'));
      $(this).addClass('on');
  }
});
	}
	$("#main").bind("touchstart", function(evt){
		$('.year-pad').removeClass("on")
		yearArr=[]
	});

	$("#timeline").bind("touchmove", function(evt){
		var touch = evt.originalEvent.touches[0]
		highlightHoveredObject(touch.clientX, touch.clientY);
	});

	$("#timeline").bind("touchend", function(evt){
		yearArr.sort(SortByName);
		console.log([yearArr[0],yearArr[yearArr.length-1]]);
		if(yearArr[0]!=0 && yearArr[0]!="0" && yearArr[yearArr.length-1] != 0 && yearArr[yearArr.length-1]!="0") {
			scope.$emit('interval',[yearArr[0],yearArr[yearArr.length-1]]);
			//osc.send('/interval',[yearArr[0]+"",yearArr[yearArr.length-1]+""],ok,ko)
		}
	});

	$(".month").on("click",function(evt) {
		$(this).addClass("on");
		$(this).parent().hide();
		m=$(this).attr('month')
		y=$(this).parent().parent().attr('year');
		if(m!=0 && m!="0" && m!==undefined && y!=0 && y!="0") {
			//osc.send('/querydb',[m+"",y+""],ok,ko)
			scope.$emit('singleDate',y+"#"+m);
		}

	}); 

} // end link function
}
});


