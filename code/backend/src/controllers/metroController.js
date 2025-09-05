import { supabase } from "../supabaseClient.js";

// Get tasks function
export const getTasksInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("metro_tasks")
      .select("*")
      .eq("level_id", id)
      .single();

    if (error) throw error;

    return res.json(data);
  } catch (error) {
    console.error("Error fetching tasks info:", error);
    return res.status(500).json({ error: "Error fetching tasks info" });
  }
};

// Get station function
export const getStation = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("metro_stations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return res.json(data);
  } catch (error) {
    console.error("Error fetching station:", error);
    return res.status(500).json({ error: "Error fetching station" });
  }
};

// Get all stations function
export const getAllStations = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("metro_stations")
      .select("*");

    if (error) throw error;

    return res.json(data);
  } catch (error) {
    console.error("Error fetching stations:", error);
    return res.status(500).json({ error: "Error fetching stations" });
  }
};

// Get lines with stations (including transfers)
export const getLinesWithStations = async (req, res) => {
  try {
    // 1️⃣ Traer todas las líneas del nivel
    const { data: lines, error: errLines } = await supabase
      .from("metro_lines")
      .select("*")
      .order("order_index", { ascending: true });

    if (errLines) throw errLines;

    // 2️⃣ Traer todas las estaciones
    const { data: stations, error: errStations } = await supabase
      .from("metro_stations")
      .select("*");

    if (errStations) throw errStations;

    // 3️⃣ Traer las relaciones línea-estación
    const { data: lineStations, error: errLineStations } = await supabase
      .from("metro_line_stations")
      .select("*");

    if (errLineStations) throw errLineStations;

    // 4️⃣ Mapear estaciones a cada línea usando metro_line_stations
    const linesWithStations = lines.map((line) => ({
      ...line,
      stations: lineStations
        .filter((ls) => ls.line_id === line.id)
        .sort((a, b) => a.order_index - b.order_index)
        .map((ls) => stations.find((s) => s.id === ls.station_id)),
    }));

    return res.json(linesWithStations);
  } catch (err) {
    console.error("Error fetching lines with stations:", err);
    return res.status(500).json({ error: "Error fetching lines with stations" });
  }
};