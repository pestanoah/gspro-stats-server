/* Copyright (c) 2026 Noah Pesta */

export interface DAO {
  // shots
  GetShotsByDay(date: Date): Promise<any[]>;

  GetShotsByDateRange(
    startDate: Date,
    endDate: Date,
    clubName?: string,
  ): Promise<any[]>;

  GetLatestShots(limit: number): Promise<any>;
}
