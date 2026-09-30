# ANVESHA POPULATION-ADJUSTED CRIME RATE METHODOLOGY

## Formula Specification

$$\text{RECORDED CRIME RATE} = \frac{\text{Crime Count}}{\text{Census Population}} \times 100,000$$

## Application Rules

1. **Observed Census Years Only**: Crime rates are calculated **EXCLUSIVELY for 2001 and 2011**, where actual Census of India population figures are observed.
2. **No Annual Population Interpolation**: Population is NOT interpolated for 2002–2010 or 2012–2014 to prevent synthetic noise contamination.
3. **Valid Geographies Only**: Calculated ONLY for `ONE_TO_ONE` district police units. Urban Commissionerates (`PARTIAL`) are excluded from rate calculations.
4. **Terminology**: Named strictly **RECORDED CRIME RATE**. Never termed a "risk score" or "danger index."
