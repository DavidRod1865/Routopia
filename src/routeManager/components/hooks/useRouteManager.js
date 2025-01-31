import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchRoutes, saveRoute, deleteRoute } from "../services/routeServices";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function useRouteManager() {
  const { user, getIdTokenClaims } = useAuth0();
  const mapRef = useState(null);

  const [routes, setRoutes] = useState([]);
  const [directions, setDirections] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const center = { lat: 40.7128, lng: -74.006 };

  // --------------------
  // Fetch routes on mount
  // --------------------
  useEffect(() => {
    if (user) {
      const loadRoutes = async () => {
        setFetching(true);

        try {
          const { __raw: token } = await getIdTokenClaims();
          const { data, error } = await fetchRoutes(user.sub, token);
          if (error) {
            console.error("Error fetching routes:", error);
            setFetchError(error);
          } else {
            if (!data || data.length === 0) {
              setIsEmpty(true);
            } else {
              setIsEmpty(false);
              setRoutes(data);
            }
          }
        } catch (err) {
          console.error("Fetching error:", err);
          setFetchError(err.message);
        }

        setFetching(false);
      };

      loadRoutes();
    }
  }, [user, getIdTokenClaims]);

  // -------------------------
  // Handlers
  // -------------------------
  const handleCloseRoute = () => {
    setSelectedRoute(null);
    setDirections(null);

    // Re-center the map if we have a map instance
    if (mapRef.current) {
      mapRef.current.panTo(center);
      mapRef.current.setZoom(10); // optional
    }
  };

  const handleSaveRoute = async (routeName, addresses) => {
    if (!user) {
      alert("User is not authenticated");
      return;
    }

    try {
      const { __raw: token } = await getIdTokenClaims();
      const { data, error } = await saveRoute(routeName, addresses, user.sub, token);

      if (error) {
        console.error("Error saving route:", error);
        return;
      }

      if (data) {
        alert("Route saved successfully!");
        setRoutes((prevRoutes) => [...prevRoutes, data[0]]);
        setIsEmpty(false);
      } else {
        console.error("Unexpected response:", data);
        alert("Unexpected response from the server. Please try again.");
      }
    } catch (err) {
      console.error("Error saving route:", err.message);
    }
  };

  const handleDeleteRoute = async (routeId) => {
    const { error } = await deleteRoute(routeId);
    if (error) {
      console.error("Error deleting route:", error);
      alert("Failed to delete the route. Please try again.");
    } else {
      alert("Route deleted successfully!");
      const updatedRoutes = routes.filter((route) => route.id !== routeId);
      setRoutes(updatedRoutes);
      if (updatedRoutes.length === 0) setIsEmpty(true);
    }
  };

  const viewRoute = async (route) => {
    const addresses = route.addresses;
    if (addresses.length < 2) {
      alert("At least two addresses are needed to display a route.");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    try {
      const result = await directionsService.route({
        origin: addresses[0],
        destination: addresses[addresses.length - 1],
        waypoints: addresses
          .slice(1, -1)
          .map((address) => ({ location: address, stopover: true })),
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      });

      const waypointOrder = result.routes[0].waypoint_order;
      const finalOrderedAddresses = [addresses[0]];
      waypointOrder.forEach((index) => {
        finalOrderedAddresses.push(addresses[index + 1]);
      });
      finalOrderedAddresses.push(addresses[addresses.length - 1]);

      const updatedRoute = {
        ...route,
        addresses: finalOrderedAddresses,
      };

      setDirections(result);
      setSelectedRoute(updatedRoute);
    } catch (error) {
      console.error("Error fetching directions:", error.message);
      alert("Failed to display the route. Please try again.");
    }
  };

  const handleGeneratePDF = async () => {
    try {
      // 1) Capture screenshot of the map container
      const canvas = await html2canvas(mapRef.current);
      const mapImage = canvas.toDataURL("image/png");

      // 2) Create a jsPDF instance
      const pdf = new jsPDF({
        orientation: "p",
        unit: "pt", // points, can use "mm" or "px"
        format: "letter", // or "a4"
      });

      // 3) Add the map image to the PDF
      //    For letter-size, ~612x792 points in portrait
      pdf.addImage(mapImage, "PNG", 20, 20, 300, 200);

      // 4) Add text or addresses below the image
      //    (You can also create a table, or do multiple pages)
      pdf.setFontSize(12);
      pdf.text("Route Addresses:", 20, 240);

      // Suppose you have an array of addresses:
      // selectedRoute.addresses.forEach((address, idx) => ...)
      let yPos = 260;
      selectedRoute.addresses.forEach((addr, idx) => {
        pdf.text(`${idx + 1}. ${addr}`, 20, yPos);
        yPos += 20; // move down for each address
      });

      // 5) Download or open the PDF
      pdf.save("route.pdf");
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Could not generate PDF. Please try again.");
    }
  };

  function buildGoogleMapsLink(addresses) {
    if (addresses.length < 2) {
      throw new Error("Need at least 2 addresses (origin + destination).");
    }
  
    const baseUrl = "https://www.google.com/maps/dir/?api=1";
    const origin = `&origin=${encodeURIComponent(addresses[0])}`;
    const destination = `&destination=${encodeURIComponent(addresses[addresses.length - 1])}`;
  
    // Middle addresses become waypoints
    let waypoints = "";
    if (addresses.length > 2) {
      const middleAddresses = addresses.slice(1, -1);
      waypoints = `&waypoints=${middleAddresses
        .map((addr) => encodeURIComponent(addr))
        .join("|")}`;
    }
  
    const travelMode = "&travelmode=driving"; // or TRANSIT, BICYCLING, etc.
  
    return baseUrl + origin + destination + waypoints + travelMode;
  }
  

  // ------------------------
  // Return all you need
  // ------------------------
  return {
    user,
    sidebarOpen,
    setSidebarOpen,
    routes,
    setRoutes,
    directions,
    setDirections,
    isEmpty,
    setIsEmpty,
    fetching,
    setFetching,
    fetchError,
    setFetchError,
    selectedRoute,
    setSelectedRoute,
    center,
    handleCloseRoute,
    handleSaveRoute,
    handleDeleteRoute,
    viewRoute,
    handleGeneratePDF,
    buildGoogleMapsLink
  };
}
