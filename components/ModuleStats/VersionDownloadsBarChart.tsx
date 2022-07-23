import { Fragment } from "react";
import { ParentSizeModern } from "@visx/responsive";
import {
  XYChart,
  Axis,
  BarSeries,
  Tooltip,
  buildChartTheme,
} from "@visx/xychart";

// TODO: get these values from the same place tailwindcss does
//     | (might need to add some css variables to do this).
const chartTheme = buildChartTheme({
  backgroundColor: "white",
  colors: ["steelblue"],
  tickLength: 5,
  gridColor: "black",
  gridColorDark: "black",
});

export interface VersionDownloadsBarChartProps<T> {
  data: T[];
  xAccessor: (datum: T) => string;
  yAccessor: (datum: T) => number;
  yDomain: [number, number];
  yTicks: number[];
  yTickFormat: (value: number) => string;
  onPointerUp: (datum: T) => void;
}

function VersionDownloadsBarChart<T extends object>(
  props: VersionDownloadsBarChartProps<T>
) {
  return (
    // NOTE: XYChart by default uses a polyfilled version of ParentSize that we don't need.
    <ParentSizeModern>
      {({ width, height }) => (
        <XYChart
          theme={chartTheme}
          width={width}
          height={height}
          xScale={{ type: "band", padding: 0.1 }}
          yScale={{ type: "linear", domain: props.yDomain }}
          captureEvents
          onPointerUp={({ datum }) => {
            props.onPointerUp(datum as T);
          }}
        >
          <Axis
            orientation="left"
            label="Downloads"
            numTicks={props.yTicks.length}
            tickValues={props.yTicks}
            tickFormat={props.yTickFormat}
          />
          <Axis orientation="bottom" label="Version Range" />
          <BarSeries
            data={props.data}
            dataKey="Bar1"
            xAccessor={props.xAccessor}
            yAccessor={props.yAccessor}
          />
          <Tooltip
            snapTooltipToDatumX
            showSeriesGlyphs
            renderTooltip={({ tooltipData }) => {
              const datum = tooltipData?.nearestDatum as T | undefined;
              if (!datum) return null;
              return (
                <ChartTooltip
                  version={props.xAccessor(datum)}
                  downloads={props.yAccessor(datum)}
                />
              );
            }}
          />
        </XYChart>
      )}
    </ParentSizeModern>
  );
}

export default VersionDownloadsBarChart;

const { format: formatNumber } = new Intl.NumberFormat();

const ChartTooltip = (props: { version: string; downloads: number }) => (
  <Fragment>
    <p>Version: {props.version}</p>
    <p>Downloads: {formatNumber(props.downloads)}</p>
  </Fragment>
);
