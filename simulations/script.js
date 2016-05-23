

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

function concatGraphs(g1, g2) {
  var n = g1.nodes.length
  return { nodes: g1.nodes.concat(g2.nodes), edges: g1.edges.concat(g2.edges.map(function (e) { return {source: e.source + n, target: e.target + n}})) }
}

function splitGraph(n,p,q) {
  var g1 = randomgraph.ErdosRenyi.np(n,p);
  var g2 = randomgraph.ErdosRenyi.np(n,p);
  graph = concatGraphs(g1,g2)

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

  renderForceGraph(graph)

  return graph
}


function matrice() {
  var n = graph.nodes.length
  var a = new Array(n);
  for (var i = 0; i < n; i++) {
    a[i] = new Array(n)
    for (var j = 0; j < n; j++) {
      a[i][j] = 0
    }
  }

  graph.edges.forEach(function (e) {
    a[e.source.index][e.target.index] = 1
    a[e.target.index][e.source.index] = 1
  })

  return a
}

function matrice2() {
  var n = graph.nodes.length
  var a = new Array(n);
  for (var i = 0; i < n; i++) {
    a[i] = new Array(n)
    for (var j = 0; j < n; j++) {
      a[i][j] = 0
    }
  }

  graph.edges.forEach(function (e) {
    a[e.source][e.target] = 1
    a[e.target][e.source] = 1
  })

  return a
}

function expanderGraph(n,k) {
  var ns = new Array(n)
  for (var i = 0; i < n; i++) {
    ns[i] = { label: "node" + i }
  }

  var edges = []
  for (var j = 1; j <= k; j++) {
    for (var i = 0; i < n; i++) {
      edges.push({source: i, target: (i+j) % n})
    }
  }

  return {edges: edges, nodes: ns}
}

function percentInformed(graph) {
  var informed = graph.nodes.filter(function(n) { return n.informed }).length
  return 1.0 * informed / graph.nodes.length
}

function simulation() {

  var qs = [0.0003, 0.0005, 0.001, 0.005, 0.01];
  var pss = []
  var matrices = []
  for (var i = 0; i < qs.length; i++) {
    var percs = [];
    graph = splitGraph(100, 0.1, qs[i])
    inform(0)
    var stop = false
    while (!stop) {
      informRound()
      var p = percentInformed(graph)
      stop = (p >= 0.9999999999999999999)
      percs.push(p)
    }

    pss.push(percs.toString())
    matrices.push(matrice(graph).toString())
  }
  console.log(pss, matrices)

}


function inform2(index, graph) {
  graph.nodes[index].informed = true
}

function informRound2(graph) {
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

