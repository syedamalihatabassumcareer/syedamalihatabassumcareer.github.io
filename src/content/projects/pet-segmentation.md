---
title: "PetSeg: Pet Image Segmentation and Breed Classification"
short: PetSeg
tagline: U-Net variants that segment pets pixel by pixel and classify 37 breeds, compared on the Oxford-IIIT Pet dataset.
summary: Built and compared U-Net-based models for joint semantic segmentation and breed classification on the Oxford-IIIT Pet dataset — a tuned U-Net baseline, an Attention U-Net, a decoder adapted from EfficientDet's BiFPN, and pretrained classifier heads — with geometric, photometric and noise augmentation.
course: CSE428 · Image Processing
categories: [machine-learning]
technologies: [PyTorch, U-Net, Attention U-Net, BiFPN, EfficientNet-B0, DenseNet, MobileNet, Hyperparameter tuning, Data augmentation]
links:
  - label: Project report (PDF)
    url: reports/pet-segmentation.pdf
    kind: report
cover:
  src: ../../assets/projects/pet-segmentation/cover.jpg
  alt: PetSeg app graphic — an uploaded cat photo, its predicted white-on-black mask and a purple overlay, with model selection, segmentation scores and an overview of the Oxford-IIIT Pet dataset.
media:
  - type: image
    src: ../../assets/projects/pet-segmentation/cover.jpg
    alt: PetSeg app graphic — an uploaded cat photo, its predicted white-on-black mask and a purple overlay, with model selection, segmentation scores and an overview of the Oxford-IIIT Pet dataset.
    caption: The PetSeg interface
credits:
  - Md. Imam Hasan and Reshad Ul Karim — team members
impact:
  challenge: "Choosing the right model means comparing the options fairly, on the same data."
  value:
    - kind: business
      text: "A systematic comparison of U-Net variants and pretrained classifier heads on one dataset — the model-selection discipline products depend on."
  sdgs: []
featured: false
order: 7
---

## Approach

The Oxford-IIIT Pet dataset has 37 breeds with about 200 images each, annotated with breed and a
pixel-level trimap. Images and masks were augmented together (flips, ±15° rotation, random
resized crops to 256×256) and images alone (colour jitter, grayscale, blur, noise, coarse
dropout), then normalised with ImageNet statistics.

Each model has a segmentation decoder and a classification output. Hyperparameters (learning
rate, loss weighting, weight decay, dropout) were tuned over 30 trials of 8 epochs, maximising
validation IoU.

## Reported results

| Model | Segmentation mIoU | Dice | Breed accuracy |
| --- | --- | --- | --- |
| Tuned U-Net | 0.884 | 0.934 | 77.0% |
| Attention U-Net | 0.889 | 0.937 | 74.9% |
| U-Net + BiFPN decoder | 0.883 | 0.934 | 75.0% |
| U-Net + DenseNet head | 0.891 | 0.938 | 89.9% |
| U-Net + EfficientNet-B0 head | 0.892 | 0.939 | 91.4% |

Adding a pretrained classifier head lifted breed accuracy from 77% to 91% while keeping
segmentation quality. Treating the trimap as three classes (background, foreground, boundary)
showed that thin boundaries are the hard part: boundary IoU was about 0.59 against 0.85 for the
foreground.
