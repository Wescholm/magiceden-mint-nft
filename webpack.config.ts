import path from "path";
import { PinoWebpackPlugin } from "pino-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

const config = {
  entry: "./src/main.ts",
  mode: mode,
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new PinoWebpackPlugin({ transports: ["pino-pretty"] }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(ts)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  devtool: "source-map",
};

export default config;
