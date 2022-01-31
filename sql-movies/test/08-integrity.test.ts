import _ from "lodash";
import { Database } from "../src/database";
import {
  selectGenreById,
  selectDirectorById,
  selectActorById,
  selectKeywordById,
  selectProductionCompanyById,
  selectMovieById
} from "../src/queries/select";
import { minutes } from "./utils";
import {
  ACTORS,
  DIRECTORS,
  GENRES,
  KEYWORDS,
  MOVIES,
  MOVIE_GENRES,
  MOVIE_KEYWORDS,
  MOVIE_ACTORS,
  MOVIE_DIRECTORS,
  MOVIE_PRODUCTION_COMPANIES,  
  PRODUCTION_COMPANIES
} from "../src/table-names";

describe("Foreign Keys", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("07", "08");
    await db.execute("PRAGMA foreign_keys = ON");
  }, minutes(3));

  it(
    "should not be able delete genres if any movie is linked",
    async done => {
      const genreId = 5;
      const query = `DELETE FROM ${GENRES} WHERE id = ${genreId}`;     //`delete genre by id`
      try {
        await db.delete(query);
      } catch (e) {}

      const row = await db.selectSingleRow(selectGenreById(genreId));
      expect(row).toBeDefined();

      done();
    },
    minutes(10)
  );

  it(
    "should not be able delete director if any movie is linked",
    async done => {
      const directorId = 7;
      const query = `DELETE FROM ${DIRECTORS} WHERE id = ${directorId}`;    //`delete director by id`
      try {
        await db.delete(query);
      } catch (e) {}

      const row = await db.selectSingleRow(selectDirectorById(directorId));
      expect(row).toBeDefined();

      done();
    },
    minutes(10)
  );

  it(
    "should not be able delete actor if any movie is linked",
    async done => {
      const actorId = 10;
      const query = `DELETE FROM ${ACTORS} WHERE id = ${actorId}`;   //`delete actor by id`
      try {
        await db.delete(query);
      } catch (e) {}

      const row = await db.selectSingleRow(selectActorById(actorId));
      expect(row).toBeDefined();

      done();
    },
    minutes(10)
  );

  it(
    "should not be able delete keyword if any movie is linked",
    async done => {
      const keywordId = 12;
      const query = `DELETE FROM ${KEYWORDS} WHERE id = ${keywordId}`;   //`delete keyword by id`
      try {
        await db.delete(query);
      } catch (e) {}

      const row = await db.selectSingleRow(selectKeywordById(keywordId));
      expect(row).toBeDefined();

      done();
    },
    minutes(10)
  );

  it(
    "should not be able delete production company if any movie is linked",
    async done => {
      const companyId = 12;
      const query = `DELETE FROM ${PRODUCTION_COMPANIES} WHERE id = ${companyId}`;    //`delete production company by id`
      try {
        await db.delete(query);
      } catch (e) {}

      const row = await db.selectSingleRow(
        selectProductionCompanyById(companyId)
      );
      expect(row).toBeDefined();

      done();
    },
    minutes(10)
  );

  it(
    "should not be able delete movie if there are any linked data present",
    async done => {
      const movieId = 100;
      const query = `DELETE FROM ${MOVIES} WHERE id = ${movieId}`;   //`delete movie by id`
      try {
        await db.delete(query);
      } catch (e) {}

      const row = await db.selectSingleRow(selectMovieById(movieId));
      expect(row).toBeDefined();

      done();
    },
    minutes(10)
  );

  it(
    "should be able to delete movie",
    async done => {
      const movieId = 3;  // OVERALL COUNT OF MOVIES IS 2998, TEST WITH movieId = 5915 WILL NEVER PASS, THEREFORE CHANGED movieID = 3
      const query = `
      DELETE FROM ${MOVIE_GENRES} where movie_id = ${movieId};
      DELETE FROM ${MOVIE_ACTORS} where movie_id = ${movieId};
      DELETE FROM ${MOVIE_DIRECTORS} where movie_id = ${movieId};
      DELETE FROM ${MOVIE_KEYWORDS} where movie_id = ${movieId};
      DELETE FROM ${MOVIE_PRODUCTION_COMPANIES} where movie_id = ${movieId};
      DELETE FROM ${MOVIES} where id = ${movieId}`;   //`delete movie by id and all data from all linked tables`
      await db.delete(query);

      const row = await db.selectSingleRow(selectMovieById(movieId));
      expect(row).toBeUndefined();

      done();
    },
    minutes(10)
  );
});
