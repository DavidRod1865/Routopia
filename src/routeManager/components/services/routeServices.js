import { getSupabaseClient } from "../hooks/useSupabaseClient";

export const saveRoute = async (routeName, addresses, userId, token) => {
  try {
    const supabase = getSupabaseClient(token); // Pass token here
    const { data, error } = await supabase
      .from("routes")
      .insert([{ user_id: userId, route_name: routeName, addresses }]);

    if (error) throw error;

    return { data };
  } catch (err) {
    console.error("Error saving route:", err.message);
    return { error: err.message };
  }
};

export const fetchRoutes = async (userId, token) => {
  try {
    const supabase = getSupabaseClient(token);
    const { data, error } = await supabase
      .from("routes")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    return { data };
  } catch (err) {
    console.error("Error fetching routes:", err.message);
    return { error: err.message };
  }
};

export const updateRoute = async (routeId, newAddresses) => {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase
      .from("routes")
      .update({ addresses: newAddresses })
      .eq("id", routeId);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error("Error updating route:", err.message);
    return { error: err.message };
  }
};

export const deleteRoute = async (routeId) => {
  try {
    const supabase = await getSupabaseClient();
    const { error } = await supabase.from("routes").delete().eq("id", routeId);

    if (error) throw error;

    return { success: true };
  } catch (err) {
    console.error("Error deleting route:", err.message);
    return { error: err.message };
  }
};