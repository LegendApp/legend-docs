# Slides effects releases

The setup, gallery generation, local installation checks, and release workflow
live in the Slides documentation:
[Publishing effect packs](../content/slides/effects/publishing.mdx)
(`/slides/effects/publishing` on the docs site).

## Initial catalog validation

The initial catalog contains nine source-only packs and 33 examples compiled
against their archived releases. Each example was loaded in a macOS development
app, including its declared reveal states, with no reported build/runtime errors.
Installation was exercised through the native compiler command and offline
compilation was covered by the installer and packaged-helper integration tests.
This did not verify physical clicks through the OS deep-link confirmation dialog.

All entries have native still previews. Nine entries also have video previews
that passed automated motion checks with ScreenCaptureKit source telemetry;
measured source cadence was about 57 fps at a 60 fps capture target. Other clips
had unresolved motion findings and are represented by stills. Final video review
used dense ordered frames because normal-speed browser playback was unavailable;
these results do not certify 60 fps app performance. The videos crop the window
title bar and scale/compress the original capture without changing playback speed.
