function [evolution] = simulate(graph)
    maxi = 30;
    size = length(graph);
    informed = zeros(size, 1);
    informed(int64(floor(1 + rand() * size)), 1) = 1;
    evolution = zeros(maxi,1);
    j = 1;
    while sum(informed) < size && j < maxi
        evolution(j) = sum(informed);
        newInformed = informed;
        for i = 1:size
            if informed(i) == 1
                uninformedNeighbors = and(graph(:,i), not(informed));
                indexes = find(uninformedNeighbors);
                if ~isempty(indexes)
                    inform = indexes(1 + int64(floor(rand() * length(indexes))));
                    newInformed(inform) = 1;
                end
            end
        end
        informed = newInformed;
        j = j + 1;
    end
    evolution(j) = sum(informed);
    evolution = evolution(1:j);
%     evolution = 1.0 * evolution / size;
end