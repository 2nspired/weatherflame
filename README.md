# weatherflame
_Sounds more serious than it is, now let's jump in._

## About
This project was created to help me hone and continue to develop my own web development skills. It's a playground of sorts that I will test new frameworks and libraries in. Being built from selfish ambitions that have started with weather, but where I hope to finish with surf forecasts utilizing [National Oceanic and Atmospheric Administration (NOAA)](https://www.noaa.gov/) data and [NOAA Buoy Data](https://www.ndbc.noaa.gov/) specifically. 

If you find use in this project, or want to contribute, just send me a note or fork it to explore for yourself. That is truly one of the best parts about joining the development community and this is one of the many ways I hope to contribute.

## Contents
- [Interface](#interface)
- [Data and APIs](#data-and-apis)
- [Helpful Links](#helpful-links)

## Interface
I wanted to create a simplified layout that is somewhat throwback. I want it to make you think wow, that gives me 1980 - 1990s vibes. I am not sure of the name for this type of design, but if I had to give it one, let's call it _Retro-modern_? The main inspiration comes from [mux.com](https://www.mux.com/). Their design came from the agency [For The People](https://www.forthepeople.agency/mux) -their work is amazing. I suggest checking it out. 

INSERT MOBILE LANDING PAGE

INSERT MOBILE WEATHER PAGE

INSERT MOBILE WEATHER PAGE WITH ALERTS

## Data and APIs
Using public APIs taught me a lot, frankly that you cannot trust public and government APIs. However, in my discovery I have some helpful tips for using these APIs. 

### [weather.gov](https://www.weather.gov/documentation/services-web-api) - Weather and Alerts Data
This API is vast, and I mean vast. As you'll find various quirks, I'll help you navigate them based one what I found. For example, limit does not always work so you might get quite a bit of data back. 

**Finding the Spec and Creating a Type Schema**
One of the benefits of working with this API is that there is a specification file that can be found [here](https://www.weather.gov/documentation/services-web-api).

The API was based on [OpenAPI](https://www.openapis.org/) standard. This comes with some benefits: You can create a TypeScript Schema from the spec to use in your web app and there are some great tools to use with it to make fetching the data you need easier. 

1. Create a schema file using [openapi-typescript](https://github.com/openapi-ts/openapi-typescript/tree/main/packages/openapi-typescript)
2. Use [openapi-fetch](https://openapi-ts.dev/openapi-fetch/) and utilize the paths from the spec to fetch the data you need.
3. Use the schema's paths and components to create Types for the API inputs and outputs, see [here](https://openapi-ts.dev/introduction#basic-usage) for details.

### [openweathermap](openweathermap.com) - Geo Code
This API is relatively straightforward, but it has a notable limitation: if you want to use both the Zipcode Geo lookup and the Name Geo lookup and need access to the geo’s name, city, and state, you’ll need to make two separate API calls. The Zipcode Geo lookup only provides city and country, while the Name Geo lookup returns state and country. This design might be intentional, given the free tier offers 1,000 API calls per month, effectively halving the allowance if you’re building routes with the data. A simple long-term solution is to cache the values to reduce duplicate calls.

## Helpful Links
- [Glossary of Terms (NOAA)](https://forecast.weather.gov/glossary.php?letter=a) - Weather is confusing, this will help you understand some of the values returned. 
- [Alert Event Codes](https://www.weather.gov/dsb/eventcodes#:~:text=Naming%20Convention%20for%20EAS%20Event,S%20for%20STATEMENTS)
