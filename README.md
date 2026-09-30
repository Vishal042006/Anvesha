ANVESHA
Evidence-Grounded AI Framework for Spatio-Temporal Crime Intelligence and Explainable Decision Support

ANVESHA is a research-oriented AI framework for analyzing historical crime patterns, forecasting future crime counts, detecting statistical anomalies, studying spatial relationships, retrieving source-grounded evidence, and providing explainable analytical decision support.

Primary study region: Tamil Nadu, India
Research data coverage: 2001–2014 validated benchmark + selected SCRB source data from 2017–2023

Overview

ANVESHA is designed as a research and analytical framework, rather than a simple crime-prediction application.

The system combines:

Historical crime data
Data harmonization
Crime taxonomy normalization
Temporal analysis
Spatio-temporal features
Crime forecasting
Statistical anomaly detection
Spatial intelligence
Evidence retrieval / RAG
Explainability
Data provenance
Population and geographic analysis
Graph/entity analysis where genuine case-level data is available

The core objective is to transform heterogeneous crime records and documentary evidence into a traceable, reproducible, and explainable crime-intelligence workflow.

Research Data Architecture

ANVESHA maintains separate data layers rather than forcing incompatible datasets into a single continuous panel.

                    ANVESHA
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
   VALIDATED BENCHMARK       SOURCE / EVIDENCE LAYER
       2001–2014                  2017–2023
          │                         │
          ▼                         ▼
   Crime Forecasting         SCRB Source Tables
   Spatial Research          Evidence Retrieval
   Anomaly Detection         Descriptive Analysis
   Statistical Analysis      Future Harmonization
1. Validated Crime Benchmark — 2001–2014

The primary continuous analytical benchmark currently covers:

2001–2014
36 historical Tamil Nadu police/reporting units
2,640 validated observations
Duplicate-free validated aggregation
Temporal leakage validation
Reproducible temporal train/validation/test split
Next-year crime-count forecasting target
Forecasting split
Training
2001–2010

Validation
2011–2012

Test
2013 → 2014

The benchmark is deliberately protected from incompatible post-2014 data.

2. SCRB Source Dataset Layer — 2017–2023

ANVESHA also maintains source-derived Tamil Nadu State Crime Records Bureau material covering:

2017
2018
2019
2020
2022
2023

These materials are maintained as a separate source/evidence layer.

They are not automatically treated as a continuous extension of the 2001–2014 forecasting benchmark because of changes in:

Geographic reporting structures
Crime taxonomy
Table structure
Measurement definitions
Data availability
Aggregation grain

The post-2014 material can therefore support:

Evidence retrieval
Descriptive analysis
Source comparison
Data harmonization research
Future analytical extensions
Why 2001–2014 Remains the Forecasting Benchmark

The project investigated extending the forecasting panel beyond 2014.

However, the available post-2014 material does not currently provide a sufficiently compatible continuous district-level panel.

In particular:

2015–2016 district-level coverage is incomplete
Later reporting structures use changed geographic units
Crime categories and table structures were redesigned
Some later material is available primarily through PDF tables
Some available open-data tables are state/UT aggregates rather than compatible district-level observations

Therefore, ANVESHA does not artificially interpolate or manufacture a continuous 2001–2023 forecasting dataset.

Research principle: preserve validity rather than manufacture continuity.

Core Research Pipeline
Raw Crime Sources
        │
        ▼
Data Ingestion
        │
        ▼
Data Cleaning
        │
        ▼
Schema Harmonization
        │
        ▼
Geographic Normalization
        │
        ▼
Crime Taxonomy Mapping
        │
        ▼
Temporal Validation
        │
        ▼
Validated Crime Dataset
        │
        ├───────────────┐
        ▼               ▼
Spatio-Temporal     Spatial
Features            Analysis
        │               │
        ▼               ▼
Crime Forecasting   Spatial Statistics
        │
        ▼
Anomaly Detection
        │
        ▼
Explainability
        │
        ▼
Evidence / RAG
        │
        ▼
Research Decision Support
Machine Learning
Spatio-Temporal Crime Forecasting

ANVESHA's primary forecasting task predicts:

crime_count_next_year

using historical crime information and validated temporal features.

The current benchmark evaluates:

3-Year Average
Last-Year Baseline
Ridge Regression
Extra Trees
Random Forest
HistGradientBoosting
Validated benchmark results
Model	R²	RMSE	MAE
3-Year Average	0.9353	595.74	298.94
Last-Year Baseline	0.9116	696.66	286.18
Ridge Regression	0.9386	580.25	311.52
Extra Trees	0.9193	665.48	310.04
Random Forest	0.9082	709.81	309.27
HistGradientBoosting	0.8561	888.74	360.07

These metrics correspond to the validated 2001–2014 benchmark and its established test period.

Anomaly Detection

ANVESHA includes statistical anomaly detection using Isolation Forest.

The purpose is to identify observations that differ from learned historical patterns.

Anomalies are treated as statistical observations requiring investigation, not as proof of criminal activity or wrongdoing.

Spatial Intelligence

The project incorporates spatial relationships into crime analysis.

Potential analyses include:

Spatial lag
Neighbor relationships
Global Moran's I
Local Moran's I / LISA
Getis-Ord Gi*
Spatial clustering
Temporal-spatial pattern analysis

Spatial outputs are intended to describe observed statistical patterns, not label geographic areas as inherently dangerous.

Population Intelligence

ANVESHA is also developing a separate population/geography layer.

The planned analytical framework combines:

Population
     +
Geographic Area
     ↓
Population Density
     +
Recorded Crime Count
     ↓
Recorded Crime Rate / 100,000
     ↓
Spatial / Statistical Analysis

Population data will only be incorporated where the relationship between the population geography and crime-reporting geography can be defensibly established.

The project does not fabricate annual population values or assume that a town/city population automatically represents a police jurisdiction.

Evidence Intelligence

ANVESHA incorporates source-derived documentary evidence through an evidence retrieval layer.

The research data ecosystem includes extracted SCRB/NCRB material that can be linked back to:

Source
  ↓
Report
  ↓
Table
  ↓
Row
  ↓
Extracted Value
  ↓
Analytical Result

This allows research outputs to remain connected to their underlying evidence.

Explainability

ANVESHA is designed to expose the factors contributing to model outputs rather than presenting predictions as unexplained numbers.

Explainability is used to examine:

Historical crime features
Temporal features
Spatial features
Population-related features where validated
Model-specific feature contributions

The objective is analytical transparency, not automated decision-making about individuals.

Graph / Relationship Intelligence

ANVESHA can support entity-resolution and graph analysis when genuine case-level/entity-level data is available.

Potential entities include:

Case
Person
Vehicle
Location
Phone
Organization
Crime
Document
Evidence

Potential relationships include:

SAME_PERSON
SAME_VEHICLE
SAME_PHONE
SAME_LOCATION
TEMPORALLY_NEAR
GEOGRAPHICALLY_NEAR
SIMILAR_MODUS_OPERANDI
MENTIONED_IN
SUPPORTED_BY

However, aggregate crime statistics cannot establish these relationships.

ANVESHA therefore does not fabricate individual-level relationships from aggregate SCRB/NCRB statistics.

Data Provenance

Provenance is a core design principle.

Where applicable, analytical observations retain information such as:

source
source_file
source_table
source_year
source_row
geography
original_value
standardized_value
transformation
mapping_method
mapping_confidence

This enables researchers to trace an analytical result back toward its source.

Research Data Principles

ANVESHA follows five principles:

1. Validity over volume

A smaller validated dataset is preferable to a larger incompatible dataset.

2. Provenance over convenience

Source information should remain traceable.

3. Temporal integrity

Future information must not leak into historical prediction features.

4. Geographic integrity

Historical reporting units must not be silently replaced with modern administrative boundaries.

5. Explainability

Analytical outputs should be interpretable and accompanied by appropriate limitations.

Repository Structure
Anvesha/
│
├── README.md
│
├── backend/
│   └── API and backend services
│
├── model_service/
│   └── ML/model-serving components
│
├── scripts/
│   └── Data processing and validation pipelines
│
├── tests/
│   └── Automated validation and test suite
│
├── docs/
│   └── Research documentation and methodology
│
├── reports/
│   └── Research and validation reports
│
├── anvesha_training_data/
│   └── Training-data metadata/artifacts
│
├── dataset_profiles/
│   └── Dataset profiling outputs
│
├── pdf_extracted_text/
│   └── Extracted source-document text
│
├── pdf_metadata/
│   └── Source-document metadata
│
└── .env.example

Large raw datasets and source archives are maintained separately from the GitHub code repository where appropriate.

Research Documentation

Important project documentation includes:

FINAL_PROJECT_STATUS.md
ANVESHA_DATASET_CARD.md
DATASET_ANALYSIS_REPORT.md
DATA_QUALITY_REPORT.md
TRAINING_READINESS_REPORT.md
MODEL_COMPARISON.md
LIMITATIONS.md
RESEARCH_RESULTS.md
DATASET_REGISTRY.csv
FEATURE_REGISTRY.csv
TARGET_DEFINITION_REGISTRY.csv
TEMPORAL_COVERAGE_REPORT.csv
SPLIT_INTEGRITY_REPORT.csv

These documents describe the data, methodology, validation, model evaluation, and research limitations.

Current Research Status
Completed
 Multi-source crime-data ingestion
 Data cleaning
 Schema harmonization
 Crime taxonomy normalization
 Geographic validation
 Temporal validation
 Data leakage audit
 Validated 2001–2014 benchmark
 Forecasting benchmark
 Baseline comparison
 Anomaly detection
 Spatial feature infrastructure
 Evidence/RAG infrastructure
 Explainability
 Data provenance
 Backend/API
 Research frontend
 Automated testing
Research Extensions
 Extended spatial statistical analysis
 Population-geography crosswalk
 Population-adjusted crime analysis
 Controlled spatial forecasting experiment
 Controlled population-feature experiment
 Further post-2014 harmonization
 Expanded literature review
 Additional validated case-level relationship data
Current Limitations

ANVESHA currently has several important research limitations.

Temporal coverage

The validated continuous forecasting benchmark currently ends in 2014.

2015–2016 gap

A continuous compatible district-level panel is not currently available for these years.

Geographic changes

Post-2014 administrative/reporting boundaries require additional historical crosswalk and boundary validation.

Taxonomy changes

Crime categories and reporting structures vary across source periods.

Aggregate-data limitations

Aggregate crime statistics cannot support reliable individual-level entity resolution.

Population geography

Population-based analysis requires a defensible mapping between population areas and historical crime-reporting units.

These limitations are explicitly preserved rather than hidden through data imputation or unsupported assumptions.

Reproducibility

ANVESHA is designed to make the research workflow reproducible.

The project uses:

Version-controlled source code
Documented data-processing pipelines
Validation scripts
Automated tests
Dataset registries
Feature registries
Target definitions
Temporal split documentation
Provenance metadata
Fixed random seeds where applicable

The validated benchmark should be reproducible from the documented preprocessing pipeline without introducing future information into historical observations.

Data and Privacy

The repository does not intentionally contain fabricated personal information or fabricated individual-level relationships.

Aggregate crime statistics are treated as statistical research data.

Where external or restricted source data is required, the repository should contain appropriate metadata or processing instructions rather than exposing restricted material.

API credentials and secrets must never be committed.

Use:

.env

for local credentials and:

.env.example

for configuration documentation.

Research Direction

The next stage of ANVESHA focuses on strengthening the connection between:

Historical Crime
      +
Spatial Context
      +
Population
      +
Documentary Evidence
      +
Explainable ML
      ↓
Evidence-Grounded Crime Intelligence

The goal is not simply to maximize prediction accuracy.

The goal is to build a scientifically defensible, traceable, explainable, and reproducible crime-intelligence research framework.

Disclaimer

ANVESHA is a research and analytical system.

Model predictions, statistical anomalies, spatial clusters, and retrieved evidence should not be interpreted as proof of criminal behavior, individual culpability, or causation.

Statistical association does not establish causation, and model outputs should be interpreted together with their data provenance, validation results, and documented limitations.

Project

ANVESHA

An Evidence-Grounded AI Framework for Spatio-Temporal Crime Intelligence and Explainable Decision Support

Primary Study Region: Tamil Nadu, India

Research Focus: Crime Intelligence · Spatio-Temporal Analysis · Forecasting · Spatial Statistics · Evidence Retrieval · Explainable AI · Data Provenance
