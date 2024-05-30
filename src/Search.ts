// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: search;
"use strict";

namespace Search {
  const shortcut = importModule("system/Shortcut") as typeof Shortcut;

  export class Search extends shortcut<
    string
    ,
    SearchOutput
    ,
    SearchSetting
  > {
    private get Query() {
      return importModule(
        "apps/method/search/Query",
      ) as typeof Query;
    }

    protected runtime() {
      const {
        app,
        user,
      } = this;
      const {
        tag,
        key,
        fallback,
      } = app;
      const {
        engine,
        alias,
      } = user;
      const [
        TAG,
        CHAT,
        TRANSLATE,
        MATH_SHORT,
        MATH_LONG,
        REST,
        ONE,
        TWO,
        THREE,
      ] = [
        tag,
        key
          .chat,
        key
          .translate,
        key
          .mathShort,
        key
          .mathLong,
        fallback
          .rest,
        fallback
          .one,
        fallback
          .two,
        fallback
          .three,
      ]
        .map(
          key =>
            this
              .stringful(
                key,
              ),
        ) as Tuple<
        stringful
        ,
        9
      >;
      const input = this
        .input
        ?? "";
      const query = new this
        .Query(
          input
            .length > 0
            ? input
            : this
              .read(),
          CHAT,
          TRANSLATE,
          MATH_SHORT,
          MATH_LONG,
          ONE,
          TWO,
          THREE,
        );
      const keys = Object
        .keys(
          engine,
        );
      const keyUnaliased = alias[
        query
          .key
      ]
        ?? null;
      const keyMatch = keys
        .includes(
          query
            .key,
        )
        ? query
          .key
        : keyUnaliased === null
          ? null
          : !keys
            .includes(
              keyUnaliased,
            )
            ? null
            : keyUnaliased
              .length < 1
              ? null
              : keyUnaliased as stringful;

      if (
        keyMatch === null
      )
        query
          .fallback(
            REST,
          );
      else
        query
          .dealias(
            keyMatch,
          );

      const match = engine[
        query
          .key
      ]
        ?? null;

      if (
        match === null
      )
        throw new ReferenceError(
          `Engine config missing for key`,
          { cause: { key: query.key } },
        );

      const resolved: IEngine = Array.isArray(
          match,
        )
        || typeof match === "string"
          ? new (
            this
              .Engine<typeof UrlEngine>(
              "UrlEngine",
            )
          )(
            match,
            TAG,
          )
          : "url" in match
            ? new (
              this
                .Engine<typeof UrlEngine>(
                "UrlEngine",
              )
            )(
              match
                .url,
              TAG,
              match
                .browser,
              match
                .separator,
              match
                .encodeComponent,
            )
            : "shortcut" in match
              ? new (
                this
                  .Engine<typeof ShortcutEngine>(
                  "ShortcutEngine",
                )
              )(
                match
                  .shortcut,
                match
                  .output,
                match
                  .write,
              )
              : "find" in match
                ? new (
                  this
                    .Engine<typeof FindEngine>(
                    "FindEngine",
                  )
                )(
                  match
                    .find,
                )
                : new (
                  this
                    .Engine<typeof InlineEngine>(
                    "InlineEngine",
                  )
                )(
                  match
                    .inline,
                );

      this
        .write(
          query
            .clean,
        );

      return resolved
        .parseQueryToAction(
          query,
        );
    }

    private Engine<T>(
      flavor: string,
    ): T {
      try {
        return importModule(
          `apps/method/search/engines/${
            flavor
          }`,
        ) as T;
      }
      catch (e) {
        throw new EvalError(
          `Search: import <T>Engine`,
          { cause: e },
        );
      }
    }
  }
}

new Search.Search()
  .run();
