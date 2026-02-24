const fs = require("fs");
const csvData = fs.readFileSync(
  "/Users/noahpesta/projects/gsproStats/server/dev-scripts/PlayerShots_2026-02-21_13-05.csv",
  "utf-8",
);

const { parse } = require("csv-parse/sync");
const parsedRecords = parse(csvData, { bom: true });

console.log(parsedRecords.length);
console.log(parsedRecords[0]);
console.log(parsedRecords[1]);

const populateDB = async () => {
  const sqlite3 = require("sqlite3").verbose();
  const db = new sqlite3.Database("database.sqlite");

  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS shots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shot_key TEXT,
      course_name TEXT,
      round_date TEXT,
      shot_time TEXT,
      hole INTEGER,
      shot_number INTEGER,
      global_shot_number INTEGER,
      club_name TEXT,
      club_speed REAL,
      ball_speed REAL,
      carry_distance REAL,
      total_distance REAL,
      offline REAL,
      peak_height REAL,
      descent_angle REAL,
      horizontal_launch_angle REAL,
      vertical_launch_angle REAL,
      back_spin REAL,
      spin_axis REAL,
      club_angle_of_attack REAL,
      club_path REAL,
      club_face_to_path REAL,
      club_face_to_target REAL
    )`,
    );

    const insertStmt = db.prepare(
      `INSERT INTO shots (
      shot_key,
      course_name,
      round_date,
      shot_time,
      hole,
      shot_number,
      global_shot_number,
      club_name,
      club_speed,
      ball_speed,
      carry_distance,
      total_distance,
      offline,
      peak_height,
      descent_angle,
      horizontal_launch_angle,
      vertical_launch_angle,
      back_spin,
      spin_axis,
      club_angle_of_attack,
      club_path,
      club_face_to_path,
      club_face_to_target
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );

    // Skip the header row
    for (let i = 1; i < parsedRecords.length; i++) {
      const record = parsedRecords[i];
      insertStmt.run(
        record[0], // shot_key
        record[1], // course_name
        new Date(record[2]).toISOString(), // round_date
        record[3].substr(2, record[3].length - 3), // shot_time
        parseInt(record[4]), // hole
        parseInt(record[5]), // shot_number
        parseInt(record[6]), // global_shot_number
        record[7], // club_name
        parseFloat(record[8]), // club_speed
        parseFloat(record[9]), // ball_speed
        parseFloat(record[10]), // carry_distance
        parseFloat(record[11]), // total_distance
        record[12].includes("L")
          ? -1 * parseFloat(record[12])
          : parseFloat(record[12]), // offline
        parseFloat(record[13]), // peak_height
        parseFloat(record[14]), // descent_angle
        record[15].includes("L")
          ? -1 * parseFloat(record[15])
          : parseFloat(record[15]), // horizontal_launch_angle
        parseFloat(record[16]), // vertical_launch_angle
        parseFloat(record[17]), // back_spin
        parseFloat(record[18]), // spin_axis
        parseFloat(record[19]), // club_angle_of_attack
        parseFloat(record[20]), // club_path
        parseFloat(record[21]), // club_face_to_path
      );
    }
    insertStmt.finalize();
    insertStmt.run();
  });

  db.close();
};

populateDB().then(() => {
  console.log("Database populated successfully.");
});
