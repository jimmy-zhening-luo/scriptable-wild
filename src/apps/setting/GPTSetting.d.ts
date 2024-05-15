declare type GptSetting = {
  app: {
    tags: Record<
      | "preset"
      | "location"
      ,
      string
    >;
    plugins: Record<
    | "location"
      ,
      string
    >;
    api: Record<"host" | "version" | "action", string>;
    models: Record<"ultra" | "high" | "low", string>;
    limit: Record<
      | "token"
      | "temperature"
      | "p"
      ,
      SettingLimit
    >;
  };
  user: {
    id: Record<"token" | "org", string>;
    defaults: GptProps;
    presets: Record<string, Optional<GptPromptFull, "user">>;
  };
};
