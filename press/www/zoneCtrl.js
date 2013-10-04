function zoneCtrl($scope,$http,$rootScope) {

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

$scope.resetKey= function() {
	$scope.key="";
	osc.send('/search','#',ok,ko);
};

$rootScope.$on('search', function(e,s) {

    $scope.key=s;
    osc.send('/search',$scope.key,ok,ko)
    

});

}

angular.module('inter', [])
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

			        //check if continent, remove countries
			        if($(ui.helper).hasClass('entity')) {
			        	
						for (e=0; e<ne.scope().entity.schools.length; e++) {
			        			osc.send('/removeToken',ne.scope().entity.schools[e].name,ok,ko)
			        			console.log(ne.scope().entity.schools[e]);
			        			}
			        			//osc.send('/addToken',ne.scope().entity.name,ok,ko)

			        	$.each($('.token'),function(c,v){
		
			        		inds=$(v).attr('indexes').split("-");
			        		if(inds[1]==ne.scope().$index) {
			        				
			        			$(v).hide('scale',{done:function(){$(v).remove();}},200);

			        		}
			        	});
			        }
			        //else osc.send('/addToken',ne.scope().school.name,ok,ko)

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
})
.directive('timeline', function($timeout) {
	
	
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
		if (cury!=year) {
			iElement.append("<div year=\""+cury+"\" id=\""+cury+"\" class='year'><div class='year-pad'></div><div class='month-cont'></div></div>")
			year=cury;
		}
		$("#"+year+" .month-cont").append("<div month=\""+curm+"\" class='month'></div>");
	}
	$(".year-pad").on('click', function(v) {
		console.log($(v.target).siblings())
		$(v.target).siblings()[0].slideToggle();
		
	});
	
}
}
});


