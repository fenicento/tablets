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

    $scope.keys=ke;
    $scope.selected="";
    $scope.key="";

    // settiamo Lingua
    $scope.language="en";

    $scope.info = {
        it : "<p>L'applicazione esplora le parole chiave più utilizzate dalle tesi di laurea del Politecnico di Milano. I dati utilizzati, forniti dal servizio POLITesi, sono relativi alle tesi di laurea e di dottorato presenti sul portale online, a partire dal 2010. Le parole sono categorizzate sia sulla base delle diverse Scuole e aggregate per macro area - Ingegneria, Architettura, Design.<p/><p>Nella visualizzazione principale le parole chiave sono rappresentate attraverso cerchi colorati disposti nello spazio a seconda della loro presenza all'interno delle tesi sviluppate nelle delle diverse facoltà, posizionate all'esterno come punti di aggregazione. Le parole che si trovano in una posizione centrale sono quelle maggiormente condivise dalle tesi sviluppate nelle facoltà visualizzate.</p><h4>TABLET</h4><p>Attraverso l'interazione con il tablet è possibile selezionare facoltà specifiche all'interno delle tre categorie principali, trascinandole dentro il cerchio bianco centrale. Ogni elemento inserito nel cerchio può essere eliminato trascinandolo verso il basso. Il campo di ricerca permette di cercare parole chiave specifiche, se presenti nei dati, per osservarne la presenza nelle diverse aree. La parola ricercata viene evidenziata sulla visualizzazione principale creando i collegamenti con le aree in cui viene utilizzata e mostrando il rispettivo numero di occorrenze.</p>",
        en : "<p>The application explores the keywords used in thesis at Politecnico di Milano. The data, provided by POLITesi service are referred to Bachelor, Master and PhD thesis uploaded on the platform since 2010. The keywords are categorized according to the different schools and aggregated by macro area - Engineering, Architecture, Design.</p>In the main screen keywords are displayed as coloured circles, which spatial distribution reflects their presence within the thesis developed in the different Schools, placed outwards as aggregation points. The keywords in a central position are shared by the thesis developed in the selected Schools.</p><h4>TABLET</h4><p>By interacting with the tablet you can select specific Schools between the three categories, dragging them into the white circle at the centre. Each element inserted into the circle can be deleted by dragging it downward. The search field allows to search for specific keywords, if present in the dataset, in order to observe their presence within the different areas.</p>The searched word will be highlighted in the main screen by creating links with the areas in which it is used and showing the respective number of occurrences."
    }

    $scope.translate = {
        
        it : {
            titolo : "Ricerca",
            Ingegneria : "ingegneria",
            Architettura : "architettura",
            Design : "design",
            Organizzazioni : "organizzazioni",
            Persone : "persone",
            Luoghi : "luoghi"
        },

        en : {
            titolo : "Research",
            Ingegneria : "Engineering",
            Architettura : "Architecture",
            Design : "Design",
            Organizzazioni : "Organizations",
            Persone : "People",
            Luoghi : "Places"
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
        //osc.send('/search',$scope.key,ok,ko)
        

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
                	else if(scope.faculty) {
                		scope.faculty.sel=true
                		$.each(scope.faculty.schools,function(i,v){
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
                          $.each(scope.faculty.schools,function(i,v){
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
    else if(scope.faculty) {
        scope.$watch("faculty",function(newVal) {
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
                accept: ".faculty,.school,.token",
                tolerance: "touch",
                greedy: true,
                drop: function(event, ui)
                {
                    if (!$(ui.helper).hasClass('token')) {
                     ui.helper.data('dropped', true);
                     ui.draggable.draggable('disable')

                     var ne = $(ui.draggable);

			        //check if continent, remove countries
			        if($(ui.helper).hasClass('faculty')) {
			        	
                      for (e=0; e<ne.scope().faculty.schools.length; e++) {
			        			//osc.send('/removeToken',ne.scope().faculty.schools[e].name,ok,ko)
			        			console.log(ne.scope().faculty.schools[e]);
                          }
			        			//osc.send('/addToken',ne.scope().faculty.name,ok,ko)

                                $.each($('.token'),function(c,v){

                                   inds=$(v).attr('indexes').split("-");
                                   if(inds[1]==ne.scope().$index) {

                                      $(v).hide('scale',{done:function(){$(v).remove();}},200);

                                  }
                              });
                            }
			       // else //osc.send('/addToken',ne.scope().school.name,ok,ko)

			        //moprh draggable
			        var newDiv = $(ui.helper).clone(true)
                    .removeClass('ui-draggable-dragging')
                    .removeClass('helper')
                    .removeClass('school')
                    .removeClass('faculty')
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
          else {
              scope.struct=scope.zones[ind[1]].schools[ind[0]]
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
			       //osc.send('/removeToken',s.struct.name,ok,ko)
			       if(s.struct.schools) {
			       	for(c in s.struct.schools) {
			       		
			       		//osc.send('/removeToken',s.struct.schools[c].name,ok,ko)
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
                var results = $.ui.autocomplete.filter(scope[iAttrs.uiItems], request.term);

                response(results.slice(0, 2));
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
});