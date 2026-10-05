import os
import sys
import json
import glob
import pandas as pd
import numpy as np

# Complete 2014 Detailed IPC Dataset Text provided in Prompt
RAW_CSV_TEXT = """States/UTs,District,Year,Murder,Attempt to commit Murder,Culpable Homicide not amounting to Murder,Attempt to commit Culpable Homicide,Rape,Custodial Rape,Custodial_Gang Rape,Custodial_Other Rape,Rape other than Custodial,Rape_Gang Rape,Rape_Others,Attempt to commit Rape,Kidnapping & Abduction_Total,Kidnapping & Abduction,Kidnapping & Abduction in order to Murder,Kidnapping for Ransom,Kidnapping & Abduction of Women to compel her for marriage,Other Kidnapping,Dacoity,Dacoity with Murder,Other Dacoity,Making Preparation and Assembly for committing Dacoity,Robbery,Criminal Trespass/Burglary,Criminal Trespass or Burglary,House Trespass & House Breaking,Theft,Auto Theft,Other Thefts,Unlawful Assembly,Riots,Riots_Communal,Riots_Industrial,Riots_Political,Riots_Caste Conflict,Riots_SC/STs Vs Non-SCs/STs,Riots_Other Caste Conflict,Riots_Agrarian,Riots_Students,Riots_Sectarian,Riots_Others,Criminal Breach of Trust,Cheating,Forgery,Counterfeiting,Counterfeit Offences related to Counterfeit Coin,Counterfeiting Government Stamp,Counterfeit currency & Bank notes,Counterfeiting currency notes/Bank notes,Using forged or counterfeiting currency/Bank notes,Possession of forged or counterfeiting currency/Bank notes,Making or Possessing materials for forged currency/Bank notes,Making or Using documents resembling currency,Arson,Grievous Hurt,Hurt,Acid attack,Attempt to Acid Attack,Dowry Deaths,Assault on Women with intent to outrage her Modesty,Sexual Harassment,Assault or use of criminal force to women with intent to Disrobe,Voyeurism,Stalking,Other Assault on Women,Insult to the Modesty of Women,At Office premises,Other places related to work,In Public Transport system,"Places other than 231, 232 & 233",Cruelty by Husband or his Relatives,Importation of Girls from Foreign Country,Causing Death by Negligence,Deaths due to negligent driving/act,Deaths due to Other Causes,Offences against State,Sedition,Other offences against State,Offences promoting enmity between different groups,Promoting enmity between different groups,"Imputation, assertions prejudicial to national integration",Extortion,Disclosure of Identity of Victims,Incidence of Rash Driving,HumanTrafficking,Unnatural Offence,Other IPC crimes,Total Cognizable IPC crimes
Andhra Pradesh,Anantapur,2014,134,171,8,0,35,0,0,0,35,0,35,1,125,0,0,0,88,37,6,0,6,0,30,415,315,100,753,240,513,0,214,0,0,0,0,0,0,0,0,0,214,13,296,0,10,0,0,10,10,0,0,0,0,12,25,24,1,0,25,436,82,34,4,80,236,26,0,0,0,26,165,0,638,638,0,0,0,0,0,0,0,0,0,1038,0,0,3800,8376
Andhra Pradesh,Chittoor,2014,84,170,2,0,32,0,0,0,32,1,31,0,38,4,0,3,28,3,12,0,12,0,22,195,154,41,528,192,336,0,134,0,0,0,0,0,0,0,0,0,134,7,207,0,5,0,0,5,0,5,0,0,0,23,18,18,0,0,17,135,0,0,0,0,135,94,0,0,0,94,278,0,538,538,0,0,0,0,0,0,0,19,0,249,0,0,2567,5374
Andhra Pradesh,Cuddapah,2014,80,162,1,0,28,0,0,0,28,0,28,4,27,0,0,0,11,16,3,0,3,0,16,144,144,0,638,193,445,0,104,0,0,104,0,0,0,0,0,0,0,86,163,0,5,0,0,5,5,0,0,0,0,0,39,39,0,0,16,215,212,0,0,0,3,12,1,11,0,0,91,0,417,417,0,0,0,0,0,0,0,0,0,948,0,0,2604,5803
Andhra Pradesh,East Godavari,2014,64,84,2,0,85,0,0,0,85,0,85,18,66,0,0,0,0,66,3,0,3,0,24,346,295,51,903,347,556,0,27,0,0,0,0,0,0,0,0,0,27,96,214,0,22,0,0,22,0,22,0,0,0,50,44,43,0,1,7,519,159,61,11,55,233,62,0,0,0,62,464,0,668,642,26,0,0,0,0,0,0,32,0,39,0,0,3791,7630
Andhra Pradesh,Guntakal Railway,2014,14,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,2,0,4,0,0,0,413,0,413,0,1,0,0,0,0,0,0,0,0,0,1,0,5,0,5,0,0,5,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,4,0,0,0,0,0,0,0,0,1,0,0,37,490
Andhra Pradesh,Guntur,2014,105,137,4,0,49,0,0,0,49,0,49,24,64,12,2,0,0,50,5,0,5,0,24,210,155,55,711,200,511,0,78,0,0,0,6,6,0,0,0,0,72,22,328,16,5,0,0,5,0,0,4,1,0,52,37,37,0,0,16,245,17,7,3,8,210,347,0,0,0,347,454,0,494,494,0,0,0,0,0,0,0,18,0,846,0,0,2606,6897
Andhra Pradesh,Guntur Urban,2014,51,65,0,0,40,0,0,0,40,1,39,8,84,0,0,0,0,84,5,0,5,0,31,173,121,52,1045,367,678,0,8,0,0,0,0,0,0,0,0,0,8,23,531,22,2,0,0,2,0,0,2,0,0,35,29,29,0,0,12,160,0,0,0,0,160,452,0,0,0,452,345,0,226,226,0,0,0,0,0,0,0,20,0,691,0,0,1740,5798
Andhra Pradesh,Krishna,2014,51,47,1,0,80,0,0,0,80,1,79,20,41,20,0,0,19,2,0,0,0,0,15,302,247,55,521,141,380,0,9,0,0,0,0,0,0,0,0,0,9,24,242,0,11,0,0,11,11,0,0,0,0,23,39,39,0,0,8,354,98,44,13,76,123,232,2,0,0,230,613,0,418,418,0,0,0,0,0,0,0,15,0,70,0,0,3942,7078
Andhra Pradesh,Kurnool,2014,118,135,5,0,32,0,0,0,32,1,31,4,53,4,0,1,16,32,3,0,3,0,28,244,170,74,563,9,554,0,108,4,0,1,9,9,0,0,0,0,94,20,639,0,4,0,0,4,4,0,0,0,0,33,9,9,0,0,12,403,81,18,2,40,262,251,0,0,0,251,362,0,506,495,11,0,0,0,4,4,0,27,0,1313,0,0,3522,8398
Andhra Pradesh,Nellore,2014,78,117,4,0,58,0,0,0,58,3,55,16,153,71,1,1,64,16,8,0,8,0,44,381,323,58,1058,362,696,0,84,0,0,10,0,0,0,0,0,0,74,255,239,32,2,0,0,2,0,2,0,0,0,45,31,28,1,2,14,295,79,14,8,32,162,205,0,62,56,87,362,0,466,440,26,0,0,0,0,0,0,17,0,1173,1,0,3037,8175
Andhra Pradesh,Prakasham,2014,75,68,7,0,50,0,0,0,50,2,48,8,50,17,0,0,11,22,5,0,5,0,23,247,195,52,617,209,408,31,124,0,0,4,0,0,0,0,0,0,120,98,261,48,1,0,0,1,0,1,0,0,0,28,18,18,0,0,8,197,24,3,7,13,150,16,0,0,0,16,402,0,502,490,12,0,0,0,0,0,0,11,0,785,0,0,2687,6367
Andhra Pradesh,Rajahmundry,2014,18,18,1,0,35,0,0,0,35,1,34,3,15,5,0,1,2,7,3,0,3,0,14,214,195,19,361,155,206,0,16,2,0,0,2,2,0,0,0,0,12,56,105,7,3,0,0,3,1,2,0,0,0,13,23,23,0,0,3,121,37,6,0,17,61,27,0,0,0,27,190,0,128,128,0,0,0,0,0,0,0,5,0,394,0,0,657,2430
Andhra Pradesh,Srikakulam,2014,30,29,4,0,40,0,0,0,40,1,39,3,33,26,1,0,5,1,0,0,0,0,8,152,131,21,236,52,184,0,17,0,0,10,0,0,0,0,0,0,7,12,153,10,1,0,0,1,1,0,0,0,0,18,67,66,1,0,3,214,26,45,0,22,121,91,0,6,6,79,298,0,284,259,25,0,0,0,1,1,0,4,0,895,0,1,2123,4727
Andhra Pradesh,Tirupathi Urban,2014,35,72,2,0,18,0,0,0,18,1,17,5,24,3,0,0,9,12,2,0,2,0,8,227,178,49,1148,482,666,0,31,0,0,0,0,0,0,0,0,0,31,11,248,0,7,0,0,7,0,5,2,0,0,11,3,3,0,0,13,60,2,2,0,5,51,21,0,0,0,21,167,0,223,221,2,0,0,0,0,0,0,0,0,429,0,0,886,3651
Andhra Pradesh,Vijayawada City,2014,23,45,1,1,64,0,0,0,64,0,64,4,42,13,1,1,11,16,3,1,2,0,48,345,106,239,2016,685,1331,25,2,0,0,0,0,0,0,0,0,0,2,68,391,46,12,0,0,12,0,12,0,0,0,21,25,25,0,0,10,279,40,15,9,91,124,212,0,0,1,211,642,0,312,312,0,1,1,0,2,2,0,34,0,1366,1,0,1835,7876
Andhra Pradesh,Vijayawada Railway,2014,1,1,1,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,7,0,0,0,1085,3,1082,0,0,0,0,0,0,0,0,0,0,0,0,1,7,0,39,0,0,39,0,39,0,0,0,0,0,0,0,0,2,8,4,0,1,0,3,6,0,4,2,0,1,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,59,1223
Andhra Pradesh,Visakha Rural,2014,43,50,4,0,38,0,0,0,38,0,38,0,24,18,0,0,2,4,5,0,5,0,5,88,88,0,179,57,122,0,14,0,1,4,2,2,0,0,0,0,7,6,90,2,6,6,0,0,0,0,0,0,0,23,33,33,0,0,4,129,35,13,1,6,74,57,0,0,0,57,166,0,308,308,0,0,0,0,0,0,0,11,0,507,0,0,1236,3028
Andhra Pradesh,Visakhapatnam,2014,38,57,0,0,84,0,0,0,84,0,84,0,130,130,0,0,0,0,4,0,4,0,46,392,334,58,1358,401,957,0,3,0,0,3,0,0,0,0,0,0,0,71,413,3,7,0,0,7,7,0,0,0,0,14,64,63,1,0,13,147,50,0,0,27,70,112,0,0,0,112,371,0,360,353,7,0,0,0,0,0,0,8,0,1831,0,0,2202,7728
Andhra Pradesh,Vizianagaram,2014,43,23,1,0,47,0,0,0,47,1,46,1,27,0,0,0,0,27,2,0,2,0,4,176,0,176,388,92,296,0,13,0,0,0,0,0,0,0,0,0,13,14,149,0,1,0,0,1,1,0,0,0,0,13,41,41,0,0,8,225,0,0,0,0,225,327,0,0,0,327,330,0,272,272,0,0,0,0,0,0,0,5,0,913,0,0,1990,5013
Andhra Pradesh,West Godavari,2014,90,85,4,0,146,0,0,0,146,1,145,46,67,29,0,0,8,30,4,0,4,1,32,468,359,109,1096,353,743,3,26,4,0,3,0,0,0,0,0,0,19,52,410,13,14,0,0,14,1,9,4,0,0,36,52,51,1,0,24,405,126,72,12,32,163,99,0,1,0,98,661,0,614,608,6,0,0,0,14,14,0,49,0,1165,0,0,2866,8542
Andhra Pradesh,Total,2014,1175,1540,52,1,961,0,0,0,961,14,947,165,1066,355,5,7,274,425,75,1,74,1,433,4719,3510,1209,15617,4540,11077,59,1013,10,1,139,19,19,0,0,0,0,844,935,5091,199,162,6,0,156,41,102,12,1,0,450,597,589,5,3,215,4547,1072,334,71,504,2566,2649,3,84,65,2497,6362,0,7379,7260,119,1,1,0,21,21,0,276,0,14653,2,1,44187,114604
Arunachal Pradesh,Anjaw,2014,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,6,6,0,2,0,2,0,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,12,29
Arunachal Pradesh,Changlang,2014,9,3,0,0,6,0,0,0,6,0,6,0,11,0,0,0,6,5,1,0,1,0,5,18,18,0,50,4,46,0,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,24,0,9,0,0,23,180
Arunachal Pradesh,Crime Branch,2014,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4
Arunachal Pradesh,Dibang Valley,2014,0,0,0,0,1,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,4
Arunachal Pradesh,Kameng East,2014,4,1,0,0,1,0,0,0,1,0,1,0,7,0,0,1,0,6,2,0,2,0,4,8,0,8,18,0,18,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,0,0,0,0,0,0,0,0,0,2,18,18,0,0,0,6,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,0,66,148
Arunachal Pradesh,Kameng West,2014,7,1,0,0,0,0,0,0,0,0,0,1,3,0,0,0,0,3,1,0,1,0,3,4,4,0,21,10,11,0,8,0,0,8,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,0,0,0,5,8,8,0,0,0,9,8,0,0,1,0,0,0,0,0,0,2,0,10,10,0,0,0,0,0,0,0,1,0,15,0,0,35,140
Arunachal Pradesh,Kukung Kumey,2014,4,1,0,0,3,1,0,1,2,0,2,0,2,0,0,0,0,2,0,0,0,0,0,5,5,0,5,1,4,0,1,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,10,10,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,13,49
Arunachal Pradesh,Lohit,2014,10,4,0,0,7,0,0,0,7,0,7,0,25,0,0,0,0,25,1,0,1,0,8,32,32,0,39,6,33,0,3,0,0,0,0,0,0,0,0,0,3,2,5,0,1,0,0,1,1,0,0,0,0,2,16,16,0,0,0,13,0,0,0,0,13,0,0,0,0,0,1,0,16,16,0,0,0,0,0,0,0,6,0,0,0,0,89,280
Arunachal Pradesh,Longding,2014,4,3,1,0,3,3,0,3,0,0,0,0,9,5,0,0,4,0,1,0,1,0,1,9,9,0,5,1,4,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13,13,0,0,0,3,1,0,0,0,2,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,8,0,0,0,0,29,92
Arunachal Pradesh,Lower Dibang Valley,2014,2,5,0,0,3,0,0,0,3,0,3,0,4,4,0,0,0,0,1,0,1,0,1,10,10,0,21,0,21,0,0,0,0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,10,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,3,0,4,0,0,5,75
Arunachal Pradesh,Papum Pare City,2014,13,5,1,0,32,0,0,0,32,2,30,2,52,35,0,2,1,14,0,0,0,0,11,36,16,20,154,105,49,0,6,0,0,0,0,0,0,0,4,0,2,8,49,7,0,0,0,0,0,0,0,0,0,3,42,42,0,0,1,26,1,0,0,0,25,0,0,0,0,0,21,0,22,21,1,0,0,0,0,0,0,30,0,29,0,0,111,661
Arunachal Pradesh,Papum Pare Rural,2014,7,3,0,0,0,0,0,0,0,0,0,0,7,3,0,0,4,0,2,0,2,0,3,6,6,0,20,6,14,0,2,0,0,0,0,0,0,0,0,0,2,2,2,1,0,0,0,0,0,0,0,0,0,0,9,9,0,0,0,4,0,0,0,0,4,0,0,0,0,0,0,0,4,3,1,0,0,0,0,0,0,4,0,0,0,0,20,96
Arunachal Pradesh,Siang East,2014,5,0,1,0,11,0,0,0,11,1,10,3,4,1,0,1,0,2,0,0,0,0,3,20,20,0,49,12,37,5,0,0,0,0,0,0,0,0,0,0,0,2,5,1,0,0,0,0,0,0,0,0,0,9,23,23,0,0,0,21,8,0,0,0,13,0,0,0,0,0,4,0,10,10,0,0,0,0,0,0,0,7,0,14,0,0,48,245
Arunachal Pradesh,Siang Upper,2014,1,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,1,0,1,0,0,8,8,0,8,2,6,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,2,2,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,1,0,0,0,0,12,40
Arunachal Pradesh,Siang West,2014,10,4,0,0,6,0,0,0,6,0,6,3,2,0,1,0,0,1,0,0,0,0,4,18,18,0,29,4,25,0,4,0,0,2,0,0,0,0,0,0,2,7,13,2,0,0,0,0,0,0,0,0,0,2,30,30,0,0,0,11,0,0,0,0,11,3,0,0,0,3,8,0,6,6,0,0,0,0,0,0,0,3,0,13,0,0,71,249
Arunachal Pradesh,Subansiri Lower,2014,4,3,1,0,1,0,0,0,1,1,0,0,7,0,0,0,0,7,1,0,1,0,10,22,22,0,18,4,14,0,3,0,0,0,0,0,0,0,0,0,3,0,6,0,0,0,0,0,0,0,0,0,0,6,22,22,0,0,0,6,0,0,0,0,6,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,43,160
Arunachal Pradesh,Subansiri Upper,2014,3,2,0,0,5,0,0,0,5,0,5,1,2,0,0,0,2,0,1,0,1,0,5,11,11,0,33,2,31,0,4,0,0,3,0,0,0,0,0,0,1,3,5,2,0,0,0,0,0,0,0,0,0,7,19,19,0,0,0,16,0,0,0,0,16,0,0,0,0,0,3,0,2,0,2,0,0,0,0,0,0,9,0,16,0,0,85,234
Arunachal Pradesh,Tawang,2014,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,14,0,14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,2,0,0,0,0,13,40
Arunachal Pradesh,Tirap,2014,2,10,0,0,3,0,0,0,3,0,3,0,10,3,0,3,2,2,0,0,0,0,3,9,9,0,12,1,11,0,0,0,0,0,0,0,0,0,0,0,0,1,5,0,0,0,0,0,0,0,0,0,0,0,6,6,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,12,0,0,0,0,42,117
Arunachal Pradesh,Total,2014,86,48,4,0,83,4,0,4,79,5,74,10,146,51,1,7,20,67,12,0,12,0,61,224,196,28,498,158,340,6,33,0,0,14,0,0,0,0,4,0,15,33,103,14,1,0,0,1,1,0,0,0,0,39,247,247,0,0,1,121,21,0,6,1,93,3,0,0,0,3,42,0,85,81,4,0,0,0,0,0,0,121,0,102,0,0,720,2843
"""

def run_ingestion():
    print("=== INGESTING 2014 DETAILED IPC DATASET (crime_data.csv) ===")
    
    raw_dir = 'data/01_raw/Indian-Crime-Data'
    canonical_dir = 'data/canonical'
    validation_dir = 'data/07_validation'
    
    os.makedirs(raw_dir, exist_ok=True)
    os.makedirs(canonical_dir, exist_ok=True)
    os.makedirs(validation_dir, exist_ok=True)
    
    # Save raw file
    raw_file_path = os.path.join(raw_dir, "crime_data.csv")
    with open(raw_file_path, "w", encoding="utf-8") as f:
        f.write(RAW_CSV_TEXT.strip())
    print(f"Raw source dataset saved to {raw_file_path}")
    
    # Read raw dataset
    df_raw = pd.read_csv(raw_file_path)
    print(f"Dataset loaded: {len(df_raw)} rows, {len(df_raw.columns)} columns.")
    
    # 1. Reporting Unit Classification
    print("Step 1: Classifying reporting units...")
    def classify_unit(row):
        dist = str(row.get('District', '')).strip()
        dist_upper = dist.upper()
        if dist_upper == 'TOTAL':
          return 'STATE_TOTAL'
        elif 'RAILWAY' in dist_upper or 'G.R.P.' in dist_upper or 'G. R. P.' in dist_upper or 'SRP' in dist_upper:
          return 'RAILWAY_POLICE_UNIT'
        elif 'CRIME BRANCH' in dist_upper or 'C. I. D.' in dist_upper or 'CID' in dist_upper or 'EOW' in dist_upper:
          return 'CRIME_BRANCH'
        elif 'CITY' in dist_upper or 'COMMR.' in dist_upper or 'COMMR' in dist_upper or 'URBAN' in dist_upper:
          return 'URBAN_POLICE_UNIT'
        elif 'RURAL' in dist_upper:
          return 'RURAL_POLICE_UNIT'
        elif 'CELL' in dist_upper or 'SQUAD' in dist_upper or 'POWER' in dist_upper or 'ATS' in dist_upper or 'SPUWAC' in dist_upper:
          return 'SPECIAL_POLICE_UNIT'
        else:
          return 'DISTRICT'

    df_raw['reporting_unit_type'] = df_raw.apply(classify_unit, axis=1)
    
    # Separate units from state totals
    df_units = df_raw[df_raw['reporting_unit_type'] != 'STATE_TOTAL'].copy()
    df_totals = df_raw[df_raw['reporting_unit_type'] == 'STATE_TOTAL'].copy()
    
    print(f"Reporting unit classification: {len(df_units)} individual units, {len(df_totals)} state total aggregate rows.")
    
    # 2. Save Detailed Source & Normalized Parquet Layers
    print("Step 2: Building detailed source & normalized parquet layers...")
    
    # Tag Provenance
    df_units['source_dataset'] = 'Indian-Crime-Data'
    df_units['source_file'] = 'crime_data.csv'
    df_units['provenance'] = 'OFFICIAL_OBSERVED'
    df_units['is_synthetic'] = False
    
    df_units.to_parquet(os.path.join(canonical_dir, "crime_detailed_source_2014.parquet"), index=False)
    
    # Normalize schema
    norm_records = []
    category_cols = [c for c in df_units.columns if c not in ['States/UTs', 'District', 'Year', 'reporting_unit_type', 'source_dataset', 'source_file', 'provenance', 'is_synthetic']]
    
    for _, r in df_units.iterrows():
        state = str(r['States/UTs']).strip()
        unit = str(r['District']).strip()
        yr = int(r['Year'])
        utype = r['reporting_unit_type']
        
        for cat in category_cols:
            val = r[cat]
            if pd.notna(val):
                norm_records.append({
                    "state_ut": state,
                    "reporting_unit": unit,
                    "reporting_unit_type": utype,
                    "year": yr,
                    "crime_category_original": cat,
                    "crime_count": float(val),
                    "source_dataset": "Indian-Crime-Data",
                    "source_file": "crime_data.csv",
                    "provenance": "OFFICIAL_OBSERVED",
                    "is_synthetic": False
                })
                
    df_norm = pd.DataFrame(norm_records)
    df_norm.to_parquet(os.path.join(canonical_dir, "crime_detailed_normalized_2014.parquet"), index=False)
    print(f"Normalized layer saved with {len(df_norm):,} observations across {len(category_cols)} crime categories.")
    
    # 3. Create Reporting Unit Crosswalk
    unit_crosswalk = []
    for _, r in df_units[['States/UTs', 'District', 'reporting_unit_type']].drop_duplicates().iterrows():
        state = str(r['States/UTs']).strip()
        unit = str(r['District']).strip()
        utype = r['reporting_unit_type']
        
        unit_crosswalk.append({
            "source_state": state,
            "source_unit": unit,
            "reporting_unit_type": utype,
            "canonical_state": state,
            "canonical_district": unit.replace(" City", "").replace(" Urban", "").replace(" Rural", "").replace(" Commr.", ""),
            "match_method": "RULE_BASED_POLICE_JURISDICTION",
            "match_confidence": 1.0 if utype == 'DISTRICT' else 0.85
        })
        
    pd.DataFrame(unit_crosswalk).to_csv(os.path.join(canonical_dir, "crime_reporting_unit_crosswalk.csv"), index=False)
    
    # 4. State Total Reconciliation Audit
    print("Step 4: Auditing reported state totals vs sum of units...")
    recon_rows = []
    for state in df_raw['States/UTs'].unique():
        st_units = df_units[df_units['States/UTs'] == state]
        st_tot = df_totals[df_totals['States/UTs'] == state]
        
        reported_val = float(st_tot['Total Cognizable IPC crimes'].iloc[0]) if not st_tot.empty else None
        derived_val = float(st_units['Total Cognizable IPC crimes'].sum()) if not st_units.empty else 0.0
        
        diff = reported_val - derived_val if reported_val is not None else None
        diff_pct = round((diff / reported_val) * 100, 2) if reported_val and diff is not None else None
        
        status = "MATCH" if diff == 0 else ("ROUNDING_DIFFERENCE" if diff is not None and abs(diff) <= 5 else "DEFINITION_DIFFERENCE")
        
        recon_rows.append({
            "state_ut": state,
            "year": 2014,
            "reported_total": reported_val,
            "derived_sum_of_units": derived_val,
            "difference": diff,
            "difference_pct": diff_pct,
            "reconciliation_status": status
        })
        
    pd.DataFrame(recon_rows).to_csv(os.path.join(validation_dir, "ipc_total_reconciliation_report.csv"), index=False)
    
    # 5. Taxonomy Crosswalk
    print("Step 5: Generating crime taxonomy crosswalk...")
    taxonomy_rows = []
    for cat in category_cols:
        cat_lower = cat.lower()
        rel = "TOTAL" if "total" in cat_lower else ("COMPONENT" if "_" in cat else "INDEPENDENT")
        parent = "IPC_TOTAL" if rel != "TOTAL" else "ROOT"
        
        taxonomy_rows.append({
            "source_category": cat,
            "canonical_category": cat.replace(" ", "_").upper(),
            "parent_category": parent,
            "relationship_type": rel,
            "source_dataset": "Indian-Crime-Data"
        })
    pd.DataFrame(taxonomy_rows).to_csv(os.path.join(canonical_dir, "crime_taxonomy_crosswalk.csv"), index=False)
    
    print("=== INGESTION PIPELINE COMPLETED SUCCESSFULLY ===")

if __name__ == '__main__':
    run_ingestion()
