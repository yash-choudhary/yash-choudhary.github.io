## The problem

Genetic programming evolves mathematical expressions by mutating and recombining
their *syntax* — swapping subtrees between parent expressions. The trouble is
that syntax and behaviour are only loosely related: a tiny change to a tree can
send its output somewhere completely different, so the search wanders.

The alternative, geometric semantic GP, fixes the behaviour problem but is forced
to build offspring as linear combinations of their parents. Expressions balloon
in size until they're unreadable and expensive to evaluate.

## Approach

This implements **Transformer Semantic Genetic Programming**, following Anthes,
Sobania & Rothlauf (2025), and replaces both variation operators with a single
learned one.

- Trained an **encoder–decoder transformer (~934K parameters) on 5 million
  expression pairs**, teaching it what it means for two expressions to be
  *semantically* similar — to produce similar outputs, regardless of how they're
  built.
- The trained model drops into a standard GP evolutionary loop as the variation
  operator: given a parent expression tree, it generates an offspring that
  behaves similarly without being constrained to the parent's structure. No
  crossover, no mutation, and none of the bloat that geometric semantic GP
  forces.

## Making it fast enough to actually run

A learned operator is called once per individual per generation, so inference
cost decides whether the whole approach is viable. Naive decoding took **1,375 ms
per individual** — enough to make a full benchmark grid impractical.

Two changes moved it:

- **Batched decoding**, so a generation's offspring are produced together rather
  than one at a time
- **Graph compilation** of the model's forward pass

Together they cut inference to **84 ms per individual — a 16× speed-up** — and
brought a **291-hour benchmark grid down to 10.5 hours**.

## What I took away

The research contribution is the learned operator, but the engineering is what
made it testable. A 16× inference win is the difference between evaluating an
idea across a full benchmark suite and only ever seeing it run on toy problems —
the same optimisation instinct that production backends demand, pointed at a
research loop.
