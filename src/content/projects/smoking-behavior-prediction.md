---
title: Predictive Modeling of Smoking Behavior from Biomedical Data
short: Smoking prediction
tagline: A supervised learning pipeline that predicts smoking behaviour from biomedical measurements.
summary: Developed a biomedical machine learning pipeline with feature engineering and multi-model evaluation to predict smoking behavior, emphasizing robust validation and interpretability.
start: 2025-02
end: 2025-05
course: CSE422 · Artificial Intelligence
categories: [machine-learning, health-tech]
technologies: [Feature engineering, Multi-model evaluation, Supervised learning, Scikit-learn, KNN, Decision tree, Logistic regression, Naive Bayes, Neural network]
links:
  - label: Project report (PDF)
    url: reports/smoking-behavior-prediction.pdf
    kind: report
cover:
  src: ../../assets/projects/smoking-behavior-prediction/cover.jpg
  alt: Project graphic — biomedical features such as age, BMI, heart rate, blood pressure, cholesterol and diabetes feed five models (KNN, LR, DT, NB, NN) that predict smoker or non-smoker, above a feature-importance chart and a model-comparison chart.
media:
  - type: image
    src: ../../assets/projects/smoking-behavior-prediction/cover.jpg
    alt: Project graphic — biomedical features such as age, BMI, heart rate, blood pressure, cholesterol and diabetes feed five models (KNN, LR, DT, NB, NN) that predict smoker or non-smoker, above a feature-importance chart and a model-comparison chart.
    caption: Project overview graphic
credits:
  - Zawad Yousuf — co-author of the project report
impact:
  challenge: "Preventive health programmes need simple ways to spot risk in data they already collect."
  value:
    - kind: social
      text: "Explores whether routine biomedical measurements can indicate smoking behaviour — a potential aid to preventive health screening."
    - kind: business
      text: "Compares five model types — KNN, decision tree, logistic regression, naive Bayes and a neural network — with an emphasis on validation and interpretability."
  sdgs: [3]
featured: true
order: 3
---

## Approach

200,000 anonymised medical records with 13 features (age, gender, BMI, blood pressure,
cholesterol, heart rate, blood type, diabetes …); only about 18% of the records are smokers.
About 10% of values were missing, so each feature got its own imputation (mean, median or
segment-wise mode), followed by label/one-hot encoding, standard scaling and a stratified 70/30
split. Five models were compared: KNN, a decision tree, logistic regression, naive Bayes and a
small neural network.

## What we found

Accuracy alone was misleading: logistic regression and the neural network reached 82% by
predicting almost no smokers at all (F1 of 0.00 for smokers). The decision tree gave the best F1
for smokers (0.36), followed by KNN. None of the biomedical features correlated meaningfully with
smoking, a useful negative result: smoking status is hard to infer from routine clinical
measurements alone.
