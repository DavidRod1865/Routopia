import { useRef, useCallback, useEffect } from "react";
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
  const mapInstanceRef = useRef(null);

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
  
  // Function to fit map bounds to show entire route
  const fitMapToRoute = useCallback(() => {
    if (!mapInstanceRef.current) return;

    try {
      const map = mapInstanceRef.current;
      
      // Option 1: Use directions bounds if available
      if (directions && directions.routes && directions.routes.length > 0) {
        const bounds = directions.routes[0].bounds;
        if (bounds) {
          map.fitBounds(bounds, { padding: 50 });
          return;
        }
      }
      
      // Option 2: Calculate bounds from selected route addresses
      if (selectedRoute && selectedRoute.addresses && selectedRoute.addresses.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        
        const geocoder = new window.google.maps.Geocoder();
        let geocodePromises = [];
        
        selectedRoute.addresses.forEach((address) => {
          const promise = new Promise((resolve) => {
            geocoder.geocode({ address }, (results, status) => {
              if (status === 'OK' && results[0]) {
                bounds.extend(results[0].geometry.location);
              }
              resolve();
            });
          });
          geocodePromises.push(promise);
        });
        
        // Wait for all geocoding to complete, then fit bounds
        Promise.all(geocodePromises).then(() => {
          if (!bounds.isEmpty()) {
            map.fitBounds(bounds, { padding: 50 });
          }
        });
        
        return;
      }
      
      // Option 3: Fall back to default center and zoom
      if (center) {
        map.setCenter(center);
        map.setZoom(10);
      }
    } catch (error) {
      console.error('Error fitting map to route:', error);
    }
  }, [directions, selectedRoute, center]);
  
  // Effect to fit bounds when route data changes
  useEffect(() => {
    if (mapInstanceRef.current && (selectedRoute || directions)) {
      fitMapToRoute();
    }
  }, [selectedRoute, directions, fitMapToRoute]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapDivRef} className="w-full h-full">
        <GoogleMap
          onLoad={(map) => {
            mapInstanceRef.current = map;
            if (mapRef) {
              mapRef.current = map;
            }
            // Fit bounds after map loads if we have route data
            if (selectedRoute || directions) {
              setTimeout(() => fitMapToRoute(), 100);
            }
          }}
          onError={(error) => {
            console.error("Google Map error:", error);
          }}
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
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
