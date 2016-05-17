

var graph;
var node;

function inform(index) {
  graph.nodes[index].informed = true
  node.style("fill", function (d) { return (d.informed ? '#1f77b4' : 'black'); });
}

function informRound() {
  var i = 0
  graph.nodes.filter(function (node) { return node.informed })
             .forEach(function (node) {
               var uninformedNeighbors = graph.edges.filter(function (e) { 
                return (e.source.index == node.index && ! e.target.informed) || (e.target.index == node.index && ! e.source.informed)
              }).map(function(e) { return e.source == node ? e.target : e.source })
              if (uninformedNeighbors.length > 0) {
                var rand = Math.floor(Math.random()*uninformedNeighbors.length)
                if (! uninformedNeighbors[rand].informed) {
                  uninformedNeighbors[rand].informed = true
                  i += 1
                }
              }
             });
  node.style("fill", function (d) { return (d.informed ? '#1f77b4' : 'black'); });
  return i
}

function renderForceGraph(graph) {

  $('svg').remove();

  var width = innerWidth-40,
    height = innerHeight-40;

  var force = d3.layout.force()
      .charge(+$('#charge').val()*-1)
      .linkDistance(+$('#dist').val())
      .size([width, height]);

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  force
      .nodes(graph.nodes)
      .links(graph.edges)
      .start();
  
  var link = svg.selectAll(".link")
      .data(graph.edges)
    .enter().append("line")
      .attr("class", "link");
  
   node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .call(force.drag).style("fill", function (d) { return (d.informed ? '#1f77b4' : 'black'); });
  
  node.append("title")
      .text(function(d) { return d.name; });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  });
  
    $('input[type=range]').off('change').on('change', function() {
        force
            .charge(+$('#charge').val()*-1)
            .linkDistance(+$('#dist').val())
            .start();
    });
}


$().ready(function () {

$('select').change(function() {
    loadPreset($('select option:selected'));
});

loadPreset($('select option').get(0));


function loadPreset(opt) {
    var P = $('#params').html('');
    $.each($(opt).data('p').split(','), function(i, p) {
        p = p.split(':');
        var inp = $('<input />').val(p[1]).appendTo(
            $('<label />').html(p[0]).appendTo(P)
        );
        inp.change(update);
    });
    
    function update() {
        var args = [];
        $('input').each(function(i,el) {
           args.push(+$(el).val());
        });
        $('svg').remove();

        graph = eval('randomgraph.'+$(opt).html()+'('+args.join(',')+')')
        renderForceGraph(graph);
    }
    update();
}

});

function splitGraph(n,p,q) {
  var g1 = randomgraph.ErdosRenyi.np(n,p)
  var g2 = randomgraph.ErdosRenyi.np(n,p)
  var graph = { nodes: g1.nodes.concat(g2.nodes), edges: g1.edges.concat(g2.edges.map(function (e) { return {
    source: e.source + n,
    target: e.target + n
  }})) }

   for (i = 0; i < n; i++) {
                    for (j = n; j < 2 * n; j++) {
                        if (Math.random() < q) {
                            graph.edges.push({
                                source: i,
                                target: j
                            });
                        }
                    }
                }

  return graph
}





