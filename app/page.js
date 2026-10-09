"use client";

import { useState } from "react";

function getGPU() {
  const out = { vendor: "unavailable", renderer: "unavailable" };
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (ext) {
        out.vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || out.vendor;
        out.renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || out.renderer;
      } else {
        out.vendor = gl.getParameter(gl.VENDOR) || out.vendor;
        out.renderer = gl.getParameter(gl.RENDERER) || out.renderer;
      }
    }
  } catch (e) {}
  return out;
}

function getBattery() {
  if (!navigator.getBattery) return Promise.resolve(null);
  return navigator
    .getBattery()
    .then((b) => ({
      charging: String(b.charging),
      level: Math.round(b.level * 100) + "%",
      chargingTime: b.chargingTime === Infinity ? "n/a" : b.chargingTime + "s",
      dischargingTime: b.dischargingTime === Infinity ? "n/a" : b.dischargingTime + "s"
    }))
    .catch(() => null);
}

function getConnection() {
  const c =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!c) return null;
  return {
    type: c.effectiveType || "n/a",
    downlink: c.downlink != null ? c.downlink + " Mbps" : "n/a",
    rtt: c.rtt != null ? c.rtt + " ms" : "n/a",
    saveData: String(c.saveData)
  };
}

function collect() {
  const gpu = getGPU();
  const mem = navigator.deviceMemory;
  const data = {
    Hardware: {
      "CPU cores (hardwareConcurrency)": navigator.hardwareConcurrency,
      "Device memory (GB)": mem != null ? mem : "unavailable",
      "GPU vendor": gpu.vendor,
      "GPU renderer": gpu.renderer,
      Platform: navigator.platform
    },
    Display: {
      "Screen resolution": screen.width + " x " + screen.height,
      Available: screen.availWidth + " x " + screen.availHeight,
      Viewport: window.innerWidth + " x " + window.innerHeight,
      "Pixel ratio": window.devicePixelRatio,
      "Color depth": screen.colorDepth + "-bit",
      "Touch points": navigator.maxTouchPoints
    },
    System: {
      Language: navigator.language,
      Languages: (navigator.languages || []).join(", "),
      Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      "Timezone offset (min)": new Date().getTimezoneOffset(),
      Online: String(navigator.onLine),
      "Cookies enabled": String(navigator.cookieEnabled),
      "Do Not Track": navigator.doNotTrack,
      "User agent": navigator.userAgent
    }
  };
  const conn = getConnection();
  if (conn) data.Network = conn;
  return data;
}

function Rows({ title, entries }) {
  return (
    <>
      <div className="section">{title}</div>
      {Object.entries(entries).map(([k, v]) => (
        <div className="row" key={k}>
          <div className="k">{k}</div>
          <div className="v">{String(v)}</div>
        </div>
      ))}
    </>
  );
}

export default function Page() {
  const [data, setData] = useState(null);
  const [battery, setBattery] = useState(undefined);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setData(collect());
    setBattery(await getBattery());
    setLoading(false);
  }

  return (
    <>
      <div className="wrap">
        <h1>Browser Telemetry</h1>
        <p className="lead">
          Your browser knows a surprising amount about your machine.{" "}
          <strong>Click below</strong> to reveal your GPU, CPU, memory, battery,
          screen, network, and more. Nothing is sent anywhere &mdash; it all runs
          locally on your device.
        </p>
        <button className="run" onClick={run} disabled={loading}>
          {loading ? "COLLECTING..." : "CLICK HERE"}
        </button>
        <div className="out">
          {data &&
            Object.entries(data).map(([title, entries]) => (
              <Rows title={title} entries={entries} key={title} />
            ))}
          {battery !== undefined && (
            <Rows
              title="Battery"
              entries={battery || { Status: "unavailable" }}
            />
          )}
        </div>
      </div>
      <footer>
        Some values are intentionally hidden or rounded by browsers for privacy,
        so a few fields may read &quot;unavailable&quot;. Chromium-based browsers
        (Chrome, Edge) expose the most; Firefox and Safari reveal less.
      </footer>
    </>
  );
}
