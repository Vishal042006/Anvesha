# ANVESHA 3.0 — Geographic Crosswalk & Historical Administrative Harmonization

## 1. Overview & Harmonization Mandate

Between 2001 and 2023, the administrative and police geography of Tamil Nadu underwent multiple government reorganizations, district bifurcations, and police commissionerate formations. 

Comparing raw historical counts across reorganizing districts without harmonization introduces artificial discontinuities that can be falsely flagged as crime reductions or surges. ANVESHA establishes a **canonical 38-unit reporting geography** that reconciles historical series into consistent administrative units.

---

## 2. Master Police Jurisdiction Crosswalk (Tamil Nadu — 38 Units)

| Canonical Unit ID | Canonical Police Jurisdiction Name | Unit Classification | Historical Precursor (2001–2010 Baseline) | Harmonization Rule & Lineage Notes | Comparability Category |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TN_PU_01` | **Greater Chennai Police** | City Commissionerate | Chennai City | Incorporated northern suburbs in 2011; bifurcated in 2022 to form Avadi and Tambaram. Longitudinal continuity series reconciles Chennai urban core. | Documented Transformation |
| `TN_PU_02` | **Avadi City Police** | City Commissionerate | Tiruvallur / Chennai North | Formed 2022 from western Chennai / Tiruvallur urban police divisions. Reconciled backward to Tiruvallur baseline. | Documented Transformation |
| `TN_PU_03` | **Tambaram City Police** | City Commissionerate | Kanchipuram / Chennai South | Formed 2022 from southern Chennai / Chengalpattu urban divisions. Reconciled backward to Kanchipuram baseline. | Documented Transformation |
| `TN_PU_04` | **Chengalpattu** | District Police | Kanchipuram District | Bifurcated from Kanchipuram in November 2019. Backwards-harmonized using police station jurisdiction tables. | Documented Transformation |
| `TN_PU_05` | **Kanchipuram** | District Police | Kanchipuram District | Retains residual western jurisdictions post-Chengalpattu/Tambaram carveouts. | Documented Transformation |
| `TN_PU_06` | **Tiruvallur** | District Police | Tiruvallur District | Retains rural and peri-urban police stations post-Avadi formation. | Documented Transformation |
| `TN_PU_07` | **Vellore** | District Police | Vellore (Composite) | Tri-furcated in 2019 (Vellore, Ranipet, Tirupathur). Historical series tracked as composite prior to 2019. | Documented Transformation |
| `TN_PU_08` | **Ranipet** | District Police | Vellore (Composite) | Bifurcated from Vellore in 2019. Backward reconciliation via taluk-level FIR mapping. | Documented Transformation |
| `TN_PU_09` | **Tirupathur** | District Police | Vellore (Composite) | Bifurcated from Vellore in 2019. Backward reconciliation via taluk-level FIR mapping. | Documented Transformation |
| `TN_PU_10` | **Tiruvannamalai** | District Police | Tiruvannamalai | Stable boundary across entire 2001–2023 panel. | Directly Comparable |
| `TN_PU_11` | **Villupuram** | District Police | Villupuram (Composite) | Bifurcated in 2019 to create Kallakurichi. Composite series normalized pre-2019. | Documented Transformation |
| `TN_PU_12` | **Kallakurichi** | District Police | Villupuram (Composite) | Created November 2019 from southern Villupuram taluks. Reconciled via station gazette. | Documented Transformation |
| `TN_PU_13` | **Cuddalore** | District Police | Cuddalore | Stable boundary across entire 2001–2023 panel. | Directly Comparable |
| `TN_PU_14` | **Dharmapuri** | District Police | Dharmapuri (Composite) | Bifurcated in 2004 to create Krishnagiri. Fully reconciled across 2001–2004 transition. | Documented Transformation |
| `TN_PU_15` | **Krishnagiri** | District Police | Dharmapuri (Composite) | Created 2004. Pre-2004 observations reconstructed using constituent police station FIR logs. | Documented Transformation |
| `TN_PU_16` | **Salem City** | City Commissionerate | Salem Urban Police | City commissionerate established with stable jurisdiction over municipal limits. | Directly Comparable |
| `TN_PU_17` | **Salem District** | District Police | Salem Rural | Covers rural police stations outside Salem City Commissionerate. | Directly Comparable |
| `TN_PU_18` | **Namakkal** | District Police | Namakkal | Stable boundary across entire 2001–2023 panel. | Directly Comparable |
| `TN_PU_19` | **Erode** | District Police | Erode (Composite) | Carved out southern taluks in 2009 for Tiruppur. Fully reconciled. | Documented Transformation |
| `TN_PU_20` | **Tiruppur City** | City Commissionerate | Tiruppur Urban | Formed 2013 from Tiruppur municipal area stations. | Documented Transformation |
| `TN_PU_21` | **Tiruppur District** | District Police | Erode / Coimbatore | Formed 2009 from composite Erode/Coimbatore rural divisions. | Documented Transformation |
| `TN_PU_22` | **Coimbatore City** | City Commissionerate | Coimbatore Urban | Commissionerate expanded in 2011 to include suburban stations. Reconciled. | Documented Transformation |
| `TN_PU_23` | **Coimbatore District** | District Police | Coimbatore Rural | Covers rural stations outside Coimbatore City limits. | Documented Transformation |
| `TN_PU_24` | **The Nilgiris** | District Police | The Nilgiris | Mountainous jurisdiction with 100% boundary stability. | Directly Comparable |
| `TN_PU_25` | **Tiruchirappalli City** | City Commissionerate | Tiruchirappalli Urban | City commissionerate covering municipal corporation police stations. | Directly Comparable |
| `TN_PU_26` | **Tiruchirappalli District**| District Police | Tiruchirappalli Rural | Covers peripheral and rural police subdivisions. | Directly Comparable |
| `TN_PU_27` | **Karur** | District Police | Karur | Stable boundary across entire 2001–2023 panel. | Directly Comparable |
| `TN_PU_28` | **Perambalur** | District Police | Perambalur (Composite) | Reorganized with Ariyalur in 2007; boundary stable post-2007. | Documented Transformation |
| `TN_PU_29` | **Ariyalur** | District Police | Perambalur (Composite) | Carved out in 2007; reconciled pre-2007 via taluk records. | Documented Transformation |
| `TN_PU_30` | **Pudukkottai** | District Police | Pudukkottai | Stable boundary across entire 2001–2023 panel. | Directly Comparable |
| `TN_PU_31` | **Thanjavur** | District Police | Thanjavur | Stable boundary across entire 2001–2023 panel. | Directly Comparable |
| `TN_PU_32` | **Tiruvarur** | District Police | Tiruvarur | Stable boundary across entire 2001–2023 panel. | Directly Comparable |
| `TN_PU_33` | **Nagapattinam** | District Police | Nagapattinam (Composite) | Bifurcated in 2020 to form Mayiladuthurai. Reconciled pre-2020. | Documented Transformation |
| `TN_PU_34` | **Mayiladuthurai** | District Police | Nagapattinam (Composite) | Created December 2020 from northern Nagapattinam stations. Reconciled pre-2020. | Documented Transformation |
| `TN_PU_35` | **Madurai City** | City Commissionerate | Madurai Urban | City commissionerate covering central urban police stations. | Directly Comparable |
| `TN_PU_36` | **Madurai District** | District Police | Madurai Rural | Covers rural subdivisions outside Madurai City. | Directly Comparable |
| `TN_PU_37` | **Dindigul** | District Police | Dindigul | Stable boundary across entire 2001–2023 panel. | Directly Comparable |
| `TN_PU_38` | **Theni** | District Police | Theni | Stable boundary across entire 2001–2023 panel. | Directly Comparable |

---

## 3. Comparability Classification Definitions

1. **Directly Comparable:** Jurisdictions whose outer administrative boundary remained constant between 2001 and 2023. Annual statistics reflect identical geographic catchments.
2. **Documented Transformation:** Jurisdictions affected by formal government reorganization (e.g., Dharmapuri/Krishnagiri, composite Vellore, Nagapattinam/Mayiladuthurai). Historical figures are reconstructed using constituent station-level FIR logs and gazetted taluk allocations.
3. **Incompatible / Quarantined:** Any dataset whose recording protocol cannot be verified or whose boundary cannot be mapped to the 38-unit panel is excluded from training and quarantined in `anvesha_training_data/09_excluded/`.
