abstract class IFilepath<
  Root extends boolean,
> {
  protected readonly _nodes: Root extends true
    ? Arrayful<
      ToString<
        FileNode
      >
    >
    : Array<
      ToString<
        FileNode
      >
    >;

  constructor(
    ...subpaths: Parameters<IFilepath<Root>["compose"]>
  ) {
    try {
      this._nodes = this
        .check(
          this
            .compose(
              ...subpaths,
            ),
        );
    }
    catch (e) {
      throw new EvalError(
        `IFilepath: ctor`,
        { cause: e },
      );
    }
  }

  public get nodes() {
    try {
      return [
        ...this
          ._nodes,
      ] as IFilepath<
        Root
      >[
        "_nodes"
      ];
    }
    catch (e) {
      throw new EvalError(
        `IFilepath: nodes`,
        { cause: e },
      );
    }
  }

  public get parent() {
    try {
      const parent: this = new (
        this
          .constructor as new (
          ...args: ConstructorParameters<typeof IFilepath>
        )=>
        this
      )(
        this,
      );

      parent
        .pop();

      return parent;
    }
    catch (e) {
      throw new EvalError(
        `IFilepath: parent`,
        { cause: e },
      );
    }
  }

  public get isEmpty() {
    try {
      return this
        ._nodes
        .length < 1;
    }
    catch (e) {
      throw new EvalError(
        `IFilepath: isEmpty`,
        { cause: e },
      );
    }
  }

  private get Splitterful() {
    try {
      return importModule(
        "./common/validators/base/string/splitters/Splitterful",
      ) as typeof Splitterful;
    }
    catch (e) {
      throw new ReferenceError(
        `IFilepath: import Splitterful`,
        { cause: e },
      );
    }
  }

  private get FilepathNode() {
    try {
      return importModule(
        "node/FilepathNode",
      ) as typeof FileNode;
    }
    catch (e) {
      throw new ReferenceError(
        `IFilepath: import FilepathNode`,
        { cause: e },
      );
    }
  }

  public pop() {
    try {
      const nodeQ = [
        ...this
          ._nodes,
      ]
        .reverse();

      if (
        this
          .poppable(
            nodeQ,
          )
      ) {
        this
          ._nodes
          .pop();

        return nodeQ[
          0
        ];
      }
      else
        throw new RangeError(
          `filepath unpoppable`,
          {
            cause: {
              nodes: this._nodes,
              length: this._nodes.length,
            },
          },
        );
    }
    catch (e) {
      throw new EvalError(
        `IFilepath: pop`,
        { cause: e },
      );
    }
  }

  public append(
    ...subpaths: Parameters<IFilepath<Root>["compose"]>
  ) {
    try {
      return new (
        this
          .constructor as new (
          ...args: ConstructorParameters<typeof IFilepath>
        )=>
        this
      )(
        this,
        ...subpaths,
      );
    }
    catch (e) {
      throw new EvalError(
        `IFilepath: append`,
        { cause: e },
      );
    }
  }

  public prepend(
    root: rootpath,
  ) {
    try {
      return this.isEmpty
        ? root
        : `${
          root
        }/${
          this
            .toString()
        }` as rootpath;
    }
    catch (e) {
      throw new EvalError(
        `IFilepath: prepend`,
        { cause: e },
      );
    }
  }

  public cd(
    ...relPaths: Parameters<IFilepath<Root>["compose"]>
  ) {
    try {
      const rel = this
        .compose(
          ...relPaths,
        );

      for (const node of rel)
        if (node === "..")
          this
            .pop();
        else
          this
            ._nodes
            .push(
              node,
            );

      return this;
    }
    catch (e) {
      throw new EvalError(
        `IFilepath: cd`,
        { cause: e },
      );
    }
  }

  public toString() {
    try {
      return [
        ...this
          ._nodes,
      ]
        .join(
          "/",
        ) as filepath<
        Root
      >;
    }
    catch (e) {
      throw new EvalError(
        `IFilepath: toString`,
        { cause: e },
      );
    }
  }

  private compose(
    ...subpaths: Array<
      | string
      | string[]
      | IFilepath<
        boolean
      >
    >
  ) {
    try {
      return subpaths
        .map(
          subpath =>
            typeof subpath !== "string"
            && !Array.isArray(
              subpath,
            )
              ? subpath
                ._nodes
              : new this
                .Splitterful(
                  subpath,
                  "/",
                  { trimSegment: true },
                )
                .segments
                .map(
                  node =>
                    new this
                      .FilepathNode(
                        node,
                      )
                      .string,
                ),
        )
        .flat();
    }
    catch (e) {
      throw new EvalError(
        `IFilepath: compose`,
        { cause: e },
      );
    }
  }

  protected abstract check(nodes: Array<ToString<FileNode>>): IFilepath<Root>["_nodes"];

  protected abstract poppable(nodes: Array<ToString<FileNode>>): nodes is Arrayful<ToString<FileNode>>;
}

module.exports = IFilepath;
