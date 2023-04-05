const Logger = require("pretty-logger");

const customConfig = {
  showMillis: true,
  showTimestamp: true,
  info: "gray",
  error: ["bgRed", "bold"],
  debug: "rainbow",
};

// задаем явно тип логгера, потому что для него нет типов
type Logger = {
  info: (message: string) => void;
  error: (message: string) => void;
  warn: (message: string) => void;
  debug: (message: string) => void;
  trace: (message: string) => void;
};

export const logger: Logger = new Logger(customConfig);
