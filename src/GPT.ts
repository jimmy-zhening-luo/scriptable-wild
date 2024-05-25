// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: comment-alt;
"use strict";

namespace GPT {
  const shortcut = importModule("system/Shortcut") as typeof Shortcut;

  export class GPT extends shortcut<
    GptInput,
    GptOutput,
    GptSetting
  > {
    public runtime() {
      const {
        app: {
          tags,
          api,
          models,
          limit,
        },
        user: {
          id,
          defaults: {
            model,
            token,
            temperature,
            p,
            preset
            location,
          },
          presets,
        },
      } = this
        .setting
        .parsed;
      const input = this
        .inputful;
      const wrap =
        typeof input !== "string"
        && "prompt" in input
          ? input
          : { prompt: input };
      const opts = {
        model:
          "model" in wrap
          && `${
            wrap
              .model
          }` in models
            ?
          wrap
            .model
            ?? model,
        token:
          "token" in wrap
          && wrap
            .token >= limit
            .token
            .min
            && wrap
              .token <= limit
              .token
              .max
            ? wrap
              .token
            : token,
        temperature:
          "temperature" in wrap
          && wrap
            .temperature >= limit
            .temperature
            .min
            && wrap
              .temperature <= limit
              .temperature
              .max
            ? wrap
              .temperature
            : temperature,
        p:
          "p" in wrap
          && wrap
            .p >= limit
            .p
            .min
            && wrap
              .p <= limit
              .p
              .max
            ? wrap
              .p
            : p,
        preset:
          "preset" in wrap
          && wrap
            .preset in presets
            ? wrap
              .preset
            : preset,
        location:
          wrap
            .location
            ?? location,
        date:
          wrap
            .date
            ?? new this
              .Timeprint()
              .date,
      };
      const presetConfig = presets[
        opts
          .preset
      ]
        ?? null;
      const promptTemplate = typeof wrap
        .prompt !== "string"
          ? wrap
            .prompt
          : presetConfig === null
            ? {
                user: wrap
                  .prompt,
              }
            : {
                system: presetConfig
                  .system,
                user:
                  "user" in presetConfig
                  && presetConfig
                    .includes(
                      tags
                        .preset,
                    )
                    ? presetConfig
                      .user
                      .replace(
                        tags
                          .preset,
                        wrap
                          .prompt,
                      )
                    : wrap
                      .prompt,
              };
      const messageQueue: Array<
        [
          GptRole,
          string
        ]
      > = [
        ..."system" in promptTemplate
          ? [
              "system",
              promptTemplate
                .system,
            ]
          : []
        [
          "user",
          promptTemplate
            .user,
        ]
      
      ]
        .map(
          [role, content] =>
            [
              role,
              content
                .replaceAll(
                  tags
                    .location,
                  opts
                    .location,
                )
                .replaceAll(
                  tags
                    .date,
                  opts
                    .date,
                ),
            ],
        );
      const messages = messageQueue
        .map(
          ([role, content]): GptMessage =>
            {
              role,
              content,
            },
        );

      return {
        api: [
          api
            .host,
          api
            .version,
          api
            .action,
        ]
          .join(
            "/",
          ),
        header: {
          auth: id
            .token,
          org: id
            .org,
        },
        body: {
          messages,
          model: models[
            opts
              .model
          ],
          max_tokens: opts
            .token
            .toString(),
          temperature: opts
            .temperature
            .toString(),
          top_p: opts
            .p
            .toString(),
        },
      };
    }
  }
}

new GPT.GPT()
  .run();
