import { Fragment, useMemo } from "react";
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
  onPointerUp: (datum: T) => void;
}

function VersionDownloadsBarChart<T extends object>(
  props: VersionDownloadsBarChartProps<T>
) {
  const yAxis = useMemo(() => {
    const yAccessor = props.yAccessor;
    const largestValue = props.data.reduce(
      (sum, value) => sum + yAccessor(value),
      0
    );
    return computeYAxis(largestValue);
  }, [props.data, props.yAccessor]);

  return (
    // NOTE: XYChart by default uses a polyfilled version of ParentSize that we don't need.
    <ParentSizeModern>
      {({ width, height }) => (
        <XYChart
          theme={chartTheme}
          width={width}
          height={height}
          xScale={{ type: "band", padding: 0.1 }}
          yScale={{ type: "linear", domain: yAxis.domain }}
          captureEvents
          onPointerUp={({ datum }) => {
            props.onPointerUp(datum as T);
          }}
        >
          <Axis
            orientation="left"
            label="Downloads"
            numTicks={yAxis.ticks.length}
            tickValues={yAxis.ticks}
            tickFormat={yAxis.tickFormat}
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
              const datum = tooltipData?.nearestDatum?.datum as T | undefined;
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

export function computeYAxis(largestValue: number) {
  // NOTE: largestValue and step have a minimum value of 1 so that
  // in empty/small cases, we still render a tick at 0 and 1.
  largestValue = Math.max(largestValue, 1);

  // Calculate the largest power of 10 that will span the domain in
  // less than or equal to 10 steps (11 ticks if you count tick at 0).
  //
  // calculate a 1/10th step from 0 to the largestValue (not a power of 10)
  let step = Math.max(1, largestValue / 10);
  // find the closest power of 10 greater than step
  const stepPower = Math.ceil(Math.log10(step));
  step = 10 ** stepPower;

  // +1 tick to account for the first tick starting at 0
  const ticks = Array(1 + Math.ceil(largestValue / step))
    .fill(0) // map skips holes in array, so we need to fill them
    .map((_, i) => i * step);

  const domain: [number, number] = [ticks[0], ticks[ticks.length - 1]];

  const tickFormat =
    stepPower <= 2
      ? // only use scientific notation if steps are larger than 100
        String
      : (value: number) => (value === 0 ? "0" : `${value / step}e${stepPower}`);

  return {
    ticks,
    domain,
    tickFormat,
  };
}
