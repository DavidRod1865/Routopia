import { useRef, useCallback } from "react";
import PropTypes from "prop-types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";

function MapSection({
  selectedRoute,
  directions,
  mapContainerStyle,
  center,
  mapRef,
  handleCloseRoute,
}) {
  const mapDivRef = useRef(null);

  const handleGeneratePDF = useCallback(async () => {
    if (!selectedRoute) {
      alert("No route selected to export!");
      return;
    }
    try {
      // 1) Capture a screenshot of the map container
      const canvas = await html2canvas(mapDivRef.current, {
        useCORS: true,
        scale: 1,
      });
      const mapImageData = canvas.toDataURL("image/png");
  
      // 2) Create a jsPDF instance (Letter size in portrait)
      const pdf = new jsPDF({
        orientation: "p",
        unit: "pt",
        format: "letter",
      });
  
      // 3) Insert the screenshot at (x=50, y=50) with a width/height of (500, 250)
      pdf.addImage(mapImageData, "PNG", 50, 50, 500, 250);
  
      // 4) Route info (Route name + number of stops)
      pdf.setFontSize(14);
      pdf.text(`Route: ${selectedRoute.route_name}`, 50, 330);
  
      pdf.setFontSize(12);
      pdf.text(`Number of Stops: ${selectedRoute.addresses.length}`, 50, 360);
  
      // 5) List of addresses
      pdf.text("Addresses:", 50, 390);
      let yPos = 410;
      selectedRoute.addresses.forEach((addr, idx) => {
        pdf.text(`${idx + 1}. ${addr}`, 60, yPos);
        yPos += 20; // spacing for each address
      });
  
      // 6) Step-by-step directions (if available)
      if (directions && directions.routes?.length) {
        const route = directions.routes[0]; // or loop over each route if you want
        const legs = route.legs;
      
        yPos += 20; 
        pdf.text("Directions:", 50, yPos);
        yPos += 20;
      
        legs.forEach((leg, legIndex) => {
          // If you want to label legs (e.g., “Leg 1: ...”)
          pdf.text(`Leg ${legIndex + 1}:`, 50, yPos);
          yPos += 20;
      
          leg.steps.forEach((step, stepIndex) => {
            // Remove HTML tags from instructions (b, div, etc.)
            const instructionsText = step.instructions.replace(/<[^>]+>/g, "");
      
            // Check page bottom; if needed, add a new page
            if (yPos > 700) {
              pdf.addPage();
              yPos = 50;
            }
      
            pdf.text(`${stepIndex + 1}. ${instructionsText}`, 60, yPos);
            yPos += 20;
          });
      
          // Optionally add space between legs
          yPos += 10;
        });
      }
  
      // 7) Save the PDF
      pdf.save(`Route_${selectedRoute.route_name}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Could not generate PDF. Please try again.");
    }
  }, [selectedRoute, directions]);  

  return (
    <div className="relative flex-1 flex flex-col">
      {/* Top Section (Map) */}
      <div
        ref={mapDivRef}
        className={`
          transition-all 
          duration-300
          ${selectedRoute ? "h-1/2" : "h-full"}
        `}
      >
        <GoogleMap
          onLoad={(map) => {
            if (mapRef) {
              mapRef.current = map;
            }
          }}
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>

      {/* Bottom Section (Route Details) */}
      <div
        className={`
          overflow-hidden
          bg-white
          shadow-lg 
          transition-all 
          duration-300
          ${selectedRoute ? "h-1/2" : "h-0"}
        `}
      >
        {selectedRoute && (
          <div className="p-4 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold">{selectedRoute.route_name}</h2>
              <button
                onClick={handleCloseRoute}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <h3>Number of Stops: {selectedRoute.addresses.length}</h3>

            <hr className="my-2" />
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">Route Addresses:</h3>
              <ul className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                {selectedRoute.addresses.map((address, idx) => (
                  <li key={idx}>{address}</li>
                ))}
              </ul>
            </div>

            {/* Button to generate PDF */}
            <button
              onClick={handleGeneratePDF}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Generate PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

MapSection.propTypes = {
  selectedRoute: PropTypes.shape({
    route_name: PropTypes.string,
    addresses: PropTypes.arrayOf(PropTypes.string),
  }),
  directions: PropTypes.object,
  mapContainerStyle: PropTypes.object.isRequired,
  center: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }).isRequired,
  mapRef: PropTypes.object,
  handleCloseRoute: PropTypes.func.isRequired,
};

export default MapSection;
