## Weather Application

What I'm building

1. I want to build an app that you can easily check fire data for your local area.
2. I'd like it to auto request your current location
3. I would like it to show your fire rating based on your location using lat and long
4. come up with a nice interface

Research national weather service and see what is provided

https://www.weather.gov/documentation/services-web-api

Check out NOAA
https://www.ncdc.noaa.gov/cdo-web/webservices/v2

event codes for national weather service:

https://www.weather.gov/dsb/eventcodes#:~:text=Naming%20Convention%20for%20EAS%20Event,S%20for%20STATEMENTS

Alerts return
Enumerations:
• query.status: ["actual", "exercise", "system", "test", "draft"]
• query.message_type: ["alert", "update", "cancel"]
• query.region: ["AL", "AT", "GL", "GM", "PA", "PI"]
• query.urgency: ["Immediate", "Expected", "Future", "Past", "Unknown"]
• query.severity: ["Extreme", "Severe", "Moderate", "Minor", "Unknown"]
• query.certainty: ["Observed", "Likely", "Possible", "Unlikely", "Unknown"] 2. Regex Patterns:
• query.event: ^[A-Za-z0-9 ]+$
	•	query.code: ^\w{3}$
• query.point: ^(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)$
	•	query.zone: ^(A[KLMNRSZ]|C[AOT]|D[CE]|F[LM]|G[AMU]|I[ADLN]|K[SY]|L[ACEHMOS]|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[AHKMRSWZ]|S[CDL]|T[NX]|UT|V[AIT]|W[AIVY]|[HR]I)[CZ]\d{3}$ 3. Conflicting Parameters:
• region_type, point, region, area, zone: Cannot be used together.

API FAQ
