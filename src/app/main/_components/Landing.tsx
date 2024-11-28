"use client";
// TODO: DETERMINE ZOD ISSUES

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

import { getLocationByZip, type LocationByZip } from "~/server/api/location";

import { redirect } from "next/navigation";

import { useState } from "react";
// ------------------------------------------------------------

export default function Landing() {
  const [zipcode, setZipcode] = useState<string>("90210");
  console.log("zipcode", zipcode);

  // function handleSubmit() {
  //   console.log("SUBMITTED ZIPCODE", zipcode);
  // }

  async function handleSubmit() {
    try {
      const data: LocationByZip | null = await getLocationByZip({
        zip: zipcode,
        countryCode: "US",
      });
      if (data && "lat" in data && "lon" in data) {
        redirect(`/main/alerts?lat=${data.lat}&long=${data.lon}`);
      } else {
        console.error("Error: Could not get location data from zip code", data);
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  }

  return (
    <>
      <div className="items- flex flex-row">
        <div className="px-6 pb-4 pt-6 text-5xl md:text-6xl ">weatherflame</div>
      </div>

      <Input
        placeholder="Zipcode"
        type="number"
        className="w-32 text-sm text-black"
        value={zipcode}
        onChange={(e) => setZipcode(e.target.value)}
      />

      <Button onClick={handleSubmit} type="submit">
        {/* 
            TODO: Add react-query and loading state
            <Loader2 className="animate-spin" />
            Please wait Submit 
            */}
        Submit
      </Button>
    </>
  );
}
