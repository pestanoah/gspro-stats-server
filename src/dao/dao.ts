/* Copyright (c) 2026 Noah Pesta */
import Database from "better-sqlite3";
import type { DAO } from "./interface";

export class SqliteDAO implements DAO {
  private db: any;

  constructor() {
    const db = new Database("database.sqlite", {});
    db.pragma("journal_mode = WAL");
    this.db = db;
  }

  async GetShotsByDay(date: Date): Promise<any[]> {
    return this.db
      .prepare("SELECT * FROM shots WHERE round_date = ?")
      .all(date.toISOString());
  }

  async GetShotsByDateRange(
    startDate: Date,
    endDate: Date,
    clubName?: string,
  ): Promise<any[]> {
    if (clubName !== undefined) {
      return this.db
        .prepare(
          "SELECT * FROM shots WHERE round_date BETWEEN ? AND ? AND club_name = ?",
        )
        .all(startDate.toISOString(), endDate.toISOString(), clubName);
    }
    return this.db
      .prepare("SELECT * FROM shots WHERE round_date BETWEEN ? AND ?")
      .all(startDate.toISOString(), endDate.toISOString());
  }

  async GetLatestShots(limit: number): Promise<any[]> {
    return this.db
      .prepare("SELECT * FROM shots ORDER BY round_date DESC LIMIT ?")
      .all(limit);
  }
}

export const dao = new SqliteDAO();
