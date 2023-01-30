/// <reference path="./Files.ts" />
namespace Files {
  export class Bookmark {
    readonly bookmark: string;
    readonly path: string;
    constructor(
      bookmark: string = String()
    ) {
      this.bookmark = bookmark.trim();
      this.path = this.bookmark === String() ?
        String()
        : FileManager.iCloud()
          .bookmarkedPath(bookmark);
    }

    toString(): string {
      return this.path;
    }
  }
}