const s_Filepath: typeof IFilepath = importModule(
  "filepath/IFilepath",
) as typeof IFilepath;

class Subpath extends s_Filepath<false> {
  protected check(
    parts: Part[],
  ): Part[] {
    try {
      return parts;
    }
    catch (e) {
      throw new EvalError(
        `Subpath: check`,
        { cause: e },
      );
    }
  }

  protected poppable(parts: Part[]): parts is Arrayful<Part> {
    try {
      return parts.length > 0;
    }
    catch (e) {
      throw new EvalError(
        `Subpath: poppable`,
        { cause: e },
      );
    }
  }
}

module.exports = Subpath;
