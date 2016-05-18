function alpha = computeAlpha(graph)
    
    D = diag(sum(graph));
    D2 = D^(-1/2);
    Ng = D2 * graph * D2;
    
    [~, lambdas] = eig(Ng);
    lambdas = lambdas * ones(length(lambdas),1);
    alpha = 1 - lambdas(length(lambdas) - 1);
end