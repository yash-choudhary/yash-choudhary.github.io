## The problem

Given outdoor field images of wheat plants from farms around the world, detect every wheat head — the spike containing the grain — in each image. Accurate detection lets farmers estimate crop density and yield, but it's hard: wheat heads overlap, vary by genotype and region, and images differ wildly in lighting and blur.

## Approach

- Built an end-to-end detection pipeline with **Faster R-CNN and a ResNet-50 backbone** in PyTorch.
- Squeezed out a **17% improvement** over the baseline with a stack of training and inference techniques:
  - **Cut-mix and mix-up** augmentation to make the model robust to occlusion and density variation
  - **Mixed-precision training** for larger effective batch sizes on the same hardware
  - **Test-time augmentation (TTA)** at inference
  - **Weighted box fusion** to ensemble predictions instead of naive non-max suppression

## Result

Final score of **0.7699 mAP**, placing **8th of 1,800 teams** worldwide.

## What I took away

Detection competitions are won in the last few percent, and that last few percent comes from disciplined experimentation — logging every run, changing one variable at a time, and knowing when a technique is actually helping versus adding noise.
