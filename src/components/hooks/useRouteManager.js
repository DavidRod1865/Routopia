import { useState, useEffect, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getSupabaseClient } from "./useSupabaseClient";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useToast } from "../../contexts/ToastContext";
import useUserPermissions from "./useUserPermissions";

export default function useRouteManager() {
  const { user, getIdTokenClaims } = useAuth0();
  const { showSuccess, showError } = useToast();
  const { can, getDataScope, permissions } = useUserPermissions();
  const mapRef = useRef(null);

  const [routes, setRoutes] = useState([]);
  const [directions, setDirections] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.006 }); // Default to NYC, will update based on route

  const getOrganizationId = async (supabase) => {
    const { data, error } = await supabase
      .from('users')
      .select('organization_id')
      .eq('auth0_id', user.sub)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error("Organization not found. Please contact support.");
      }
      throw new Error(`Error fetching organization: ${error.message}`);
    }

    return data.organization_id;
  };

  // --------------------
  // Fetch routes on mount
  // --------------------
  useEffect(() => {
    if (user && user.sub) {
      const loadRoutes = async () => {
        setFetching(true);
        setFetchError(null);

        try {
          const tokenClaims = await getIdTokenClaims();
          if (!tokenClaims || !tokenClaims.__raw) {
            throw new Error("Unable to get authentication token");
          }

          const supabase = getSupabaseClient(tokenClaims.__raw);
          
          // Get organization UUID from users table
          const organizationId = await getOrganizationId(supabase);

          // Get data scope based on user role
          const dataScope = getDataScope.routes();
          
          let query = supabase
            .from("routes")
            .select("*");
          
          // Apply role-based filtering
          Object.entries(dataScope).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
          
          const { data, error } = await query;
          if (error) {
            console.error("Error fetching routes:", error);
            setFetchError(error);
            setIsEmpty(false);
          } else {
            if (!data || data.length === 0) {
              setIsEmpty(true);
              setRoutes([]);
            } else {
              setIsEmpty(false);
              setRoutes(data);
            }
          }
        } catch (err) {
          console.error("Fetching error:", err);
          setFetchError(err.message || "Failed to load routes");
          setIsEmpty(false);
        }

        setFetching(false);
      };

      loadRoutes();
    } else if (!user) {
      // User not loaded yet, keep in loading state
      setFetching(true);
    } else {
      // User is loaded but has no sub, this shouldn't happen but handle gracefully
      setFetchError("Authentication error: Invalid user data");
      setFetching(false);
    }
  }, [user?.sub]); // Only depend on user.sub to prevent infinite loops

  // -------------------------
  // Helper Functions
  // -------------------------
  const calculateRouteCenter = async (addresses, directionsResult = null) => {
    if (!addresses || addresses.length === 0) {
      return { lat: 40.7128, lng: -74.006 }; // Default to NYC
    }

    try {
      // If we have directions result with bounds, use that (most accurate)
      if (directionsResult && directionsResult.routes && directionsResult.routes[0]?.bounds) {
        const bounds = directionsResult.routes[0].bounds;
        const center = bounds.getCenter();
        return { lat: center.lat(), lng: center.lng() };
      }

      // Otherwise, geocode the first address to get approximate center
      const geocoder = new window.google.maps.Geocoder();
      return new Promise((resolve) => {
        geocoder.geocode({ address: addresses[0] }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            resolve({ lat: location.lat(), lng: location.lng() });
          } else {
            // Fallback to NYC if geocoding fails
            resolve({ lat: 40.7128, lng: -74.006 });
          }
        });
      });
    } catch (error) {
      console.error('Error calculating route center:', error);
      return { lat: 40.7128, lng: -74.006 }; // Fallback to NYC
    }
  };

  // -------------------------
  // Handlers
  // -------------------------
  const handleCloseRoute = () => {
    setSelectedRoute(null);
    setDirections(null);
    // Let MapSection handle centering - remove forced centering to NYC
  };

  const handleSaveRoute = async (routeName, addresses) => {
    if (!user) {
      showError("User is not authenticated");
      return;
    }
  
    try {
      const tokenClaims = await getIdTokenClaims();
      if (!tokenClaims || !tokenClaims.__raw) {
        throw new Error("Unable to get authentication token");
      }

      const supabase = getSupabaseClient(tokenClaims.__raw);
      
      // Get organization UUID from users table
      const organizationId = await getOrganizationId(supabase);

      const { data, error } = await supabase
        .from("routes")
        .insert([{ 
          organization_id: organizationId, 
          user_id: user.sub,
          route_name: routeName, 
          addresses 
        }])
        .select()
        .single();

      if (error) {
        console.error("Error saving route:", error);
        showError("Failed to save the route. Please try again.");
        return;
      }
  
      showSuccess("Route saved successfully!");
  
      setRoutes((prevRoutes) => [...prevRoutes, data]);
      setIsEmpty(false);
  
      // Ensure the UI updates correctly
      setSelectedRoute(data); 
  
    } catch (err) {
      console.error("Unexpected error:", err.message);
      showError("An unexpected error occurred. Please check your network and try again.");
    }
  };   

  const handleDeleteRoute = async (routeId) => {
    if (!user) {
      showError("User is not authenticated");
      return;
    }

    // Find the route to check permissions
    const routeToDelete = routes.find(route => route.id === routeId);
    if (!routeToDelete) {
      showError("Route not found");
      return;
    }

    // Check if user has permission to delete this route
    if (!can.deleteRoute(routeToDelete)) {
      showError("You don't have permission to delete this route");
      return;
    }

    try {
      const tokenClaims = await getIdTokenClaims();
      if (!tokenClaims || !tokenClaims.__raw) {
        throw new Error("Unable to get authentication token");
      }

      const supabase = getSupabaseClient(tokenClaims.__raw);
      const { error } = await supabase.from("routes").delete().eq("id", routeId);

      if (error) {
        console.error("Error deleting route:", error);
        showError("Failed to delete the route. Please try again.");
      } else {
        showSuccess("Route deleted successfully!");
        const updatedRoutes = routes.filter((route) => route.id !== routeId);
        setRoutes(updatedRoutes);
        if (updatedRoutes.length === 0) setIsEmpty(true);
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
      showError("An unexpected error occurred. Please check your network and try again.");
    }
  };

  const handleUpdateRoute = async (routeId, newAddresses) => {
    if (!user) {
      showError("User is not authenticated");
      return;
    }

    try {
      const tokenClaims = await getIdTokenClaims();
      if (!tokenClaims || !tokenClaims.__raw) {
        throw new Error("Unable to get authentication token");
      }

      const supabase = getSupabaseClient(tokenClaims.__raw);
      const { data, error } = await supabase
        .from("routes")
        .update({ addresses: newAddresses })
        .eq("id", routeId)
        .select()
        .single();

      if (error) {
        console.error("Error updating route:", error);
        showError("Failed to update the route. Please try again.");
        return;
      }

      showSuccess("Route updated successfully!");
      
      // Update the route in local state
      setRoutes(prevRoutes => 
        prevRoutes.map(route => 
          route.id === routeId ? data : route
        )
      );

      // Update selected route if it's the one being updated
      if (selectedRoute && selectedRoute.id === routeId) {
        setSelectedRoute(data);
      }

      return data;
    } catch (err) {
      console.error("Unexpected error:", err.message);
      showError("An unexpected error occurred. Please check your network and try again.");
    }
  };

  const viewRoute = async (route) => {
    const addresses = route.addresses;
    if (addresses.length < 2) {
      showError("At least two addresses are needed to display a route.");
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

      // Update center based on the route bounds
      try {
        const routeCenter = await calculateRouteCenter(finalOrderedAddresses, result);
        setCenter(routeCenter);
      } catch (error) {
        console.error("Error calculating route center:", error);
        // Continue without updating center if calculation fails
      }
    } catch (error) {
      console.error("Error fetching directions:", error.message);
      showError("Failed to display the route. Please try again.");
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
      showError("Could not generate PDF. Please try again.");
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
    setCenter,
    handleCloseRoute,
    handleSaveRoute,
    handleUpdateRoute,
    handleDeleteRoute,
    viewRoute,
    handleGeneratePDF,
    buildGoogleMapsLink,
    // Permission helpers
    canDeleteRoute: can.deleteRoute,
    canEditRoute: can.editRoute,
    canViewRoute: can.viewRoute,
    permissions
  };
}
