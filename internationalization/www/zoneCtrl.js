function zoneCtrl($scope,$http) {

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

$scope.toggleIn=function() {
	console.log($scope.inc)
	$scope.inc=!$scope.inc
	if($scope.inc) osc.send('/filter',["in",1],ok,ko);
	else osc.send('/filter',["in",0],ok,ko);
	if(!$scope.inc && !$scope.outc) $scope.filt="filt-none";
	else if($scope.inc && !$scope.outc) $scope.filt="filt-in";
	else if(!$scope.inc && $scope.outc) $scope.filt="filt-out";
	else $scope.filt="filt-both";

	$scope.safeApply();
	
}

$scope.toggleOut=function() {
	console.log($scope.outc)
	$scope.outc=!$scope.outc
	if($scope.outc) osc.send('/filter',["out",1],ok,ko);
	else osc.send('/filter',["out",0],ok,ko);
		if(!$scope.inc && !$scope.outc) $scope.filt="filt-none";
	else if($scope.inc && !$scope.outc) $scope.filt="filt-in";
	else if(!$scope.inc && $scope.outc) $scope.filt="filt-out";
	else $scope.filt="filt-both"

	$scope.safeApply();
}

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
				scope.$watch("country",function(newVal) {
					//console.log(newVal)
		        	if(!newVal.sel) {
		        		element.draggable('enable')
		        		
		        	}
		        	else {
		        		element.draggable('disable')
		        		osc.send('/addCountry',scope.country.name,ok,ko)
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
			        			osc.send('/removeCountry',ne.scope().countries[e].name,ok,ko)
			        			console.log(ne.scope().zone.countries[e]);
			        			}

			        	$.each($('.token'),function(c,v){
		
			        		inds=$(v).attr('indexes').split("-");
			        		if(inds[1]==ne.scope().$index) {
			        				
			        			$(v).hide('scale',{done:function(){$(v).remove();}},200);
			        			
			        		}
			        	});
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
			       osc.send('/removeCountry',s.struct.name,ok,ko)
			       if(s.struct.countries) {
			       	for(c in s.struct.countries) {
			       		
			       		osc.send('/removeCountry',s.struct.countries[c].name,ok,ko)
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
