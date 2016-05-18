function [graph, size, interedges] = splitGraph(n,p,q)

size = 2 * n;

g1 = triu(rand(n,n) < p, 1);
g1 = g1 + g1';

g2 = triu(rand(n,n) < p, 1);
g2 = g2 + g2';

cross = rand(n,n) < q;
graph = [g1, cross; cross', g2];

interedges = sum(sum(cross));

end